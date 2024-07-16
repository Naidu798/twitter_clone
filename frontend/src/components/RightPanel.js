import React, { useContext, useEffect, useState } from "react";
import backendDomain from "../common";
import { AppContext } from "../context/AppContext";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const RightPanel = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const { customToast, tabSection, currentUser, setActiveTab, setCurrentUser } =
    useContext(AppContext);

  const setFollowUnfollowUser = (userId, type) => {
    if (type === "follow") {
      setCurrentUser((prev) => ({
        ...prev,
        following: [...prev.following, userId],
      }));
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        following: prev.following.filter((idx) => idx !== userId),
      }));
    }
  };

  const followUnfollowUser = async (userId, type) => {
    try {
      setIsLoading(true);

      const res = await fetch(backendDomain.users.followUnfollowUser + userId, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setFollowUnfollowUser(userId, type);
        customToast("success", data.message);
        setIsLoading(false);
        setActiveIndex(null);
      } else {
        customToast("error", data.message);
        setIsLoading(false);
        setActiveIndex(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const res = await fetch(backendDomain.users.suggested, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSuggestedUsers(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFollowingUsers = async () => {
    try {
      const res = await fetch(backendDomain.users.following, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSuggestedUsers(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (tabSection === "FOR_YOU") {
      fetchSuggestedUsers();
    } else {
      fetchFollowingUsers();
    }
  }, [tabSection]);

  return (
    <div className="w-[250px] h-screen text-white border border-gray-900 px-2 py-2">
      <p className="font-semibold text-lg mb-3">
        {tabSection === "FOR_YOU" ? "Who to follow" : "Followed by you"}
      </p>
      <ul className="w-full h-[90vh] overflow-y-scroll scrollbar-none">
        {suggestedUsers.length > 0 &&
          suggestedUsers.map((user, i) => {
            return (
              <li
                className="flex items-center justify-between mb-4"
                key={user?._id + "suggested"}
              >
                <Link
                  to={"/profile/" + user?.username}
                  onClick={() => setActiveTab("PROFILE")}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-800">
                      {user?.profileImg ? (
                        <img
                          src={user?.profileImg}
                          alt="profile"
                          className="h-full w-full rounded-full"
                        />
                      ) : (
                        <FaUserCircle className="h-full w-full text-gray-500" />
                      )}
                    </div>
                    <div className="text-white flex flex-col">
                      <p className="text-md text-gray-200 text-ellipsis line-clamp-1">
                        {user?.fullName}
                      </p>

                      <span className="text-gray-500 text-xs">
                        @{user?.username}
                      </span>
                    </div>
                  </div>
                </Link>
                {currentUser?.following.includes(user?._id) ? (
                  <button
                    onClick={() => {
                      setActiveIndex(i);
                      followUnfollowUser(user._id, "unfollow");
                    }}
                    className="bg-gray-300 hover:bg-gray-100 text-sm text-black font-semibold px-2 pb-0.5 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading && i === activeIndex ? (
                      <Loading size={4} b={2} />
                    ) : (
                      "Unfollow"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveIndex(i);
                      followUnfollowUser(user._id, "follow");
                    }}
                    className="bg-gray-300 hover:bg-gray-100 text-sm text-black font-semibold px-3 pb-0.5 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading && i === activeIndex ? (
                      <Loading size={4} b={2} />
                    ) : (
                      "Follow"
                    )}
                  </button>
                )}
              </li>
            );
          })}
        {suggestedUsers.length === 0 && (
          <div className="w-full flex justify-center items-center h-[30vh]">
            <span className="text-gray-500">No users found</span>
          </div>
        )}
      </ul>
    </div>
  );
};

export default RightPanel;
