const Order = require('../models/order.model');
const Transaction = require('../models/transaction.model');
const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const Product = require('../models/product.model');
const { getIO } = require('../utils/socket');
const xlsx = require('xlsx');
const PayOS = require('@payos/node');
const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
  );
//  console.log('payOS',payOS) 
class OrderService {
    getPaginatedAllOrders = async (page, pageSize, keywords, sortBy) => {
        const skip = (page - 1) * pageSize;
        let filter = {};
        if (keywords) {
            filter['contactInfo.phone'] = keywords;
        }
        let sort = {};
        switch (sortBy) {
            case 'orderStatus': {
                sort.orderStatus = 1;
                break;
            }
            case 'totalPrice': {
                sort.totalPrice = 1;
                break;
            }
        }
        const orders = await Order.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .populate('userId')
            .populate({ path: 'items.productId', strictPopulate: false })
            .populate('couponId', 'code type value minOrderValue maxDiscount expiryDate')
            .lean();
        const totalOrders = await Order.countDocuments(filter);
        return {
            orders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / pageSize),
            currentPage: page,
        };
    }
    async createOrder(req) {
        try {
            let { userId, items, paymentMethod, contactInfo, shippingFee,  couponId} = req.body;
            if (!userId || userId.trim() === '') {
                userId = null;
            }
            if (!shippingFee) {
                shippingFee = 0;
            }
            const totalPrice = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0) + shippingFee;
            // await this.validateOrderItems(items);
            const newOrder = new Order({
                userId,
                items,
                totalPrice,
                shippingFee,
                paymentMethod,
                contactInfo,
                orderStatus: 'Pending',
                paymentStatus: 'Pending',
                couponId
            });

            const order = await newOrder.save();
            const io = getIO();
            io.emit('newOrder', order);
            return order;

        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Internal Server Error');
        }
    }

    async validateOrderItems(items) {
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            const colorStock = product.inStock.find(stock => stock.variant === item.variant);
            if (!colorStock) {
                throw new Error(`Color ${item.variant} not available for product ID ${item.productId}`);
            }

            if (colorStock.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.productId} and color ${item.variant}`);
            }
            if (item.salePrice !== product.price) {
                throw new Error(`Sale price ${item.salePrice} does not match product price ${product.price} for product ID ${item.productId}`);
            }
        }
    }
    async createPaymentUrl(req) {
        try {
            const order = await this.createOrder(req);
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const tmnCode = process.env.VNP_TMN_CODE;
            const secretKey = process.env.VNP_HASH_SECRET;
            let vnpUrl = process.env.VNP_URL;
            const returnUrl = process.env.VNP_RETURN_URL;

            const date = new Date();
            const createDate = moment(date).format("YYYYMMDDHHmmss");
            const orderId = order._id;
            const amount = order.totalPrice;
            const orderInfo = 'Order payment';
            const orderType = 'other';
            const locale = 'vn';
            const currCode = 'VND';
            const bankCode = req.body.bankCode || ''; // Ngân hàng thanh toán
            let vnp_Params = {
                'vnp_Version': '2.1.0',
                'vnp_Command': 'pay',
                'vnp_TmnCode': tmnCode,
                'vnp_Locale': locale,
                'vnp_CurrCode': currCode,
                'vnp_TxnRef': orderId.toString(),
                'vnp_OrderInfo': orderInfo,
                'vnp_OrderType': orderType,
                'vnp_Amount': amount * 100,
                'vnp_ReturnUrl': returnUrl,
                'vnp_IpAddr': ipAddr,
                'vnp_CreateDate': createDate,
            };
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            vnp_Params = this.sortObject(vnp_Params);

            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            await Transaction.create({
                orderId,
                amount,
                bankCode: req.body.bankCode,
                orderDescription: orderInfo,
                orderType,
                language: locale,
                paymentStatus: 'Pending'
            });

            return { vnpUrl };
        } catch (error) {
            console.error('Error creating payment URL:', error);
            throw new Error('Internal Server Error');
        }
    }
    async updateProductStock(items) {
        for (const item of items) {
            const product = await Product.findById(item.productId);
            const colorStock = product.inStock.find(stock => stock.variant === item.variant);

            if (colorStock) {
                colorStock.quantity -= item.quantity;
                if (colorStock.quantity < 0) colorStock.quantity = 0; // Ensure stock doesn't go negative
            }

            await product.save();
        }
    }
    async handleVnpayReturnUrl(req) {
        try {
            const responseData = req.query;
            const secureHash = responseData.vnp_SecureHash;
            delete responseData.vnp_SecureHash;
            delete responseData.vnp_SecureHashType;

            const secretKey = process.env.VNP_HASH_SECRET;
            const sortedData = this.sortObject(responseData);
            const signData = querystring.stringify(sortedData, { encode: false });
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            if (secureHash !== signed) {
                throw new Error('Checksum validation failed');
            }

            const orderId = responseData.vnp_TxnRef;

            await Transaction.findOneAndUpdate({ orderId }, {
                paymentStatus: responseData.vnp_ResponseCode === '00' ? 'Success' : 'Failed',
                paymentTime: new Date()
            });

            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                paymentStatus: responseData.vnp_ResponseCode === '00' ? 'Completed' : 'Failed',
                orderStatus: responseData.vnp_ResponseCode === '00' ? 'Processing' : 'Cancelled',
                'paymentDetails.transactionId': responseData.vnp_TransactionNo,
                'paymentDetails.paymentTime': new Date()
            }, { new: true });
            // console.log('updatedOrder',updatedOrder)
            if (responseData.vnp_ResponseCode === '00') {
                // console.log('updatedOrder.items',updatedOrder.items)
                await this.updateProductStock(updatedOrder.items);
            }

            return responseData.vnp_ResponseCode === '00' ? 'Payment successful' : 'Payment failed';
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getOrderById(orderId) {
        try {
            return await Order.findById(orderId).populate('items.productId');
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            throw new Error('Internal Server Error');
        }
    }

    sortObject(obj) {
        let sorted = {};
        let str = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (let key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    async getTopSellingProducts() {
        try {
            // Thống kê sản phẩm bán chạy
            const topSellingProducts = await Order.aggregate([
                { $unwind: '$items' },
                { $match: { paymentStatus: 'Completed' } },
                {
                    $group: {
                        _id: '$items.productId',
                        totalSold: { $sum: '$items.quantity' }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 4 }
            ]);

            // Lấy thông tin chi tiết sản phẩm
            const productIds = topSellingProducts.map(item => item._id);
            const products = await Product.find({ _id: { $in: productIds } });

            // Gộp thông tin chi tiết sản phẩm vào kết quả
            const result = topSellingProducts.map(item => {
                const product = products.find(p => p._id.equals(item._id));
                return {
                    productId: item._id,
                    totalSold: item.totalSold,
                    productDetails: product
                };
            });

            return result;
        } catch (error) {
            console.error('Error fetching top selling products:', error);
            throw new Error('Internal Server Error');
        }
    }
    async getOrdersByUserId(userId, page, limit, startDate, endDate, orderStatus) {
        try {
            const skip = (page - 1) * limit;
            const query = { userId };

            // Add date range filter
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                };
            }

            // Add order status filter
            if (orderStatus) {
                query.orderStatus = orderStatus;
            }

            const orders = await Order.find(query).skip(skip).limit(limit).populate('items.productId').sort({ createdAt: -1 })
                .populate('couponId', 'code type value minOrderValue maxDiscount expiryDate');
            const totalOrders = await Order.countDocuments(query);
            return {
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page,
                orders
            };
        } catch (error) {
            console.error('Error fetching orders by user ID:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Internal Server Error'
            };
        }
    }

    async updateOrder(orderId, orderData) {
        try {
            const allowedUpdates = {
                orderStatus: orderData.orderStatus,
                paymentStatus: orderData.paymentStatus,
                contactInfo: orderData.contactInfo
            };
            const updatedOrder = await Order.findByIdAndUpdate(orderId, allowedUpdates, { new: true });
            if (!updatedOrder) {
                throw new Error('Order not found');
            }
            // Gửi thông báo qua socket.io
            const io = getIO();
            io.to(updatedOrder.userId.toString()).emit('orderUpdated', updatedOrder);

            return { message: 'Update order successfully' };
        } catch (error) {
            console.error('Error updating order:', error);
            return { error: 'failed', message: error.message || 'Internal Server Error' };
        }
    }


    async getOrders({ page, limit, search, sort, filter }) {
        try {
            const skip = (page - 1) * limit;
            const query = {};

            // Handle search
            if (search) {
                query['$or'] = [
                    { 'contactInfo.name': { $regex: search, $options: 'i' } },
                    { 'contactInfo.email': { $regex: search, $options: 'i' } },
                    { 'contactInfo.phone': { $regex: search, $options: 'i' } }
                ];
            }

            // Handle filter
            if (filter) {
                if (filter.orderStatus) {
                    query.orderStatus = filter.orderStatus;
                }
                if (filter.paymentStatus) {
                    query.paymentStatus = filter.paymentStatus;
                }
                if (filter.paymentMethod) {
                    query.paymentMethod = filter.paymentMethod;
                }
            }

            // Handle sort
            let sortOptions = {};
            if (sort) {
                sortOptions[sort.field] = sort.order === 'desc' ? -1 : 1;
            } else {
                sortOptions = { createdAt: -1 }; // default sort by creation date
            }

            const orders = await Order.find(query)
                .skip(skip)
                .limit(limit)
                .sort(sortOptions)
                .populate('items.productId', 'name')
                .populate('couponId', 'code type value minOrderValue maxDiscount expiryDate');

            const totalOrders = await Order.countDocuments(query);

            return {
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page,
                orders
            };
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Internal Server Error');
        }
    }

    async deleteOrder(orderId) {
        try {
            await Order.findByIdAndDelete(orderId);
        } catch (error) {
            console.error('Error deleting order:', error);
            throw new Error('Internal Server Error');
        }
    }

    updateCost = async () => {
        const bulkOperations = [];
        const orders = await Order.aggregate([
            { $unwind: "$items" },
            { $set: { "items.saleCost": { $multiply: ["$items.salePrice", 0.7] } } }
        ]);

        orders.forEach(order => {
            const updateQuery = { _id: order._id, "items.productId": order.items.productId };
            const updateData = { $set: { "items.$.saleCost": order.items.saleCost } };
            bulkOperations.push({ updateOne: { filter: updateQuery, update: updateData } });
        });

        return await Order.bulkWrite(bulkOperations);
    }

    getProfitByMonth = async (month) => {
        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);

        const orders = await Order.find({
            orderStatus: "Delivered",
            createdAt: { $gte: start, $lt: end },
        }).populate('items.productId');
        let totalRevenue = 0;
        let totalCost = 0;
        let totalOrders = orders.length;
        let productQuantities = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.saleCost && item.quantity && item.salePrice) {
                    totalRevenue = item.salePrice * item.quantity;
                    totalCost += item.saleCost * item?.quantity;
                }
                if (!productQuantities[item.productId?._id]) {
                    productQuantities[item.productId?._id] = {
                        product: item.productId,
                        quantity: 0
                    };
                }
                productQuantities[item.productId?._id].quantity += item.quantity;
            });
        });

        // check hardcode
        if (totalCost > totalRevenue) {
            totalCost = totalRevenue * 0.7
        }
        let totalProfit = totalRevenue - totalCost;

        // Tìm sản phẩm bán chạy nhất
        let bestSellerItem = null;
        let maxQuantity = 0;

        for (const productId in productQuantities) {
            if (productQuantities[productId].quantity > maxQuantity) {
                maxQuantity = productQuantities[productId].quantity;
                bestSellerItem = productQuantities[productId].product;
            }
        }


        const statistics = {
            totalRevenue: Number.parseFloat(totalRevenue).toFixed(2),
            totalCost: Number.parseFloat(totalCost).toFixed(2),
            totalProfit: Number.parseFloat(totalProfit).toFixed(2),
            totalOrders,
            bestSellerItem: bestSellerItem ? {
                productId: bestSellerItem._id,
                name: bestSellerItem.name,
                quantity: maxQuantity
            } : null
        };

        return statistics;
    };

    getMonthName = (monthNumber) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[monthNumber - 1];
    };

    getAllProfitsByYear = async (year) => {
        const result = await Order.aggregate([
            {
                $match: {
                    orderStatus: "Delivered",
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: { $multiply: ["$items.salePrice", "$items.quantity"] } },
                    totalCost: { $sum: { $multiply: ["$items.saleCost", "$items.quantity"] } },
                    totalProfit: { $sum: { $multiply: [{ $subtract: ["$items.salePrice", "$items.saleCost"] }, "$items.quantity"] } },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        // Tính tổng cho cả năm
        const yearlySummary = result.reduce(
            (totals, monthData) => {
                totals.totalRevenue += monthData.totalRevenue || 0;
                totals.totalCost += monthData.totalCost || 0;
                totals.totalProfit += monthData.totalProfit || 0;
                totals.totalOrders += monthData.totalOrders || 0;
                return totals;
            },
            { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalOrders: 0 }
        );

        // Tạo mảng kết quả cho từng tháng
        const allMonths = Array.from({ length: 12 }, (_, index) => ({
            month: this.getMonthName(index + 1),
            totalRevenue: 0,
            totalCost: 0,
            totalProfit: 0,
            totalOrders: 0
        }));

        const monthlyData = allMonths.map(monthData => {
            const foundData = result.find(r => r._id.month === allMonths.indexOf(monthData) + 1);
            return foundData
                ? {
                    ...monthData,
                    totalRevenue: foundData.totalRevenue,
                    totalCost: foundData.totalCost,
                    totalProfit: foundData.totalProfit,
                    totalOrders: foundData.totalOrders
                }
                : monthData;
        });

        return {
            yearlySummary,
            monthlyData
        };
    };

    exportProfitsByYear = async (year) => {
        const result = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: { $multiply: ["$items.salePrice", "$items.quantity"] } },
                    totalCost: { $sum: { $multiply: ["$items.saleCost", "$items.quantity"] } },
                    totalProfit: { $sum: { $multiply: [{ $subtract: ["$items.salePrice", "$items.saleCost"] }, "$items.quantity"] } },
                    totalOrders: { $sum: 1 },
                    items: { $push: "$items" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        const finalResult = await Promise.all(result.map(async monthData => {
            const bestSellerItem = monthData.items.reduce((best, item) => {
                return (best.quantity || 0) > item.quantity ? best : item;
            }, {});

            return {
                month: this.getMonthName(monthData._id.month),
                totalRevenue: monthData.totalRevenue,
                totalCost: monthData.totalCost,
                totalProfit: monthData.totalProfit,
                totalOrders: monthData.totalOrders,
                bestSellerItem: bestSellerItem.productId || 'N/A'
            };
        }));

        // Create an XLSX file
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(finalResult);
        xlsx.utils.book_append_sheet(wb, ws, "Yearly Profit Report");

        // Send the XLSX file as response
        const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
        return (buffer);
    };
    async createOrderPayOS(req) {
        try {
            let { userId, items, paymentMethod, contactInfo, shippingFee } = req.body;
            if (!userId || userId.trim() === '') {
                userId = null;
            }
            if (!shippingFee) {
                shippingFee = 0;
            }
            const totalPrice = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0) + shippingFee;

            const newOrder = new Order({
                userId,
                items,
                totalPrice,
                shippingFee,
                paymentMethod,
                contactInfo,
                orderStatus: 'Pending',
                paymentStatus: 'Pending'
            });

            const savedOrder = await newOrder.save();

            if (paymentMethod === 'PayOS') {
                const YOUR_DOMAIN = `http://localhost:3000`; // Update with your actual domain
                const body = {
                    orderCode: Number(String(Date.now()).slice(-6)),
                    amount: totalPrice,
                    description: "Thanh toan don hang",
                    items: items.map(item => ({
                        name: item.productId.toString(), // You may want to use actual product names
                        quantity: item.quantity,
                        price: item.salePrice
                    })),
                    returnUrl: `${YOUR_DOMAIN}/success?orderId=${savedOrder._id}`,
                    cancelUrl: `${YOUR_DOMAIN}/cancel?orderId=${savedOrder._id}`,
                };

                const paymentLinkResponse = await payOS.createPaymentLink(body);
                console.log('paymentLinkResponse',paymentLinkResponse)
                console.log('paymentLinkResponse.checkout',paymentLinkResponse.checkoutUrl)
                let paymentLink = paymentLinkResponse.checkoutUrl 
                // return { order: savedOrder, paymentLink: paymentLinkResponse.checkoutUrl };
                savedOrder.paymentDetails = {
                    orderCode: paymentLinkResponse.orderCode,
                    paymentLinkId: paymentLinkResponse.paymentLinkId,
                    paymentTime: new Date() 
                };
                await savedOrder.save();
                return { paymentLink};
            }

            const io = getIO();
            io.emit('newOrder', savedOrder);
            return { order: savedOrder };

        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Internal Server Error');
        }
    }

    async handlePayOSCallback(req) {
        // const { orderCode, code } = req.query;
        const responseData = req.query;
        try {
            // const order = await Order.findOne({ 'paymentDetails.transactionId': responseData.orderCode });
            // if (!order) {
            //     return { success: false, message: 'Order not found' };
            // }
            const orderId = responseData.orderId;
            
            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                paymentStatus: responseData.cancel === 'false' ? 'Completed' : 'Failed',
                orderStatus: responseData.cancel === 'false' ? 'Processing' : 'Cancelled',
                'paymentDetails.paymentTime': new Date()
            }, { new: true });
            if (responseData.false === 'false') {
                await this.updateProductStock(updatedOrder.items);
            }
        //     order.paymentDetails.paymentTime = new Date(); 
        //    paymentStatus : responseData.code === '00' ? 'Completed' : 'Failed';
        //    orderStatus : responseData.code === '00' ? 'Processing' : 'Cancelled';
        //     await order.save();

        //     if (code === '00') {
        //         await this.updateProductStock(order.items);
        //     }

            return responseData.cancel === 'false' ? 'Payment successful' : 'Payment failed';
        } catch (error) {
            console.error('Error handling PayOS callback:', error);
            throw new Error('Internal Server Error');
        }
    }

    
}

module.exports = new OrderService();
