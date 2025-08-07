const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        uniqe: [true, "Category name must be unique !"],
        lowercase: [true, "Category name must be in lowercase !"],
        required: [true, "Category name must require !"],
        minLength: 0,
        maxLength: 20
    },
    description: {
        type: String,
        default: "",
        minLength: 0,
        maxLength: 200
    },
    thumbnails: String
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
