function getReplUnlCost() {
	if (inNGM(2) && player.tickspeedBoosts === undefined) return 1e80
	if (tmp.ngC) return 1e111
	return 1e140
}

function unlockReplicantis() {
	let cost = getReplUnlCost()
	if (player.infinityPoints.gte(cost)) {
		getEl("replicantidiv").style.display = "inline-block"
		getEl("replicantiunlock").style.display = "none"
		player.replicanti.unl = true
		player.replicanti.amount = new Decimal(1)
		player.infinityPoints = player.infinityPoints.minus(cost)
	}
}

function replicantiIncrease(diff) {
	if (!player.replicanti.unl || player.currentEternityChall == "eterc14") return
	if (diff > 5 || tmp.rep.chance > 1 || tmp.rep.interval < 50 || tmp.rep.est.gt(50) || isReplicantiLimitBroken()) continuousReplicantiUpdating(diff)
	else notContinuousReplicantiUpdating()
	if (player.replicanti.amount.gt(0)) replicantiTicks += diff

	let auto = player.replicanti.galaxybuyer
	if (auto && tmp.ngC) ngC.condense.rep.buy()
	if (auto && canGetReplicatedGalaxy() && (canAutoReplicatedGalaxy() || player.currentEternityChall == "eterc14")) replicantiGalaxy()

	if (tmp.ngp3 && player.masterystudies.includes("d10") && tmp.qu.autoOptions.replicantiReset && player.replicanti.amount.gt(tmp.qu.replicants.requirement)) replicantReset(true)
}

function getReplicantiLimit(cap = false) {
	if (player.boughtDims) return player.replicanti.limit
	if (tmp.ngC && cap) {
		let lim = new Decimal(Number.MAX_VALUE);
		if (hasTS(52)) lim = lim.pow(tsMults[52]())
		if (hasTS(192)) lim = lim.times(player.timeShards.plus(1))
		if (player.dilation.upgrades.includes("ngp3c4")) lim = lim.times(player.dilation.dilatedTime.plus(1).pow(2500))
		return lim;
	}
	return Number.MAX_VALUE
}

function isReplicantiLimitBroken() {
	return hasTimeStudy(192)
}

function getReplMult(next) {
	let exp = 2
	if (inNGM(2)) exp = Math.max(2, Math.pow(player.galaxies, .4))
	if (player.boughtDims) {
		exp += (player.timestudy.ers_studies[3] + (next ? 1 : 0)) / 2
		if (hasAch('r108')) exp *= 1.09;
	}
	if (tmp.ngC && ngC.tmp) exp *= ngC.tmp.rep.eff2 * 2.5
	let replmult = Decimal.max(player.replicanti.amount.log(2), 1).pow(exp)
	if (hasTimeStudy(21) && !tmp.ngC) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032))
	if (hasTimeStudy(102)) {
		let rg = getFullEffRGs()
		let base = new Decimal(replmult)

		replmult = base.times(Decimal.pow(5, rg))
		if (masteryStudies.has(304)) replmult = replmult.max(base.pow(getMTSMult(304)))
	}
	return replmult;
}

function upgradeReplicantiChance() {
	if (player.infinityPoints.gte(player.replicanti.chanceCost) && isChanceAffordable() && player.eterc8repl > 0) {
		if (ph.did("ghostify")) if (player.ghostify.milestones < 11) player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
		else player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
		player.replicanti.chance = Math.round(player.replicanti.chance * 100 + 1) / 100
		if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
		getEl("eterc8repl").textContent = "You have " + player.eterc8repl + " purchases left."
		player.replicanti.chanceCost = player.replicanti.chanceCost.times(1e15)
	}
}

function isChanceAffordable() {
	return player.replicanti.chance < 1 || (tmp.ngp3 && masteryStudies.has(265))
}

function upgradeReplicantiInterval() {
	if (!isIntervalAffordable() || !player.infinityPoints.gte(player.replicanti.intervalCost) || player.eterc8repl <= 0) return 
	player.infinityPoints = player.infinityPoints.minus(player.replicanti.intervalCost)

	player.replicanti.interval *= 0.9
	if (!isIntervalAffordable()) player.replicanti.interval = (hasTimeStudy(22) || player.boughtDims ? 1 : 50)

	if (player.replicanti.interval < 1) {
		let x = 1 / player.replicanti.interval
		// if (x > 1e10) x = Math.pow(x / 1e5, 2)
		player.replicanti.intervalCost = Decimal.pow("1e800", x)
	} else player.replicanti.intervalCost = player.replicanti.intervalCost.times(1e10)

	if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
	getEl("eterc8repl").textContent = "You have " + player.eterc8repl + " purchases left."
}

