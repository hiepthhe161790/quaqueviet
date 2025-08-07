const { WishlistService } = require('../services/index');

class wishlistController {
  addToWishlist = async (req, res, next) => {
    try {
      const { userId, productId, color } = req.body; // Destructure dữ liệu từ req.body
      if (!userId || !productId || !color) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
      }
      const wishlist = await WishlistService.addToWishlist(userId, productId, color);
      res.status(200).json(wishlist);
    } catch (error) {
      next(error)
    }
  }

  removeFromwishlist = async (req, res, next) => {
    try {
      const { userId, productId, color } = req.body;
      if (!userId || !productId || !color) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ  ' });
      }
      const wishlist = await WishlistService.removeFromwishlist(userId, productId, color);
      res.status(200).json(wishlist);
    } catch (error) {
      next(error)
    }
  }

  getWishlist = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const cart = await WishlistService.getWishlist(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error)
    }
  }

}

module.exports = new wishlistController;