//////////////////////////////////////////////////////////////////////
//////////////////////////////// HELPERS /////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get the identifier of an object
 *
 * @return {Integer}
 */
CookieObject.identifier = function() {
	return 'cookie-monster__'+this.getType()+'--'+this.id;
};

/**
 * Check if an object matches against a piece of text
 *
 * @param {String} matcher
 *
 * @return {Boolean}
 */
CookieObject.matches = function(matcher) {
	if (!this.desc) {
		return false;
	}

	return this.desc.toLowerCase().indexOf(matcher.toLowerCase()) !== -1;
};

/**
 * Get the integer mentionned in a description
 *
 * @return {Integer}
 */
CookieObject.getDescribedInteger = function() {
	if (!this.matches('<b>')) {
		return;
	}

	return this.desc.match(/<b>\+?([\.0-9]+)%?/)[1].replace(/[%,]/g, '') * 1;
};