function isIntervalAffordable() {
	if (masteryStudies.has(281)) return true
	return player.replicanti.interval > (hasTimeStudy(22) || player.boughtDims ? 1 : 50)
}

function getRGCost(offset = 0, costChange) {
	let ret = player.replicanti.galCost
	if (offset > 0) {
		if (inQC(5)) return player.replicanti.galCost.pow(Math.pow(1.2, offset))
		
		let increase = 0
		if (player.currentEternityChall == "eterc6") increase = offset * ((offset + player.replicanti.gal * 2) + 3)
		else increase = offset * (2.5 * (offset + player.replicanti.gal * 2) + 22.5)
		if (player.replicanti.gal + offset > 99) increase += (offset - Math.max(99 - player.replicanti.gal, 0)) * (25 * (offset - Math.max(99 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 99) * 2) - 4725)
		
		let scaleStart = tmp.ngC ? 250 : 400
		if (player.replicanti.gal + offset > scaleStart - 1) {
			if (player.exdilation != undefined) for (var g = Math.max(player.replicanti.gal, scaleStart - 1); g < player.replicanti.gal + offset; g++) increase += Math.pow(g - 389, 2)
			if (player.meta != undefined) {
				var isReduced = tmp.ngp3 && masteryStudies.has(266)
				if (isReduced) increase += (Math.pow(player.replicanti.gal + offset - scaleStart, 3) - Math.pow(Math.max(player.replicanti.gal - scaleStart, 0), 3)) * 10
				else for (var g = Math.max(player.replicanti.gal, scaleStart - 1); g < player.replicanti.gal + offset; g++) increase += 5 * Math.floor(Math.pow(1.2, g - scaleStart + 6))
			}
		}
		ret = ret.times(Decimal.pow(10, increase))

	}
	if (hasTimeStudy(233) && !costChange) ret = ret.dividedBy(tmp.rmPseudo.pow(0.3))
	return ret
}

function upgradeReplicantiGalaxy() {
	var cost = getRGCost()
	if (player.infinityPoints.gte(cost) && player.eterc8repl !== 0) {
		player.infinityPoints = player.infinityPoints.minus(cost)
		player.replicanti.galCost = getRGCost(1)
		player.replicanti.gal += 1
		if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
		getEl("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
		return true
	}
	return false
}

function replicantiGalaxy() {
	var maxGal = getMaxRG()
	if (!canGetReplicatedGalaxy()) return
	if (player.galaxyMaxBulk) player.replicanti.galaxies = maxGal
	else player.replicanti.galaxies++
	if (!tmp.ngp3 || !hasAch("ngpp16")) player.replicanti.amount = Decimal.div(hasAch("r126") ? player.replicanti.amount : 1, Number.MAX_VALUE).max(1)
	galaxyReset(0)
}

function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk = !player.galaxyMaxBulk
	getEl('replicantibulkmodetoggle').textContent = "Mode: " + (player.galaxyMaxBulk ? "Max" : "Singles")
}

function canGetReplicatedGalaxy() {
	return player.replicanti.galaxies < getMaxRG() && player.replicanti.amount.gte(getReplicantiLimit())
}

function canAutoReplicatedGalaxy() {
	return (hasAch("r136") && (tmp.ngp3 || tmp.mod.newGamePlusVersion)) || !hasTimeStudy(131) || tmp.ngC
}

function getMaxRG() {
	let ret = player.replicanti.gal
	if (hasTimeStudy(131)) ret += Math.floor(ret * 0.5)
	return ret
}

function autoBuyRG() {
	if (!player.infinityPoints.gte(getRGCost())) return

	let data = doBulkSpent(player.infinityPoints, getRGCost, 0)
	player.replicanti.infinityPoints = data.res
	player.replicanti.galCost = getRGCost(data.toBuy, true)
	player.replicanti.gal += data.toBuy
}

var extraReplBase = 0
function updateExtraReplBase() {
	extraReplBase = 0
	if (hasTimeStudy(225)) extraReplBase += tsMults[225]()
	if (hasTimeStudy(226)) extraReplBase += tsMults[226]()
}

var extraReplMulti = 1
function updateExtraReplMult() {
	let x = 1
	if (tmp.quActive) {
		if (inQC(2) || inQC(3)) x = 0
		if (enB.active("glu", 2)) x *= tmp.enB.glu2
	}
	extraReplMulti = x
}

