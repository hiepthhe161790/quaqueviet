import React from "react";
import { Link } from "react-router-dom";
import {
  saleImgOne,
  saleImgTwo,
  saleImgThree,
} from "../../../assets/images/index";
import Image from "../../designLayouts/Image";
import ShopNow from "../../designLayouts/buttons/ShopNow";

const Sale = () => {
  return (
    <div className="py-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 bg-gray-50">
      <div className="w-full lg:w-1/2 flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full aspect-w-4 aspect-h-3">
          <Image
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            imgSrc={saleImgOne}
          />
        </div>
        <div className="p-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Khuyến Mãi Lớn !
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 mb-6">
            Giảm <span className="text-3xl lg:text-4xl font-bold text-red-600">30%</span> cho đơn hàng đầu tiên
          </p>
          <ShopNow
            className="bg-gray-800 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-900 transition-colors"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="w-full aspect-w-4 aspect-h-3">
          <Link to="/menu">
            <Image
              className="h-full w-full object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              imgSrc={saleImgTwo}
            />
          </Link>
        </div>
        <div className="w-full aspect-w-4 aspect-h-3">
          <Link to="/menu">
            <Image
              className="h-full w-full object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              imgSrc={saleImgThree}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;