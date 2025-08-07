const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    sendVerificationEmail = async (email, otp) => {
        const verificationLink = `http://localhost:3000/verify-email?otp=${otp}&email=${email}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="background-color: #4CAF50; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0;">Email Verification</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Dear user,</p>
                    <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
                    <p style="text-align: center; margin: 20px 0;">
                        <a href="${verificationLink}" style="display: inline-block; padding: 15px 25px; font-size: 18px; color: #ffffff; background-color: #4CAF50; border-radius: 5px; text-decoration: none;">Verify Email</a>
                    </p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Best regards,<br>Your Company Name</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 10px; border-radius: 0 0 10px 10px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666;">&copy; 2024 Your Company Name. All rights reserved.</p>
                </div>
            </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Verification email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    sendResetPasswordEmail = async (email, token) => {
        const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
        const resetLink = `http://localhost:3000/reset-Password/${encodedToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="background-color: #4CAF50; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0;">Password Reset Request</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Dear user,</p>
                    <p>We received a request to reset your password. Please click the button below to reset your password:</p>
                    <p style="text-align: center; margin: 20px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 15px 25px; font-size: 18px; color: #ffffff; background-color: #4CAF50; border-radius: 5px; text-decoration: none;">Reset Password</a>
                    </p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Best regards,<br>Your Company Name</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 10px; border-radius: 0 0 10px 10px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666;">&copy; 2024 Your Company Name. All rights reserved.</p>
                </div>
            </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Reset password email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    sendConfirmationEmail = async (order) => {
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">
                    <img src="${`http://localhost:3333/api/v1/product/get-image/${item.productId.images[0].filename}`}" alt="${item.productId.name}" style="width: 100px; height: 100px;"/>
                </td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">${item.productId.name}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">${item.color}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">${item.salePrice}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">${item.quantity * item.salePrice}</td>
            </tr>
        `).join('');
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.contactInfo.email,
            subject: 'Order Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Thank you for your order!</h2>
                    <p>Your order ID is <strong>${order._id}</strong></p>
                    <h3 style="color: #4CAF50;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="border: 1px solid #dddddd; padding: 8px;">Image</th>
                                <th style="border: 1px solid #dddddd; padding: 8px;">Product</th>
                                <th style="border: 1px solid #dddddd; padding: 8px;">Color</th>
                                <th style="border: 1px solid #dddddd; padding: 8px;">Quantity</th>
                                <th style="border: 1px solid #dddddd; padding: 8px;">Price</th>
                                <th style="border: 1px solid #dddddd; padding: 8px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    <h3 style="color: #4CAF50; margin-top: 20px;">Shipping Information</h3>
                    <p>Name: ${order.contactInfo.name}</p>
                    <p>Email: ${order.contactInfo.email}</p>
                    <p>Phone: ${order.contactInfo.phone}</p>
                    <p>Address: ${order.contactInfo.address}</p>
                    <h3 style="color: #4CAF50; margin-top: 20px;">Summary</h3>
                    <p>Shipping Fee: ${order.shippingFee}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>Payment Method: ${order.paymentMethod}</p>
                    <p>Order Status: ${order.orderStatus}</p>
                    <p>Payment Status: ${order.paymentStatus}</p>
                </div>
            `
        };
    
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Confirmation email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
    
}

module.exports = new EmailService();
