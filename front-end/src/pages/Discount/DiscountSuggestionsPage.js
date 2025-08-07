import React from "react";
import { useDiscount } from "../../context/DiscountContext";
import Product from "../../components/home/Products/Product";

const DiscountSuggestionsPage = () => {
  const { discountSuggestions, loading, error } = useDiscount();

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Gợi ý giảm giá từ hệ thống</h1>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">Lỗi: {error.message || "Không thể tải dữ liệu"}</p>}
      {!loading && discountSuggestions.length === 0 && (
        <p className="text-gray-500">Không có sản phẩm nào cần gợi ý giảm giá.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {discountSuggestions.map((item) => {
          // Tính giá sau giảm cho từng biến thể
          const discountPercent = item.suggestedDiscountPercent || 0;
          const discountedInStock = item.inStock?.map(stock => ({
            ...stock,
            originalPrice: stock.price,
            price: Math.round(stock.price * (1 - discountPercent / 100)),
          })) || [];
          return (
            <div key={item._id} className="relative">
              {discountPercent > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  -{discountPercent}%
                </span>
              )}
              <Product
                _id={item._id}
                images={item.images}
                name={item.name}
                price={discountedInStock[0]?.price || item.price}
                color={discountedInStock[0]?.variant}
                isDeleted={item.isDeleted}
                description={item.description}
                pdf={item.pdf}
                specs={item.specs}
                inStock={discountedInStock}
                category={item.category?.name}
                brand={item.brand?.name}
                cost={item.cost}
                originalInStock={item.inStock}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountSuggestionsPage;