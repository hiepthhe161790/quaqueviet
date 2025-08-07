const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const UserModel = require('../models/user.model');

class UserService {
    async registerUser(data) {
        const { email, password, fullName, address, phoneNumber } = data;
        const otp = crypto.randomBytes(4).toString('hex');
        const otpExpires = Date.now() + 3600000; // OTP expires 1 hour
        const user = await UserModel.findOne({ email });
        if (user) {
            return { message: "User already existed" };
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            email,
            passwordToken: hashpassword,
            fullName,
            address,
            phoneNumber,
            otp,
            otpExpires
        });

        await newUser.save();
        return {
            success: true,
            message: 'User registered successfully',
            email,
            otp
        };
    }
    async loginUser(data) {
        const { email, password } = data;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: 'Email hoặc mật khẩu không đúng' };
        }

        const validPassword = await bcrypt.compare(password, user.passwordToken);
        if (!validPassword) {
            return { success: false, message: 'Email hoặc mật khẩu không đúng' };
        }

        const accessToken = jwt.sign(
            { email: email, role: user.role, id: user._id, isDeleted: user.isDeleted },
            config.accessTokenSecret,
            { expiresIn: config.accessTokenExpiry}
        );
        const refreshToken = jwt.sign(
            { id: user._id },
            config.refreshTokenSecret,
            { expiresIn: config.refreshTokenExpiry }
        );

        // Store the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();

        const isVerified = user.isVerified;

      return {
    success: true,
    accessToken,
    refreshToken,
    isVerified,
    role: user.role, // thêm dòng này
    deleted: user.isDeleted, // hoặc isDeleted: user.isDeleted
    message: isVerified ? 'Login successful' : 'Please verify your email'
};
    }
    async forgotPassword(email) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { error: "User not registered" };
        }
        const token = jwt.sign({ id: user._id }, "jwt-token-secret-key", { expiresIn: "5m" });
        return { email, token };
    }

    async resetPassword(token, password) {
        const decoded = jwt.verify(token, "jwt-token-secret-key");
        const id = decoded.id;
        const hashPassword = await bcrypt.hash(password, 10);
        await UserModel.findByIdAndUpdate({ _id: id }, { passwordToken: hashPassword });
        return { message: "Password updated successfully" };
    }

    async verifyEmail(otp, email) {
        const user = await UserModel.findOne({ email, otp });
        if (!user) {
            return { message: 'Invalid OTP or email' };
        }
        if (user.otpExpires < Date.now()) {
            return { message: 'OTP has expired' };
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        return { message: 'Email verified successfully' };
    }

    async resendVerificationEmail(email) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { message: 'User not found' };
        }
        const otp = crypto.randomBytes(4).toString('hex');
        user.otp = otp;
        user.otpExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        return { email, otp };
    }
    async updateProfile(userId, data) {
        const { fullName, address, phoneNumber } = data;
        const user = await UserModel.findById(userId);
        if (!user) {
            return { message: 'User not found' };
        }
        user.fullName = fullName || user.fullName;
        user.address = address || user.address;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        await user.save();
        return { message: 'Profile updated successfully', user };
    }

    async changePassword(userId, oldPassword, newPassword) {
        const user = await UserModel.findById(userId);
        if (!user) {
            return { message: 'User not found' };
        }

        const validPassword = await bcrypt.compare(oldPassword, user.passwordToken);
        if (!validPassword) {
            return { message: 'Old password is incorrect' };
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.passwordToken = hashPassword;
        await user.save();
        return { message: 'Password changed successfully' };
    }

    async getProfile(userId) {
        const user = await UserModel.findById(userId).select('-passwordToken -otp -otpExpires -refreshToken');
        if (!user) {
            return { message: 'User not found' };
        }
        return { message: 'User fetched successfully', user };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
            const user = await UserModel.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                throw new Error('Invalid refresh token');
            }

            const newAccessToken = jwt.sign(
                { email: user.email, role: user.role, id: user._id },
                config.accessTokenSecret,
                { expiresIn: config.refreshTokenExpiry }
            );

            return { success: true, accessToken: newAccessToken };
        } catch (err) {
            return { success: false, message: 'Invalid refresh token' };
        }
    }
    async logout(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return { message: 'User not found' };
            }
            user.refreshToken = null; // Clear the refresh token in the database
            await user.save();
            return { message: 'Logout successful' };
        } catch (error) {
            return { message: 'Logout failed', error };
        }
    }
    
    getAllUsers = async () => {
        return await UserModel.find({});
    }

    createUser = async (req) => {
        return await UserModel.create(req.body);
    }

    updateUser = async (id, updateData) => {
        return await UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true })
    }

    deleteUser = async (id) => {
        return await UserModel.deleteOne({ _id: id })
    }

    getPaginatedUsers = async (page, pageSize, keywords, sortBy) => {
        const skip = (page - 1) * pageSize;
        let filter = {
            isDeleted: { $ne: true }
        };
        if (keywords) {
            const regex = new RegExp(keywords, 'i');
            filter.email = { $regex: regex };
        }
        let sort = {};
        switch (sortBy) {
            case 'email': {
                sort.userstatus = 1;
                break;
            }
            case 'fullName': {
                sort.fullName = 1;
                break;
            }
            case "address": {
                sort.address = 1;
                break;
            }
            case "phoneNumber": {
                sort.phoneNumber = 1;
                break;
            }
            case "role": {
                sort.totalPrice = 1;
                break;
            }
            case "isVerified": {
                sort.isVerified = 1;
                break;
            }
        }
        const users = await UserModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalUsers = await UserModel.countDocuments(filter);
        return {
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
            currentPage: page,
        };
    }

    softDeleteUser = async (userId) => {
        return await UserModel.updateOne({ _id: userId }, { $set: { isDeleted: true } }, { new: true });
    }

    recoverSoftDeletedUser = async (userId) => {
        return await UserModel.updateOne({ _id: userId }, { $set: { isDeleted: false } }, { new: true });
    }

    getAllDeletedUsers = async () => {
        return await UserModel.find({ isDeleted: true }).lean()
    };
}

module.exports = new UserService;