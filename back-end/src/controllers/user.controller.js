const { UserService, EmailService } = require('../services/index');

class UserController {
    register = async (req, res, next) => {
        try {
            const result = await UserService.registerUser(req.body);
            console.log(result);
            if (result.message === "User already existed") {
                return res.json(result);
            }
            // Send verification email
            await EmailService.sendVerificationEmail(result.email, result.otp);
            return res.status(200).json({ message: 'Verification email sent' });
        } catch (err) {
            next(err)
        }
    }
    login = async (req, res, next) => {
        try {
            const result = await UserService.loginUser(req.body);

            if (!result.success) {
                return res.status(401).json({ message: result.message });
            }

            // Set cookies for access and refresh tokens
            // res.cookie('accessToken', result.accessToken, { httpOnly: true, maxAge: 60000 }); // 1 minute
            res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 604800000 }); // 7 days

            return res.json({
    accessToken: result.accessToken,
    message: result.message,
    role: result.role, // thêm dòng này
    deleted: result.deleted // hoặc isDeleted: result.isDeleted
});
        } catch (err) {
            next(err)
        }
    };

    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await UserService.forgotPassword(email);
            if (result.error) {
                return res.status(404).json({ error: result.error });
            }

            // Send reset password email
            await EmailService.sendResetPasswordEmail(result.email, result.token);
            return res.json({ message: "Reset password link sent to your email" });
        } catch (err) {
            next(err)
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const result = await UserService.resetPassword(token, password);
            return res.json(result);
        } catch (err) {
            next(err)
        }
    }

    verifyEmail = async (req, res, next) => {
        try {
            const { otp, email } = req.query;
            const result = await UserService.verifyEmail(otp, email);
            if (result.message === 'Invalid OTP or email' || result.message === 'OTP has expired') {
                return res.status(400).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            next(err)
        }
    }

    resendVerificationEmail = async (req, res, next) => {
        try {
            const { email } = req.query;
            const result = await UserService.resendVerificationEmail(email);
            if (result.message === 'User not found') {
                return res.status(400).json(result);
            }

            // Send verification email
            await EmailService.sendVerificationEmail(result.email, result.otp);
            return res.json(result);
        } catch (err) {
            next(err)
        }
    }
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const result = await UserService.updateProfile(userId, req.body);
            if (result.message === 'User not found') {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    changePassword = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { oldPassword, newPassword } = req.body;
            const result = await UserService.changePassword(userId, oldPassword, newPassword);
            if (result.message === 'User not found' || result.message === 'Old password is incorrect') {
                return res.status(400).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const result = await UserService.getProfile(userId);
            if (result.message === 'User not found') {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
    refreshAccessToken = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const result = await UserService.refreshAccessToken(refreshToken);

            if (!result.success) {
                return res.status(401).json({ message: result.message });
            }
            return res.json({ accessToken: result.accessToken });
        } catch (err) {
            next(err);
        }
    }
    logout = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const result = await UserService.logout(userId);
            res.clearCookie('refreshToken'); // Clear refresh token cookie

            if (result.message === 'User not found') {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    getAllUsers = async (req, res, next) => {
        try {
            const result = await UserService.getAllUsers();
            res.status(200).json(result);

        } catch (error) {
            next(error);
        }
    }

    createUser = async (req, res, next) => {
        try {
            const result = await UserService.createUser(req);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            const updateData = req.body;
            const result = await UserService.updateUser(id, updateData);
            res.status(200).json({
                success: true,
                message: "Update user success!",
                result
            });
        } catch (error) {
            next(error);
        }
    }

    deleteUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await UserService.deleteUser(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    getPaginatedUsers = async (req, res, next) => {
        try {
            const { page = 1, pageSize = 10, keywords = '', sortBy = '' } = req.query;
            const result = await UserService.getPaginatedUsers(parseInt(page), parseInt(pageSize), keywords, sortBy);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }

    softDeleteUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const deletedUser = await UserService.softDeleteUser(userId);
            return res.status(200).json({
                success: true,
                message: "Soft delete success!",
                account: deletedUser
            })
        } catch (error) {
            next(error)
        }
    }

    recoverSoftDeletedUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const deletedUser = await UserService.recoverSoftDeletedUser(userId);
            return res.status(200).json({
                success: true,
                message: "Recover soft deleted user success!",
                account: deletedUser
            })
        } catch (error) {
            next(error)
        }
    }

    getAllDeletedUsers = async (req, res, next) => {
        try {
            const deletedUsers = await UserService.getAllDeletedUsers();
            return res.status(200).json(deletedUsers)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController;