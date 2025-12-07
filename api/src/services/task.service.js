import Task from "../models/task.model.js";
import { AppError } from "../utils/AppError.js";

export class TaskService {
	static async getAllTasks() {
		const tasks = await Task.find().populate("assignedTo", "name email").sort({ createdAt: -1 });
		return tasks.map(task => this.formatTask(task));
	}

	static async createTask(data) {
		const task = new Task(data);
		await task.save();
        await task.populate("assignedTo", "name email");
		return this.formatTask(task);
	}

	static async updateTask(id, data) {
		const task = await Task.findByIdAndUpdate(id, data, { new: true }).populate("assignedTo", "name email");
		if (!task) throw new AppError("Task not found", 404);
		return this.formatTask(task);
	}

	static async deleteTask(id) {
		const task = await Task.findByIdAndDelete(id);
		if (!task) throw new AppError("Task not found", 404);
		return { message: "Task deleted successfully" };
	}

    static async getTaskById(id) {
        const task = await Task.findById(id).populate("assignedTo", "name email");
        if (!task) throw new AppError("Task not found", 404);
        return this.formatTask(task);
    }

	static formatTask(task) {
		return {
			id: task._id,
			title: task.title,
			description: task.description,
			completed: task.completed,
			dueDate: task.dueDate,
			priority: task.priority,
            assignedTo: task.assignedTo,
            createdAt: task.createdAt
		};
	}
}
