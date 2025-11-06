import dotenv from "dotenv";
dotenv.config();

export const ENVS = {
	PORT: process.env.PORT || 5000,
	MONGO_URI: process.env.MONGO_URI,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
	NODE_ENV: process.env.NODE_ENV || "development",
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	DEBUG: process.env.DEBUG || "false",
};
