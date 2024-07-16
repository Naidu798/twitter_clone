const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw Error("Unauthorized: you need to login first");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw Error("Unauthorized: Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = protectRoute;
