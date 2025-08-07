import React, { useState } from 'react';
import { FaRegHeart, FaHeart, FaCartPlus, FaInfoCircle } from "react-icons/fa";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToWishlist } from "../../../redux/orebiSlice";
import { toast } from "react-toastify";
import ProductService from '../../../services/api/ProductService';
import ImgDefault from '../../../assets/images/default.jpg';

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.orebiReducer.userInfo);
  const [isWished, setIsWished] = useState(false);

  const _id = props._id;
  const rootId = String(_id).toLowerCase().replace(/\s/g, "");
  const productItem = props;

  const defaultColor = props.inStock?.[0]?.variant  || "";
  const defaultPrice = props.inStock?.[0]?.price || props.price;
  const isOutOfStock = props.inStock?.reduce((sum, item) => sum + (item.quantity || 0), 0) === 0;
  // Lấy giá gốc nếu có truyền vào (dùng cho trang gợi ý giảm giá)
  const originalInStock = props.originalInStock || [];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!userInfo || !userInfo._id) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      // navigate('/signin');
      return;
    }
    dispatch(
      addToCart({
        _id: props._id,
        name: props.name,
        quantity: 1,
        images: props.images,
        isDeleted: props.isDeleted,
        price: defaultPrice,
        variant: defaultColor,
        cost: props.cost,
        inStock: props.inStock,
      })
    );
  };

  const handleWishList = () => {
    if (!userInfo || !userInfo._id) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào wishlist!");
      // navigate('/signin');
      return;
    }
    setIsWished((prev) => !prev); // Toggle UI icon
    dispatch(
      addToWishlist({
        _id: props._id,
        name: props.name,
        quantity: 1,
        images: props.images,
        isDeleted: props.isDeleted,
        price: defaultPrice,
        color: defaultColor,
        cost: props.cost,
      })
    );
  };

  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: { item: productItem },
    });
  };

  return (
    <div className="w-full relative group border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="cursor-pointer" onClick={handleProductDetails}>
          <Image
            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
            imgSrc={
              props.images && props.images.length > 0
                ? ProductService.getImage(props.images[0].filename)
                : ImgDefault
            }
            alt={props.name || "Ảnh sản phẩm"}
          />
        </div>
        <div className="absolute top-3 left-3">
          {!props.isDeleted && (
            <Badge
              text={isOutOfStock ? "Hết hàng" : "Mới"}
              color={isOutOfStock ? "bg-red-500" : undefined}
            />
          )}
        </div>
        <button
          onClick={handleWishList}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-pink-100 transition"
          title="Thêm vào danh sách ước"
        >
          {isWished ? (
            <FaHeart className="text-pink-500 text-lg" />
          ) : (
            <FaRegHeart className="text-pink-500 text-lg" />
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primeColor truncate">{props.name}</h2>
          <span className="text-gray-500 text-sm">{props.brand?.name || props.brand}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">{props.category?.name || props.category}</span>
          <span className="text-[#d0121a] font-semibold text-lg">
            {defaultPrice.toLocaleString()} VND
            {/* Nếu có giá gốc và giá đã giảm, hiển thị giá gốc gạch ngang */}
            {originalInStock.length > 0 && props.inStock?.[0]?.price !== originalInStock[0]?.price && (
              <span className="text-gray-400 text-base line-through ml-2">{originalInStock[0]?.price} VND</span>
            )}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {props.inStock?.map((item, idx) => {
            const original = originalInStock[idx];
            return (
              <span key={item._id} className="bg-gray-100 px-2 py-1 rounded text-xs flex flex-col items-start">
                <span>
                  {item.variant}: {item.quantity}
                </span>
                <span>
                  <span className="text-[#d0121a] font-semibold">{item.price.toLocaleString()} VND</span>
                  {original && item.price !== original.price && (
                    <span className="text-gray-400 line-through ml-1">{original.price.toLocaleString()} VND</span>
                  )}
                </span>
              </span>
            );
          })}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primeColor text-white hover:bg-black"} transition`}
          >
            <FaCartPlus /> {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
          <button
            onClick={handleProductDetails}
            className="flex items-center gap-1 px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            <FaInfoCircle /> Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
