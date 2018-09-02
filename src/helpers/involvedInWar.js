var involvedInSection = require("./involvedInSection");

var involvedInWar = function(war, aids, cids) {
	if (involvedInSection(war.aggressor, aids, cids)) {
		return "an aggressor";
	}

	if (involvedInSection(war.defender, aids, cids)) {
		return "a defender";
	}

	if (war.allies != undefined && war.allies != null) {
		for (var ally of war.allies) {
			if (involvedInSection(ally, aids, cids)) {
				return "an ally";
			}
		}
	}

	return false;
};

module.exports = involvedInWar;