function getTotalRGs() {
	if (inQC(3)) return 0

	return player.replicanti.galaxies + tmp.extraRG
}

function getFullEffRGs(min) {
	if (inQC(3)) return 0

	let x = player.replicanti.galaxies
	if (masteryStudies.has(291)) x = getTotalRGs()
	else if (min) x = Math.min(x, player.replicanti.gal)

	return x
}

function getReplGalaxyEff() {
	let x = 1
	if (player.boughtDims) x = Math.log10(player.replicanti.limit.log(2)) / Math.log10(2)/10
	else if (ECComps("eterc8") > 0) x = getECReward(8)
	if (tmp.ngp3) {
		if (masteryStudies.has(344)) x *= getMTSMult(344)
		if (hasBosonicUpg(34)) x *= tmp.blu[34]
	}

	return x
}

function replicantiGalaxyAutoToggle() {
	player.replicanti.galaxybuyer=!player.replicanti.galaxybuyer
	getEl("replicantiresettoggle").textContent="Auto galaxy "+(player.replicanti.galaxybuyer?"ON":"OFF")+(!canAutoReplicatedGalaxy()?" (disabled)":"")
}

function getReplicantiBaseInterval(speed) {
	if (speed === undefined) speed = player.replicanti.interval
	speed = new Decimal(speed)

	if (enB.active("glu", 8)) {
		let lvls = Math.round(Decimal.div(speed, 1e3).log(0.9))
		speed = Decimal.pow(0.9, Math.pow(lvls, tmp.enB.glu8)).times(1e3)
	}
	return speed
}

function getReplicantiIntervalMult() {
	let interval = 1
	if (tmp.mod.ngexV) interval *= .8
	if (hasTimeStudy(62)) interval /= tsMults[62]()
	if (player.replicanti.amount.gt(Number.MAX_VALUE)||hasTimeStudy(133)) interval *= 10
	if (hasTimeStudy(213)) interval /= tsMults[213]()
	if (player.replicanti.amount.lt(Number.MAX_VALUE) && hasAch("r134")) interval /= 2
	if (isBigRipUpgradeActive(4)) interval /= 10
	if (tmp.ngC) interval /= 20

	interval = new Decimal(interval)
	if (player.exdilation != undefined) interval = interval.div(getBlackholePowerEffect().pow(1/3))
	if (player.dilation.upgrades.includes('ngpp1') && tmp.mod.nguspV && !tmp.mod.nguepV) interval = interval.div(player.dilation.dilatedTime.max(1).pow(0.05))
	if (player.dilation.upgrades.includes("ngmm9")) interval = interval.div(getDil72Mult())
	if (masteryStudies.has(332)) interval = interval.div(getMTSMult(332))
	if (tmp.ngC && ngC.tmp) interval = interval.div(ngC.tmp.rep.eff1)
	return interval
}

function getReplicantiFinalInterval() {
	let x = tmp.rep.baseInt.div(ls.mult("rep"))
	if (player.replicanti.amount.gt(getReplScaleStart())) {
		if (player.boughtDims) {
			let base = hasAch("r107") ? Math.max(player.replicanti.amount.log(2) / 1024, 1) : 1
			x = Math.pow(base, -.25) * x.toNumber()
		} else x = Decimal.pow(tmp.rep.speeds.inc, Math.max(player.replicanti.amount.log10() - tmp.rep.speeds.exp, 0) / tmp.rep.speeds.exp).times(x)
	}
	return x
}

function getReplScaleStart() {
	return Number.MAX_VALUE
}

function getReplSpeed() {
	let inc = .2
	let exp = Math.floor(Decimal.log10(getReplScaleStart()))
	if (hasDilationUpg('ngpp1') && (!tmp.mod.nguspV || tmp.mod.nguepV)) {
		let expDiv = 10
		if (tmp.ngp3) expDiv = 9
		let x = 1 + player.dilation.dilatedTime.max(1).log10() / expDiv

		inc /= Math.min(x, 20)
	}
	inc = inc + 1

	if (masteryStudies.has(282)) exp += tmp.mts[282]
	if (tmp.quActive) exp *= colorBoosts.g

	if (masteryStudies.has(283)) exp += 100

	//if (hasBosonicUpg(35)) exp += tmp.blu[35].rep
	//if (hasBosonicUpg(44)) exp += tmp.blu[44]
	if (GDs.boostUnl('rep')) exp *= GDs.tmp.rep

	return {inc: inc, exp: exp}
}

