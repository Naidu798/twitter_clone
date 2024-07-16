import React, { useContext, useEffect, useState } from "react";
import backendDomain from "../common";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Posts from "../pages/Posts";

const MyPosts = () => {
  let username = useParams().username;
  const { customToast, currentUser } = useContext(AppContext);

  const [posts, setPosts] = useState([]);

  const getMyPosts = async (userName) => {
    try {
      const res = await fetch(backendDomain.posts.userPosts + userName, {
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
    if (username === "me") {
      getMyPosts(currentUser?.username);
    } else {
      getMyPosts(username);
    }
  }, [username]);

  return <Posts data={posts} setData={setPosts} keyType={"Myposts"} />;
};

export default MyPosts;
