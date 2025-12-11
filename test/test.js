import DeluxeLogger, {OUTPUT} from "../src/deluxe-logger.js";

(async function main(args) {
	let exitCode = 0;

	const logger = DeluxeLogger.getInstance({
		outputs: [DeluxeLogger.DEFAULT_OUTPUT.CONSOLE, DeluxeLogger.DEFAULT_OUTPUT.FILE]
	});

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

	process.exit(exitCode);
})(process.argv.splice(2));
