const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        lowercase: true
    },
    passwordToken: String,
    fullName: String,
    address: String,
    phoneNumber: String,
    role: { type: String, enum: ['customer', 'admin', 'sales manager'], default: 'customer', required: true },
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
