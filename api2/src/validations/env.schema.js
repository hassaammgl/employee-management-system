import Joi from "joi";

export const envSchema = Joi.object({
	PORT: Joi.number()
		.default(5000)
		.messages({ "number.base": "PORT must be a number" }),

	MONGO_URI: Joi.string()
		.uri({ scheme: ["mongodb", "mongodb+srv"] })
		.required()
		.messages({
			"string.uri": "MONGO_URI must be a valid MongoDB connection string",
			"any.required": "MONGO_URI is required",
		}),

	CLIENT_ORIGIN: Joi.string()
		.uri({ scheme: ["http", "https"] })
		.required()
		.messages({
			"string.uri":
				"CLIENT_ORIGIN must be a valid URL (e.g. http://localhost:3000)",
			"any.required": "CLIENT_ORIGIN is required",
		}),
	NODE_ENV: Joi.string()
		.valid("development", "production")
		.default("development"),

	JWT_SECRET: Joi.string().min(32).required().messages({
		"string.min": "JWT_SECRET must be at least 32 characters",
		"any.required": "JWT_SECRET is required",
	}),

	JWT_REFRESH_SECRET: Joi.string().min(32).required().messages({
		"string.min": "JWT_REFRESH_SECRET must be at least 32 characters",
		"any.required": "JWT_REFRESH_SECRET is required",
	}),

	DEBUG: Joi.string().valid("true", "false").default("false"),
})
	.unknown(false)
	.required();
