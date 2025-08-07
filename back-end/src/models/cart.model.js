const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User must required !"]
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, "Product must required !"]
        },
        quantity: {
            type: Number,
            required: [true, "Please enter your product quantity !"]
        },
        color: {
            type: String,
            required: [true, "Please choose your product color !"]
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
