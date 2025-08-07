const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User Id must require !"]
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, "Product Id must require !"]
        },
        color: {
            type: String,
            required: [true, "Please choose your product color !"]
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
