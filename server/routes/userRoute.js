import express from "express";
import {
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
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/get-team", protect, getTeamList);
router.get("/notifications", protect, getNotificationsList);
router.get("/get-status", protect, getUserTaskStatus);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changeUserPassword);
router.put("/activate/:id", protect, activateUserProfile);
router.put("/read-noti", protect, markNotificationRead);
router.delete("/:id", protect, deleteUserProfile);

export default router;