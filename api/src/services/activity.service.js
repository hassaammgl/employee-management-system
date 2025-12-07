import Activity from "../models/activity.model.js";

export class ActivityService {
	static async getAllActivities() {
		const activities = await Activity.find()
            .populate("user", "name")
            .sort({ occurredAt: -1 })
            .limit(50);
		return activities.map(act => this.formatActivity(act));
	}

    static async logActivity(userId, action, type = "general", metadata = {}) {
        try {
            const activity = new Activity({
                user: userId,
                action,
                type,
                metadata
            });
            await activity.save();
            return activity;
        } catch (error) {
            console.error("Failed to log activity:", error);
            // Don't throw, activity logging should not block main flow
        }
    }

	static formatActivity(act) {
		return {
			id: act._id,
			action: act.action,
			user: act.user?.name || "System",
			type: act.type,
			timestamp: act.occurredAt
		};
	}
}
