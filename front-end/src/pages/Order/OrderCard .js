import React from "react";
import { Link } from "react-router-dom";

const OrderCard = ({ order }) => {
  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="col-span-5 mdl:col-span-2 flex items-center gap-4 ml-4">
        <img className="w-32 h-32" src={order.image} alt="orderImage" />
        <div>
          <h1 className="font-titleFont font-semibold">{order.name}</h1>
          <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
          <p className="text-sm text-gray-500">Date: {order.date}</p>
        </div>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${order.price}
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <p>{order.status}</p>
        </div>
        <div className="w-1/3 flex items-center">
          <Link to={`/order/${order.orderId}`} className="text-primeColor hover:underline">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
