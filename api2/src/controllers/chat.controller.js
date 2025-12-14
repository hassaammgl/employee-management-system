import asyncHandler from "express-async-handler";
import { ChatService } from "../services/chat.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getChats = asyncHandler(async (req, res) => {
	const chats = await ChatService.getChats(req.user._id);
	return ApiResponse.success(res, {
		message: "Chats fetched successfully",
		data: chats,
	});
});

export const getMessages = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const messages = await ChatService.getMessages(id, req.user._id);
	return ApiResponse.success(res, {
		message: "Messages fetched successfully",
		data: messages,
	});
});

export const sendMessage = asyncHandler(async (req, res) => {
	const { id } = req.params; // Conversation ID
	const { content } = req.body;
	const message = await ChatService.sendMessage(req.user._id, id, content);
	return ApiResponse.success(res, {
		message: "Message sent successfully",
		data: message,
	});
});

export const createDM = asyncHandler(async (req, res) => {
	const { targetUserId } = req.body;
	const conversation = await ChatService.createDM(req.user._id, targetUserId);
	return ApiResponse.success(res, {
		message: "Conversation created/fetched successfully",
		data: conversation,
	});
});
