import React, { useState, useEffect } from "react";
// import { FaPlus } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "../../../../redux/orebiSlice";
import CategoryService from "../../../../services/api/CategoryService";
import { motion } from "framer-motion";
const Category = () => {
  const [showSubCatOne, setShowSubCatOne] = useState(true);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const allCategory = await CategoryService.getAllCategories();
      setCategory(allCategory);
    };

    fetchCategory();
  }, []);
  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const dispatch = useDispatch();

  const handleToggleCategory = (category) => {
    dispatch(toggleCategory(category));
  };

  return (
  <div className="w-full bg-white rounded-lg shadow p-4">
    <div
      onClick={() => setShowSubCatOne(!showSubCatOne)}
      className="flex items-center justify-between cursor-pointer select-none"
    >
      <NavTitle title="Xếp theo Loại" icons={true} />
      <span
        className={`transition-transform duration-300 ${
          showSubCatOne ? "rotate-90" : ""
        }`}
      >
        <ImPlus />
      </span>
    </div>

    {showSubCatOne && (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ul className="flex flex-col gap-2 mt-4">
          {category.map((item) => (
            <li
              key={item._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-primeColor transition-colors duration-200 ${
                checkedCategorys.some((b) => b._id === item._id)
                  ? "bg-primeColor/10 text-primeColor font-semibold"
                  : "text-[#767676]"
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <input
                  type="checkbox"
                  id={item._id}
                  checked={checkedCategorys.some((b) => b._id === item._id)}
                  onChange={() => handleToggleCategory(item)}
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
};

export default Category;
