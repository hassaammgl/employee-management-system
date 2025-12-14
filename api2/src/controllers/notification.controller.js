import asyncHandler from "express-async-handler";
import { NotificationService } from "../services/notification.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllNotifications = asyncHandler(async (req, res) => {
	const notifications = await NotificationService.getAllNotifications(req.user._id);
	return ApiResponse.success(res, {
		message: "Notifications fetched successfully",
		data: notifications,
	});
});

export const markAsRead = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const notification = await NotificationService.markAsRead(id, req.user._id);
	return ApiResponse.success(res, {
		message: "Notification marked as read",
		data: notification,
	});
});

export const markAllAsRead = asyncHandler(async (req, res) => {
    await NotificationService.markAllAsRead(req.user._id);
    return ApiResponse.success(res, {
        message: "All notifications marked as read"
    });
});

export const deleteNotification = asyncHandler(async (req, res) => {
	const { id } = req.params;
	await NotificationService.deleteNotification(id, req.user._id);
	return ApiResponse.success(res, {
		message: "Notification deleted successfully",
	});
});
