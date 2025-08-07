// import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
// import Color from "./shopBy/Color";
import Price from "./shopBy/Price";
import { useDispatch } from "react-redux";
import { resetFilters } from "../../../redux/orebiSlice";

const ShopSideNav = () => {
  const dispatch = useDispatch();

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Category icons={false} />
      <Brand />
      {/* <Color /> */}
      <Price />

      <button
        onClick={handleResetFilters}
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
        Xóa sạch bộ lọc
      </button>
    </div>
  );
};

export default ShopSideNav;
