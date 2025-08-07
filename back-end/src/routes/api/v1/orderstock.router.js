const express = require('express');
const orderService = require('../../../services/order.service');
const router = express.Router();


// API to update product stock based on order items
router.post('/update-stock', async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items array is required.' });
        }
        await orderService.updateProductStock(items);
        return res.status(200).json({ message: 'Product stock updated successfully.' });
    } catch (error) {
        console.error('Error updating product stock:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
