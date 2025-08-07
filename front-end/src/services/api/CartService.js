import { api } from '../index';

class CartService {
  async getAllProducts(userId) {
    try {
      const { data } = await api.get(`/cart/${userId}`);
      if (data) return data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }

  async updateCartItem(userId, productId, quantity, variant) {
    try {
      const { data } = await api.put('/cart/update', {
        userId,
        productId,
        quantity,
        variant
      });
      return data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }

  async addToCartItem(userId, productId, quantity, variant) {
    try {
      const { data } = await api.post('/cart/add-to-cart', {
        userId,
        productId,
        quantity,
        variant
      });
      return data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }

  async deleteCartItem(userId, productId, variant) {
    try {
      const { data } = await api.delete('/cart/remove', {
        data: {
          userId,
          productId,
          variant
        }
      });
      return data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }
}

export default new CartService();
