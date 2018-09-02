var involvedInWar = require("./helpers/involvedInWar");
var request = require("request");
var sendSlackMessage = require("./helpers/sendSlackMessage");

var runTask = function(finish) {
	// Basic logging.
	console.log("Pulling list of wars.");

	// Set up our headers and options.
	var headers = {
		"Content-Type": "application/json",
		"User-Agent":
			"wars-to-slack/1.0.0 <https://github.com/defmonk0/wars-to-slack>",
		Accept: "application/json",
	};

	var options = {
		url: "https://esi.evetech.net/latest/wars/?datasource=tranquility",
		headers: headers,
	};

	// Create a callback for the war list request.
	var warCallback = (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.error("An error occurred with one of the wars. Ignoring.");
			return;
		}

		// Grab the list of wars.
		var wars = JSON.parse(body);

		// Gotta make a call for each of these.
		wars.map(war => {
			// Set up our new options.
			var options = {
				headers: headers,
				url:
					"https://esi.evetech.net/latest/wars/" +
					war +
					"/?datasource=tranquility",
			};

			// Create a callback for the war details request.
			var detailsCallback = (error, response, body) => {
				if (error || response.statusCode !== 200) {
					console.error(
						"An error occurred with one of the wars. Ignoring."
					);
					return;
				}

				// Grab the war details.
				var war = JSON.parse(body);

				// Get our involvement.
				var involvement = involvedInWar(
					war,
					process.env.allianceIds
						.split(",")
						.map(item => parseInt(item.trim())),
					process.env.corporationIds
						.split(",")
						.map(item => parseInt(item.trim()))
				);

				// Send the message if involved.
				if (involvement) {
					sendSlackMessage(
						war,
						involvement,
						(error, response, body) => {}
					);
				}
			};

			// Start the request.
			request(options, detailsCallback);
		});
	};

	// Start the request.
	request(options, warCallback);
};

module.exports = runTask;
