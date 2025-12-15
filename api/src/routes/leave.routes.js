import express from "express";
import { LeaveController } from "../controllers/leave.controller.js";
import { protect, admin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(protect);

router.post("/", LeaveController.applyLeave);
router.get("/my-leaves", LeaveController.getMyLeaves);

// Admin routes
router.get("/", admin, LeaveController.getAllLeaves);
router.patch("/:id/status", admin, LeaveController.updateStatus);
router.delete("/:id", LeaveController.deleteLeave);

export default router;
