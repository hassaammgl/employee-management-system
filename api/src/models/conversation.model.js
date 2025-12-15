import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		isGroup: {
			type: Boolean,
			default: false,
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		department: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Department",
		},
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
