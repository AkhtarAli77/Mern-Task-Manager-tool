import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";

// POST - Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user?.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    const token = createJWT(res, user._id);
    
    user.password = undefined;

    res.status(200).json({
      user: user,
      token: token
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }
});

// POST - Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, title } = req.body;

  console.log("Register request:", { name, email, password, role, title });

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ status: false, message: "Email address already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
    title: title || "Team Member",
  });

  if (user) {
    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "User created successfully",
      user: user
    });
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }
});

// POST - Logout
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// GET - Team list
const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  const users = await User.find(query).select("name title role email isActive");
  res.status(200).json(users);
});

// GET - Notifications
const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notice = await Notice.find({
    team: userId,
    isRead: { $nin: [userId] },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(200).json(notice);
});

// GET - User task status
const getUserTaskStatus = asyncHandler(async (req, res) => {
  const users = await User.find()
    .populate("tasks", "title stage")
    .sort({ _id: -1 });

  res.status(200).json(users);
});

// PUT - Mark notification as read
const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } }
      );
    }
    res.status(200).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// PUT - Update profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id = isAdmin && userId === _id ? userId : isAdmin && userId !== _id ? _id : userId;

  const user = await User.findById(id);

  if (user) {
    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({
      status: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// PUT - Activate/deactivate user
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (user) {
    user.isActive = req.body.isActive;
    await user.save();

    res.status(200).json({
      status: true,
      message: `User account has been ${user?.isActive ? "activated" : "disabled"}`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// PUT - Change password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (user) {
    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password changed successfully.",
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

// DELETE - Delete user
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(200).json({ status: true, message: "User deleted successfully" });
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
};