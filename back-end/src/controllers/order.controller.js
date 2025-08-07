const { OrderService, EmailService } = require('../services/index');

class OrderController {
    async createOrder(req, res) {
        try {
            const order = await OrderService.createOrder(req);
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async createPaymentUrl(req, res) {
        try {
            const result = await OrderService.createPaymentUrl(req);
            res.json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async vnpayReturnUrl(req, res) {
        try {
            const message = await OrderService.handleVnpayReturnUrl(req);

            // Fetch the order details using the order ID from the request query
            const orderId = req.query.vnp_TxnRef;
            const order = await OrderService.getOrderById(orderId);
            console.log(order)
            // Check if the payment was successful and the user is not logged in
            if (req.query.vnp_ResponseCode === '00' && !order.userId) {
                await EmailService.sendConfirmationEmail(order);
            }

            res.json(message);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    async getTopSellingProducts(req, res) {
        try {
            const topSellingProducts = await OrderService.getTopSellingProducts();
            res.json(topSellingProducts);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getOrdersByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const { page = 1, limit = 10, startDate, endDate, orderStatus } = req.query;
            const result = await OrderService.getOrdersByUserId(
                userId,
                Number(page),
                Number(limit),
                startDate,
                endDate,
                orderStatus
            );
            res.json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    async updateOrder(req, res) {
        try {
            const { orderId } = req.params;
            const orderData = req.body;
            const updatedOrder = await OrderService.updateOrder(orderId, orderData);
            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getOrder(req, res) {
        try {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getOrders(req, res) {
        try {
            const { page = 1, limit = 10, search, sortField, sortOrder, orderStatus, paymentStatus, paymentMethod } = req.query;

            const filter = {
                orderStatus: orderStatus || undefined,
                paymentStatus: paymentStatus || undefined,
                paymentMethod: paymentMethod || undefined
            };

            const sort = {
                field: sortField || 'createdAt',
                order: sortOrder || 'desc'
            };

            const result = await OrderService.getOrders({
                page: Number(page),
                limit: Number(limit),
                search,
                sort,
                filter
            });

            res.status(200).json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            await OrderService.deleteOrder(orderId);
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    getProfitByMonth = async (req, res, next) => {
        try {
            const { month } = req.query;
            const data = await OrderService.getProfitByMonth(month);
            res.json(data)
        } catch (error) {
            next(error);
        }
    }

    getAllProfitsByYear = async (req, res, next) => {
        try {
            const { year } = req.query;
            const data = await OrderService.getAllProfitsByYear(year);
            res.json(data)
        } catch (error) {
            next(error);
        }
    }

    getPaginatedAllOrders = async (req, res, next) => {
        try {
            const { page = 1, pageSize = 10, keywords = '', sortBy = '' } = req.query;
            const result = await OrderService.getPaginatedAllOrders(parseInt(page), parseInt(pageSize), keywords, sortBy);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }

    exportProfitsByYear = async (req, res, next) => {
        try {
            const currentTime = new Date()
            const year = req.query.year || currentTime.getFullYear();
            const buffer = await OrderService.exportProfitsByYear(year);
            res.setHeader('Content-Disposition', `attachment; filename=Yearly_Profit_Report_${year}.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }
    async createOrderPayOS(req, res) {
        try {
            const result = await OrderService.createOrderPayOS(req);
            res.json(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async handlePayOSCallback(req, res) {
        try {
            
           const message = await OrderService.handlePayOSCallback(req);
           const orderId = req.query.orderId;
           const order = await OrderService.getOrderById(orderId);
           console.log(order)
              if (req.query.cancel === 'false' && !order.userId) {
                await EmailService.sendConfirmationEmail(order);
              }
              res.json(message);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = new OrderController();
