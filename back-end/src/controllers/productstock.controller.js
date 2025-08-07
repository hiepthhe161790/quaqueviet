const OrderService = require('../services/order.service');

class ProductStockController {
    async updateProductStock(req, res, next) {
        try {
            const { items } = req.body;
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ success: false, message: 'No items provided' });
            }
            await OrderService.updateProductStock(items);
            res.json({ success: true, message: 'Product stock updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductStockController();
