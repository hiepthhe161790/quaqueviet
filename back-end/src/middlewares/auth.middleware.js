// const jwt = require('jsonwebtoken');

// class AuthMiddleware {
    
//     renewToken = (req, res) => {
//         const refreshToken = req.cookies.refreshToken;

//         if (!refreshToken) {
//             res.status(401).json({ valid: false, message: "No Refresh Token" });
//             return false;
//         }

//         try {
//             const decoded = jwt.verify(refreshToken, 'jwt-refresh-token-secret-key');
//             const accessToken = jwt.sign(
//                 { email: decoded.email, role: decoded.role, id: decoded.id },
//                 config.refreshTokenSecret,
//                 { expiresIn: '1m' }
//             );
//             res.cookie('accessToken', accessToken, { maxAge: 60000 });
//             return true;
//         } catch (err) {
//             res.status(403).json({ valid: false, message: "Invalid Refresh Token" });
//             return false;
//         }
//     }

//     verifyRole = (role) => {
//         return (req, res, next) => {
//             const accessToken = req.cookies.accessToken;

//             if (!accessToken) {
//                 if (this.renewToken(req, res)) {
//                     this.verifyAccessToken(req, res, next, role);
//                 }
//             } else {
//                 this.verifyAccessToken(req, res, next, role);
//             }
//         };
//     }

//     verifyAccessToken = (req, res, next, role) => {
//         const accessToken = req.cookies.accessToken;

//         jwt.verify(accessToken, config.refreshTokenSecret, (err, decoded) => {
//             if (err) {
//                 return res.status(403).json({ valid: false, message: "Invalid Token" });
//             }

//             if (decoded.role === role) {
//                 req.user = decoded; // Set the user information in req.user
//                 next();
//             } else {
//                 return res.status(403).json({ valid: false, message: "Unauthorized" });
//             }
//         });
//     }
// }

// module.exports = new AuthMiddleware();
const jwt = require('jsonwebtoken');
const config = require('../../config');
const UserModel = require('../models/user.model');

const AuthMiddleware = {
    verifyToken: async (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token.split(' ')[1], config.accessTokenSecret);
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
    },
    verifyRole: (roles) => {
        return (req, res, next) => {
            const userRole = req.user.role;
            console.log('User Role:', userRole);
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
            }
            next();
        }
    },

    verifyEmailVerification: (req, res, next) => {
        if (!req.user.isVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }
        next();
    }
};

module.exports = AuthMiddleware;
