import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import {
	registerUser,
	loginUser,
	logoutUser,
    getCurrentUser,
    refreshTokens,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.post("/refresh", refreshTokens);

export default router;
