import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENVS } from "./utils/constants.js";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import taskRoutes from "./routes/task.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import { createServer } from "node:http";
import chatRoutes from "./routes/chat.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();
export const httpServer = createServer(app);

// CORS configuration - must be before other middleware
const allowedOrigins = [
	ENVS.CLIENT_ORIGIN || "http://localhost:5173",
	"http://localhost:5173",
	"http://127.0.0.1:5173",
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control"],
		exposedHeaders: ["Set-Cookie"],
		optionsSuccessStatus: 200,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Hello World",
	});
});

// auth routes
app.use("/api", authRoutes);

// employee routes
app.use("/api/employees", employeeRoutes);

// department routes
app.use("/api/departments", departmentRoutes);

// task routes
app.use("/api/tasks", taskRoutes);

// notification routes
app.use("/api/notifications", notificationRoutes);

// activity routes
app.use("/api/activities", activityRoutes);

// leave routes
app.use("/api/leaves", leaveRoutes);

// announcement routes
app.use("/api/announcements", announcementRoutes);

// chat routes
app.use("/api/chat", chatRoutes);

// email routes
app.use("/api/emails", emailRoutes);

// error handlers
app.use(errorHandler);

app.use((req, res, next) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

export default app;
