import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import CouponService from "../../services/api/CouponService";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    let price = 0;
    products.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalAmt(price);
  }, [products]);

  useEffect(() => {
    if (totalAmt === 0) setShippingCharge(0);
    else if (totalAmt > 400) setShippingCharge(0);
    else if (totalAmt > 200) setShippingCharge(0);
    else setShippingCharge(30);
  }, [totalAmt]);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setDiscount(0);
      setCouponMsg("Vui lòng nhập mã giảm giá.");
      setCouponInfo(null);
      return;
    }
    try {
      const res = await CouponService.validateCoupon({ code: coupon.trim(), total: totalAmt });
      if (res.success && res.coupon) {
        let discountValue = 0;
        if (res.coupon.type === "percent") {
          discountValue = Math.floor((totalAmt * res.coupon.value) / 100);
          if (res.coupon.maxDiscount && discountValue > res.coupon.maxDiscount) {
            discountValue = res.coupon.maxDiscount;
          }
        } else {
          discountValue = res.coupon.value;
        }
        setDiscount(discountValue);
        setCouponMsg(`Áp dụng thành công! Giảm ${discountValue} VND.`);
        setCouponInfo(res.coupon);
      } else {
        setDiscount(0);
        setCouponMsg(res.message || "Mã giảm giá không hợp lệ hoặc không đủ điều kiện.");
        setCouponInfo(null);
      }
    } catch (err) {
      setDiscount(0);
      const msg = err?.response?.data?.message || err.message || "Có lỗi khi kiểm tra mã giảm giá.";
      setCouponMsg(msg);
      setCouponInfo(null);
    }
  };
  useEffect(() => {
    setDiscount(0);
    setCouponMsg("");
    setCouponInfo(null);
  }, [products]);

  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);

  // Hàm chuyển sang checkout kèm mã giảm giá trên url
  const goToCheckout = () => {
    if (discount > 0 && coupon) {
      navigate(`/checkout?coupon=${encodeURIComponent(coupon)}`);
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              Bạn có {totalItems} mặt hàng{totalItems !== 1} trong giỏ hàng
            </h2>
            <button
              onClick={() => dispatch(resetCart())}
              className="py-2 px-6 bg-red-500 text-white font-semibold rounded hover:bg-red-700 duration-300"
            >
              Xóa giỏ hàng
            </button>
          </div>
          <div className="hidden lgl:grid grid-cols-5 bg-gray-100 text-primeColor px-6 py-4 font-semibold rounded">
            <h2 className="col-span-2">Sản phẩm</h2>
            <h2>Giá</h2>
            <h2>Số lượng</h2>
            <h2>Giá tiền</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0 mt-8">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-primeColor text-white px-4 py-1 rounded hover:bg-black duration-300"
              >
                Đồng ý
              </button>
              {couponMsg && (
                <span className={`ml-2 text-sm ${discount > 0 ? "text-green-600" : "text-red-500"}`}>
                  {couponMsg}
                </span>
              )}
            </div>
            <p className="text-lg font-semibold">Cập nhật giỏ hàng của bạn nếu cần</p>
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Thanh toán đơn hàng</h1>
              <div>
                <p className="flex items-center justify-between border-b py-1.5 text-lg px-4 font-medium">
                  Giá tiền
                  <span className="font-semibold tracking-wide font-titleFont">
                    {totalAmt.toLocaleString()} VND
                  </span>
                </p>
                <p className="flex items-center justify-between border-b py-1.5 text-lg px-4 font-medium">
                  Vận chuyển
                  <span className="font-semibold tracking-wide font-titleFont">
                    {shippingCharge === 0 ? "Free" : `{shippingCharge} VND`}
                  </span>
                </p>
                {discount > 0 && (
                  <p className="flex items-center justify-between border-b py-1.5 text-lg px-4 font-medium text-green-600">
                    Khuyến mãi
                    <span>- {discount} VND</span>
                  </p>
                )}
                <p className="flex items-center justify-between py-1.5 text-lg px-4 font-bold">
                  Tổng tiền
                  <span className="tracking-wide text-lg font-titleFont">
                    {(totalAmt + shippingCharge - discount).toLocaleString()} VND
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300 rounded"
                  onClick={goToCheckout}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Giỏ hàng của bạn đang trống!
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Có vẻ như bạn chưa thêm gì cả. Hãy bắt đầu mua sắm và lấp đầy giỏ hàng của bạn với những sản phẩm tuyệt vời!
            </p>
            <Link to="/menu">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;