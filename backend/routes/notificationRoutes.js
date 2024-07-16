const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  getAllNotifications,
  deleteAllNotifications,
  updateNotificationStatus,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/all", protectRoute, getAllNotifications);
router.delete("/", protectRoute, deleteAllNotifications);
router.put("/update-status", protectRoute, updateNotificationStatus);

module.exports = router;
