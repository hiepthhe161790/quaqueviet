const { CartService } = require('../services/index');

class CartController {
  addToCart = async (req, res, next) => {
    try {
      const { userId, productId, quantity, color } = req.body; // Destructure dữ liệu từ req.body
      if (!userId || !productId || typeof quantity !== 'number' || !color) {
        return res.status(400).json({ message: 'Invalid input data' });
      }
      const cart = await CartService.addToCart(userId, productId, quantity, color);
      res.status(200).json(cart);
    } catch (error) {
      next(error)
    }
  }

  removeFromCart = async (req, res, next) => {
    try {
      const { userId, productId, color } = req.body;
      if (!userId || !productId || !color) {
        return res.status(400).json({ message: 'Invalid input data' });
      }
      const cart = await CartService.removeFromCart(userId, productId, color);
      res.status(200).json(cart);
    } catch (error) {
      next(error)
    }
  }

  updateCart = async (req, res, next) => {
    try {
      const { userId, productId, quantity, color } = req.body;
      if (!userId || !productId || typeof quantity !== 'number' || !color) {
        return res.status(400).json({ message: 'Invalid input data' });
      }
      const cart = await CartService.updateCart(userId, productId, quantity, color);
      res.status(200).json(cart);
    } catch (error) {
      next(error)
    }
  }

  getCartById = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const cart = await CartService.getCartById(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error)
    }
  }

}
module.exports = new CartController;