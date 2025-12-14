import express from "express";
import {
	getAllNotifications,
	markAsRead,
    markAllAsRead,
	deleteNotification
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getAllNotifications);

router.route("/mark-all-read")
    .patch(markAllAsRead);

router.route("/:id")
    .patch(markAsRead)
    .delete(deleteNotification);

export default router;
