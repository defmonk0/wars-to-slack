var involvedInSection = function(section, aids, cids) {
	if (
		section.alliance_id != undefined &&
		section.alliance_id != null &&
		aids.indexOf(section.alliance_id) > -1
	) {
		return true;
	}

	if (
		section.corporation_id != undefined &&
		section.corporation_id != null &&
		cids.indexOf(section.corporation_id) > -1
	) {
		return true;
	}

	return false;
};

module.exports = involvedInSection;
