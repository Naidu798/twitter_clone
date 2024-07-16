const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const gerateTokenAndSetCookie = require("../lib/utils/generateTokenAndSetCookie");

const signup = async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw Error("Invalid email format");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw Error("Username is already taken");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw Error("Email is already taken");
    }

    if (password.length < 6) {
      throw Error("Password must have at least 6 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      gerateTokenAndSetCookie(newUser._id, res);

      await newUser.save();
      const user = {
        _id: newUser._id,
        username,
        fullName,
        email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
      };

      res.status(201).json({
        message: "Signup successfull",
        data: user,
        success: true,
        error: false,
      });
    } else {
      throw Error("User data invalid");
    }
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw Error("Please provide username");
    } else if (!password) {
      throw Error("Password field is required");
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      throw Error("Invalid username or password");
    }

    gerateTokenAndSetCookie(user._id, res);
    const loginUser = {
      _id: user._id,
      username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    };

    res.status(200).json({
      message: "Login successfull",
      data: loginUser,
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

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfull",
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

const getMe = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id).select("-password")
    const user = req.user;
    res.status(200).json({
      message: "User details fetched successfull",
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

module.exports = { signup, login, logout, getMe };
