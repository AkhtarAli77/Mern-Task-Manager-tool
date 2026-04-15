import mongoose from "mongoose";

const subTaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    stage: {
      type: String,
      required: true,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    assets: [String],
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isTrashed: {
      type: Boolean,
      default: false,
    },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: ["assigned", "started", "in progress", "bug", "completed"],
        },
        activity: String,
        date: {
          type: Date,
          default: Date.now,
        },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    subTasks: [subTaskSchema],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;