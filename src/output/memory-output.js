import Output from "../output.js";
import Level from "../level.js";

class MemoryOutput extends Output {
	static LEVELS = {
		DEBUG: new Level({id: Level.ID.DEBUG, name: Level.NAME.DEBUG}),
		INFO: new Level({id: Level.ID.INFO, name: Level.NAME.INFO}),
		LOG: new Level({id: Level.ID.LOG, name: Level.NAME.LOG}),
		WARN: new Level({id: Level.ID.WARN, name: Level.NAME.WARN}),
		ERROR: new Level({id: Level.ID.ERROR, name: Level.NAME.ERROR})
	};

	constructor({id, level = MemoryOutput.LEVELS.INFO}) {
		super(id, MemoryOutput.name, level, Object.values(MemoryOutput.LEVELS));

		this._buffer = [];
		this._maxBufferSize = -1;
	}

	doLog(level, ...args) {
		const {level: logLevel, _buffer, _maxBufferSize} = this;
		if (level.id < logLevel.id) {
			return;
		}

		_buffer.push(level.format(...args));
		if (_maxBufferSize > 0 && _buffer.length > _maxBufferSize) {
			_buffer.shift();
		}
	}

	getMemory(start = 0, end = 0) {
		const {_buffer} = this;

		start = start || 0;
		end = end || _buffer.length;

		return _buffer.slice(start, end);
	}

	clear() {
		this._buffer = [];
	}
}
export default MemoryOutput;
