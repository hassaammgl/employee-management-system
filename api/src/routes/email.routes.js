import { Router } from "express";
import { protect } from "../middlewares/auth.middlewares.js";
import { emailController } from "../controllers/email.controller.js";

const router = Router();

router.use(protect);

router.post("/send", emailController.sendEmail);
router.get("/inbox", emailController.getInbox);
router.get("/sent", emailController.getSent);
router.put("/:id/read", emailController.markAsRead);
router.delete("/:id", emailController.deleteEmail);

export default router;
