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

		// Track our processed count.
		var processedCount = 0;

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
				// Handle errors.
				if (error || response.statusCode !== 200) {
					// Log.
					console.error(
						"An error occurred with one of the wars. Ignoring."
					);

					// Increment the number of callbacks we've processed.
					processedCount++;

					// If we're done, call finish.
					if (processedCount == wars.length) {
						finish();
					}

					// Stop executing.
					return;
				}

				// Grab the war details.
				var war = JSON.parse(body);

				// Compare the date to now.
				active = true;
				if (war.finished != undefined && war.finished != null) {
					var now = new Date();
					var then = new Date(war.finished);
					active = now < then;
				}

				// Get our involvement.
				var involved = involvedInWar(
					war,
					process.env.allianceIds
						.split(",")
						.map(item => parseInt(item.trim())),
					process.env.corporationIds
						.split(",")
						.map(item => parseInt(item.trim()))
				);

				// Send the message if involved.
				if (active && involved) {
					sendSlackMessage(war, involved, (error, response, body) => {
						// Increment the number of callbacks we've processed.
						processedCount++;

						// If we're done, call finish.
						if (processedCount == wars.length) {
							finish();
						}
					});
				} else {
					// Log that we we have a war past its end time for posterity.
					if (involved) {
						console.log(
							"Found a war, but it's past the finished date."
						);
					}

					// Increment the number of callbacks we've processed.
					processedCount++;

					// If we're done, call finish.
					if (processedCount == wars.length) {
						finish();
					}
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
