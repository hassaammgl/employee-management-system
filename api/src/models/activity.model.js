import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    action: {
      type: String,
      required: true
    },
    metadata: { type: Object },
    type: {
      type: String,
      enum: ["employee", "department", "profile", "leave", "general"],
      default: "general"
    },
    occurredAt: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;


