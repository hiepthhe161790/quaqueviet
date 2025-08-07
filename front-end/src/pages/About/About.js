import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Về chúng tôi" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">Quà Quê Việt</span>{" "}
          là một website bán ẩm thực vùng miền quanh Việt Nam!
        </h1><br></br>
        <Link to="/">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Tiếp Tục Mua Hàng
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
