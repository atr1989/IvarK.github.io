function updateLightEmpowermentReq() {
	tmp.leReq = getLightEmpowermentReq()
}

function getLightEmpowermentBoost() {
	let r = player.ghostify.ghostlyPhotons.enpowerments
	if (hasBosonicUpg(13)) r *= tmp.blu[13]
	return r
}


var leBoosts = {
	max: 11,
	1: {
		leThreshold: 1,
		eff() {
			var le1exp = 0.75
			if (tmp.newNGP3E) {
				le1exp += 0.2
				if (player.ghostify.ghostlyPhotons.unl) le1exp += .15
				if (player.ghostify.wzb.unl) le1exp += .15
			}
			var le1mult = 500
			if (tmp.newNGP3E) le1mult *= 2
			var eff = Math.pow(Math.log10(tmp.effL[3] + 1), le1exp) * le1mult
			return {effect: eff}
		},
		effDesc(x) {
			return getFullExpansion(Math.floor(x.effect))
		}
	},
	2: {
		leThreshold: 2,
		eff() {
			return Math.log10(tmp.effL[4] * 10 + 1) / 4 + 1
		},
		effDesc(x) {
			return (x * 100 - 100).toFixed(1)
		}
	},
	3: {
		leThreshold: 3,
		eff() {
			return Math.pow(tmp.effL[0].normal + 1, 0.1) * 2 - 1
		},
		effDesc(x) {
			return x.toFixed(2)
		}
	},
	4: {
		req() {
			return hasBosonicUpg(32)
		},
		leThreshold: 10,
		eff() {
			return tmp.leBonus[4]
		}
	},
	5: {
		req() {
			return hasBosonicUpg(32)
		},
		leThreshold: 13,
		eff() {
			return {
				exp: 0.75 - 0.25 / Math.sqrt(tmp.leBoost / 200 + 1),
				mult: Math.pow(tmp.leBoost / 100 + 1, 1/3),
			}
		},
		effDesc(x) {
			return "(" + shorten(x.mult) + "x+1)^" + x.exp.toFixed(3)
		}
	},
	6: {
		req() {
			return hasBosonicUpg(32)
		},
		leThreshold: 16,
		eff() {
			return Math.pow(3, Math.pow(tmp.effL[2] + 1, 0.25) - 1)
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	7: {
		req() {
			return hasBosonicUpg(32)
		},
		leThreshold: 19,
		eff() {
			return Math.pow(tmp.effL[5] / 150 + 1, 0.25)
		},
		effDesc(x) {
			return (x * 100).toFixed(1)
		}
	},
	8: {
		req() {
			return hasBosonicUpg(32)
		},
		leThreshold: 22,
		eff() {
			return Math.pow(tmp.effL[6] / 500 + 1, 0.125)
		},
		effDesc(x) {
			return (x * 100).toFixed(1)
		}
	},
	9: {
		req() {
			return hasBosonicUpg(62)
		},
		leThreshold: 0,
		eff() {
			return Math.pow(tmp.effL[1] / 10 + 1, 1/3) - 1
		},
		effDesc(x) {
			return x.toFixed(2)
		}
	},
	10: {
		req() {
			return hasBosonicUpg(62)
		},
		leThreshold: 0,
		eff() {
			return 1
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	11: {
		req() {
			return hasBosonicUpg(62)
		},
		leThreshold: 0,
		eff() {
			return 1
		},
		effDesc(x) {
			return shorten(x)
		}
	},
	12: {
		req() {
			return hasBosonicUpg(62)
		},
		leThreshold: 0,
		eff() {
			return 1
		},
		effDesc(x) {
			return shorten(x)
		}
	}
}

function isLEBoostUnlocked(x) {
	let data = leBoosts

	if (!ph.did("ghostify")) return false
	if (!player.ghostify.ghostlyPhotons.unl) return false
	if (x > data.max) return false
	if (data[x].req && !data[x].req()) return false
	return player.ghostify.ghostlyPhotons.enpowerments >= data[x].leThreshold
}

function updateGPHUnlocks() {
	let unl = player.ghostify.ghostlyPhotons.unl
	document.getElementById("gphUnl").style.display = unl ? "none" : ""
	document.getElementById("gphDiv").style.display = unl ? "" : "none"
	document.getElementById("gphRow").style.display = unl ? "" : "none"
	document.getElementById("breakUpgR3").style.display = unl ? "" : "none"
	document.getElementById("bltabbtn").style.display = unl ? "" : "none"
}

function getGPHProduction() {
	let b = tmp.qu.bigRip.active
	if (b) var ret = player.dilation.dilatedTime.div("1e480")
	else var ret = player.dilation.dilatedTime.div("1e930")
	if (ret.gt(1)) ret = ret.pow(0.02)
	if (b && ret.gt(Decimal.pow(2, 444))) ret = ret.div(Decimal.pow(2, 444)).sqrt().times(Decimal.pow(2, 444))
	return ret
}

function updatePhotonsTab(){
	updateRaysPhotonsDisplay()
	updateLightThresholdStrengthDisplay()
	updateLightBoostDisplay()
	updateLEmpowermentPrimary()
	updateLEmpowermentBoosts()
}

function updateRaysPhotonsDisplay(){
	var gphData = player.ghostify.ghostlyPhotons
	document.getElementById("dtGPH").textContent = shorten(player.dilation.dilatedTime)
	document.getElementById("gphProduction").textContent = shorten(getGPHProduction())
	document.getElementById("gphProduction").className = (tmp.qu.bigRip.active ? "gph" : "dm") + "Amount"
	document.getElementById("gphProductionType").textContent = tmp.qu.bigRip.active ? "Ghostly Photons" : "Dark Matter"
	document.getElementById("gph").textContent = shortenMoney(gphData.amount)
	document.getElementById("dm").textContent = shortenMoney(gphData.darkMatter)
	document.getElementById("ghrProduction").textContent = shortenMoney(getGHRProduction())
	document.getElementById("ghrCap").textContent = shortenMoney(getGHRCap())
	document.getElementById("ghr").textContent = shortenMoney(gphData.ghostlyRays)
}

function updateLightBoostDisplay(){
	var gphData = player.ghostify.ghostlyPhotons
	document.getElementById("lightMax1").textContent = getFullExpansion(gphData.maxRed)
	document.getElementById("lightBoost1").textContent = tmp.le[0].toFixed(3)
	document.getElementById("lightBoost2").textContent = tmp.le[1].toFixed(2)
	document.getElementById("lightBoost3").textContent = getFullExpansion(Math.floor(tmp.le[2]))
	document.getElementById("lightBoost4").textContent = (tmp.le[3] * 100 - 100).toFixed(1)
	document.getElementById("lightBoost5").textContent = (tmp.le[4] * 100).toFixed(1) + (hasBosonicUpg(11) ? "+" + (tmp.blu[11] * 100).toFixed(1) : "")
	document.getElementById("lightBoost6").textContent = shorten(tmp.le[5])
	document.getElementById("lightBoost7").textContent = shorten(tmp.le[6])
}

function updateLightThresholdStrengthDisplay(){
	var gphData=player.ghostify.ghostlyPhotons
	for (var c = 0; c < 8; c++) {
		document.getElementById("light" + (c + 1)).textContent = getFullExpansion(gphData.lights[c])
		document.getElementById("lightThreshold" + (c + 1)).textContent = shorten(getLightThreshold(c))
		if (c > 0) document.getElementById("lightStrength" + c).textContent = shorten(tmp.ls[c-1])
	}
}

function updateLEmpowermentPrimary(){
	var gphData = player.ghostify.ghostlyPhotons
	document.getElementById("lightEmpowerment").className = "gluonupgrade "+(gphData.lights[7] >= tmp.leReq ? "gph" : "unavailablebtn")
	document.getElementById("lightEmpowermentReq").textContent = getFullExpansion(tmp.leReq)
	document.getElementById("lightEmpowerments").textContent = getFullExpansion(gphData.enpowerments)
	document.getElementById("lightEmpowermentScaling").textContent = getGalaxyScaleName(tmp.leReqScale) + "Light Empowerments"
	document.getElementById("lightEmpowermentsEffect").textContent = shorten(tmp.leBoost)
}

function updateLEmpowermentBoosts(){
	var boosts = 0
	for (var e = 1; e <= leBoosts.max; e++) {
		var unlocked = isLEBoostUnlocked(e)
		if (unlocked) boosts++
		document.getElementById("le"+e).style.visibility = unlocked ? "visible" : "hidden"
		if (e >= 9) console.log(e, tmp.leBonus[e])
		if (unlocked && leBoosts[e].effDesc) document.getElementById("leBoost" + e).textContent = leBoosts[e].effDesc(tmp.leBonus[e])
	}
	if (boosts >= 1) document.getElementById("leBoost1Total").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].total))
}

function getGHRProduction() {
	var log = player.ghostify.ghostlyPhotons.amount.sqrt().div(2).log10()
	if (player.ghostify.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	return Decimal.pow(10, log)
}

function getGHRCap() {
	var log = player.ghostify.ghostlyPhotons.darkMatter.pow(0.4).times(1e3).log10()
	if (player.ghostify.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	return Decimal.pow(10, log)
}

function getLightThreshold(l) {
	return Decimal.pow(getLightThresholdIncrease(l), player.ghostify.ghostlyPhotons.lights[l]).times(tmp.lt[l])
}

function getLightThresholdIncrease(l) {
	let x = tmp.lti[l]
	if (isNanoEffectUsed("light_threshold_speed")) {
		let y = 1 / tmp.nf.effects.light_threshold_speed
		if (y < 1) x = Math.pow(x, y)
	}
	return x
}

function lightEmpowerment() {
	if (!(player.ghostify.ghostlyPhotons.lights[7] >= tmp.leReq)) return
	if (!player.aarexModifications.leNoConf && !confirm("You will become a ghost, but Ghostly Photons will be reset. You will gain 1 Light Empowerment from this. Are you sure you want to proceed?")) return
	if (!player.ghostify.ghostlyPhotons.enpowerments) document.getElementById("leConfirmBtn").style.display = "inline-block"

	if (player.achievements.includes("ng3p92")) maxLightEmpowerments()
	else player.ghostify.ghostlyPhotons.enpowerments++
	ghostify(false, true)

	if (player.achievements.includes("ng3p91")) return
	player.ghostify.ghostlyPhotons.amount = new Decimal(0)
	player.ghostify.ghostlyPhotons.darkMatter = new Decimal(0)
	player.ghostify.ghostlyPhotons.ghostlyRays = new Decimal(0)
	player.ghostify.ghostlyPhotons.lights = [0,0,0,0,0,0,0,0]
}

function getLightEmpowermentReq(le) {
	if (le === undefined) le = player.ghostify.ghostlyPhotons.enpowerments
	let x = le * 2.4 + 1
	let scale = 0
	if (le >= 20) {
		x += Math.pow(le - 19, 2) / 3
		scale = 1
	}
	if (le >= 50) {
		x += Math.pow(1.2, le - 49) - 1
		scale = 2
	}
	
	if (player.achievements.includes("ng3p95")) x--
	if (hasBosonicUpg(52)) x /= tmp.blu[52]
	tmp.leReqScale = scale
	return Math.floor(x)
}

function maxLightEmpowerments() {
	var uv = player.ghostify.ghostlyPhotons.lights[7]
	var le = player.ghostify.ghostlyPhotons.enpowerments
	var x = 1
	var y = 0
	while (uv >= getLightEmpowermentReq(le + x * 2 - 1)) x *= 2
	while (x >= 1) {
		if (uv >= getLightEmpowermentReq(le + x + y - 1)) y += x
		x /= 2
	}
	player.ghostify.ghostlyPhotons.enpowerments += y
}