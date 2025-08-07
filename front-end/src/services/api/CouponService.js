import { api } from '../index';

class CouponService {
  async getAllCoupons() {
    const res = await api.get('/coupon');
    return res.data;
  }
  async createCoupon(data) {
    const res = await api.post('/coupon', data);
    return res.data;
  }
  async updateCoupon(id, data) {
    const res = await api.put(`/coupon/${id}`, data);
    return res.data;
  }
  async deleteCoupon(id) {
    const res = await api.delete(`/coupon/${id}`);
    return res.data;
  }
  async validateCoupon({ code, total }) {
    const res = await api.post('/coupon/validate', { code, total });
    return res.data;
  }
}

export default new CouponService();