const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
    name: {
        type: String,
        unique: [true, "Brand name must be unique !"],
        lowercase: [true, "Brand name must be in lowercase !"],
        required: [true, "Brand name must require !"],
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

module.exports = mongoose.model("Brand", brandSchema);
