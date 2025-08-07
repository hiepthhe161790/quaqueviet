const CouponService = require('../services/coupon.service');
const Product = require('../models/product.model');

class CouponValidateController {
    async validateCoupon(req, res, next) {
        try {
            const { code, total } = req.body;
            const coupon = await CouponService.getCouponByCode(code);
            if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found or expired' });
            if (!coupon.isActive) return res.status(400).json({ success: false, message: 'Coupon is not active' });
            if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
            }
            if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
                return res.status(400).json({ success: false, message: 'Coupon expired' });
            }
            if (coupon.minOrderValue && total < coupon.minOrderValue) {
                return res.status(400).json({ success: false, message: `Order must be at least ${coupon.minOrderValue}` });
            }
            // Không kiểm tra productIds nữa

            // Tính toán giá trị giảm
            let discount = 0;
            if (coupon.type === 'percent') {
                discount = total * coupon.value / 100;
                if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
            } else if (coupon.type === 'amount') {
                discount = coupon.value;
            }
            if (discount > total) discount = total;
            res.status(200).json({ success: true, discount, coupon });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CouponValidateController();
