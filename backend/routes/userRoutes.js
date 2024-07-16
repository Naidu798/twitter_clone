const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  userProfile,
  suggestedUsers,
  followUnfollowUser,
  updateProfile,
  followingUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile:username", protectRoute, userProfile);
router.get("/suggested", protectRoute, suggestedUsers);
router.get("/following", protectRoute, followingUsers);
router.put("/follow:id", protectRoute, followUnfollowUser);
router.put("/update-profile", protectRoute, updateProfile);

module.exports = router;
