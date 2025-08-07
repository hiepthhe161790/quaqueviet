const express = require('express');
const router = express.Router();
const DashboardController = require('../../../controllers/dashboard.controller');
const AuthMiddleware = require('../../../middlewares/auth.middleware');

router.get('/top-selling',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), DashboardController.getTopSellingProducts);
router.get('/unsold',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), DashboardController.getUnsoldProducts);
router.get('/expired',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), DashboardController.getExpiredProducts);
router.get('/revenue',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), DashboardController.getTotalRevenue);
router.get('/monthly-revenue',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), DashboardController.getMonthlyRevenue);

module.exports = router;
