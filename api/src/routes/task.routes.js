import express from "express";
import {
	getAllTasks,
	createTask,
	updateTask,
	deleteTask,
    getTaskById
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getAllTasks)
    .post(createTask);

router.route("/:id")
    .get(getTaskById)
    .patch(updateTask)
    .delete(deleteTask);

export default router;
