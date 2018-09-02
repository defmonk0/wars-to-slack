var environmentVariables = require("./environmentVariables.json");

var setEnvironmentVariables = function() {
	process.env.allianceIds = environmentVariables.allianceIds;
	process.env.channel = environmentVariables.channel;
	process.env.corporationIds = environmentVariables.corporationIds;
	process.env.slackHookURL = environmentVariables.slackHookURL;
};

module.exports = setEnvironmentVariables;
