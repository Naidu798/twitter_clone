import React, { useContext, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaRegComment } from "react-icons/fa6";
import { FaRegHeart, FaUserCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import moment from "moment";
import backnedDomain from "../common";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";
import CommentItem from "./CommentItem";

const Post = ({
  post,
  index,
  activeCommentSection,
  setActiveCommentSection,
  setData,
  keyType,
}) => {
  const { customToast, currentUser } = useContext(AppContext);

  const [comment, setComment] = useState("");

  const deletePost = async (id) => {
    try {
      const res = await fetch(`${backnedDomain.posts.deletePost}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        customToast("success", data.message);
        setData((prev) => prev.filter((pt) => pt._id !== id));
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setPosts = (type, id) => {
    if (type === "like") {
      setData((prev) =>
        prev.map((post) =>
          post._id === id
            ? { ...post, likes: [...post.likes, currentUser?._id] }
            : post
        )
      );
    } else {
      setData((prev) =>
        prev.map((post) =>
          post._id === id
            ? {
                ...post,
                likes: post.likes.filter((idx) => idx !== currentUser?._id),
              }
            : post
        )
      );
    }
  };

  const handleLikeUnlike = async (id) => {
    try {
      const res = await fetch(`${backendDomain.posts.likePost}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.type, id);
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setPostsComments = () => {
    setData((prev) =>
      prev.map((pt) =>
        pt._id === post._id
          ? {
              ...pt,
              comments: [
                ...pt.comments,
                { text: comment, user: { ...currentUser } },
              ],
            }
          : pt
      )
    );
  };

  const sendComment = async () => {
    try {
      const res = await fetch(`${backendDomain.posts.commentPost}${post._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ text: comment.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPostsComments();
        setComment("");
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isCommented = (post) => {
    for (let comment of post.comments) {
      if (comment.user._id === currentUser._id) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-[600px] h-full">
      <div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-900">
                {post?.user?.profileImg ? (
                  <img
                    src={post?.user?.profileImg}
                    alt="profile"
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <FaUserCircle className="h-full w-full text-gray-500" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-md tracking-wide text-gray-400">
                  {post?.user.fullName}
                </span>
                <span className="text-gray-500 text-sm">
                  @{post?.user.username}
                </span>
                <span className="text-gray-600 text-xs ">
                  {moment(post?.createdAt).format("lll")}
                </span>
              </div>
            </div>
            <button
              onClick={() => deletePost(post?._id)}
              className="p-1 rounded-full hover:bg-red-500"
            >
              <MdDelete />
            </button>
          </div>
          <p className="ml-12 text-gray-300">{post?.text}</p>
          {post?.image && (
            <div className="ml-12 mt-3 h-56 w-[490px] border border-gray-900 rounded-lg p-3">
              <img
                src={post?.image}
                alt="post"
                className="h-full w-full object-scale-down"
              />
            </div>
          )}
          <div className="text-gray-600 ml-12 mt-3 w-[490px] flex items-center justify-between">
            <button
              className={`flex items-center gap-1 ${
                isCommented(post) && "text-blue-500"
              }`}
              onClick={() => setActiveCommentSection(index)}
            >
              <FaRegComment className={`h-4 w-4`} />
              <span>{post?.comments?.length}</span>
            </button>
            <div className="flex items-center gap-1">
              <BiRepost className="h-6 w-6" />
              <span>0</span>
            </div>
            <button
              className="flex items-center gap-1"
              onClick={() => handleLikeUnlike(post?._id)}
            >
              {post?.likes.includes(currentUser?._id) ? (
                <div className="text-red-600 flex items-center gap-1">
                  <FaHeart /> <span>{post?.likes?.length}</span>
                </div>
              ) : (
                <>
                  <FaRegHeart /> <span>{post?.likes?.length}</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-1">
              <FaRegBookmark className="h-4 w-4" />
            </div>
          </div>
          {activeCommentSection === index && (
            <div className="ml-11 mt-2">
              <hr className="border border-gray-900" />
              <textarea
                className="w-full outline-none h-20 bg-transparent mt-2 py-1 px-2 text-gray-300 border-b border-b-gray-800"
                placeholder="Enter comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="w-full flex justify-end mt-2">
                <button
                  onClick={sendComment}
                  className="bg-blue-500 px-2 text-[14px] pb-0.5 text-white rounded-full mb-3"
                >
                  Send Comment
                </button>
              </div>
            </div>
          )}
          <ul>
            {post?.comments.slice(0, 3).map((comment) => {
              return (
                <CommentItem comment={comment} key={comment?._id + keyType} />
              );
            })}
          </ul>
          {post?.comments?.length > 3 && (
            <span className="text-blue-500 text-sm font-semibold ml-10 mt-1">
              More...
            </span>
          )}
        </div>
        <hr className="border border-gray-900" />
      </div>
    </div>
  );
};

export default Post;
