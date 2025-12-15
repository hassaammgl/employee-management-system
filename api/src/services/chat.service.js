import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import EmployeeProfile from "../models/employee.model.js";
import { AppError } from "../utils/AppError.js";
import { getIO } from "../config/socket.js";
import mongoose from "mongoose";

export class ChatService {
	static async getChats(userId) {
		// Ensure department group exists for the user
		await this.ensureDepartmentGroup(userId);

		const conversations = await Conversation.find({
			members: userId,
		})
			.populate("members", "name email avatar")
			.populate("department", "name")
			.populate("lastMessage")
			.sort({ updatedAt: -1 });

		return conversations;
	}

	static async getMessages(conversationId, userId) {
        // Verify membership
		const conversation = await Conversation.findOne({
			_id: conversationId,
			members: userId,
		});

		if (!conversation) throw new AppError("Conversation not found or access denied", 404);

		const messages = await Message.find({ conversation: conversationId })
			.populate("sender", "name email avatar")
			.sort({ createdAt: 1 });

		return messages;
	}

	static async sendMessage(userId, conversationId, content) {
		const conversation = await Conversation.findOne({
			_id: conversationId,
			members: userId,
		});

		if (!conversation) throw new AppError("Conversation not found", 404);

		const message = new Message({
			conversation: conversationId,
			sender: userId,
			content,
			readBy: [userId],
		});

		await message.save();
        await message.populate("sender", "name email avatar");

		// Update conversation last message
		conversation.lastMessage = message._id;
		await conversation.save();

		// Emit socket event to all members
		try {
			const io = getIO();
            conversation.members.forEach(memberId => {
                 io.to(memberId.toString()).emit("message:new", message);
            });
		} catch (error) {
			console.error("Socket emit failed:", error);
		}

		return message;
	}

	static async createDM(userId, targetUserId) {
		if (userId === targetUserId) throw new AppError("Cannot chat with yourself", 400);

		// Check if conversation already exists
		let conversation = await Conversation.findOne({
			isGroup: false,
			members: { $all: [userId, targetUserId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				members: [userId, targetUserId],
				isGroup: false,
			});
			await conversation.save();
		}
        
        await conversation.populate("members", "name email avatar");
		return conversation;
	}

	static async ensureDepartmentGroup(userId) {
		const employee = await EmployeeProfile.findOne({ user: userId });
		if (!employee || !employee.department) return;

		const departmentId = employee.department;

		// Check if group exists for this department
		let group = await Conversation.findOne({
			department: departmentId,
			isGroup: true,
		});

		if (!group) {
            // Fetch department name for group name
            // Assuming we might need to populate department to get name if not stored
            // But we can just create it and let population handle display
			group = new Conversation({
				department: departmentId,
				isGroup: true,
                // Name will be handled on frontend or populated via department
                members: [] // We will add members dynamically or rely on logic
			});
            await group.save();
		}

        // Add user to members if not present
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }
	}
}
