const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        uniqe: [true, "Product name must be unique !"],
        lowercase: [true, "Product name must be in lowercase !"],
        required: [true, "Product name must require !"],
        minLength: 0,
        maxLength: 100
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, "Brand must require !"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Category must require !"]
    },
    description: {
        type: String,
        default: "",
        minLength: 0
    },
    images: [{
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
    }],
    specs: [{
        key: String,
        value: String
    }],
    price: Number,
    cost: Number, // các chi phí nhập hàng
    isAvailable: {
        type: Boolean,
        default: true // sản phẩm còn khả dụng không, đã ngừng bán chưa
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    inStock: [
        {
            "variant": {
                type: String,
                required: true
            },
            "quantity": {
                type: Number,
                default: 0
            },
            "size": {
                type: String,
            },
            "price": {
                type: Number,
                required: true
            }
        }
    ],
    expiryDate: {
        type: Date,
        required: false
    },
    importDate: {
        type: Date,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
