exports.isExpired = (date, anchorDate = Date.now(), offsetDate = 0) => {
	anchorDate = anchorDate + offsetDate;

	return date <= anchorDate;
};

exports.isExpiredDay = (date, offsetDays = 0) => {
	return exports.isExpired(date, undefined, offsetDays * 24 * 60 * 60 * 1000);
};
