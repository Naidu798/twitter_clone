import React, { useContext, useEffect, useState } from "react";
import backendDomain from "../common";
import { AppContext } from "../context/AppContext";
import Posts from "../pages/Posts";
import { useParams } from "react-router-dom";

const LikedPosts = ({ user }) => {
  const { customToast } = useContext(AppContext);
  const username = useParams().username;

  const [posts, setPosts] = useState([]);

  const getLikedPosts = async () => {
    try {
      const res = await fetch(backendDomain.posts.likedPosts + user, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLikedPosts();
  }, [username]);

  return <Posts data={posts} setData={setPosts} keyType={"LikedPosts"} />;
};

export default LikedPosts;
