import express from "express";
import { protect as verifyJWT } from "../middlewares/auth.middlewares.js";
import {
	getChats,
	getMessages,
	sendMessage,
	createDM,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getChats);
router.post("/dm", createDM);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);

export default router;
