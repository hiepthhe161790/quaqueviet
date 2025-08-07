const express = require('express');
const router = express.Router();
const CouponController = require('../../../controllers/coupon.controller');
const AuthMiddleware = require('../../../middlewares/auth.middleware');

router.post('/',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), CouponController.createCoupon);
router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), CouponController.getAllCoupons);
router.get('/:code',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), CouponController.getCouponByCode);
router.put('/:id',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), CouponController.updateCoupon);
router.delete('/:id',AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin','sales manager']), CouponController.deleteCoupon);

module.exports = router;
