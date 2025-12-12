import { Server } from "socket.io";
import { ENVS } from "../utils/constants.js";
import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";

let io;

export const initSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: [
				ENVS.CLIENT_ORIGIN || "http://localhost:5173",
				"http://localhost:5173",
				"http://127.0.0.1:5173",
			],
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		},
	});

	// Middleware for authentication
	io.use((socket, next) => {
		try {
			const cookies = cookie.parse(socket.handshake.headers.cookie || "");
			const token = cookies.accessToken;

			if (!token) {
				return next(new Error("Authentication error: No token provided"));
			}

			const decoded = jwt.verify(token, ENVS.JWT_SECRET);
			socket.user = decoded;
			next();
		} catch (err) {
			logger.error(`Socket auth error: ${err.message}`);
			next(new Error("Authentication error: Invalid token"));
		}
	});

	io.on("connection", (socket) => {
		logger.info(`New socket connection: ${socket.id} (User: ${socket.user.id})`);

		// Join user to their own room
		socket.join(socket.user.id);

		socket.on("disconnect", () => {
			logger.info(`Socket disconnected: ${socket.id}`);
		});
	});

	return io;
};

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};
