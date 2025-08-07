import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import { useDispatch, useSelector } from "react-redux";
import { toggleBrand } from "../../../../redux/orebiSlice";
import BrandService from "../../../../services/api/BrandService";

const Brand = () => {
  const [showBrands, setShowBrands] = useState(true);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      const allBrands = await BrandService.getAllBrands();
      setBrands(allBrands);
    };

    fetchBrands();
  }, []);

  const checkedBrands = useSelector(
    (state) => state.orebiReducer.checkedBrands
  );
  const dispatch = useDispatch();

  // const brands = [
  //   {
  //     _id: 900,
  //     title: "Pantum",
  //   },
  //   {
  //     _id: 901,
  //     title: "Hp",
  //   },
  //   {
  //     _id: 902,
  //     title: "Epson",
  //   },

  //   {
  //     _id: 903,
  //     title: "Ricoh",
  //   },
  // ];

  const handleToggleBrand = (brand) => {
    dispatch(toggleBrand(brand));
  };

  // ...existing code...
return (
  <div className="w-full bg-white rounded-lg shadow p-4">
    <div
      onClick={() => setShowBrands(!showBrands)}
      className="flex items-center justify-between cursor-pointer select-none"
    >
      <NavTitle title="Xếp theo Nhãn hàng" icons={true} />
      <span
        className={`transition-transform duration-300 ${
          showBrands ? "rotate-90" : ""
        }`}
      >
        {/* Bạn có thể thêm icon ở đây nếu muốn */}
      </span>
    </div>
    {showBrands && (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ul className="flex flex-col gap-2 mt-4">
          {brands.map((item) => (
            <li
              key={item._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-primeColor transition-colors duration-200 ${
                checkedBrands.some((b) => b._id === item._id)
                  ? "bg-primeColor/10 text-primeColor font-semibold"
                  : "text-[#767676]"
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <input
                  type="checkbox"
                  id={item._id}
                  checked={checkedBrands.some((b) => b._id === item._id)}
                  onChange={() => handleToggleBrand(item)}
                  className="accent-primeColor w-4 h-4 rounded-full border-2 border-primeColor focus:ring-0"
                />
                <span className="truncate">{item.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </motion.div>
    )}
  </div>
);
// ...existing code...
};

export default Brand;
