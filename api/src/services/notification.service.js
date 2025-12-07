import Notification from "../models/notification.model.js";
import { AppError } from "../utils/AppError.js";

export class NotificationService {
	static async getAllNotifications(userId) {
		const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
		return notifications.map(notif => this.formatNotification(notif));
	}

    static async createNotification(data) {
        const notification = new Notification(data);
        await notification.save();
        return this.formatNotification(notification);
    }

	static async markAsRead(id, userId) {
		const notification = await Notification.findOneAndUpdate(
			{ _id: id, user: userId },
			{ read: true },
			{ new: true }
		);
		if (!notification) throw new AppError("Notification not found", 404);
		return this.formatNotification(notification);
	}

    static async markAllAsRead(userId) {
        await Notification.updateMany({ user: userId, read: false }, { read: true });
        return { message: "All notifications marked as read" };
    }

	static async deleteNotification(id, userId) {
		const notification = await Notification.findOneAndDelete({ _id: id, user: userId });
		if (!notification) throw new AppError("Notification not found", 404);
		return { message: "Notification deleted successfully" };
	}

	static formatNotification(notif) {
		return {
			id: notif._id,
			title: notif.title,
			message: notif.message,
			type: notif.type,
			read: notif.read,
			date: notif.createdAt
		};
	}
}
