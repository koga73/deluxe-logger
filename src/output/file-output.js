import fs from "fs";
import path from "path";

import Output from "../output.js";
import Level from "../level.js";
import Token from "../token.js";

class FileOutput extends Output {
	static DEFAULT_FORMAT = {
		MESSAGE: `[${Token.TIMESTAMP}] [${Token.LEVEL}] ${Token.MESSAGE}\n`, //[2025-12-11 11:20:38.533] [INFO] message
		FILENAME: "YYYY-MM-DD.log" //2025-12-11.log
	};
	static DEFAULT_ENCODING = "utf-8";

	static LEVELS = {
		DEBUG: new Level({id: Level.ID.DEBUG, name: Level.NAME.DEBUG, formatMessage: FileOutput.DEFAULT_FORMAT.MESSAGE}),
		INFO: new Level({id: Level.ID.INFO, name: Level.NAME.INFO, formatMessage: FileOutput.DEFAULT_FORMAT.MESSAGE}),
		LOG: new Level({id: Level.ID.LOG, name: Level.NAME.LOG, formatMessage: FileOutput.DEFAULT_FORMAT.MESSAGE}),
		WARN: new Level({id: Level.ID.WARN, name: Level.NAME.WARN, formatMessage: FileOutput.DEFAULT_FORMAT.MESSAGE}),
		ERROR: new Level({id: Level.ID.ERROR, name: Level.NAME.ERROR, formatMessage: FileOutput.DEFAULT_FORMAT.MESSAGE})
	};

	constructor({id, level = FileOutput.LEVELS.DEBUG, filePath = null, formatFileName = FileOutput.DEFAULT_FORMAT.FILENAME}) {
		super(id, FileOutput.name, level, Object.values(FileOutput.LEVELS));

		this.filePath = filePath;
		this.formatFileName = formatFileName;

		this._buffer = [];
		this._lastFlushTime = Date.now();
		this._maxBufferSize = 100;
		this._maxBufferTime = 1000; //ms
	}

	doLog(level, ...args) {
		const {level: logLevel, _buffer, _lastFlushTime, _maxBufferSize, _maxBufferTime} = this;
		if (level.id < logLevel.id) {
			return;
		}

		_buffer.push(level.format(...args));

		if (_maxBufferSize > 0 && _buffer.length >= _maxBufferSize) {
			this.flush();
		} else if (_maxBufferTime > 0 && Date.now() - _lastFlushTime >= _maxBufferTime) {
			this.flush();
		}
	}

	clear() {
		this.flush({
			allowEmpty: true,
			clean: true
		});
	}

	flush({encoding = FileOutput.DEFAULT_ENCODING, allowEmpty = false, clean = false} = {}) {
		const {filePath, formatFileName, _buffer} = this;

		if (!filePath) {
			throw new Error("Undefined 'filePath'");
		}
		if (!fs.existsSync(this.filePath)) {
			fs.mkdirSync(this.filePath, {recursive: true});
		}

		if (_buffer.length > 0 || allowEmpty) {
			const file = path.join(filePath, FileOutput.formatFileName(formatFileName));

			if (clean) {
				fs.writeFileSync(file, _buffer.join(""), encoding);
			} else {
				fs.appendFileSync(file, _buffer.join(""), encoding);
			}
		}
		this._lastFlushTime = Date.now();
		this._buffer = [];
	}

	static formatFileName(format, timestamp) {
		const date = new Date(timestamp || Date.now());
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const monthStr = month.toString().length === 1 ? `0${month}` : month;
		const day = date.getDate();
		const dayStr = day.toString().length === 1 ? `0${day}` : day;
		return format.replace("YYYY", year).replace("MM", monthStr).replace("DD", dayStr);
	}
}
export default FileOutput;
