import React, { useContext, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

import backendDomain from "../common";
import { AppContext } from "../context/AppContext";
import moment from "moment";

const Notifications = () => {
  const [openSettings, setOpenSettings] = useState(false);

  const { customToast, notifications, setNotifications } =
    useContext(AppContext);

  const deleteAllNotifications = async () => {
    try {
      setOpenSettings(false);
      const res = await fetch(backendDomain.notifications.deleteAll, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications([]);
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-5 relative">
      <div className="flex items-center justify-between text-white text-lg mb-3 px-5">
        <h3>Notifications</h3>
        <IoSettingsOutline onClick={() => setOpenSettings((prev) => !prev)} />
        {openSettings && (
          <div className="absolute right-3 top-12 bg-gray-900 text-gray-200 text-sm px-3 pt-0.5 pb-1 rounded-md">
            <button onClick={deleteAllNotifications}>Delete All</button>
          </div>
        )}
      </div>
      <hr className="border border-gray-900" />
      <ul className="mt-3 h-[87vh] overflow-y-scroll scrollbar-none px-5">
        {notifications.length > 0 &&
          notifications.map((ntf) => {
            return (
              <li key={ntf?._id} className="mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {ntf.type === "follow" ? (
                      <FaUser className="h-5 w-5 text-blue-400" />
                    ) : (
                      <FaHeart className="h-5 w-5 text-red-500" />
                    )}
                    <div className="h-7 w-7 rounded-full bg-gray-900">
                      {ntf?.from.profileImg ? (
                        <img
                          src={ntf?.from.profileImg}
                          alt="profile"
                          className="h-full w-full rounded-full"
                        />
                      ) : (
                        <FaUserCircle className="h-full w-full text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">
                      {moment(ntf?.createdAt).format("lll")}
                    </span>
                  </div>
                </div>
                <p className="text-blue-400 text-sm ml-8 mt-2">
                  {ntf?.from._id === ntf?.to ? "You" : `@${ntf?.from.username}`}
                  {ntf?.type === "follow" ? (
                    <span className="text-gray-200 ml-2">Followed you</span>
                  ) : (
                    <span className="text-gray-200 ml-2">liked your post.</span>
                  )}
                </p>
                <hr className="border border-gray-900 mt-3" />
              </li>
            );
          })}
        {notifications.length === 0 && (
          <div className="w-full h-[70vh] flex justify-center items-center">
            <span className="text-lg text-gray-400">No Notifications</span>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
