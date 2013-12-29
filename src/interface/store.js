/**
 * Create the various upgrade counters above the store
 *
 * @return {void}
 */
CookieMonster.createStoreCounters = function() {

	$('#storeTitle').after(
	'<table cellpadding="0" cellspacing="0">'+
		'<tr>'+
			'<td align="center" class="text-blue"   id="cm_up_q0">0</td>' +
			'<td align="center" class="text-green"  id="cm_up_q1">0</td>' +
			'<td align="center" class="text-yellow" id="cm_up_q2">0</td>' +
			'<td align="center" class="text-orange" id="cm_up_q3">0</td>' +
			'<td align="center" class="text-red"    id="cm_up_q4">0</td>' +
			'<td align="center" class="text-purple" id="cm_up_q5">0</td>' +
		'</tr>'+
	'</table>');
};

/**
 * Check if an upgrade is in store
 *
 * @param {Array} upgrade
 *
 * @return {Boolean}
 */
CookieMonster.isInStore = function(upgrade) {
	return Game.UpgradesInStore.indexOf(upgrade) !== -1;
};