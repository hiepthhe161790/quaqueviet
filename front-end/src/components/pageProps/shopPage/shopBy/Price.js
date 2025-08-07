import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavTitle from "./NavTitle";
import { togglePrice } from "../../../../redux/orebiSlice";

const priceList = [
  { _id: 950, priceOne: 0, priceTwo: 9500 },
  { _id: 10000, priceOne: 9500, priceTwo: 10000 },
  { _id: 20000, priceOne: 10000, priceTwo: 20000 },
  { _id: 30000, priceOne: 20000, priceTwo: 30000 },
  { _id: 50000, priceOne: 30000, priceTwo: 50000 },
  { _id: 100000, priceOne: 50000, priceTwo: 100000 },
  { _id: 200000, priceOne: 100000, priceTwo: 200000 },
];

const Price = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);

  // Select the price filter state from Redux (it's now an array)
  const checkedPrices = useSelector((state) => state.orebiReducer.checkedPrices);

  // This effect syncs the local UI state with the Redux store
  useEffect(() => {
    // **THE FIX**: Check array length instead of truthiness
    if (checkedPrices.length > 0) {
      // If a price is selected, get its ID from the first item in the array
      setSelectedId(checkedPrices[0]._id);
    } else {
      // If the array is empty (filter is reset), clear the local selection
      setSelectedId(null);
    }
  }, [checkedPrices]);

  const handleSelectPrice = (item) => {
    if (selectedId === item._id) {
      setSelectedId(null);
      dispatch({ type: 'orebi/resetCheckedPrices' });
    } else {
      setSelectedId(item._id);
      dispatch({ type: 'orebi/resetCheckedPrices' });
      dispatch(togglePrice(item));
    }
  };

  return (
    <div className="cursor-pointer">
      <NavTitle title="Xếp theo giá" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-base text-[#444]">
          {priceList.map((item) => (
            <li
              key={item._id}
              className={`border rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer
                ${selectedId === item._id
                  ? "bg-green-100 border-green-500 text-green-700 font-bold shadow"
                  : "border-gray-200 hover:bg-green-50 hover:border-green-400"}
              `}
              onClick={() => handleSelectPrice(item)}
            >
              <input
                type="radio"
                name="price"
                id={item._id}
                checked={selectedId === item._id}
                onChange={() => handleSelectPrice(item)}
                className="accent-green-600 w-5 h-5"
              />
              <label htmlFor={item._id} className="text-lg select-none w-full cursor-pointer">
                {item.priceOne.toLocaleString()} VND - {item.priceTwo.toLocaleString()} VND
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;