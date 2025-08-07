import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink,useNavigate, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logo, logoLight } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { BsSuitHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";
import CategoryService from "../../../services/api/CategoryService";
import ProductService from "../../../services/api/ProductService";
import AuthenService from "../../../services/api/AuthenService";
import { resetUserInfo, setUserInfo, setProducts, calculateCartTotalCount, calculateWishlistTotalCount } from "../../../redux/orebiSlice";
const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const location = useLocation();
  useEffect(() => {
    let ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
  }, []);
  const products = useSelector((state) => state.orebiReducer.products);
  const wishlish = useSelector((state) => state.orebiReducer.wishlish);
  const cartTotalCount = useSelector((state) => state.orebiReducer.cartTotalCount);
  const wistlistTotalCount = useSelector((state) => state.orebiReducer.wistlistTotalCount);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userName, setUserName] = useState(null);
  const dispatch = useDispatch();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await CategoryService.getAllCategories();
      setCategories(allCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await ProductService.getAllProducts();
      dispatch(setProducts(products));
      setAllProducts(products);
    };
    fetchProducts();
    dispatch(calculateCartTotalCount());
    dispatch(calculateWishlistTotalCount());
  }, [dispatch, products, wishlish]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = allProducts
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((item) => ({
        _id: item._id,
        images: item.images, 
        name: item.name,
        price: item.price,
        description: item.description,
        specs:item.specs,
            inStock:item.inStock,
        category:item.category.name,
            brand:item.brand.name
            
      }));
    setFilteredProducts(filtered);
  }, [searchQuery, allProducts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleLogout = async () => {
    await AuthenService.logout();
    dispatch(resetUserInfo());
    navigate('/signin');
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AuthenService.getProfile();
      setUserName(user.user.fullName);
      dispatch(setUserInfo(user.user));
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn,dispatch]);
// ...existing code...
// ...existing code...
return (
  <div className="w-full h-20 bg-green-700 sticky top-0 z-50 border-b border-b-green-800">
    <nav className="h-full px-4 max-w-container mx-auto relative">
      <div className="flex items-center justify-between h-full w-full gap-4">
        <Link to="/" className="flex-shrink-0">
          <Image className="w-32 object-cover" imgSrc={logo} />
        </Link>
        {showMenu && (
          <motion.ul
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            {navBarList.map(({ _id, title, link }) => (
              <NavLink
                key={_id}
                className="flex font-normal hover:font-bold w-30 h-6 justify-center items-center px-6 text-base text-white hover:underline underline-offset-[4px] decoration-[1px] hover:text-green-200 md:border-r-[2px] border-r-green-800 hoverEffect last:border-r-0"
                to={link}
                state={{ data: location.pathname.split('/')[1] }}
              >
                <li>{title}</li>
              </NavLink>
            ))}
          </motion.ul>
        )}
        <div className="relative flex items-center flex-1 max-w-[600px] h-[50px] text-base text-green-900 bg-white gap-2 px-6 rounded-xl mx-4">
          <input
            className="flex-1 h-full outline-none placeholder:text-green-900 placeholder:text-[14px] bg-white text-green-900"
            type="text"
            onChange={handleSearch}
            value={searchQuery}
            placeholder="Tìm kiếm sản phẩm ở đây"
          />
          <FaSearch className="w-5 h-5 text-green-700" />
          {searchQuery && (
            <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
              {filteredProducts.map((item) => (
                <div
                  onClick={() => {
                    navigate(`/product/${item._id}`, { state: { item } });
                    setSearchQuery('');
                  }}
                  key={item._id}
                  className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                >
                  <img className="w-24" src={item.images && item.images.length > 0 ? ProductService.getImage(item.images[0].filename) : ''} alt="productImg" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-lg text-green-900">{item.name}</p>
                    <p className="text-xs text-green-900">
                      {item.description.length > 100
                        ? `${item.description.slice(0, 100)}...`
                        : item.description}
                    </p>
                    <p className="text-sm text-green-900">
                      Price:{" "}
                      <span className="text-green-700 font-semibold">
                        ${item.price}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center pr-6 cursor-pointer relative flex-shrink-0">
          <div onClick={() => setShowUser(!showUser)} className="flex text-white">
            <FaUser />
            <FaCaretDown />
          </div>
          {showUser && (
            <motion.ul
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-6 left-0 z-50 bg-green-800 w-44 text-white h-auto p-4 pb-6"
            >
              {!isLoggedIn ? (
                <>
                  <Link to="/signin">
                    <li className="text-white px-4 py-1 border-b border-b-green-700 hover:border-b-white hover:text-green-200 duration-300 cursor-pointer">
                      Đăng nhập
                    </li>
                  </Link>
                  <Link onClick={() => setShowUser(false)} to="/signup">
                    <li className="text-white px-4 py-1 border-b border-b-green-700 hover:border-b-white hover:text-green-200 duration-300 cursor-pointer">
                      Đăng kí
                    </li>
                  </Link>
                </>
              ) : (
                <>
                  <li className="text-white px-4 py-1 cursor-default">
                    {userName}
                  </li>
                  <Link to={`/order-history`}>
                    <li className="text-white px-4 py-1 border-b border-b-green-700 hover:border-b-white hover:text-green-200 duration-300 cursor-pointer">
                      Lịch sử mua hàng
                    </li>
                  </Link>
                  <Link to={`/profile`}>
                    <li className="text-white px-4 py-1 border-b border-b-green-700 hover:border-b-white hover:text-green-200 duration-300 cursor-pointer">
                      Trang cá nhân
                    </li>
                  </Link>
                  <li
                    onClick={handleLogout}
                    className="text-white px-4 py-1 border-b border-b-green-700 hover:border-b-white hover:text-green-200 duration-300 cursor-pointer"
                  >
                    Đăng xuất
                  </li>
                </>
              )}
            </motion.ul>
          )}
          <div
            onClick={() => {
              if (!isLoggedIn) {
                toast.info("Đăng nhập để sử dụng tính năng này");
                // navigate('/signin');
                return;
              }
              navigate('/cart');
            }}
            className="relative text-white cursor-pointer"
          >
            <FaShoppingCart />
            <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-green-900 text-white">
              {cartTotalCount ? cartTotalCount : 0}
            </span>
          </div>
          <div
            onClick={() => {
              if (!isLoggedIn) {
                toast.info("Đăng nhập để sử dụng tính năng này");
                // navigate('/signin');
                return;
              }
              navigate('/wishlist');
            }}
            className="relative text-white cursor-pointer"
          >
            <BsSuitHeartFill />
            <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-green-900 text-white">
              {wistlistTotalCount ? wistlistTotalCount : 0}
            </span>
          </div>
        </div>
        <HiMenuAlt2
          onClick={() => setSidenav(!sidenav)}
          className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4 text-white"
        />
        {sidenav && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[80%] h-full relative"
            >
              <div className="w-full h-full bg-green-800 p-6">
                <img
                  className="w-28 mb-6"
                  src={logoLight}
                  alt="logoLight"
                />
                <ul className="text-white flex flex-col gap-2">
                  {navBarList.map((item) => (
                    <li
                      className="font-normal hover:font-bold items-center text-lg text-white hover:underline underline-offset-[4px] decoration-[1px] hover:text-green-200 md:border-r-[2px] border-r-green-700 hoverEffect last:border-r-0"
                      key={item._id}
                    >
                      <NavLink
                        to={item.link}
                        state={{ data: location.pathname.split('/')[1] }}
                        onClick={() => setSidenav(false)}
                      >
                        {item.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              <span
                onClick={() => setSidenav(false)}
                className="w-8 h-8 border border-green-700 absolute top-2 -right-10 text-white text-2xl flex justify-center items-center cursor-pointer hover:border-green-500 hover:text-green-500 duration-300"
              >
                <MdClose />
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </nav>
  </div>
);
// ...existing code...
};

export default Header;
