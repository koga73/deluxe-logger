import util from "util";

import Token from "./token.js";

class Level {
	static ID = {
		DEBUG: 0,
		INFO: 1,
		LOG: 2,
		WARN: 3,
		ERROR: 4
	};
	static NAME = {
		DEBUG: "debug",
		INFO: "info",
		LOG: "log",
		WARN: "warn",
		ERROR: "error"
	};

	static DEFAULT_FORMAT = {
		MESSAGE: `${Token.MESSAGE}`, //message
		TIMESTAMP: "YYYY-MM-DD HH:mm:ss.SSS", //2025-12-11 11:20:38.533
		OBJECT: {
			[Error.name]: `${Token.MESSAGE}\n${Token.STACK}\n` //message\nstack
		}
	};

	constructor({
		id,
		name,
		formatMessage = Level.DEFAULT_FORMAT.MESSAGE,
		formatTimestamp = Level.DEFAULT_FORMAT.TIMESTAMP,
		formatObject = Level.DEFAULT_FORMAT.OBJECT,
		indentNewLine = true
	} = {}) {
		this.id = id;
		this.name = name;
		this.formatMessage = formatMessage;
		this.formatTimestamp = formatTimestamp;
		this.formatObject = formatObject;
		this.indentNewLine = indentNewLine;
	}

	format(...args) {
		return Level._formatMessage(this, ...args);
	}

	toString() {
		return this.name.toUpperCase();
	}

	static _formatMessage(level, ...args) {
		const {name, formatMessage, formatTimestamp, indentNewLine} = level;

		const formattedArgs = args.reduce((args, arg) => {
			if (typeof arg === "function") {
				args.push(this._formatObject(level, arg));
			} else {
				args.push(arg);
			}
			return args;
		}, []);

		let output = formatMessage;
		if (formatMessage.indexOf(Token.TIMESTAMP) !== -1) {
			output = output.replace(Token.TIMESTAMP, Level._formatTimestamp(level));
		}
		if (formatMessage.indexOf(Token.LEVEL) !== -1) {
			output = output.replace(Token.LEVEL, name.toUpperCase());
		}

		// Grab index of where message starts while ignoring ANSI color codes
		const messageIndex = output.replace(/\x1b\[\d+m/g, "").indexOf(Token.MESSAGE) - 1;
		if (formatMessage.indexOf(Token.MESSAGE) !== -1) {
			output = output.replace(Token.MESSAGE, util.format(...formattedArgs));
		}

		if (messageIndex > 0 && indentNewLine) {
			output = output.replace(/\n(.+)/g, `\n${" ".repeat(messageIndex)}$1`);
		}
		return output;
	}

	static _formatTimestamp(level, timestamp) {
		const {formatTimestamp} = level;

		const date = new Date(timestamp || Date.now());
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const monthStr = month.toString().length === 1 ? `0${month}` : month;
		const day = date.getDate();
		const dayStr = day.toString().length === 1 ? `0${day}` : day;
		const hours = date.getHours();
		const hoursStr = hours.toString().length === 1 ? `0${hours}` : hours;
		const minutes = date.getMinutes();
		const minutesStr = minutes.toString().length === 1 ? `0${minutes}` : minutes;
		const seconds = date.getSeconds();
		const secondsStr = seconds.toString().length === 1 ? `0${seconds}` : seconds;
		const milliseconds = date.getMilliseconds();
		let millisecondsStr = milliseconds.toString();
		if (millisecondsStr.length === 1) {
			millisecondsStr = `00${millisecondsStr}`;
		} else if (millisecondsStr.length === 2) {
			millisecondsStr = `0${millisecondsStr}`;
		}
		return formatTimestamp
			.replace("YYYY", year)
			.replace("MM", monthStr)
			.replace("DD", dayStr)
			.replace("HH", hoursStr)
			.replace("mm", minutesStr)
			.replace("ss", secondsStr)
			.replace("SSS", millisecondsStr);
	}

	static _formatObject(level, obj) {
		const {formatObject} = level;

		for (let type in formatObject) {
			if (obj instanceof globalThis[type]) {
				const format = formatObject[type];

				let output = format;
				if (format.indexOf(Token.MESSAGE) !== -1) {
					output = output.replace(Token.MESSAGE, obj.message);
				}
				if (format.indexOf(Token.STACK) !== -1) {
					output = output.replace(Token.STACK, obj.stack);
				}
				return output;
			}
		}
		return obj;
	}
}
export default Level;
