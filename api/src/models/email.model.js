import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            trim: true,
            required: [true, "Subject is required"],
        },
        body: {
            type: String,
            trim: true,
            required: [true, "Body is required"],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        deletedBySender: {
            type: Boolean,
            default: false,
        },
        deletedByRecipient: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);
export default Email;
