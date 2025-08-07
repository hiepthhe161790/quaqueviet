import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthenService from "../../services/api/AuthenService";
import { jwtDecode } from "jwt-decode";

const ResendVerificationEmail = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setEmail(decodedToken.email);
    }
  }, [accessToken]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrorMsg("");
  };

  const handleResendVerificationEmail = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Enter your email");
    } else {
      try {
        setIsLoading(true);
        await AuthenService.resendVerificationEmail(email);
        setSuccessMsg("Verification email has been sent to your email.");
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Resend verification email failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        <div className="px-6 py-4 w-full lgl:w-[450px] h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
          <form onSubmit={handleResendVerificationEmail} className="flex flex-col gap-3">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
              Resend Verification Email
            </h1>
            <div className="mb-4 text-sm text-gray-600">
              Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-titleFont text-base font-semibold text-gray-600">
                Your Email
              </p>
              <input
                onChange={handleEmail}
                value={email}
                className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                type="email"
                placeholder="john@workemail.com"
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
              className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </button>
            {successMsg && (
              <p className="mb-4 font-medium text-sm text-green-600">
                {successMsg}
              </p>
            )}
            <p className="text-sm text-center font-titleFont font-medium">
              Don't have an Account?{" "}
              <Link to="/signup">
                <span className="hover:text-blue-600 duration-300">
                  Sign up
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationEmail;
