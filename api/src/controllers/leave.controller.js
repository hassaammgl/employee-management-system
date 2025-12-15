import { LeaveService } from "../services/leave.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";

export class LeaveController {
    static applyLeave = asyncHandler(async (req, res) => {
        const leave = await LeaveService.applyLeave(req.user._id, req.body);
        ApiResponse.success(res, {
            statusCode: 201,
            message: "Leave application submitted successfully",
            data: leave
        });
    });

    static getMyLeaves = asyncHandler(async (req, res) => {
        const leaves = await LeaveService.getEmployeeLeaves(req.user._id);
        ApiResponse.success(res, {
            message: "Leaves fetched successfully",
            data: leaves
        });
    });

    static getAllLeaves = asyncHandler(async (req, res) => {
        const leaves = await LeaveService.getAllLeaves();
        ApiResponse.success(res, {
            message: "All leaves fetched successfully",
            data: leaves
        });
    });

    static updateStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const leave = await LeaveService.updateLeaveStatus(id, status);
        ApiResponse.success(res, {
            message: `Leave ${status} successfully`,
            data: leave
        });
    });

    static deleteLeave = asyncHandler(async (req, res) => {
        await LeaveService.deleteLeave(req.params.id);
        ApiResponse.success(res, {
            message: "Leave request deleted successfully"
        });
    });
}
