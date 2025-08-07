import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetWishlist } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemWishlist from "./ItemWishlist";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlish = useSelector((state) => state.orebiReducer.wishlish);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Danh sách yêu thích" />
      {wishlish.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-3">Sản phẩm</h2>
            <h2>Price</h2>
            {/* <h2>Sub Total</h2> */}
          </div>
          <div className="mt-5">
            {wishlish.map((item) => (
              <div key={item._id}>
                <ItemWishlist item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetWishlist())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Đặt lại danh sách yêu thích
          </button>
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
              Danh sách yêu thích của bạn khiến bạn cảm thấy cô đơn.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Giỏ hàng của bạn sống để phục vụ. Hãy cho nó một mục đích - lấp đầy nó bằng sách, đồ điện tử, video, v.v. và làm cho nó trở nên vui vẻ.
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

export default Wishlist;
