import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductService from "../../services/api/ProductService";
import Gallery from "../../components/Pictures/Gallery";
import { FaLeaf, FaListUl } from "react-icons/fa";
import Review from "../../components/Review/Review";
import { useDiscount } from "../../context/DiscountContext"; // Thêm dòng này
import "./image.css";

const tabs = [
  {
    id: "Nutrition Facts",
    key: "Thông tin dinh dưỡng",
    icon: <FaLeaf className="inline-block mr-2" />,
  },
  {
    id: "Ingredients",
    key: "Thành phần",
    icon: <FaListUl className="inline-block mr-2" />,
  },
];

const ProductDetails = () => {
  const location = useLocation();
  const { _id } = useParams();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [loading, setLoading] = useState(true);

  const { discountSuggestions } = useDiscount(); // Lấy danh sách gợi ý giảm giá

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const product = await ProductService.getProductById(_id);
      setProductInfo(product);
      setLoading(false);
    };

    if (location.state && location.state.item) {
      setProductInfo(location.state.item);
      setLoading(false);
    } else {
      fetchProduct();
    }
    setPrevLocation(location.pathname);
  }, [location, _id]);

  // Tìm discount suggestion cho sản phẩm này (nếu có)
  let discountData = null;
  if (discountSuggestions && productInfo) {
    discountData = discountSuggestions.find(p => p._id === productInfo._id);
  }

  // Nếu có discount, tính originalInStock và discountPercent
  let originalInStock, discountPercent;
  if (discountData && discountData.suggestedDiscountPercent) {
    discountPercent = discountData.suggestedDiscountPercent;
    originalInStock = productInfo.inStock?.map(stock => ({
      ...stock,
      price: Math.round(stock.price / (1 - discountPercent / 100))
    }));
  }

  if (loading || !productInfo) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 h-full -mt-5 xl:-mt-8 pb-10">
          <div className="h-full xl:col-span-2 bg-white rounded-lg shadow p-4 flex items-center justify-center">
            <section className="core w-full">
              <Gallery images={productInfo.images} />
            </section>
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-4 xl:px-6 flex flex-col gap-6 justify-center bg-white rounded-lg shadow p-6">
            <ProductInfo
              productInfo={{
                ...productInfo,
                suggestedDiscountPercent: discountPercent,
              }}
              originalInStock={originalInStock}
              discountPercent={discountPercent}
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="flex space-x-4 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center py-2 px-5 rounded-full font-semibold shadow transition-all duration-200
                  ${activeTab === tab.id
                    ? "bg-green-500 text-white scale-105"
                    : "bg-gray-200 text-gray-800 hover:bg-green-100"
                  }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.icon}
                {tab.key}
              </button>
            ))}
          </div>
          <div className="my-6">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "" : "hidden"}
              >
                {tab.id === "Nutrition Facts" && productInfo.specs ? (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border rounded-lg shadow">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="px-4 py-2 text-left">Nutrient</th>
                          <th className="px-4 py-2 text-left">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productInfo.specs.map((row) => (
                          <tr key={row.key} className="even:bg-green-50">
                            <td className="border px-4 py-2 font-semibold">{row.key}</td>
                            <td className="border px-4 py-2">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  tab.id === "Ingredients" ? (
                    <div className="bg-green-50 rounded-lg p-4 shadow">
                      <p className="text-gray-700">{productInfo.description}</p>
                    </div>
                  ) : (
                    tab.content
                  )
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Review />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;