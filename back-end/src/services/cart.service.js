const Cart = require('../models/cart.model');

const addToCart = async (userId, productId, quantity, color) => {
    let cart = await Cart.findOne({ userId });

    if (cart) {
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const itemIndex = cart.items.findIndex(p => p.productId == productId && p.color == color);

        if (itemIndex > -1) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng với cùng màu, cập nhật số lượng
            let productItem = cart.items[itemIndex];
            productItem.quantity += quantity;
            cart.items[itemIndex] = productItem;
        } else {
            // Nếu sản phẩm chưa tồn tại trong giỏ hàng hoặc khác màu, thêm sản phẩm mới
            cart.items.push({ productId, quantity, color });
        }

        cart = await cart.save();
        return cart;
    } else {
        // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
        const newCart = await Cart.create({
            userId,
            items: [{ productId, quantity, color }]
        });

        return newCart;
    }
};


const updateCart = async (userId, productId, quantity, color) => {
    let cart = await Cart.findOne({ userId });

    if (cart) {
        const itemIndex = cart.items.findIndex(p => p.productId == productId && p.color == color);

        if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];
            productItem.quantity = quantity;
            cart.items[itemIndex] = productItem;

            cart = await cart.save();
            return cart;
        } else {
            throw new Error('Product not found in cart');
        }
    } else {
        throw new Error('Cart not found');
    }
};

const removeFromCart = async (userId, productId, color) => {
    let cart = await Cart.findOne({ userId });

    if (cart) {
        cart.items = cart.items.filter(item => !(item.productId == productId && item.color == color));

        cart = await cart.save();
        return cart;
    } else {
        throw new Error('Cart not found');
    }
};

const getCartById = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
        throw new Error('Cart not found');
    }
    return cart;
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCart,
    getCartById
};
