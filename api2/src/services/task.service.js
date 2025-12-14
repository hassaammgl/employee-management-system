import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { NotificationService } from "./notification.service.js";
import { getIO } from "../config/socket.js";

export class TaskService {
	static async getAllTasks(filter = {}) {
		const tasks = await Task.find(filter).populate("assignedTo", "name email").sort({ createdAt: -1 });
		return tasks.map(task => this.formatTask(task));
	}

	static async createTask(data) {
		const task = new Task(data);
		await task.save();
        await task.populate("assignedTo", "name email");

        // Notify assigned employee
        if (data.assignedTo) {
            await NotificationService.createNotification({
                user: data.assignedTo,
                title: "New Task Assigned",
                message: `You have been assigned a new task: ${task.title}`,
                type: "info"
            });
            
            // Emit task:new event
            try {
                const io = getIO();
                const formattedTask = this.formatTask(task);
                io.to(data.assignedTo.toString()).emit("task:new", formattedTask);
            } catch (error) {
                console.error("Socket emit failed:", error.message);
            }
        }

		return this.formatTask(task);
	}

	static async updateTask(id, data) {
        const oldTask = await Task.findById(id);
		const task = await Task.findByIdAndUpdate(id, data, { new: true }).populate("assignedTo", "name email");
		if (!task) throw new AppError("Task not found", 404);

        // Notify admin if task is marked as completed
        if (data.completed === true && !oldTask.completed) {
            const admins = await User.find({ role: "admin" });
            const notifications = admins.map(admin => ({
                user: admin._id,
                title: "Task Completed",
                message: `${task.assignedTo?.name || "An employee"} completed the task: ${task.title}`,
                type: "success"
            }));
             Promise.all(notifications.map(n => NotificationService.createNotification(n))).catch(err => 
                console.error("Failed to send task completion notifications", err)
            );
        }

        // Emit task:updated event to assignee
        try {
            const io = getIO();
            const formattedTask = this.formatTask(task);
            if (task.assignedTo) {
                 io.to(task.assignedTo._id.toString()).emit("task:updated", formattedTask);
            }
        } catch (error) {
             console.error("Socket emit failed:", error.message);
        }

		return this.formatTask(task);
	}

	static async deleteTask(id) {
		const task = await Task.findByIdAndDelete(id);
		if (!task) throw new AppError("Task not found", 404);
        
        // Emit task:deleted event to assignee
        try {
            const io = getIO();
            if (task.assignedTo) {
                io.to(task.assignedTo.toString()).emit("task:deleted", id);
            }
        } catch (error) {
             console.error("Socket emit failed:", error.message);
        }

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
