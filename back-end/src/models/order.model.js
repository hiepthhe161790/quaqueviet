const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        salePrice: Number,
        saleCost: Number, // chi phí tạo món đồ tại thời điểm bán
        variant: {
            type: String,
            required: true
        }
    }],
    totalPrice: Number,
    shippingFee: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing',
        /*
            Pending: Đơn hàng đã được tạo nhưng chưa được xử lý.
            Processing: Đơn hàng đang được xử lý.
            Shipped: Đơn hàng đã được gửi đi.
            Delivered: Đơn hàng đã được giao đến người nhận.
            Cancelled: Đơn hàng đã bị hủy.
        */
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'VnPay', 'Cash On Delivery', 'PayOS'],
        required: true
    },
    paymentDetails: {
        transactionId: String,
        orderCode: String,
        paymentLinkId: String,
        paymentTime: Date
    },
    contactInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
