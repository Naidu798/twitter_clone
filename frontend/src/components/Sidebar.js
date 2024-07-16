import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "./XSvg";
import { AiFillHome } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import backnedDomain from "../common";

const Sidebar = () => {
  const {
    isLightTheme,
    setActiveTab,
    activeTab,
    customToast,
    currentUser,
    notifications,
    setNotifications,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(backnedDomain.auth.logout, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        customToast("success", data.message);
        setActiveTab("HOME");
        navigate("/auth/login");
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const unReadNotifications = () => {
    let count = 0;
    notifications.forEach((ele) => {
      if (ele.read === false) {
        count += 1;
      }
    });
    return count;
  };

  const handleUpdateNotifications = async () => {
    try {
      const res = await fetch(backnedDomain.notifications.updateStatus, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        customToast("error", data.message);
      } else {
        setNotifications((prev) => prev.map((ntf) => ({ ...ntf, read: true })));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className={`w-[250px] h-screen border border-gray-900 py-2 px-3`}>
        <div className={`flex justify-center mb-6 md:mb-0 md:justify-start`}>
          <XSvg
            className={`w-9 md:w-12 ${
              isLightTheme ? "fill-gray-800" : "fill-white"
            }`}
          />
        </div>
        <div className="mt-7 w-full h-[85vh] flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setActiveTab("HOME")}
              className={` text-white flex items-center gap-3 cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 ${
                activeTab === "HOME" && "bg-gray-200 bg-opacity-10"
              } px-2 pb-1 pt-0.5 rounded-lg`}
            >
              <AiFillHome className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to={""}
              onClick={() => {
                setActiveTab("NOTIFICATIONS");
                handleUpdateNotifications();
              }}
              className={` text-white flex items-center gap-3 cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 ${
                activeTab === "NOTIFICATIONS" && "bg-gray-200 bg-opacity-10"
              } px-2 pb-1 pt-0.5 rounded-lg relative`}
            >
              <IoIosNotifications className="h-5 w-5" />
              <span>Notifications</span>
              {unReadNotifications() > 0 && (
                <span className="bg-red-500 cursor-pointer absolute top-0 left-4 rounded-full h-4 w-4 flex items-center justify-center text-xs text-gray-200">
                  {unReadNotifications()}
                </span>
              )}
            </Link>
            <Link
              to={"/profile/me"}
              onClick={() => setActiveTab("PROFILE")}
              className={` text-white flex items-center gap-3 cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 ${
                activeTab === "PROFILE" && "bg-gray-200 bg-opacity-10"
              } px-2 pb-1 pt-0.5 rounded-lg`}
            >
              <FaUser className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gray-800">
                {currentUser?.profileImg ? (
                  <img
                    src={currentUser?.profileImg}
                    alt="profile"
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <FaUserCircle className="h-full w-full text-gray-400" />
                )}
              </div>
              <div className="text-white flex flex-col">
                <p className="text-md text-ellipsis line-clamp-1">
                  {currentUser?.fullName}
                </p>

                <span className="text-gray-500">@{currentUser?.username}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-500 border border-blue-500 rounded-full w-full pb-1 mt-4"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
