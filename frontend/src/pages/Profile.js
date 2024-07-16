import React, { useContext, useEffect, useRef, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { LuLink } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import Posts from "./Posts";
import EditProfile from "../components/EditProfile";
import { AppContext } from "../context/AppContext";
import uploadImageToCloudinary from "../helpers/uploadImageToCloudinary";
import backendDomain from "../common";
import moment from "moment";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import LikedAndMyPosts from "../components/LikedAndMyPosts";

const Profile = () => {
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [coverImgPreview, setCoverImgPreview] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(null);

  const { currentUser, setCurrentUser, customToast, allPosts, getCurrentUser } =
    useContext(AppContext);

  const [userProfile, setUserProfile] = useState(null);

  const params = useParams();

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const handleCoverImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImg(file);
        setCoverImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(file);
        setProfileImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await fetch(backendDomain.users.updateProfile, {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (data.success) {
        getCurrentUser();
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateCoverAndProfileImg = async () => {
    try {
      setIsUploading(true);
      if (!profileImg && !coverImg) {
        setIsUploading(false);
        return customToast("error", "Please upload profile or cover image");
      }

      let coverImageUrl = null;
      if (coverImg) {
        const cloudinaryRes = await uploadImageToCloudinary(coverImg);
        if (cloudinaryRes?.error) {
          setIsUploading(false);
          setCoverImg(null);
          setCoverImgPreview(null);
          setProfileImg(null);
          setProfileImgPreview(null);
          return customToast("error", cloudinaryRes?.error?.message);
        }
        coverImageUrl = cloudinaryRes.url;
      }

      let profileImageUrl = null;
      if (profileImg) {
        const cloudinaryRes = await uploadImageToCloudinary(profileImg);

        if (cloudinaryRes?.error) {
          setIsUploading(false);
          setCoverImg(null);
          setCoverImgPreview(null);
          setProfileImg(null);
          setProfileImgPreview(null);
          return customToast("error", cloudinaryRes?.error?.message);
        }
        profileImageUrl = cloudinaryRes.url;
      }

      await updateProfile({
        coverImg: coverImageUrl,
        profileImg: profileImageUrl,
      });
      setIsUploading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserProfile = async (username) => {
    try {
      const res = await fetch(backendDomain.users.profile + username, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      } else {
        customToast("error", data.message);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let username = params.username;
    if (currentUser || username) {
      if (username === "me") {
        username = currentUser?.username;
      }
      getUserProfile(username);
    }
  }, [params.username, currentUser]);

  return (
    <div className="py-3">
      <div>
        <div className="flex items-center gap-4 px-3">
          <GoArrowLeft />
          <div className="flex flex-col">
            <span className="text-gray-100">{userProfile?.fullName}</span>
            <span className="text-gray-600">{allPosts?.length} posts</span>
          </div>
        </div>
        <div className="h-[90vh] overflow-y-scroll scrollbar-none">
          <div className="relative">
            <div
              className="h-44 w-full bg-gray-800 mt-2"
              onClick={() => coverImgRef.current.click()}
            >
              {(coverImgPreview || userProfile?.coverImg) && (
                <img
                  src={coverImgPreview || userProfile?.coverImg}
                  alt="cover"
                  className="h-full w-full object-fill"
                />
              )}
            </div>
            <input
              type="file"
              ref={coverImgRef}
              onChange={handleCoverImg}
              className="hidden"
              disabled={!(currentUser?._id === userProfile?._id)}
            />
            <input
              type="file"
              ref={profileImgRef}
              onChange={handleProfileImg}
              className="hidden"
              disabled={!(currentUser?._id === userProfile?._id)}
            />
            <div
              className="w-32 h-32 rounded-full bg-gray-900 absolute -bottom-14 left-3"
              onClick={() => profileImgRef.current.click()}
            >
              {(profileImgPreview || userProfile?.profileImg) && (
                <img
                  src={profileImgPreview || userProfile?.profileImg}
                  alt="profile"
                  className="h-full w-full rounded-full"
                />
              )}
            </div>
          </div>
          {currentUser?._id === userProfile?._id ? (
            <div className="w-full text-right mt-3">
              <button
                onClick={() => setOpenEditProfile(true)}
                className="bg-transparent border px-5 pt-0.5 pb-1 rounded-full text-gray-100 mr-3"
              >
                Edit profile
              </button>
              {(coverImg || profileImg) && (
                <button
                  disabled={isUploading}
                  onClick={handleUpdateCoverAndProfileImg}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-3 pt-0.5 pb-1 rounded-full mr-3 outline-none"
                >
                  {isUploading ? "Uploading..." : "Update"}
                </button>
              )}
            </div>
          ) : (
            <div className="my-3 w-full flex justify-end px-5">
              {currentUser?.following.includes(userProfile?._id) ? (
                <button
                  onClick={() =>
                    followUnfollowUser(userProfile._id, "unfollow")
                  }
                  className="border-gray-300 border text-gray-300 text-md font-semibold px-3 pb-1 pt-0.l5 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading size={4} b={2} /> : "Unfollow"}
                </button>
              ) : (
                <button
                  onClick={() => followUnfollowUser(userProfile._id, "follow")}
                  className="bg-gray-300 hover:bg-gray-100 text-md text-black font-semibold px-3 pb-1 pt-0.l5 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading size={4} b={2} /> : "Follow"}
                </button>
              )}
            </div>
          )}

          <div className="mt-8 px-3">
            <h3>{userProfile?.fullName}</h3>
            <span className="text-gray-400">@{userProfile?.username}</span>
            <p className="text-sm mt-3 mb-4">{userProfile?.bio}</p>
            {userProfile?.link && (
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <LuLink className="h-3 w-3" />
                <a
                  href={userProfile?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  {userProfile?.link}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <FaRegCalendarAlt />
              <span>
                Joined By {moment(userProfile?.createdAt).format("LLL")}
              </span>
            </div>
            <div className="flex items-center gap-5 mt-3">
              <p className="text-gray-200">
                {userProfile?.following.length}{" "}
                <span className="text-gray-500">Following</span>
              </p>
              <p className="text-gray-200">
                {userProfile?.followers.length}{" "}
                <span className="text-gray-500">Followers</span>
              </p>
            </div>
          </div>
          <LikedAndMyPosts user={userProfile?._id} />
        </div>
      </div>
      {openEditProfile && (
        <EditProfile setOpenEditProfile={setOpenEditProfile} />
      )}
    </div>
  );
};

export default Profile;
