import asyncHandler from "express-async-handler";
import { ActivityService } from "../services/activity.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllActivities = asyncHandler(async (req, res) => {
	const activities = await ActivityService.getAllActivities();
	return ApiResponse.success(res, {
		message: "Activities fetched successfully",
		data: activities,
	});
});
