const express = require('express');
const router = express.Router();
const ProductStockController = require('../../../controllers/productstock.controller');

router.post('/update', ProductStockController.updateProductStock);

module.exports = router;
