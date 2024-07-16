import React, { useState } from "react";
import MyPosts from "./MyPosts";
import LikedPosts from "./LikedPosts";

const LikedAndMyPosts = ({ user }) => {
  const [activeButton, setActiveButton] = useState("MY_POSTS");

  return (
    <div>
      <div className="flex justify-evenly text-gray-500 mt-3">
        <button
          onClick={() => setActiveButton("MY_POSTS")}
          className={`text-md font-semibold rounded-sm py-1.5 ${
            activeButton === "MY_POSTS" && "border-b-4 border-b-blue-500"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveButton("LIKED")}
          className={`text-md font-semibold rounded-sm py-1.5 ${
            activeButton === "LIKED" && "border-b-4 border-b-blue-500"
          }`}
        >
          Likes
        </button>
      </div>
      <hr className="border border-gray-900" />
      {activeButton === "MY_POSTS" ? <MyPosts /> : <LikedPosts user={user} />}
    </div>
  );
};

export default LikedAndMyPosts;
