import asyncHandler from "express-async-handler";
import Email from "../models/email.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import User from "../models/user.model.js";

class EmailController {
    // Send an email
    sendEmail = asyncHandler(async (req, res) => {
        const { recipientId, subject, body } = req.body;

        if (!recipientId || !subject || !body) {
            throw new AppError("All fields are required", 400);
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            throw new AppError("Recipient not found", 404);
        }

        const email = await Email.create({
            sender: req.user._id,
            recipient: recipientId,
            subject,
            body,
        });

        return ApiResponse.success(res, {
            statusCode: 201,
            message: "Email sent successfully",
            data: email,
        });
    });

    // Get inbox (emails sent to me)
    getInbox = asyncHandler(async (req, res) => {
        const emails = await Email.find({
            recipient: req.user._id,
            deletedByRecipient: false,
        })
            .populate("sender", "name email avatar")
            .sort({ createdAt: -1 });

        return ApiResponse.success(res, {
            message: "Inbox fetched successfully",
            data: emails,
        });
    });

    // Get sent box (emails sent by me)
    getSent = asyncHandler(async (req, res) => {
        const emails = await Email.find({
            sender: req.user._id,
            deletedBySender: false,
        })
            .populate("recipient", "name email avatar")
            .sort({ createdAt: -1 });

        return ApiResponse.success(res, {
            message: "Sent emails fetched successfully",
            data: emails,
        });
    });

    // Mark email as read
    markAsRead = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const email = await Email.findOne({
            _id: id,
            recipient: req.user._id,
        });

        if (!email) {
            throw new AppError("Email not found", 404);
        }

        email.isRead = true;
        await email.save();

        return ApiResponse.success(res, {
            message: "Email marked as read",
            data: email,
        });
    });

    // Delete email (Soft delete)
    deleteEmail = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id.toString();

        const email = await Email.findById(id);
        if (!email) {
            throw new AppError("Email not found", 404);
        }

        if (email.sender.toString() === userId) {
            email.deletedBySender = true;
        } else if (email.recipient.toString() === userId) {
            email.deletedByRecipient = true;
        } else {
            throw new AppError("Not authorized to delete this email", 403);
        }

        await email.save();

        return ApiResponse.success(res, {
            message: "Email deleted successfully",
        });
    });
}

export const emailController = new EmailController();
