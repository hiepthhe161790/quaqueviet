import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { bannerImgOne } from "../../assets/images";
import Image from "../designLayouts/Image";

const CustomSlide = ({ Subtext, imgSrc, text, buttonLink, buttonText }) => (
  <div
    style={{
      position: "relative",
      backgroundColor: "#e6f4ea", // Softer gray background
      display: "flex",
      flexDirection: "row-reverse", // Image on left, text on right
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      minHeight: "400px",
    }}
  >
    <div style={{ maxWidth: "400px", marginLeft: "60px" }}>
      <h1
        style={{
          marginBottom: "20px",
          fontSize: "2.8rem",
          color: "#166534", // Darker shade for contrast
          fontWeight: "800",
          lineHeight: "1.2",
        }}
      >
        {text}
      </h1>
      <p
        style={{
          marginBottom: "30px",
          fontSize: "1.2rem",
          color: "#388e3c", // Softer gray for subtext
          lineHeight: "1.6",
        }}
      >
        {Subtext}
      </p>
      <Link to={buttonLink}>
        <button
          style={{
            backgroundColor: "#2D3748",
            color: "white",
            fontSize: "1rem",
            fontWeight: "600",
            padding: "12px 30px",
            borderRadius: "8px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4A5568")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2D3748")}
        >
          {buttonText}
        </button>
      </Link>
    </div>
       <div style={{ maxWidth: "50%" }}>
      <Image
        imgSrc={imgSrc}
        style={{
          borderRadius: "10px",
          width: "200px",
          height: "200px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  </div>
);

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (prev, next) => setDotActive(next),
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "20px", textAlign: "center" }}>
        <ul style={{ margin: "0", padding: "0", display: "inline-flex" }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          margin: "0 8px",
          borderRadius: "50%",
          backgroundColor: i === dotActive ? "#2D3748" : "#A0AEC0",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 576,
        settings: {
          dots: true,
          appendDots: (dots) => (
            <div style={{ position: "absolute", bottom: "15px", textAlign: "center" }}>
              <ul style={{ margin: "0", padding: "0", display: "inline-flex" }}>
                {dots}
              </ul>
            </div>
          ),
          customPaging: (i) => (
            <div
              style={{
                width: "10px",
                height: "10px",
                margin: "0 6px",
                borderRadius: "50%",
                backgroundColor: i === dotActive ? "#2D3748" : "#A0AEC0",
                cursor: "pointer",
              }}
            />
          ),
        },
      },
    ],
  };

  const slides = [
  {
    imgSrc: bannerImgOne,
    text: "Món ngon được giao tận nơi",
    Subtext: "Thưởng thức món ngon từ các vùng miền tại nhà. Nhanh chóng và thơm ngon!",
    buttonLink: "/menu",
    buttonText: "Mua ngay",
  },
  {
    imgSrc: bannerImgOne,
    text: "Các sản phẩm luôn được đảm bảo chất lượng",
    Subtext: "Chúng tôi luôn cam kết về chất lượng sản phẩm.",
    buttonLink: "/about",
    buttonText: "Xem thêm",
  },
  {
    imgSrc: bannerImgOne,
    text: "Ưu đãi đặc biệt hàng tuần",
    Subtext: "Xem thêm các ưu đãi tại đây",
    buttonLink: "/offers",
    buttonText: "Xem thêm",
  },
];
  return (
    <div style={{ width: "100%", backgroundColor: "#e6f4ea" }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <CustomSlide key={index} {...slide} />
        ))}
      </Slider>
    </div>
  );
};

export default Banner;