function updateReplicantiTemp() {
	var data = {}
	tmp.rep = data

	data.ln = player.replicanti.amount.ln()

	data.chance = player.replicanti.chance

	let pow = 1
	if (data.chance > 1) pow = Math.pow(data.chance, masteryStudies.has(284) ? 1 : 0.5)
	if (pow > 1) data.chance = Decimal.pow(data.chance, pow)

	data.freq = 0
	if (Decimal.gte(data.chance, "1e9999998")) data.freq = Decimal.times(Math.log10(player.replicanti.chance + 1), pow / Math.log10(2))

	let estChance = data.freq ? data.freq.times(Math.log10(2) / Math.log10(Math.E) * 1e3) : Decimal.add(data.chance, 1).log(Math.E) * 1e3

	data.intUpg = getReplicantiBaseInterval()
	data.intMult = getReplicantiIntervalMult()
	data.baseInt = data.intUpg.times(data.intMult)

	data.baseEst = Decimal.div(estChance, data.baseInt)

	data.speeds = getReplSpeed()
	if (data.baseEst && ECComps("eterc14")) {
		//Sub-1ms reduction -> Lower replicanti scaling
		let pow = getECReward(14)
		let div = data.baseEst.pow(pow)

		data.ec14 = {
			interval: div,
			ooms: div.log10() / 2 + 1
		}
		data.speeds.exp *= data.ec14.ooms
		data.ec14.interval = data.ec14.interval.div(Math.pow(data.speeds.exp / Math.log10(data.speeds.inc), pow))

		data.baseInt = data.baseInt.times(data.ec14.interval)
		data.baseEst = data.baseEst.div(data.ec14.interval)
	}

	data.interval = getReplicantiFinalInterval()

	data.est = Decimal.div(estChance, data.interval)
	data.estLog = data.est.times(Math.log10(Math.E))
}

function runRandomReplicanti(chance) {
	if (Decimal.gte(chance, 1)) {
		player.replicanti.amount = player.replicanti.amount.times(2)
		return
	}
	var temp = player.replicanti.amount
	if (typeof(chance) == "object") chance = chance.toNumber()
	for (var i = 0; temp.gt(i); i++) {
		if (chance > Math.random()) player.replicanti.amount = player.replicanti.amount.plus(1)
		if (i >= 99) return
	}
}

function notContinuousReplicantiUpdating() {
	var chance = tmp.rep.chance
	var interval = Decimal.div(tmp.rep.interval, 100)
	if (typeof(chance) !== "number") chance = chance.toNumber()

	if (interval <= replicantiTicks && player.replicanti.unl) {
		if (player.replicanti.amount.lte(100)) runRandomReplicanti(chance) //chance should be a decimal
		else if (player.replicanti.amount.lt(getReplicantiLimit(true))) {
			var temp = Decimal.round(player.replicanti.amount.dividedBy(100))
			if (chance < 1) {
				let counter = 0
				for (var i = 0; i < 100; i++) if (chance > Math.random()) counter++;
				player.replicanti.amount = temp.times(counter).plus(player.replicanti.amount)
				counter = 0
			} else player.replicanti.amount = player.replicanti.amount.times(2)
			if (!hasTimeStudy(192) || tmp.ngC) player.replicanti.amount = player.replicanti.amount.min(getReplicantiLimit(true))
		}
		replicantiTicks -= interval
	}
}

function continuousReplicantiUpdating(diff){
	if (isReplicantiLimitBroken()) {
		let ln = tmp.rep.ln
		if (tmp.rep.est.toNumber() > 0 && tmp.rep.est.toNumber() < 1/0) ln += Math.log((diff * tmp.rep.est / 10) * (Math.log10(tmp.rep.speeds.inc) / tmp.rep.speeds.exp) + 1) / (Math.log10(tmp.rep.speeds.inc) / tmp.rep.speeds.exp)
		else ln += tmp.rep.est.times(diff * Math.log10(tmp.rep.speeds.inc) / tmp.rep.speeds.exp / 10).add(1).log(Math.E) / (Math.log10(tmp.rep.speeds.inc) / tmp.rep.speeds.exp)

		player.replicanti.amount = Decimal.pow(Math.E, ln)
	} else player.replicanti.amount = Decimal.pow(Math.E, tmp.rep.ln + (diff * tmp.rep.est / 10)).min(getReplicantiLimit(true))
	replicantiTicks = 0
}
