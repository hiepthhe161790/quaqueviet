const express = require('express');
const router = express.Router();
const { UserController } = require('../../../controllers/index');
const AuthMiddleware = require('../../../middlewares/auth.middleware');

/**
 * Định nghĩa các router ở đây theo feature
 * router.get('<router>', UserController.<Method>);
 * router.post('<router>', UserController.<Method>);
 * VD: router.get('/view-all-user')
 */
router.delete('/soft-delete/:id', UserController.softDeleteUser);
router.patch('/recover-soft-deleted/:id', UserController.recoverSoftDeletedUser);
router.get('/get-deleted-users', UserController.getAllDeletedUsers);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password/:token', UserController.resetPassword);
router.get('/verify-email', UserController.verifyEmail);
router.get('/resend-verification-email', UserController.resendVerificationEmail);
router.post('/refresh-token', UserController.refreshAccessToken);
router.post('/logout', AuthMiddleware.verifyToken, UserController.logout);

router.put('/profile', AuthMiddleware.verifyToken, UserController.updateProfile);
router.put('/change-password', AuthMiddleware.verifyToken, UserController.changePassword);
router.get('/profile', AuthMiddleware.verifyToken, UserController.getProfile);

router.get("/find", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.getAllUsers);
router.post("/create", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.createUser);
router.put("/update/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.updateUser);
router.delete("/delete/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.deleteUser);
router.get("/get-paginated-users", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.getPaginatedUsers)

module.exports = router;
