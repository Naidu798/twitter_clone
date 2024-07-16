const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    let notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "-password",
    });

    // notifications = notifications.map((ntf) => ({ ...ntf, read: true }));

    res.json({
      message: "Notifications fetched successfully",
      data: notifications,
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

const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    await Notification.deleteMany({ to: userId });

    res.json({
      message: "All notifications deleted successfully",
      data: {},
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

const updateNotificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    await Notification.updateMany({ to: userId }, { read: true });

    res.json({
      message: "All notifications status upadated successfully",
      data: {},
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
  getAllNotifications,
  deleteAllNotifications,
  updateNotificationStatus,
};
