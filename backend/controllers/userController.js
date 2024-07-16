const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const bcrypt = require("bcrypt");
const { v2 } = require("cloudinary");
let cloudinary = v2;

const userProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      throw Error("User not found");
    }

    res.json({
      message: "User profile fetched successfull",
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      throw Error("You can't follow/unfollow yourself!");
    }

    const currentUser = await User.findById(req.user._id).select("-password");
    const userToModify = await User.findById(id).select("-password");

    if (!currentUser || !userToModify) {
      throw Error("User not found");
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow the user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });

      res.json({
        message: `You unfollowed @${userToModify?.username}`,
        data: {},
        success: true,
        error: false,
      });
    } else {
      // follw the user
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });

      const notification = new Notification({
        from: currentUser._id,
        to: userToModify._id,
        type: "follow",
      });
      await notification.save();

      res.json({
        message: `You followed @${userToModify?.username}`,
        data: {},
        success: true,
        error: false,
      });
    }
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const suggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = req.user.following;
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.json({
      message: "Suggested users fetched successfully",
      data: suggestedUsers,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;

    let user = await User.findById(req.user._id);
    if (!user) {
      throw Error("User not found");
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw Error("Invalid email format");
      }
    }

    if (currentPassword || newPassword) {
      if (
        (!currentPassword && newPassword) ||
        (currentPassword && !newPassword)
      ) {
        throw Error("Please provide both current password and new password");
      } else {
        const isCurrentPasswordCorrect = await bcrypt.compare(
          currentPassword || "",
          user.password
        );
        if (!isCurrentPasswordCorrect) {
          throw Error("Current password is incorrect");
        }

        if (newPassword.length < 6) {
          throw Error("Password must be 6 characters long");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
      }
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
    }

    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    res.json({
      message: "Profile updated successfully",
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const followingUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    const followingUsers = await User.find({
      _id: { $in: user.following },
    }).select("-password");

    res.json({
      message: "Following users fetched successfully",
      data: followingUsers || [],
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = {
  userProfile,
  followUnfollowUser,
  suggestedUsers,
  updateProfile,
  followingUsers,
};
