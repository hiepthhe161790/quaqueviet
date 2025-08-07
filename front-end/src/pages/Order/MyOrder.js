import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import OrderCard from "./OrderCard";

const MyOrder = () => {
  const orders = useSelector((state) => state.orderReducer.orders);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="My Orders" />
      {orders.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Sản phẩm</h2>
            <h2>Giá</h2>
            <h2>Trạng thái</h2>
            <h2>Hành động</h2>
          </div>
          <div className="mt-5">
            {orders.map((order) => (
              <div key={order.orderId}>
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Chưa có đơn hàng nào
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Bạn chưa đặt hàng. Hãy bắt đầu đặt hàng để đặt hàng.
            </p>
            <Link to="/menu">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Tiếp tục đặt hàng
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyOrder;
