import React, { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDarkMode, MdLightMode, MdOutlinePassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "../components/XSvg";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";

const Login = () => {
  const { isLightTheme, setIsLightTheme, customToast, setCurrentUser } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const loginUser = async () => {
    try {
      const res = await fetch(backendDomain.auth.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userData),
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
    loginUser();
  };

  return (
    <div className="h-full w-full p-5 flex justify-center items-center relative">
      <div className="absolute top-10 right-10">
        {isLightTheme ? (
          <MdDarkMode
            className="text-gary-800 h-8 w-8"
            onClick={() => setIsLightTheme(false)}
          />
        ) : (
          <MdLightMode
            className="text-white h-8 w-8"
            onClick={() => setIsLightTheme(true)}
          />
        )}
      </div>
      <div className={`flex md:flex-row flex-col md:gap-10`}>
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
            Let's Go.
          </h2>

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
              value={userData.username}
              required
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, username: e.target.value }))
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
              required
              value={userData.password}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, password: e.target.value }))
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
            Login
          </button>
          <p
            className={`font-medium mt-2 ${
              isLightTheme ? "text-gray-900" : "text-gray-200"
            }`}
          >
            Don't have an account?
          </p>
          <Link to="/auth/signup">
            <button className="text-blue-500 border border-blue-500 rounded-full w-full pb-2 pt-1.5">
              Signup
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
