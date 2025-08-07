import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
// import {
//   newArrOne,
//   newArrTwo,
//   newArrThree,
//   newArrFour,
// } from "../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import ProductService from "../../../services/api/ProductService";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const result = await ProductService.getNewArrivals();
      setNewArrivals(result);
    };

    fetchNewArrivals();
  }, []);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(newArrivals.length, 4), // Show up to 4 items, or fewer if not enough products
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  if (!newArrivals || newArrivals.length === 0) {
    return (
      <div className="w-full pb-16">
        <Heading heading="Sản Phẩm Mới !" />
        <p className="text-center text-gray-500">Hiện tại không có sản phẩm mới nào cả</p>
      </div>
    );
  }
  return (
    <div className="w-full pb-16">
      <Heading heading="Sản Phẩm Mới !" />
      <Slider {...settings}>
        {newArrivals?.map(product => (
          <div key={product._id} className="px-2">
            <Product
              _id={product._id}
              images={product.images}
              name={product.name}
              price={product.price}
              // color={product.color}
              isDeleted={product.isDeleted}
              description={product.description}
              specs={product.specs}
              inStock={product.inStock}
              category={product.category.name}
              brand={product.brand.name}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;
