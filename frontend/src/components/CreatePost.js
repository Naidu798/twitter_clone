import React, { useContext, useRef, useState } from "react";
import { FaRegImage, FaUserCircle } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import backendDomain from "../common";
import { AppContext } from "../context/AppContext";
import { RxCross2 } from "react-icons/rx";
import uploadImageToCloudinary from "../helpers/uploadImageToCloudinary";

const CreatePost = ({ getAllPosts }) => {
  const [postData, setPostData] = useState({
    text: "",
    image: null,
  });
  const [imgPreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { customToast, currentUser } = useContext(AppContext);

  const imgRef = useRef(null);

  const handleSendPost = async () => {
    try {
      setIsUploading(true);
      let imageUrl = null;
      if (postData?.image) {
        const cloudinaryImage = await uploadImageToCloudinary(postData.image);
        if (!cloudinaryImage) {
          return customToast(
            "error",
            "image uploading failed! try again later"
          );
        }
        imageUrl = cloudinaryImage.url;
      }

      const res = await fetch(backendDomain.posts.createPost, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ text: postData.text, image: imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setImagePreview("");
        setPostData({ text: "", image: null });
        getAllPosts();
        setIsUploading(false);
        customToast("success", data.message);
      } else {
        setIsUploading(false);
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData((prev) => ({ ...prev, image: file }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-4 px-2">
      <div className="flex gap-3 w-full">
        <div className="h-9 w-9 rounded-full bg-gray-900">
          {currentUser?.profileImg ? (
            <img
              src={currentUser?.profileImg}
              alt="profile"
              className="h-full w-full rounded-full"
            />
          ) : (
            <FaUserCircle className="h-full w-full text-gray-500" />
          )}
        </div>
        <div>
          <textarea
            type="text"
            value={postData.text}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="What is happening?"
            className="w-[530px] outline-none h-20 bg-transparent scrollbar-none border-b border-b-gray-900"
          />
          {imgPreview && (
            <div className="w-[530px] h-60 px-3">
              <div className="w-full flex justify-end">
                <RxCross2
                  className="text-white text-lg cursor-pointer"
                  onClick={() => {
                    setImagePreview("");
                    setPostData((prev) => ({ ...prev, image: null }));
                  }}
                />
              </div>
              <div className="w-full flex justify-center">
                <img
                  src={imgPreview}
                  alt="upload"
                  className="h-52 w-[80%] object-scale-down"
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between w-full p-1">
            <div className="flex items-center gap-3 text-blue-500 text-xl">
              <FaRegImage onClick={() => imgRef.current.click()} />
              <input
                type="file"
                onChange={handleImage}
                ref={imgRef}
                className="hidden"
              />
              <MdEmojiEmotions />
            </div>
            <button
              onClick={handleSendPost}
              className="text-white bg-blue-500 hover:bg-blue-600 transition-all px-5 pb-0.5 rounded-full"
              disabled={isUploading}
            >
              {isUploading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
