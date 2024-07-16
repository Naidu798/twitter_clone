const User = require("../models/userModel");
const { v2 } = require("cloudinary");
const Post = require("../models/postModel");
const Notification = require("../models/notificationModel");
const cloudinary = v2;

const createPost = async (req, res) => {
  try {
    let { text, image } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    if (!text && !image) {
      throw Error("Post must have text or image");
    }

    const newPost = new Post({
      user: user._id,
      image: image || "",
      text: text || "",
    });
    const post = await newPost.save();

    res.json({
      message: "Post created successfully",
      data: post,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.body;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      throw Error("Post not found");
    }

    const userLikedPost = post.likes.includes(userId.toString());

    if (userLikedPost) {
      // unlike post
      await Post.findByIdAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } }
      );
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      res.json({
        message: "Post unliked successfully",
        type: "unlike",
        data: {},
        success: true,
        error: false,
      });
    } else {
      // like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await newNotification.save();

      res.json({
        message: "Post liked successfully",
        data: {},
        type: "like",
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

const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;

    if (!text) {
      throw Error("Text field is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw Error("Post not found");
    }

    post.comments.push({ user: userId, text });

    await post.save();

    res.json({
      message: "comment send successfully",
      data: {},
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    const post = await Post.findById(id);
    if (!post) {
      throw Error("Post not found");
    }

    if (user._id.toString() !== post.user.toString()) {
      throw Error("You don't have authorize to delete this post");
    }

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(id);

    res.json({
      message: "Post deleted successfully",
      data: {},
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.json({
      message: "Posts fetched successfully",
      data: allPosts.length === 0 ? [] : allPosts,
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

const getLikedPosts = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.json({
      message: "Liked posts fetched successfully",
      data: likedPosts,
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

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      throw Error("User not found");
    }

    const userPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-paasword",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.json({
      message: "User posts fetched successfuly",
      data: userPosts,
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

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    const following = user.following;
    const followingPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.json({
      message: "Following posts fetched successfully",
      data: followingPosts,
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
  createPost,
  likeUnlikePost,
  commentOnPost,
  deletePost,
  getAllPosts,
  getLikedPosts,
  getUserPosts,
  getFollowingPosts,
};
