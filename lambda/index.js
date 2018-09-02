var logEnv = require("./src/logEnv");
var runTask = require("./src/runTask");

exports.handler = (event, context, callback) => {
	// Log the environment for debugging.
	logEnv();

	// Start processing.
	runTask(callback);
};
