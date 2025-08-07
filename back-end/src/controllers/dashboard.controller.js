const Product = require('../models/product.model');
const Order = require('../models/order.model');


const getMonthName = (monthNumber) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
};

class DashboardController {
    // Sản phẩm bán chạy nhất
    async getTopSellingProducts(req, res, next) {
        try {
            const topProducts = await Order.aggregate([
                { $unwind: '$items' },
                { $match: { paymentStatus: 'Completed' } },
                {
                    $group: {
                        _id: '$items.productId',
                        totalSold: { $sum: '$items.quantity' }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 10 }
            ]);
            const products = await Product.find({ _id: { $in: topProducts.map(p => p._id) } });
            const result = topProducts.map(item => ({
                product: products.find(p => p._id.equals(item._id)),
                totalSold: item.totalSold
            }));
            // Chuẩn bị dữ liệu cho biểu đồ
            const chartData = {
                labels: result.map(r => r.product ? r.product.name : 'Unknown'),
                data: result.map(r => r.totalSold)
            };
            res.json({ success: true, data: result, chartData });
        } catch (error) {
            next(error);
        }
    }

    // Sản phẩm không bán được
    async getUnsoldProducts(req, res, next) {
        try {
            const soldProductIds = await Order.distinct('items.productId', { paymentStatus: 'Completed' });
            const unsoldProducts = await Product.find({ _id: { $nin: soldProductIds }, isDeleted: false });
            res.json({ success: true, data: unsoldProducts, count: unsoldProducts.length });
        } catch (error) {
            next(error);
        }
    }

    // Sản phẩm hết hạn
    async getExpiredProducts(req, res, next) {
        try {
            const now = new Date();
            const expiredProducts = await Product.find({ expiryDate: { $lte: now }, isDeleted: false });
            res.json({ success: true, data: expiredProducts, count: expiredProducts.length });
        } catch (error) {
            next(error);
        }
    }

    // Tổng doanh thu theo tháng trong năm hiện tại (biểu đồ)
    async getMonthlyRevenue(req, res, next) {
        try {
            const year = new Date().getFullYear();
            const result = await Order.aggregate([
                {
                    $match: {
                        paymentStatus: 'Completed',
                        createdAt: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`)
                        }
                    }
                },
                { $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }},
                { $sort: { "_id.month": 1 } }
            ]);
            const allMonths = Array.from({ length: 12 }, (_, i) => ({
                month: getMonthName(i + 1),
                totalRevenue: 0,
                count: 0
            }));
            result.forEach(r => {
                allMonths[r._id.month - 1].totalRevenue = r.totalRevenue;
                allMonths[r._id.month - 1].count = r.count;
            });
            res.json({ success: true, data: allMonths });
        } catch (error) {
            next(error);
        }
    }

    // Tổng doanh thu toàn hệ thống
    async getTotalRevenue(req, res, next) {
        try {
            const orders = await Order.find({ paymentStatus: 'Completed' });
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
            res.json({ success: true, totalRevenue });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DashboardController();
