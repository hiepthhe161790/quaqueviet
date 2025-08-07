import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { logoLight } from "../../assets/images";
import AuthenService from "../../services/api/AuthenService";
import { jwtDecode } from "jwt-decode";
import { resetUserInfo } from "../../redux/orebiSlice";
const SignIn = () => {
  // ============= Initial State Start here =============
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // ============= Event Handler Start here =============
  const navigate = useNavigate();
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
    setErrorMsg("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
    setErrorMsg("");
  };
  // ============= Event Handler End here ===============
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrEmail("Enter your email");
    }

    if (!password) {
      setErrPassword("Enter your password");
    }

    if (email && password) {
      try {
        const data = { email, password };
        const response = await AuthenService.login(data);
        if (response.message === "Please verify your email") {
          setSuccessMsg("Please verify your email to continue.");
          setEmail("");
          setPassword("");
          navigate("/resend-verification-email");
        } else if (response.message === "Login successful") {
          // Ưu tiên lấy role từ response trả về từ backend
          const role = response.role;
          // Nếu backend không trả về deleted, fallback sang accessToken
          let deleted = response.deleted;
          if (typeof deleted === 'undefined') {
            const decodedToken = jwtDecode(response.accessToken);
            deleted = decodedToken.isDeleted;
          }

          if (deleted) {
            setErrorMsg(
              "Your Account has been disabled by the admin. Please contact customer support for more info! Redirect to Home in 10 seconds !"
            );
            await AuthenService.logout();
            dispatch(resetUserInfo());
            await new Promise((r) => setTimeout(r, 10000));
            return navigate("/");
          }

          if (role === "admin") {
            setSuccessMsg(
              "Hello Admin, Welcome back! You have successfully signed in."
            );
            setEmail("");
            setPassword("");
            return navigate("/admin/dashboard");
          } else if (role === "sales manager") {
            setSuccessMsg(
              "Hello Sales Manager, Welcome back! You have successfully signed in."
            );
            setEmail("");
            setPassword("");
            return navigate("/manage-product");
          } else if (role === "customer") {
            setSuccessMsg(
              "Hello dear, Welcome back! You have successfully signed in."
            );
            setEmail("");
            setPassword("");
            return navigate("/");
          }
        } else {
          setErrorMsg("Login failed");
        }
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-green-700 px-10 flex flex-col gap-6 justify-center"></div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/">
              <button
                className="w-full h-10 bg-green-700 text-gray-200 rounded-md text-base font-titleFont font-semibold 
                tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Đăng nhập
              </h1>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="john@workemail.com"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Mật khẩu
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Enter password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleSignIn}
                  className="bg-green-700 hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                >
                  Đăng nhập
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300">
                      Đăng kí
                    </span>
                  </Link>
                </p>
                <p className="text-sm text-center font-titleFont font-medium">
                  Không nhớ mật khẩu?{" "}
                  <Link to="/forgot-password">
                    <span className="hover:text-blue-600 duration-300">
                      Quên mật khẩu
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
