import express from "express";
import { getAllActivities } from "../controllers/activity.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getAllActivities);

export default router;
