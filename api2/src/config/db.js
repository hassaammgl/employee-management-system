import mongoose from "mongoose";
import { ENVS } from "../utils/constants.js";
import { logger } from "../utils/logger.js";

const connectDb = async () => {
	try {
		const conn = await mongoose.connect(ENVS.MONGO_URI);
		logger.debug(
			`MongoDB Connected: ${conn?.connection?.db?.databaseName}`
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

export default connectDb;
