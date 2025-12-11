import Output from "../output.js";
import Level from "../level.js";

// Node.js console colors
export const COLOR = {
	FG: {
		BLACK: "\x1b[30m",
		RED: "\x1b[31m",
		GREEN: "\x1b[32m",
		YELLOW: "\x1b[33m",
		BLUE: "\x1b[34m",
		MAGENTA: "\x1b[35m",
		CYAN: "\x1b[36m",
		WHITE: "\x1b[37m",
		// Bright
		BLACK_BRIGHT: "\x1b[90m",
		RED_BRIGHT: "\x1b[91m",
		GREEN_BRIGHT: "\x1b[92m",
		YELLOW_BRIGHT: "\x1b[93m",
		BLUE_BRIGHT: "\x1b[94m",
		MAGENTA_BRIGHT: "\x1b[95m",
		CYAN_BRIGHT: "\x1b[96m",
		WHITE_BRIGHT: "\x1b[97m"
	},
	BG: {
		BLACK: "\x1b[40m",
		RED: "\x1b[41m",
		GREEN: "\x1b[42m",
		YELLOW: "\x1b[43m",
		BLUE: "\x1b[44m",
		MAGENTA: "\x1b[45m",
		CYAN: "\x1b[46m",
		WHITE: "\x1b[47m",
		// Bright
		BLACK_BRIGHT: "\x1b[100m",
		RED_BRIGHT: "\x1b[101m",
		GREEN_BRIGHT: "\x1b[102m",
		YELLOW_BRIGHT: "\x1b[103m",
		BLUE_BRIGHT: "\x1b[104m",
		MAGENTA_BRIGHT: "\x1b[105m",
		CYAN_BRIGHT: "\x1b[106m",
		WHITE_BRIGHT: "\x1b[107m"
	}
};

// Node.js cursor styles
export const CURSOR = {
	RESET: "\x1b[0m",
	BOLD: "\x1b[1m",
	DIM: "\x1b[2m",
	ITALIC: "\x1b[3m",
	UNDERLINE: "\x1b[4m",
	OVERLINE: "\x1b[53m",
	BLINK: "\x1b[5m",
	RAPID_BLINK: "\x1b[6m",
	INVERSE: "\x1b[7m",
	HIDDEN: "\x1b[8m",
	STRIKETHROUGH: "\x1b[9m"
};

class ConsoleOutput extends Output {
	static LEVELS = {
		DEBUG: new Level({id: Level.ID.DEBUG, name: Level.NAME.DEBUG}),
		INFO: new Level({id: Level.ID.INFO, name: Level.NAME.INFO}),
		LOG: new Level({id: Level.ID.LOG, name: Level.NAME.LOG}),
		WARN: new Level({id: Level.ID.WARN, name: Level.NAME.WARN, formatMessage: `${COLOR.FG.YELLOW}${Level.DEFAULT_FORMAT.MESSAGE}${CURSOR.RESET}`}),
		ERROR: new Level({id: Level.ID.ERROR, name: Level.NAME.ERROR, formatMessage: `${COLOR.FG.RED}${Level.DEFAULT_FORMAT.MESSAGE}${CURSOR.RESET}`})
	};

	constructor({id, level = ConsoleOutput.LEVELS.INFO}) {
		super(id, ConsoleOutput.name, level, Object.values(ConsoleOutput.LEVELS));
	}

	doLog(level, ...args) {
		const {level: logLevel} = this;
		if (level.id < logLevel.id) {
			return;
		}

		const method = console[level.name.toLowerCase()];
		if (!method) {
			throw new Error("Not implemented");
		}
		method(level.format(...args));
	}
}
export default ConsoleOutput;
