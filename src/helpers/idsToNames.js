var request = require("request");
var EveIdMap = require("../classes/EveIdMap");

var idsToNames = function(ids, callback, count = 0) {
	var headers = {
		"Content-Type": "application/json",
		"User-Agent":
			"wars-to-slack/1.0.0 <https://github.com/defmonk0/wars-to-slack>",
		Accept: "application/json",
	};

	var options = {
		body: ids,
		headers: headers,
		json: true,
		method: "POST",
		url:
			"https://esi.tech.ccp.is/latest/universe/names/?datasource=tranquility",
	};

	request(options, function(error, response, body) {
		if (!error && response.statusCode === 200 && body) {
			var map = {};
			for (var i in body) {
				map[body[i]["id"]] = body[i];
			}

			callback(new EveIdMap(map));
		} else if (count < 5) {
			console.log("Failed to get names from ESI: trying again");
			console.log(error, response.statusCode, body.error);

			idsToNames(ids, callback, ++count);
		} else {
			console.log("Failed to get names from ESI: giving up");
			console.log(error, response.statusCode, body.error);

			console.log(JSON.stringify(ids));
		}
	});
};

module.exports = idsToNames;
