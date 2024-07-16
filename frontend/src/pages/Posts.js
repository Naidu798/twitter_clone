import React, { useState } from "react";
import Post from "../components/Post";

const Posts = ({ data, setData, keyType }) => {
  const [activeCommentSection, setActiveCommentSection] = useState(null);

  return (
    <ul>
      {data.length === 0 ? (
        <div className="w-full h-[35vh] flex justify-center items-center">
          No Posts Created
        </div>
      ) : (
        data.map((post, i) => {
          return (
            <Post
              key={post?._id + "posts"}
              post={post}
              setData={setData}
              index={i}
              activeCommentSection={activeCommentSection}
              setActiveCommentSection={setActiveCommentSection}
              keyType={keyType}
            />
          );
        })
      )}
    </ul>
  );
};

export default Posts;
