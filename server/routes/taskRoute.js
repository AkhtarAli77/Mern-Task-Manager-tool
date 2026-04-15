import express from "express";
import {
  createTask,
  duplicateTask,
  postTaskActivity,
  trashTask,
  changeTaskStage,
  deleteRestoreTask,
  updateTask,
  getTasks,
  getSingleTask,
  createSubTask,
  changeSubTaskStatus,
  getDasboardStats,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTask);
router.post("/duplicate/:id", protect, duplicateTask);
router.post("/activity/:id", protect, postTaskActivity);

router.put("/update/:id", protect, updateTask);
router.put("/:id", protect, trashTask);
router.put("/change-stage/:id", protect, changeTaskStage);
router.put("/change-status/:id/:subId", protect, changeSubTaskStatus);
router.put("/create-subtask/:id", protect, createSubTask);

router.delete("/delete-restore/:id", protect, deleteRestoreTask);

router.get("/", protect, getTasks);
router.get("/dashboard", protect, getDasboardStats);
router.get("/:id", protect, getSingleTask);

export default router;