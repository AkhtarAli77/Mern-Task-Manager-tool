import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ Pehle Authorization header check karo
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // ✅ Agar nahi mila, to cookie mein check karo
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };