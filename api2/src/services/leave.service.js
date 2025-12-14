import { Leave } from "../models/leave.model.js";
import { AppError } from "../utils/AppError.js";

export class LeaveService {
    static async applyLeave(userId, leaveData) {
        const leave = await Leave.create({
            ...leaveData,
            employee: userId
        });
        return leave;
    }

    static async getEmployeeLeaves(userId) {
        return await Leave.find({ employee: userId }).sort({ createdAt: -1 });
    }

    static async getAllLeaves() {
        return await Leave.find().populate("employee", "name email department").sort({ createdAt: -1 });
    }

    static async updateLeaveStatus(leaveId, status) {
        const leave = await Leave.findByIdAndUpdate(
            leaveId, 
            { status }, 
            { new: true }
        );
        
        if (!leave) {
            throw new AppError("Leave request not found", 404);
        }

        return leave;
    }

    static async deleteLeave(leaveId) {
        const leave = await Leave.findByIdAndDelete(leaveId);
        if(!leave) throw new AppError("Leave request not found", 404);
        return leave;
    }
}
