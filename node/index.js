var logEnv = require("../src/logEnv");
var runTask = require("../src/runTask");
var setEnvironmentVariables = require("./config/setEnvironmentVariables");

// Process our environment variables so they're accessible.
setEnvironmentVariables();

// Log the environment for debugging.
logEnv();

// Start processing.
runTask(() => {
	console.log("Called finish function.");
});
