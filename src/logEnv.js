var logEnv = function() {
	console.log(
		"Environment: " +
			JSON.stringify({
				allianceIds: process.env.allianceIds
					.split(",")
					.map(item => parseInt(item.trim())),
				channel: process.env.channel,
				corporationIds: process.env.corporationIds
					.split(",")
					.map(item => parseInt(item.trim())),
				slackHookURL: process.env.slackHookURL,
			})
	);
};

module.exports = logEnv;
