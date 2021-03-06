/**
 * Get how much buying an upgrade would earn
 *
 * @param {Object} upgrade
 *
 * @return {Integer}
 */
CookieMonster.getUpgradeWorth = function(upgrade) {
	var income     = 0;
	var unlocked   = 0;
	var multiplier = Game.globalCpsMult;

	// Standard bulding upgrades
	var buildingUpgrades = ['Cursors', 'Grandmas', 'Farms', 'Factories', 'Mines', 'Shipments', 'Alchemy labs', 'Portals', 'Time machines', 'Antimatter condensers'];
	buildingUpgrades.forEach(function(building, key) {
		if (upgrade.matches(building+' are <b>')) {
			income = CookieMonster.getBuildingUpgradeOutcome(key);
		}
	});

	// CPS building upgrades
	var gainsUpgrades = [
		{building: 'Cursors',               modifier: 0.1},
		{building: 'Grandmas',              modifier: 0.3},
		{building: 'Farms',                 modifier: 0.5},
		{building: 'Factories',             modifier: 4},
		{building: 'Mines',                 modifier: 10},
		{building: 'Shipments',             modifier: 30},
		{building: 'Alchemy labs',          modifier: 100},
		{building: 'Portals',               modifier: 1666},
		{building: 'Time machines',         modifier: 9876},
		{building: 'Antimatter condensers', modifier: 99999},
	];
	gainsUpgrades.forEach(function(gainUpgrade, key) {
		if (upgrade.matches(gainUpgrade.building+' gain <b>')) {
			income = CookieMonster.getMultiplierOutcome(gainUpgrade.building, gainUpgrade.modifier, key);
		}
	});

	if (upgrade.matches('Grandmas are <b>twice</b>')) {
		unlocked += this.lgt(upgrade);
	}

	else if (upgrade.matches('for each non-cursor object')) {
		income = this.getNonObjectsGainOutcome(upgrade);
	}

	// Grandmas per grandmas
	else if (upgrade.matches('for every 50 grandmas')) {
		income = this.getGrandmasPerGrandmaOutcome();
	}

	// Grandmas per portals
	else if (upgrade.matches('for every 20 portals')) {
		income = this.getGrandmasPerPortalOutcome();
	}

	// Heavenly upgrades
	else if (upgrade.matches('potential of your heavenly')) {
		income = this.getHeavenlyUpgradeOutcome(unlocked, upgrade) / multiplier;
		if (upgrade.name === 'Heavenly key') {
			unlocked += this.hasntAchievement('Wholesome');
		}
	}

	// Elder pacts
	if (upgrade.name === 'Elder Covenant') {
		return Game.cookiesPs * -0.05;
	} else if (upgrade.name === 'Revoke Elder Covenant') {
		return (Game.cookiesPs / multiplier) * (multiplier * 1.05) - Game.cookiesPs;
	}

	// Building counts
	if (Game.UpgradesOwned === 19) {
		unlocked += this.hasntAchievement('Enhancer');
	}
	if (Game.UpgradesOwned === 49) {
		unlocked += this.hasntAchievement('Augmenter');
	}
	if (Game.UpgradesOwned === 99) {
		unlocked += this.hasntAchievement('Upgrader');
	}

	return (income * multiplier) + this.callCached('getAchievementWorth', [unlocked, upgrade.id, income]);
};

//////////////////////////////////////////////////////////////////////
///////////////////////////// UPGRADES WORTH /////////////////////////
//////////////////////////////////////////////////////////////////////

// Classic situations
//////////////////////////////////////////////////////////////////////

/**
 * Get the outcome of a building upgrade
 *
 * @param {Integer} buildingKey
 *
 * @return {Integer}
 */
CookieMonster.getBuildingUpgradeOutcome = function(buildingKey) {
	return Game.ObjectsById[buildingKey].storedTotalCps;
};

/**
 * Get how much a given multiplier would impact the current CPS for a type of building
 *
 * @param {String}  building
 * @param {Integer} baseMultiplier
 * @param {Integer} buildingKey
 *
 * @return {Integer}
 */
CookieMonster.getMultiplierOutcome = function(building, baseMultiplier, buildingKey) {
	var multiplier = 1;

	// Gather current multipliers
	Game.UpgradesById.forEach(function (upgrade) {
		if (upgrade.bought && upgrade.matches(building + ' are <b>twice</b>')) {
			multiplier = multiplier * 2;
		}
		if (upgrade.bought && upgrade.matches(building + ' are <b>4 times</b>')) {
			multiplier = multiplier * 4;
		}
	});

	return Game.ObjectsById[buildingKey].amount * multiplier * baseMultiplier;
};

/**
 * Get the output of an Heavenly Chips upgrade
 *
 * @param {Integer} unlocked
 * @param {Object}  upgrade
 *
 * @return {Integer}
 */
CookieMonster.getHeavenlyUpgradeOutcome = function(unlocked, upgrade) {
	var multiplier = Game.prestige['Heavenly chips'] * 2 * (upgrade.getDescribedInteger() / 100);

	return this.callCached('getAchievementWorth', [unlocked, upgrade.id, 0, multiplier]) - Game.cookiesPs;
};

// Special cases
//////////////////////////////////////////////////////////////////////

/**
 * Compute the production of Grandmas per 20 portals
 *
 * @return {Integer}
 */
CookieMonster.getGrandmasPerPortalOutcome = function() {
	var multiplier = 1;

	Game.UpgradesById.forEach(function (upgrade) {
		if (upgrade.bought && upgrade.matches('Grandmas are <b>twice</b>.')) {
			multiplier = multiplier * 2;
		}
		if (upgrade.bought && upgrade.matches('Grandmas are <b>4 times</b>')) {
			multiplier = multiplier * 4;
		}
	});

	return Game.ObjectsById[7].amount * 0.05 * multiplier * Game.ObjectsById[1].amount;
};

/**
 * Computes the production of Grandmas per 50 grandmas
 *
 * @return {Integer}
 */
CookieMonster.getGrandmasPerGrandmaOutcome = function() {
	var multiplier = 1;

	Game.UpgradesById.forEach(function (upgrade) {
		if (upgrade.bought && upgrade.matches('Grandmas are <b>twice</b>')) {
			multiplier = multiplier * 2;
		}
		if (upgrade.bought && upgrade.matches('Grandmas are <b>4 times</b>')) {
			multiplier = multiplier * 4;
		}
	});

	return Game.ObjectsById[1].amount * 0.02 * multiplier * Game.ObjectsById[1].amount;
};

CookieMonster.lgt = function(upgrade) {
	if (this.hasAchievement('Elder Pact') || upgrade.name.indexOf(' grandmas') === -1) {
		return false;
	}

	var todo = [];
	Game.UpgradesById.forEach(function (upgrade, key) {
		if (!upgrade.bought && upgrade.name.indexOf(' grandmas ') !== -1) {
			todo.push(key);
		}
	});

	return (todo.length === 1 && todo[0] === upgrade.id);
};

/**
 * Computes the production of cursors per non-cursor objects
 *
 * @param {Object} upgrade
 *
 * @return {Integer}
 */
CookieMonster.getNonObjectsGainOutcome = function(upgrade) {
	return upgrade.getDescribedInteger() * (Game.BuildingsOwned - Game.ObjectsById[0].amount) * Game.ObjectsById[0].amount;
};

/**
 * Compute the production of a building once 4 times as efficient
 *
 * @param {Integer} buildingKey
 *
 * @return {Integer}
 */
CookieMonster.getFourTimesEfficientOutcome = function(buildingKey) {
	return Game.ObjectsById[buildingKey].storedTotalCps * 3;
};