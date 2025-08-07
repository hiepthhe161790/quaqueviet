const express = require('express');
const router = express.Router();
const CouponValidateController = require('../../../controllers/coupon.validate.controller');

router.post('/validate', CouponValidateController.validateCoupon);

module.exports = router;
