import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
	createEmployeeSchema,
	updateEmployeeSchema,
} from "../validations/employee.validation.js";
import { employee } from "../controllers/employee.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/", protect, employee.getAllEmployees);
router.get("/:id", protect, employee.getEmployeeById);
router.post(
	"/",
	protect,
	validateRequest(createEmployeeSchema),
	employee.createEmployee
);
router.put(
	"/:id",
	protect,
	validateRequest(updateEmployeeSchema),
	employee.updateEmployee
);
router.delete("/:id", protect, employee.deleteEmployee);

export default router;
