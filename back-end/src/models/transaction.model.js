const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bankCode: String,
    orderDescription: String,
    orderType: String,
    language: String,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    paymentTime: Date
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
