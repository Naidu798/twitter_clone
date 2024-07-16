import React, { useContext, useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import Posts from "../pages/Posts";
import Profile from "./Profile";
import Notifications from "../pages/Notifications";
import Following from "../components/Following";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";

const Main = () => {
  const { activeTab, tabSection, setTabSection, currentUser, customToast } =
    useContext(AppContext);

  const [allPosts, setAllPosts] = useState([]);

  const getAllPosts = async () => {
    try {
      const res = await fetch(backendDomain.posts.allPosts, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAllPosts(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAllPosts();
    }
  }, [currentUser]);

  const renderHome = () => {
    return (
      <>
        <div className="flex justify-evenly">
          <button
            onClick={() => setTabSection("FOR_YOU")}
            className={`text-md font-semibold rounded-sm py-1.5 ${
              tabSection === "FOR_YOU" && "border-b-4 border-b-blue-500"
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setTabSection("FOLLOWING")}
            className={`text-md font-semibold rounded-sm py-1.5 ${
              tabSection === "FOLLOWING" && "border-b-4 border-b-blue-500"
            }`}
          >
            Following
          </button>
        </div>
        <hr className="border border-gray-900" />

        <div className="w-full h-[94vh] overflow-y-scroll scrollbar-none">
          {tabSection === "FOR_YOU" ? (
            <>
              <CreatePost getAllPosts={getAllPosts} />
              <hr className="border border-gray-900" />
              <Posts
                data={allPosts}
                setData={setAllPosts}
                keyType={"allPosts"}
              />
            </>
          ) : (
            <Following />
          )}
        </div>
      </>
    );
  };

  const setCurrentTab = () => {
    switch (activeTab) {
      case "HOME":
        return renderHome();
      case "PROFILE":
        return <Profile />;
      case "NOTIFICATIONS":
        return <Notifications />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[calc(1100px-500px)] h-screen text-white">
      {setCurrentTab()}
    </div>
  );
};

export default Main;
