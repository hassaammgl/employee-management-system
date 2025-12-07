import asyncHandler from "express-async-handler";
import { TaskService } from "../services/task.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllTasks = asyncHandler(async (req, res) => {
	const tasks = await TaskService.getAllTasks();
	return ApiResponse.success(res, {
		message: "Tasks fetched successfully",
		data: tasks,
	});
});

export const createTask = asyncHandler(async (req, res) => {
	const task = await TaskService.createTask(req.body);
	return ApiResponse.success(res, {
		statusCode: 201,
		message: "Task created successfully",
		data: task,
	});
});

export const updateTask = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const task = await TaskService.updateTask(id, req.body);
	return ApiResponse.success(res, {
		message: "Task updated successfully",
		data: task,
	});
});

export const deleteTask = asyncHandler(async (req, res) => {
	const { id } = req.params;
	await TaskService.deleteTask(id);
	return ApiResponse.success(res, {
		message: "Task deleted successfully",
	});
});

export const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const task = await TaskService.getTaskById(id);
    return ApiResponse.success(res, {
        message: "Task fetched successfully",
        data: task
    });
});
