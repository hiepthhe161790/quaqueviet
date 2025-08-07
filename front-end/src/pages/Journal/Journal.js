import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Khuyến mãi" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          Trang đang được xây dựng !
        </h1><br></br>
        <Link to="/">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Quay Lại Mua Hàng
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Journal;
