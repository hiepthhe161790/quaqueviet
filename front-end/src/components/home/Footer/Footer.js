import React from "react";
import { FaFacebook, FaYoutube, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import { paymentCard } from "../../../assets/images";
import Image from "../../designLayouts/Image";

const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-b from-green-100 via-lime-50 to-white py-20">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 px-4 gap-10">
        <div className="col-span-2">
          <FooterListTitle title="Về Quà Quê Việt" />
          <div className="flex flex-col gap-6">
            <p className="text-base w-full xl:w-[80%] text-green-900">
              Quà Quê Việt là một website bán ẩm thực vùng miền quanh Việt Nam! 
            </p>
            <ul className="flex items-center gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <li className="w-8 h-8 bg-green-500 text-white hover:bg-green-700 cursor-pointer text-xl rounded-full flex justify-center items-center duration-300 shadow">
                  <FaFacebook />
                </li>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <li className="w-8 h-8 bg-pink-400 text-white hover:bg-pink-600 cursor-pointer text-xl rounded-full flex justify-center items-center duration-300 shadow">
                  <FaInstagram />
                </li>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <li className="w-8 h-8 bg-red-500 text-white hover:bg-red-700 cursor-pointer text-xl rounded-full flex justify-center items-center duration-300 shadow">
                  <FaYoutube />
                </li>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <li className="w-8 h-8 bg-gray-800 text-white hover:bg-black cursor-pointer text-xl rounded-full flex justify-center items-center duration-300 shadow">
                  <FaGithub />
                </li>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <li className="w-8 h-8 bg-blue-600 text-white hover:bg-blue-800 cursor-pointer text-xl rounded-full flex justify-center items-center duration-300 shadow">
                  <FaLinkedin />
                </li>
              </a>
            </ul>
          </div>
        </div>
        <div>
          <FooterListTitle title="Menu" />
          <ul className="flex flex-col gap-2">
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Đặc sản đất bắc
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Hương vị phương nam
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Cu đơ hà tĩnh
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Quà tặng quê hương
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Bánh pía sầu riêng
            </li>
          </ul>
        </div>
        <div>
          <FooterListTitle title="Dịch vụ CSKH" />
          <ul className="flex flex-col gap-2">
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Tài khoản của tôi
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Theo dõi đơn hàng
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Hỗ trợ
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Câu hỏi thường gặp
            </li>
            <li className="font-titleFont text-base text-green-700 hover:text-green-900 hover:underline cursor-pointer duration-300">
              Phương thức thanh toán
            </li>
          </ul>
        </div>
        <div className="col-span-2 flex flex-col items-center w-full px-4">
          <FooterListTitle title="Trụ sở chính" />
          <div className="w-full flex flex-col items-center">
            <p className="text-center mb-4 text-green-800">
              Bạn có thể đến thăm hoặc đặt hàng trực tiếp
            </p>
            {/* 21.01256641914894, 105.52530004039076 */}
            <div className="w-full rounded-lg overflow-hidden shadow" style={{ minHeight: 250 }}>
              <iframe
                title="OpenStreetMap"
                width="100%"
                height="250"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=105.5203,21.0075,105.5303,21.0175&amp;layer=mapnik&amp;marker=21.01256641914894,105.52530004039076"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=21.01256641914894&amp;mlon=105.52530004039076#map=15/21.01257/105.52530"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-green-700 underline"
            >
              Phóng to bản đồ
            </a>
            <Image
              className="w-[80%] lg:w-[60%] mx-auto mt-6"
              imgSrc={paymentCard}
            />
          </div>
        </div>
      </div>
      <div className="text-center text-green-900 mt-10 text-sm">
        &copy; {new Date().getFullYear()} Quà Quê Việt. Mọi quyền được bảo lưu.
      </div>
    </div>
  );
};

export default Footer;