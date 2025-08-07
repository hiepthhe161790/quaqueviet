const Wishlist = require('../models/wishlist.model');

class WishlistService {
  addToWishlist = async (userId, productId, color) => {
    try {
      // Tìm wishlist của người dùng
      let wishlist = await Wishlist.findOne({ userId });

      if (wishlist) {
        // Kiểm tra xem sản phẩm đã tồn tại trong wishlist chưa
        const itemIndex = wishlist.items.findIndex(p => p.productId.toString() === productId && p.color === color);

        if (itemIndex > -1) {
          // Nếu sản phẩm đã tồn tại trong wishlist với cùng màu, không làm gì cả
        } else {
          // Nếu sản phẩm chưa tồn tại trong wishlist hoặc khác màu, thêm sản phẩm mới
          wishlist.items.push({ productId, color });
        }

        wishlist = await wishlist.save();
        return wishlist;
      } else {
        // Nếu wishlist chưa tồn tại, tạo wishlist mới
        const newWishlist = new Wishlist({
          userId,
          items: [{ productId, color }]
        });

        const savedWishlist = await newWishlist.save();
        return savedWishlist;
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào wishlist:', error);
      throw error;
    }
  };


  removeFromwishlist = async (userId, productId, color) => {
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => !(item.productId == productId && item.color == color));

      wishlist = await wishlist.save();
      return wishlist;
    } else {
      throw new Error('không tìm thấy danh sách yêu thích');
    }
  };

  getWishlist = async (userId) => {
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
    if (!wishlist) {
      throw new Error('Không tìm thấy giỏ hàng');
    }
    return wishlist;
  };
}

module.exports = new WishlistService;