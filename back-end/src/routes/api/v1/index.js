const brandRouter = require('./brand.router');
const cartRouter = require('./cart.router');
const categoryRouter = require('./category.router');
const orderRouter = require('./order.router');
const productRouter = require('./product.router');
const userRouter = require('./user.router');
const wishlistRouter = require('./wishlist.router');
const reviewRouter = require('./review.router');
const couponRouter = require('./coupon.router');
const couponValidateRouter = require('./coupon.validate.router');
const orderStockRouter = require('./orderstock.router');

const dashboardRouter = require('./dashboard.router');
const express = require('express');
const router = express.Router();

router.use('/brand', brandRouter);
router.use('/cart', cartRouter);
router.use('/category', categoryRouter);
router.use('/order', orderRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);
router.use('/wishlist', wishlistRouter);
router.use('/review', reviewRouter);
router.use('/coupon', couponRouter);
router.use('/coupon', couponValidateRouter);
router.use('/dashboard', dashboardRouter);
router.use('/orderstock', orderStockRouter);
module.exports = router;
