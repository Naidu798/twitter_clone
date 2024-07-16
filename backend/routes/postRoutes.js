const protectRoute = require("../middleware/protectRoute");
const {
  createPost,
  likeUnlikePost,
  commentOnPost,
  deletePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} = require("../controllers/postController");

const express = require("express");

const router = express.Router();

router.get("/user:username", protectRoute, getUserPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes:id", protectRoute, getLikedPosts);
router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.put("/like", protectRoute, likeUnlikePost);
router.put("/comment:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

module.exports = router;
