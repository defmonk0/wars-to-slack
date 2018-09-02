var idsToNames = require("./idsToNames");
var Slack = require("slack-node");

var sendSlackMessage = function(war, involvement, callback) {
	// Set up variables.
	var title = "You are " + involvement + " in a war today!";

	switch (involvement) {
		case "an aggressor":
			var color = "good";
			break;
		case "a defender":
			var color = "danger";
			break;
		default:
			var color = "warning";
			break;
	}

	if (
		war.defender.alliance_id != undefined &&
		war.defender.alliance_id != null
	) {
		var image =
			"https://imageserver.eveonline.com/Alliance/" +
			war.defender.alliance_id +
			"_128.png";
	} else if (
		war.defender.corporation_id != undefined &&
		war.defender.corporation_id != null
	) {
		var image =
			"https://imageserver.eveonline.com/Corporation/" +
			war.defender.corporation_id +
			"_128.png";
	}

	// Create the formatted slack post using the war.
	var formattedKillInfo = {
		fields: [
			{
				title: "Aggressor",
				value:
					war.aggressor.alliance_id || war.aggressor.corporation_id,
				short: false,
			},
			{
				title: "Ships Killed",
				value: war.aggressor.ships_killed,
				short: true,
			},
			{
				title: "ISK Destroyed",
				value: war.aggressor.isk_destroyed
					.toFixed(2)
					.replace(/\d(?=(\d{3})+\.)/g, "$&,"),
				short: true,
			},
			{
				title: "Defender",
				value: war.defender.alliance_id || war.defender.corporation_id,
				short: false,
			},
			{
				title: "Ships Killed",
				value: war.defender.ships_killed,
				short: true,
			},
			{
				title: "ISK Destroyed",
				value: war.defender.isk_destroyed
					.toFixed(2)
					.replace(/\d(?=(\d{3})+\.)/g, "$&,"),
				short: true,
			},
			{
				title: "Is the war mutual?",
				value: war.mutual ? "Yes" : "No",
				short: true,
			},
			{
				title: "Is the war open to allies?",
				value: war.open_for_allies ? "Yes" : "No",
				short: true,
			},
		],
		title: title,
		thumb_url: image,
		fallback: title,
		color: color,
		footer: "wars-to-slack: github@defmonk0",
	};

	// Add the time the war ends if it exists.
	if (war.finished != undefined && war.finished != null) {
		var time = war.finished;
		time = time.replace("T", " ");
		time = time.replace("Z", "");

		formattedKillInfo.fields.push({
			title: "Shooting Ends",
			value: time,
			short: false,
		});
	}

	// Grab proper names for the post.
	idsToNames(
		[formattedKillInfo.fields[0].value, formattedKillInfo.fields[3].value],
		map => {
			// Replace the names.
			formattedKillInfo.fields[0].value = map.getParameter(
				formattedKillInfo.fields[0].value,
				"name"
			);

			formattedKillInfo.fields[3].value = map.getParameter(
				formattedKillInfo.fields[3].value,
				"name"
			);

			// Prep the attachments container.
			var attachments = [];
			attachments.push(formattedKillInfo);
			console.log(
				"Sending attachments to Slack: " + JSON.stringify(attachments)
			);

			// Actually send the data off, and use our callback when finished
			slack = new Slack();
			slack.setWebhook(process.env.slackHookURL);
			slack.webhook(
				{
					attachments: attachments,
					channel: process.env.channel,
				},
				callback
			);
		}
	);
};

module.exports = sendSlackMessage;
