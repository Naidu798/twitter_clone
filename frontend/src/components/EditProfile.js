import React, { useContext, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import backendDomain from "../common";
import { AppContext } from "../context/AppContext";

const EditProfile = ({ setOpenEditProfile }) => {
  const { getCurrentUser, customToast, currentUser } = useContext(AppContext);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [userData, setUserData] = useState({
    fullName: currentUser?.fullName || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    link: currentUser?.link || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
  });

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

  const handleUpdate = async () => {
    setIsUploading(true);
    Object.keys(userData).map((userKey) => {
      const trimmedValue = userData[userKey].trim();
      userData[userKey] = trimmedValue;
      return null;
    });

    await updateProfile(userData);
    setIsUploading(false);
  };

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-30">
      <div className="bg-gray-900 w-[500px] px-5 py-4 rounded-lg">
        <div className="flex items-center justify-between text-xl">
          <h3>Update Profile</h3>
          <RxCrossCircled
            className="cursor-pointer"
            onClick={() => setOpenEditProfile(false)}
          />
        </div>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <input
            type="text"
            className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 max-w-[48%] pb-0.5"
            placeholder="Full Name"
            value={userData.fullName}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
          <input
            type="text"
            className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 max-w-[48%] pb-0.5"
            placeholder="Username"
            value={userData.username}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          <input
            type="text"
            className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 max-w-[48%] pb-0.5"
            placeholder="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <input
            type="text"
            className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 max-w-[48%] pb-0.5"
            placeholder="Bio"
            value={userData.bio}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
          <input
            type="text"
            className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 pb-0.5"
            placeholder="Link"
            value={userData.link}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, link: e.target.value }))
            }
          />
          {showChangePassword && (
            <input
              type="password"
              className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 max-w-[48%] pb-0.5"
              placeholder="Current Password"
              value={userData.currentPassword}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />
          )}
          {showChangePassword && (
            <input
              type="password"
              className="border-2 border-gray-700 rounded-lg h-9 w-full outline-none bg-transparent px-3 max-w-[48%] pb-0.5"
              placeholder="New Password"
              value={userData.newPassword}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          )}

          <button
            className="text-md text-gray-500"
            onClick={() => setShowChangePassword((prev) => !prev)}
          >
            Change your old password
          </button>
        </div>
        <button
          disabled={isUploading}
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-600 trasition-all w-full text-white py-1 mt-2 rounded-full mb-2"
        >
          {isUploading ? "Uploading..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
