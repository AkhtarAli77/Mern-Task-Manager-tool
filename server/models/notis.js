import mongoose from "mongoose";

const noticeSchema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    text: {
      type: String,
    },
    isRead: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;