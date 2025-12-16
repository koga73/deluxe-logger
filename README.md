# deluxe-logger

A logger for console / files / memory

```js
import DeluxeLogger, {OUTPUT, ConsoleOutput, FileOutput, MemoryOutput} from "../src/deluxe-logger.js";

(async function main(args) {
	let exitCode = 0;

	// Create logger instance with multiple outputs
	const logger = DeluxeLogger.getInstance({
		outputs: [
			new ConsoleOutput({id: OUTPUT.CONSOLE}),
			new FileOutput({
				id: OUTPUT.FILE,
				filePath: "./logs",
				formatFileName: `test_${FileOutput.DEFAULT_FORMAT.FILENAME}`
			}),
			new MemoryOutput({id: OUTPUT.MEMORY})
		]
	});

	// Main application code
	try {
		logger.debug("This is a debug message");
		logger.info("This is an info message");
		logger.log("This is a log message");
		logger.warn("This is a warning message");
		logger.error("This is an error message");
		logger.log();

		// To console only
		const consoleLogger = logger.getOutput(OUTPUT.CONSOLE);
		consoleLogger.log("This message is for the console only");
		consoleLogger.log();

		throw new Error("Sample error");
	} catch (err) {
		logger.error(err);
		exitCode = 1;
	} finally {
		logger.log();
		logger.flush();
	}

	// Display memory output contents
	/*
	const memoryLogger = logger.getOutput(OUTPUT.MEMORY);
	for (const item of memoryLogger.getMemory()) {
		console.log(JSON.stringify(item, null, 2));
	}
	*/

	process.exit(exitCode);
})(process.argv.splice(2));
```
