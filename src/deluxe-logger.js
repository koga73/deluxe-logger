/*
 * AJ Savino
 * December 2025
 */
import Level from "./level.js";
import Output from "./output.js";
import Token from "./token.js";

import ConsoleOutput from "./output/console-output.js";
import FileOutput from "./output/file-output.js";
import MemoryOutput, {MemoryItem} from "./output/memory-output.js";

export const OUTPUT = {
	CONSOLE: 1 << 0,
	FILE: 1 << 1,
	MEMORY: 1 << 2
};

class DeluxeLogger {
	static DEFAULT_OUTPUT = {
		CONSOLE: new ConsoleOutput({id: OUTPUT.CONSOLE}),
		FILE: new FileOutput({id: OUTPUT.FILE, filePath: "./logs"})
	};

	//Singleton for ease-of-use global logger
	static _instance = null;
	static getInstance(options) {
		if (!DeluxeLogger._instance) {
			DeluxeLogger._instance = new DeluxeLogger(options);
		} else if (options) {
			throw new Error("DeluxeLogger instance already created");
		}
		return DeluxeLogger._instance;
	}

	constructor({outputs = null, clear = true} = {}) {
		this.outputs = outputs || Object.values(DeluxeLogger.DEFAULT_OUTPUT);

		const methods = this.outputs.flatMap((output) => output.levels.map((level) => level.name.toLowerCase()));
		for (const method of methods) {
			this[method] = ((...args) => {
				for (const output of this.outputs) {
					if (output.levels.some((level) => level.name.toLowerCase() === method)) {
						output[method](...args);
					}
				}
			}).bind(this);
		}

		if (clear) {
			this.clear();
		}
	}

	getOutput(id) {
		return this.outputs.find((output) => output.id === id) || null;
	}

	flush() {
		for (const output of this.outputs) {
			if (typeof output.flush === "function") {
				output.flush();
			}
		}
	}

	clear() {
		for (const output of this.outputs) {
			if (typeof output.clear === "function") {
				output.clear();
			}
		}
	}
}
export default DeluxeLogger;

export {Token, Level, Output};
export {ConsoleOutput, FileOutput, MemoryOutput, MemoryItem};
