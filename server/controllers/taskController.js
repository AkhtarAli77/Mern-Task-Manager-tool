import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Notice from "../models/notis.js";

// Create Task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, stage, date, team, assets } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      stage,
      date,
      team,
      assets,
      activities: [
        {
          type: "assigned",
          activity: `${req.user.name} assigned this task`,
          by: req.user._id,
        },
      ],
    });

    // Add task to users
    if (team && team.length > 0) {
      await User.updateMany(
        { _id: { $in: team } },
        { $push: { tasks: task._id } }
      );
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Duplicate Task
const duplicateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const originalTask = await Task.findById(id);

  if (!originalTask) {
    res.status(404);
    throw new Error("Task not found");
  }

  const newTask = await Task.create({
    title: `${originalTask.title} - Duplicate`,
    description: originalTask.description,
    priority: originalTask.priority,
    stage: "todo",
    date: new Date(),
    team: originalTask.team,
    assets: originalTask.assets,
    subTasks: originalTask.subTasks,
    activities: [
      {
        type: "assigned",
        activity: `${req.user.name} duplicated this task`,
        by: req.user._id,
      },
    ],
  });

  res.status(201).json(newTask);
});

// Post Task Activity
const postTaskActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, activity } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.activities.push({
    type,
    activity,
    by: req.user._id,
  });

  await task.save();

  res.status(200).json({ message: "Activity added successfully" });
});

// Trash Task
const trashTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.isTrashed = true;
  await task.save();

  res.status(200).json({ message: "Task moved to trash" });
});

// Change Task Stage
const changeTaskStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.stage = stage;
  await task.save();

  res.status(200).json({ message: "Stage updated successfully" });
});

// Delete or Restore Task
const deleteRestoreTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { actionType } = req.query;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (actionType === "delete") {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted permanently" });
  } else if (actionType === "restore") {
    task.isTrashed = false;
    await task.save();
    res.status(200).json({ message: "Task restored successfully" });
  }
});

// Update Task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, stage, date, team, assets, subTasks } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.priority = priority || task.priority;
  task.stage = stage || task.stage;
  task.date = date || task.date;
  task.team = team || task.team;
  task.assets = assets || task.assets;
  task.subTasks = subTasks || task.subTasks;

  await task.save();

  res.status(200).json(task);
});

// Get All Tasks
const getTasks = asyncHandler(async (req, res) => {
  const { stage, isTrashed, search } = req.query;

  let query = {};

  if (stage) {
    query.stage = stage;
  }

  if (isTrashed === "true") {
    query.isTrashed = true;
  } else if (isTrashed === "false") {
    query.isTrashed = false;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const tasks = await Task.find(query)
    .populate("team", "name title email")
    .sort({ createdAt: -1 });

  res.status(200).json(tasks);
});

// Get Single Task
const getSingleTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate("team", "name title email")
    .populate("activities.by", "name");

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(task);
});

// Create Sub Task
const createSubTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.subTasks.push({
    title,
    isCompleted: false,
  });

  await task.save();

  res.status(200).json(task);
});

// Change Sub Task Status
const changeSubTaskStatus = asyncHandler(async (req, res) => {
  const { id, subId } = req.params;
  const { isCompleted } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const subTask = task.subTasks.id(subId);
  subTask.isCompleted = isCompleted;

  await task.save();

  res.status(200).json(task);
});

// Get Dashboard Stats - FIXED (Sabko saare tasks dikhein)
const getDasboardStats = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;

  // ✅ FIXED: Sab tasks fetch karo (admin check hata diya)
  let query = {};

  const allTasks = await Task.find(query);
  const trashedTasks = await Task.find({ ...query, isTrashed: true });
  const completedTasks = await Task.find({ ...query, stage: "completed" });
  const inProgressTasks = await Task.find({ ...query, stage: "in progress" });
  const todoTasks = await Task.find({ ...query, stage: "todo" });

  // Graph data by priority
  const graphData = [
    { name: "High", value: await Task.countDocuments({ ...query, priority: "high" }) },
    { name: "Medium", value: await Task.countDocuments({ ...query, priority: "medium" }) },
    { name: "Normal", value: await Task.countDocuments({ ...query, priority: "normal" }) },
    { name: "Low", value: await Task.countDocuments({ ...query, priority: "low" }) },
  ];

  // Last 10 tasks
  const last10Task = await Task.find(query)
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("team", "name");

  // Users for admin only
  let users = [];
  if (isAdmin) {
    users = await User.find().select("name title role email isActive");
  }

  res.status(200).json({
    totalTasks: allTasks.length,
    trashedTasks: trashedTasks.length,
    tasks: {
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      todo: todoTasks.length,
    },
    graphData,
    last10Task,
    users,
  });
});

export {
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
};