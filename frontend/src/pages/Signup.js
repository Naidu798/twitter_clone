import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "../components/XSvg";
import { HiOutlineMail } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";

const Signup = () => {
  const { isLightTheme, setIsLightTheme, customToast, setCurrentUser } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const signupUser = async () => {
    try {
      const res = await fetch(backendDomain.auth.signup, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (resData.success) {
        customToast("success", resData.message);
        setCurrentUser(resData.data);
        navigate("/");
      } else {
        customToast("error", resData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    signupUser();
  };

  return (
    <div className="h-full w-full p-5 flex justify-center items-center relative">
      <div className="absolute top-10 right-10">
        {isLightTheme ? (
          <MdDarkMode
            className="text-gary-800 h-6 w-6"
            onClick={() => setIsLightTheme(false)}
          />
        ) : (
          <MdLightMode
            className="text-white h-6 w-6"
            onClick={() => setIsLightTheme(true)}
          />
        )}
      </div>
      <div className={`flex md:flex-row flex-col md:gap-16 `}>
        <div className={`flex justify-center mb-6 md:mb-0 md:justify-start`}>
          <XSvg
            className={`w-2/5 md:w-4/5 ${
              isLightTheme ? "fill-gray-800" : "fill-white"
            }`}
          />
        </div>

        <form
          className="flex flex-col gap-2 md:w-[35vw] lg:w-[25vw] "
          onSubmit={handleSubmitForm}
        >
          <h2
            className={`font-bold text-2xl ${
              isLightTheme ? "text-gray-800" : "text-white"
            }`}
          >
            Join Today.
          </h2>
          <div
            className={`flex items-center pl-2 rounded-lg ${
              isLightTheme
                ? "bg-white border"
                : "bg-transparent border border-gray-500"
            }`}
          >
            <HiOutlineMail
              className={`h-5 w-5 ${
                isLightTheme ? "text-gray-800" : "text-gray-200"
              }`}
            />
            <input
              type="text"
              value={data.email}
              onChange={(e) =>
                setData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              placeholder="Email"
              className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md ${
                isLightTheme ? "" : "bg-transparent text-white"
              }`}
            />
          </div>
          <div
            className={`flex items-center pl-2 rounded-lg ${
              isLightTheme
                ? "bg-white border"
                : "bg-transparent border border-gray-500"
            }`}
          >
            <FaUser
              className={`h-3 w-5 ${
                isLightTheme ? "text-gray-800" : "text-gray-200"
              }`}
            />
            <input
              type="text"
              placeholder="Username"
              value={data.username}
              required
              onChange={(e) =>
                setData((prev) => ({ ...prev, username: e.target.value }))
              }
              className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md ${
                isLightTheme ? "" : "bg-transparent text-white"
              }`}
            />
          </div>
          <div
            className={`flex items-center pl-2 rounded-lg ${
              isLightTheme
                ? "bg-white border"
                : "bg-transparent border border-gray-500"
            }`}
          >
            <MdOutlineDriveFileRenameOutline
              className={`h-5 w-5 ${
                isLightTheme ? "text-gray-800" : "text-gray-200"
              }`}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={data.fullName}
              required
              onChange={(e) =>
                setData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md ${
                isLightTheme ? "" : "bg-transparent text-white"
              }`}
            />
          </div>
          <div
            className={`flex items-center pl-2 rounded-lg ${
              isLightTheme
                ? "bg-white border"
                : "bg-transparent border border-gray-500"
            }`}
          >
            <MdOutlinePassword
              className={`h-5 w-5 ${
                isLightTheme ? "text-gray-800" : "text-gray-200"
              }`}
            />
            <input
              type="password"
              placeholder="Password"
              value={data.password}
              required
              onChange={(e) =>
                setData((prev) => ({ ...prev, password: e.target.value }))
              }
              className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md ${
                isLightTheme ? "" : "bg-transparent text-white"
              }`}
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-500 rounded-full w-full pb-2 pt-1.5"
          >
            Signup
          </button>
          <p
            className={`font-medium mt-2 ${
              isLightTheme ? "text-gray-900" : "text-gray-200"
            }`}
          >
            Already have an account?
          </p>
          <Link to="/auth/login">
            <button className="text-blue-500 border border-blue-500 rounded-full w-full pb-2 pt-1.5">
              Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
