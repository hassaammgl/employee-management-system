import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENVS } from "./utils/constants.js";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: ENVS.CLIENT_ORIGIN,
		credentials: true,
	})
);
app.use(morgan("combined"));

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Hello World",
	});
});
// auth routes
app.use("/api/auth", authRoutes);

// error handlers
app.use(errorHandler);

app.use((req, res, next) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

export default app;
