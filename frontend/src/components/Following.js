import React, { useContext, useEffect, useState } from "react";
import backnedDomain from "../common";
import { AppContext } from "../context/AppContext";
import Posts from "../pages/Posts";

const Following = () => {
  const [followingPosts, setFollowingPosts] = useState([]);

  const { customToast } = useContext(AppContext);

  const fetchFollowingPosts = async () => {
    try {
      const res = await fetch(backnedDomain.posts.followingPosts, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setFollowingPosts(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFollowingPosts();
  }, []);

  return (
    <Posts
      data={followingPosts}
      setData={setFollowingPosts}
      keyType={"Following"}
    />
  );
};

export default Following;
