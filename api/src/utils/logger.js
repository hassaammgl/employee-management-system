import { ENVS } from "./constants.js";
import colors from "colors";

class Logger {
	constructor(scope = "APP") {
		this.scope = scope.toUpperCase();
	}

	#_format(level, message, colorFn) {
		const tag = `[${this.scope}]`.magenta.bold;
		const lvl = `[${level}]`[colorFn];
		return `${tag} ${lvl} ${message}`;
	}

	info(message) {
		console.log(this.#_format("INFO", message, "cyan"));
	}

	success(message) {
		console.log(this.#_format("SUCCESS", message, "green"));
	}

	warn(message) {
		console.warn(this.#_format("WARN", message, "yellow"));
	}

	error(message) {
		console.error(this.#_format("ERROR", message, "red"));
	}

	debug(message) {
		if (ENVS.DEBUG === "true") {
			console.log(this.#_format("DEBUG", message, "blue"));
		}
	}

	custom(level, message, color = "white") {
		console.log(this.#_format(level.toUpperCase(), message, color));
	}
}

export const logger = new Logger("Server");
// log.custom("event", "User signed in", "rainbow");
