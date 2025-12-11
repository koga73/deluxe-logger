class Output {
	constructor(id, name, level, levels) {
		this.id = id;
		this.name = name;
		this.level = level;
		this.levels = levels;

		for (let i = 0; i < levels.length; i++) {
			this[levels[i].name.toLowerCase()] = (...args) => this.doLog(levels[i], ...args);
		}
	}

	doLog(level, ...args) {
		throw new Error("Not implemented");
	}
}
export default Output;
