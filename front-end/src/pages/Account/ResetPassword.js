import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthenService from "../../services/api/AuthenService";
import { BsCheckCircleFill } from "react-icons/bs";
import { logoLight } from "../../assets/images";
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMsg("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password) {
      setErrorMsg("Enter your new password");
    } else {
      try {
        const response = await AuthenService.resetPassword(token, password);
        if (response.err) {
          setErrorMsg(response.err);
        } else if (response.message) {
          setSuccessMsg(response.message);
        }
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-green-700 px-10 flex flex-col gap-6 justify-center">
          
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full ">
        <div className="px-6 py-4 w-full lgl:w-[450px] h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
          <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
              Reset Password
            </h1>
            <div className="flex flex-col gap-1">
              <p className="font-titleFont text-base font-semibold text-gray-600">
                New Password
              </p>
              <input
                onChange={handlePassword}
                value={password}
                className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                type="password"
                placeholder="Enter new password"
              />
              {errorMsg && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errorMsg}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"
            >
              Reset Password
            </button>
            {successMsg && (
              <p className="mb-4 font-medium text-sm text-green-600">
                {successMsg}
              </p>
            )}
            <p className="text-sm text-center font-titleFont font-medium">
              Remembered your password?{" "}
              <Link to="/signin">
                <span className="hover:text-blue-600 duration-300">
                  Sign in
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;