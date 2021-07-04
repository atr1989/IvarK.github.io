var mTs = {
	initCosts: {
		time: {
			//Eternity
			241: 1e69,
			251: 1e70, 252: 1e70, 253: 1e70,
			261: 1.5e69, 262: 1.5e69, 263: 1.5e69, 264: 1.5e69, 265: 1.5e69, 266: 1.5e69,

			//Quantum
			271: 0, 272: 1e77,
			281: 1e78, 282: 5e76, 283: 5e76, 284: 1e78,
			291: 2e78, 292: 2e78,
			301: 1e80, 302: 1e78, 303: 1e80,
			311: 1e80, 312: 1e82, 313: 1e82, 314: 1e80,

			//Beginner Mode
			bg_251: 2e69, bg_252: 2e69, bg_253: 2e69,
			bg_261: 2e69, bg_262: 2e69, bg_263: 2e69, bg_264: 2e69, bg_265: 2e69, bg_266: 2e69,

			//Expert Mode
			ex_241: 3e69,
			ex_251: 1e70, ex_252: 1e70, ex_253: 1e70,
			ex_261: 1e70, ex_262: 1e70, ex_264: 3e70,
			ex_281: 4e74, ex_284: 4e74,

			//Death Mode
			dt_251: 1e70,
			dt_265: 3e70
		},
		ec: {
			13: 5e69, 14: 5e69
		},
		dil: {
			7: 2e75, 8: 1e81, 9: 1e85, 10: 1e87, 11: 1e90, 12: 1e92, 13: 1e95, 14: 1e97,
		}
	},
	costs: {
		time: {},
		mults: {
			//Eternity
			t241: 1,
			t251: 3, t252: 3, t253: 3,
			t261: 12, t262: 12, t263: 4, t264: 1, t265: 4, t266: 4,

			//Quantum
			t271: "reset", t272: 1.5,
			t281: 4, t282: 6, t283: 6, t284: 4,
			t291: 5, t292: 5,
			t301: 10, t302: "reset", t303: 10,
			t311: 1 / 2, t312: 16, t313: 16, t314: 1 / 2,

			//Beginner Mode
			t251_bg: 1.5, t252_bg: 1.5, t253_bg: 1.5,
			t261_bg: 2, t262_bg: 2, t264_bg: 1, t265_bg: 1,
			t281_bg: 3, t282_bg: 2, t283_bg: 2, t284_bg: 3,

			//Expert Mode
			t241_ex: 1,
			t251_ex: 6, t252: 3, t253: 3,
			t261_ex: 12, t262_ex: 12, t263_ex: 6, t264_ex: 2, t265_ex: 8, t266_ex: 6,
			t271_ex: 1 / 5e3, t272_ex: 2,
			t281_ex: 6, t282_ex: 1, t283_ex: 1, t284_ex: 6,

			//Death Mode
			t251_dt: 5,
			t261_dt: 10, t262_dt: 10, t263_dt: 10, t264_dt: 16, t265_dt: 16, t266_dt: 10,
			t271_dt: 1 / 2e4,
			t282_ex: 2, t283_ex: 2, 
			t291_dt: 2, t292_dt: 2,
		},
		ec: {},
		dil: {}
	},
	costMult: 1,

	ecReqNums: {
		13() {
			let comps = ECComps("eterc13")
			return (tmp.bgMode ? 850000 : 900000) + (tmp.exMode ? 5e4 : 4.5e4) * Math.pow(comps, 2)
		},
		14() {
			let comps = ECComps("eterc14")
			if (tmp.bgMode) return 1/0
			return Decimal.pow(10, (comps ? 1e6 : 250000) * Math.pow(tmp.dtMode ? 1.8 : tmp.exMode ? 1.6 : 1.5, Math.max(comps - 1, 0)))
		}
	},
	ecReqNumsStored: {},
	ecReqs: {
		13() {
			return player.resets >= mTs.ecReqNumsStored[13]
		},
		14() {
			if (tmp.bgMode) return Math.round(player.replicanti.chance * 100) >= mTs.ecReqNumsStored[14]
			return player.replicanti.amount.gte(mTs.ecReqNumsStored[14])
		}
	},
	ecReqDisplays: {
		13() {
			return getFullExpansion(mTs.ecReqNumsStored[13]) + " Dimension Boosts"
		},
		14() {
			if (tmp.bgMode) return getFullExpansion(mTs.ecReqNumsStored[14]) + "% replicate chance"
			return shortenCosts(mTs.ecReqNumsStored[14]) + " replicantis"
		}
	},

	unlockReqConditions: {
		241() {
			return hasAch("ng3p16") || player.dilation.dilatedTime.gte(1e100)
		},
		271() {
			return mTs.bought >= (tmp.dtMode ? 9 : tmp.exMode ? 8 : 10)
		},
		d7() {
			return enB.glu.engAmt() >= 5.3
		},
		d8() {
			return enB.pos.engAmt() >= 5
		},
		d9() {
			return false
		},
		d10() {
			return false
		},
		d11() {
			return tmp.eds[1].perm >= 10
		},
		d12() {
			return tmp.eds[8].perm >= 10
		},
		d13() {
			return qu_save.nanofield.rewards >= 16
		},
		d14() {
			return hasAch("ng3p34")
		}
	},
	unlockReqDisplays: {
		241() {
			return hasAch("ng3p16") ? undefined : shorten(1e100) + " dilated time"
		},
		271() {
			return (tmp.dtMode ? 9 : tmp.exMode ? 8 : 10) + " bought mastery studies"
		},
		d7() {
			return "5.3 quantum energy"
		},
		d8() {
			return "5 positronic charge"
		},
		d9() {
			return "COMING IN BETA V0.5"
		},
		d10() {
			return "Complete Paired Challenge 4"
		},
		d11() {
			return getFullExpansion(10) + " worker replicants"
		},
		d12() {
			return getFullExpansion(10) + " Eighth Emperor Dimensions"
		},
		d13() {
			return getFullExpansion(16) + " Nanofield rewards"
		},
		d14() {
			return "Get 'The Challenging Day' achievement"
		}
	},
	types: {t: "time", ec: "ec", d: "dil"},
	studies: [],
	unl() {
		return pH.did("quantum") || (tmp.ngp3 && hasDilationUpg("ngpp6"))
	},
	has(x) {
		return mTs.unl() && mTs.studyUnl.includes(x) && (player.masterystudies.includes("t" + x) || player.masterystudies.includes(x))
	},
	timeStudies: [],
	timeStudyEffects: {
		251() {
			if (hasNU(6)) return 0

			let x = player.meta.resets
			x *= (13 / (Math.abs(x / 50) + 1) + 2)
			if (tmp.ngp3_mul) x *= 1.25
			return x
		},
		252() {
			if (hasNU(6)) return 0

			let x = Math.floor(player.dilation.freeGalaxies / 9)
			if (tmp.ngp3_mul) x *= 1.25
			return x
		},
		253() {
			if (hasNU(6)) return 0

			let x = Math.floor(getTotalRGs() / 7) * 2
			if (tmp.ngp3_mul) x *= 1.25
			return x
		},
		265() {
			let x = doubleMSMult(tmp.rep ? tmp.rep.baseChance : 0)
			return Decimal.pow(x, hasMTS(283) ? getMTSMult(283, "update") : 0.6)
		},

		271() {
			let log = tmp.rm.log10()
			let dLog = Math.max(Math.log10(log), 0)
			let str = Math.pow(Math.max(dLog / 5 + 1, 1), 2)

			return Decimal.pow(10, Math.pow(log, 2 - 1 / str) * Math.pow(10, 5 / str - 5) * str).max(tmp.rm)
		},
		281() {
			return Math.sqrt(player.dilation.dilatedTime.add(1).log10()) * 1.2
		},
		283() {
			let x = tmp.rep ? tmp.rep.baseChance : 0
			let log = Math.max(Math.log10(x), 0)
			return Math.pow(x / 2e7 + 1, 0.1) - 0.4
		},
		284() {
			let x = Math.pow(
				Math.pow(player.galaxies, 0.75) +
				Math.pow(getTotalRGs(), 0.75) +
				Math.pow(player.dilation.freeGalaxies, 0.75)
			, 2) / 4000
			return x
		},
		291() {
			let rep = getReplEff().max(1).log10()
			return Math.log10(rep / 1e5 + 1) / 20 + 1
		},
		292() {
			let rg = getFullEffRGs()
			return Math.log10(rg / 1e3 + 1) / 3 + 1
		},

		311() {
			return Math.min(Math.log10(qu_save.colorPowers.r + 1) / 2, 1)
		},
		312() {
			return Math.min(Math.pow(qu_save.colorPowers.g + 1, 0.15) - 1, 1)
		},
		313() {
			let tpLog = player.dilation.tachyonParticles.max(1).log10()
			let bpLog = colorBoosts.b_base2 ? colorBoosts.b_base2.log10() : 0

			return Math.pow(tpLog / 100, 0.75) * Math.pow(bpLog, 0.25) / 8 + 1
		},
	},
	eff(id, uses = "") {
		if (uses == "" && this.studyUnl.includes(id)) return mTs_tmp[id]
		return this.timeStudyEffects[id](uses)
	},
	timeStudyDescs: {
		241: "The IP mult multiplies IP gain by 2.1x per upgrade.",
		251: "Remote galaxy scaling starts later based on Meta-Dimension Boosts.",
		252: "Remote galaxy scaling starts later based on Tachyonic Galaxies.",
		253: "Remote galaxy scaling starts later based on total Replicated Galaxies.",
		261: () => "Dimension Boost cost scales by " + doubleMSMult(0.5) + " less.",
		262: () => "The power of meta-antimatter effect is increased by ^" + doubleMSMult(0.5) + ".",
		263: () => "Tachyonic Galaxies are " + doubleMSMult(25) + "% stronger.",
		264: () => "You gain " + doubleMSMult(5) + "x more Tachyon Particles.",
		265: () => "Replicate chance can go above 100%, with a bonus.",
		266: () => "Reduce the post-400 replicated galaxy scaling.",

		271: () => "Replicantis boost Infinity Dimensions greatly more.",
		272: () => "Add +25% to red power effect, but divide red power by 5.",

		281: () => "Before boosts, dilated time adds OoMs to replicate interval slowdown.",
		282: () => "Replicate interval can go below 1ms, but starts to scale faster.",
		283: () => "Replicate chance above 100% has a greater bonus to itself.",
		284: () => "Total galaxies add OoMs to replicate interval slowdown.",

		291: () => "Replicantis multiply Dimension Boosts.",
		292: () => "Replicated Galaxies raise Replicanti multiplier to an exponent instead.",

		301: () => "Replicated Galaxies work effective equally.",
		302: () => "Strengthen some Replicanti boosts.",
		303: () => "All Replicanti boosts are based on replicanti multiplier instead.",

		311: () => "Red power boosts Replicated and Tachyonic Galaxies with TS232's power.",
		312: () => "Green power boosts Tachyonic Galaxies with Replicated Galaxies' strength.",
		313: () => "Blue power effect boosts itself; but Tachyonic Particles also boost it.",
		314: () => "Every color power adds the suceeding color power."
	},
	timeStudyTitles: {
		241: "Multiplier Overcharge",
		251: "Meta-Energetic Galaxies", 252: "Time Channelling", 253: "Replicanti Radar",
		261: "Dimension Superboost", 262: "Meta Mastery", 263: "Tachyonic Mastery", 264: "Tachyonic Boost", 265: "Replicanti Luck", 266: "Galactic Overseer",
		271: "Replicanti Takeover", 272: "Knowledge of Quarks",
		281: "Time Augment-RP", 282: "Rep. Augment-TM", 283: "Replicanti Self-Luck", 284: "Type-IV Goo",
		291: "Dimensional Acknowledge", 292: "Galactic Insurance",
		301: "Replicanti Equality", 302: "Replicanti Foam", 303: "Multiplier Based",
		311: "Study Code: Red", 312: "Lucidious Jump", 313: "Blue Condenser", 314: "Color Circuit"
	},
	hasStudyEffect: [251, 252, 253, 265, 271, 281, 283, 284, 291, 292, 311, 312, 313],
	studyEffectDisplays: {
		251(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		252(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		253(x) {
			return "+" + getFullExpansion(Math.floor(x))
		},
		265(x) {
			return "^" + shorten(x)
		},
		281(x) {
			return "+" + shorten(x * getReplSpeedExpMult()) + " OoMs"
		},
		283(x) {
			return "^x^0.6 -> ^x^" + shorten(x)
		},
		284(x) {
			return "+" + shorten(x) + " OoMs"
		},
		292(x) {
			return "^" + x.toFixed(3)
		},
		311(x) {
			return formatPercentage(Math.pow(tsMults[232](), x) - 1) + "% (^" + x.toFixed(3) + " power)"
		},
		312(x) {
			return formatPercentage(Math.pow(getReplGalaxyEff(), x) - 1) + "% (^" + x.toFixed(3) + " power)"
		},
		313(x) {
			return "^" + shorten(x)
		},
	},
	ecsUpTo: 14,
	unlocksUpTo: 14,
	allConnections: {
		//Eternity
		241: [251, 253, 252],
		251: [261, 262], 252: [263, 264], 253: [265, 266],
		261: ["ec13"], 262: ["ec13"], 263: ["ec13"], 264: ["ec14"], 265: ["ec14"], 266: ["ec14"],

		//Quantum
		ec13: ["d7"], ec14: ["d7"], d7: [271],
		271: [272, 281, 282, 283, 284],
		281: [291, 302], 282: [302], 283: [302], 284: [292, 302],
		291: [311], 292: [314],
		302: [301, "d8", 303],
		311: [312], 314: [313],

		//No more mastery studies after that
		d8: ["d9"], d9: ["d10"], d10: ["d11"], d11: ["d12"], d12: ["d13"], d13: ["d14"],

		//Expert Mode
		ex_264: [],
		ex_282: [], ex_283: [], ex_284: [292],

		//Death Mode
		dt_265: [],
		dt_281: [291], dt_282: [302], dt_283: [302],
	},
	allUnlocks: {
		d7() {
			return pH.did("quantum")
		},
		r27() {
			return pos.unl()
		}
	},
	studyUnl: [],
	spentable: [],
	latestBoughtRow: 0,
	ttSpent: 0,
	respec(quick) {
		var respecedMS = []
		player.timestudy.theorem += mTs.ttSpent
		for (var id = 0; id < player.masterystudies.length; id++) {
			var d = player.masterystudies[id].split("d")[1]
			if (d) respecedMS.push(player.masterystudies[id])
		}
		player.masterystudies = respecedMS

		if (player.respecMastery) respecMasteryToggle()
		if (player.eternityChallUnlocked >= 13) resetEternityChallUnlocks()
		respecUnbuyableTimeStudies()
		updateMasteryStudyCosts()

		if (quick) return
		maybeShowFillAll()
		updateMasteryStudyButtons()
		drawMasteryTree()
	},
	updateTmp() {
		mTs_tmp = {}
		if (!this.unl()) return

		var studies = this.studyUnl
		for (var s = 0; s <= studies.length; s++) {
			var study = studies[s]
			if (this.hasStudyEffect.includes(study)) mTs_tmp[study] = this.timeStudyEffects[study]("")
		}
	}
}
var mTs_tmp = {}

let MASTERY_STUDIES = mTs
let hasMTS = mTs.has

function enterMasteryPortal() {
	if (mTs.unl()) {
		recordUpDown(1)
		showEternityTab("masterystudies")
	}
}

function exitMasteryPortal() {
	recordUpDown(2)
	showEternityTab("timestudies")
}

function convertMasteryStudyIdToDisplay(x) {
	x = x.toString()
	var ec = x.split("ec")[1]
	var dil = x.split("d")[1]
	return ec ? "ec" + ec + "unl" : dil ? "dilstudy" + dil : "mts" + x
}

function updateMasteryStudyCosts() {
	var oldBought = mTs.bought
	mTs.latestBoughtRow = 0
	mTs.baseCostMult = hasAch("ng3p12") ? 0.5 : 1
	mTs.costMult = mTs.baseCostMult
	mTs.bought = 0
	mTs.ttSpent = 0
	for (id = 0; id<player.masterystudies.length; id++) {
		var t = player.masterystudies[id].split("t")[1]
		if (t) {
			var costMult = getMasteryStudyCostMult("t" + t)

			setMasteryStudyCost(t, "t")
			mTs.ttSpent += mTs.costs.time[t] < 1/0 ? mTs.costs.time[t] : 0
			mTs.costMult = costMult == "reset" ? mTs.baseCostMult : mTs.costMult * costMult
			mTs.latestBoughtRow = Math.max(mTs.latestBoughtRow,Math.floor(t/10))
			mTs.bought++
		}
	}
	for (id = 0; id < mTs.timeStudies.length; id++) {
		var name = mTs.timeStudies[id]
		if (!mTs.studyUnl.includes(name)) break
		if (!player.masterystudies.includes("t"+name)) setMasteryStudyCost(name,"t")
	}
	for (id = 13; id <= mTs.ecsUpTo; id++) {
		if (!mTs.studyUnl.includes("ec" + id)) break
		setMasteryStudyCost(id, "ec")
		mTs.ecReqNumsStored[id] = mTs.ecReqNums[id]()
	}
	for (id = 7; id <= mTs.unlocksUpTo; id++) {
		if (!mTs.studyUnl.includes("d" + id)) break
		setMasteryStudyCost(id, "d")
	}
	if (oldBought != mTs.bought) updateSpentableMasteryStudies()
	updateMasteryStudyTextDisplay()
}

function setupMasteryStudies() {
	mTs.studies = [241]
	mTs.timeStudies = []

	if (!mTs.unl()) return

	var map = mTs.studies
	var part
	var pos = 0
	while (true) {
		var id = map[pos]
		if (!id) {
			if (!part) break
			map.push(part)
			id = part
			part = ""
		}
		if (typeof(id) == "number") mTs.timeStudies.push(id)
		var paths = getMasteryStudyConnections(id)
		if (paths !== undefined) for (var x = 0; x < paths.length; x++) {
			var y = paths[x]
			if (!map.includes(y)) {
				if (y.toString()[0] == "d") part = y
				else map.push(y)
			}
		}
		pos++
	}

	updateUnlockedMasteryStudies()
	updateSpentableMasteryStudies()
}

function setupMasteryStudiesHTML() {
	setupMasteryStudies()

	for (id = 0; id < mTs.timeStudies.length; id++) {
		var name = mTs.timeStudies[id]
		var html = "<span id='mts" + name + "Desc'></span>"

		if (mTs.hasStudyEffect.includes(name)) html += "<br>Currently: <span id='mts" + name + "Current'></span>"
		html += "<br>Cost: <span id='mts" + name + "Cost'></span> Time Theorems"
		html += "<span id='mts" + name + "Req'></span>"

		getEl("mts" + name).innerHTML = html
		getEl("mts" + name).className = "timestudy"
	}
}

function getMasteryStudyConnections(id) {
	let f = mTs.allConnections
	let r = f[id] || []

	if (tmp.bgMode) r = f["bg_" + id] || r
	if (tmp.exMode) r = f["ex_" + id] || r
	if (tmp.dtMode) r = f["dt_" + id] || r

	return r
}

function updateUnlockedMasteryStudies() {
	var unl = true
	var rowNum = 0
	mTs.studyUnl = []
	for (var x = 0; x < mTs.studies.length; x++) {
		var id = mTs.studies[x]
		var divid = convertMasteryStudyIdToDisplay(id)
		if (Math.floor(id / 10) > rowNum) {
			rowNum = Math.floor(id / 10)
			if (mTs.allUnlocks["r" + rowNum] && !mTs.allUnlocks["r" + rowNum]()) unl = false
			getEl(divid).parentElement.parentElement.parentElement.parentElement.style = unl ? "" : "display: none !important"
			if (unl) mTs.studyUnl.push("r"+rowNum)
		}
		if (mTs.allUnlocks[id] && !mTs.allUnlocks[id]()) unl = false

		var localUnl = unl
		if (id[0] == "d") {
			localUnl = (id.split("d")[1] <= 7 || hasDilationStudy(parseInt(id.split("d")[1]) - 1) || hasDilationStudy(id)) && (pH.did("ghostify") || !mTs.allUnlocks[id] || mTs.allUnlocks[id]())
			if (localUnl) getEl(divid).parentElement.parentElement.parentElement.parentElement.style = ""
		}
		if (localUnl) mTs.studyUnl.push(id)
		getEl(divid).style.visibility = localUnl ? "" : "hidden"
	}
}

function updateSpentableMasteryStudies() {
	mTs.spentable = []
	addSpentableMasteryStudies(241)
}

function addSpentableMasteryStudies(x) {
	var map = [x]
	var part
	var pos = 0
	while (true) {
		var id = map[pos]
		if (!id) break

		var isNum = typeof(id) == "number"
		var ecId = !isNum && id.split("ec")[1]
		var dId = !isNum && id[0] == "d"

		var canAdd = false
		if (ecId) canAdd = ECComps("eterc" + ecId) >= 1
		else if (dId) canAdd = true
		else canAdd = player.masterystudies.includes(isNum ? "t" + id : id)

		if (mTs.studyUnl.includes(id) && !mTs.spentable.includes(id)) mTs.spentable.push(id)
		if (canAdd) {
			var paths = getMasteryStudyConnections(id)
			if (paths) for (var x = 0; x < paths.length; x++) {
				var subPath = paths[x]
				if (!map.includes(subPath)) map.push(subPath)
			}
		}
		pos++
	}
}

function setMasteryStudyCost(id, type) {
	let d = mTs.initCosts
	let t = mTs.types[type]
	let f = d[t]
	let r = f[id] || 0

	if (tmp.bgMode) r = f["bg_" + id] || r
	if (tmp.exMode) r = f["ex_" + id] || r
	if (tmp.dtMode) r = f["dt_" + id] || r

	mTs.costs[t][id] = r * (type == "d" ? 1 : mTs.costMult)
}

function getMasteryStudyCostMult(id) {
	let d = mTs.costs.mults
	let r = d[id] || 1

	if (tmp.bgMode) r = d[id + "_bg"] || r
	if (tmp.exMode) r = d[id + "_ex"] || r
	if (tmp.dtMode) r = d[id + "_dt"] || r

	if (id.split("t")[1] < 290 && tmp.ngp3_mul && tmp.bgMode) r = Math.sqrt(r)

	return r
}

function buyingD7Changes() {
	showTab("quantumtab")
	showQuantumTab("positrons")
	getEl("positronstabbtn").style.display = ""

	enB.update("pos")
	pos.updateTmp()
}

function buyingDilStudyForQC() {
	qMs.updateDisplay()
	getEl("qctabbtn").style.display = ""

	QCs.tp()
	QCs.updateTmp()
	QCs.updateDisp()
}

function buyingDilStudyReplicant() {
	showTab("quantumtab")
	showQuantumTab("replicants")
	updateReplicants()
}

function buyingDilStudyED() {
	showTab("dimensions")
	showDimTab("emperordimensions")
	getEl("edtabbtn").style.display = ""
	updateReplicants()
}

function buyingDilStudyNanofield() {
	showTab("quantumtab")
	showQuantumTab("nanofield")
	getEl("nanofieldtabbtn").style.display = ""
	updateNanoRewardTemp()
}

function buyingDilStudyToD() {
	showTab("quantumtab")
	showQuantumTab("tod")
	updateColorCharge()
	updateTODStuff()
}

function buyingDilationStudy(id){
	if (id == 7) buyingD7Changes()
	if (id == 8 || id == 9 || id == 14) buyingDilStudyForQC()
	if (id == 9) updateGluonsTabOnUpdate()
	if (id == 10) buyingDilStudyReplicant()
	if (id == 11) buyingDilStudyED()
	if (id == 12) buyingDilStudyNanofield()
	if (id == 13) buyingDilStudyToD()
}

function buyMasteryStudy(type, id, quick=false) {
	if (quick) setMasteryStudyCost(id,type)
	if (!canBuyMasteryStudy(type, id)) return
	player.timestudy.theorem -= mTs.costs[mTs.types[type]][id]
	if (type == 'ec') {
		player.eternityChallUnlocked = id
		player.etercreq = id
		updateEternityChallenges()
	} else player.masterystudies.push(type + id)
	if (type == "t") {
		addSpentableMasteryStudies(id)
		if (quick) {
			var mult = getMasteryStudyCostMult("t" + id)
			mTs.costMult = mult == "reset" ? mTs.baseCostMult : mTs.costMult * mult
			mTs.latestBoughtRow = Math.max(mTs.latestBoughtRow, Math.floor(id / 10))
			mTs.bought++
		}
		if (id == 241) bumpInfMult()
		if (id == 266 && player.replicanti.gal >= 400) {
			var gal = player.replicanti.gal
			player.replicanti.gal = 0
			player.replicanti.galCost = new Decimal(inNGM(2) ? 1e110 : 1e170)
			player.replicanti.galCost = getRGCost(gal)
			player.replicanti.gal = gal
		}
	}
	if (type == "d") buyingDilationStudy(id)
	if (!quick) {
		if (type == "ec") {
			showTab("challenges")
			showChallengesTab("eternitychallenges")
		} else if (type == "d") {
			updateUnlockedMasteryStudies()
			updateSpentableMasteryStudies()
		}
		updateMasteryStudyCosts()
		updateMasteryStudyButtons()
		drawMasteryTree()
	}
}

function canBuyMasteryStudy(type, id) {
	if (type == 't') {
		if (player.timestudy.theorem < mTs.costs.time[id] || player.masterystudies.includes('t' + id) || player.eternityChallUnlocked > 12 || !mTs.timeStudies.includes(id)) return false
		if (mTs.latestBoughtRow - (tmp.bgMode || tmp.ngp3_mul && !tmp.exMode ? 1 : 0) > Math.floor(id / 10)) return false
		if (!mTs.spentable.includes(id)) return false
		if (mTs.unlockReqConditions[id] && !mTs.unlockReqConditions[id]()) return false

		//Death Mode
		if (tmp.dtMode && mTs.latestBoughtRow <= 26 && (id != "t264" && id != "t265") && (hasMTS(264) || hasMTS(265))) return false
	} else if (type == 'd') {
		if (player.timestudy.theorem < mTs.costs.dil[id] || player.masterystudies.includes('d' + id)) return false
		if (!pH.did("ghostify") && !(mTs.unlockReqConditions["d" + id] && mTs.unlockReqConditions["d" + id]())) return false
		if (!mTs.spentable.includes("d" + id)) return false
	} else {
		if (player.timestudy.theorem < mTs.costs.ec[id] || player.eternityChallUnlocked) return false
		if (!mTs.spentable.includes("ec" + id)) return false
		if (player.etercreq == id) return true
		return mTs.ecReqs[id]()
	}
	return true
}
	
function updateMasteryStudyButtons() {
	if (!tmp.ngp3) return
	for (id = 0; id < mTs.studyUnl.length; id++) {
		var name = mTs.studyUnl[id]
		if (name + 0 == name) {
			var className = "timestudy"
			var div = getEl("mts" + name)
			if (!hasMTS(name) && !canBuyMasteryStudy('t', name)) className = "timestudylocked"
			else {
				if (hasMTS(name)) className += "bought"
				if (name > 270) className += " elcstudy"
			}
			if (div.className !== className) div.className = className
			if (mTs.hasStudyEffect.includes(name)) {
				var mult = getMTSMult(name)
				if (mult) getEl("mts" + name + "Current").textContent = (mTs.studyEffectDisplays[name] !== undefined ? mTs.studyEffectDisplays[name](mult) : shorten(mult) + "x")
			}
		}
	}
	for (id = 13; id <= mTs.ecsUpTo; id++) {
		var div = getEl("ec" + id + "unl")
		if (!mTs.studyUnl.includes("ec" + id)) break
		if (player.eternityChallUnlocked == id) div.className = "eternitychallengestudybought"
		else if (canBuyMasteryStudy('ec', id)) div.className = "eternitychallengestudy"
		else div.className = "timestudylocked"
	}
	for (id = 7; id <= mTs.unlocksUpTo; id++) {
		var div = getEl("dilstudy" + id)
		if (!mTs.studyUnl.includes("d" + id)) break
		if (player.masterystudies.includes("d" + id)) div.className = "dilationupgbought"
		else if (canBuyMasteryStudy('d', id)) div.className = "dilationupg"
		else div.className = "timestudylocked"
	}
}

function updateMasteryStudyTextDisplay() {
	if (!tmp.ngp3) return
	getEl("costmult").textContent = shorten(mTs.costMult)
	getEl("totalmsbought").textContent = mTs.bought
	getEl("totalttspent").textContent = shortenDimensions(mTs.ttSpent)
	for (var i = 0; i < mTs.timeStudies.length; i++) {
		var name = mTs.timeStudies[i]
		if (!mTs.studyUnl.includes(name)) break

		var req = mTs.unlockReqDisplays[name] && mTs.unlockReqDisplays[name]()
		getEl("mts" + name + "Cost").textContent = shortenDimensions(mTs.costs.time[name])
		if (req) getEl("mts" + name + "Req").innerHTML = "<br>Requirement: " + req
	}
	for (id = 13; id <= mTs.ecsUpTo; id++) {
		if (!mTs.studyUnl.includes("ec" + id)) break
		getEl("ec" + id + "Cost").textContent = "Cost: " + shorten(mTs.costs.ec[id]) + " Time Theorems"
		getEl("ec" + id + "Req").style.display = player.etercreq == id ? "none" : "block"
		getEl("ec" + id + "Req").textContent = "Requirement: " + mTs.ecReqDisplays[id]()
	}
	for (id = 7; id <= mTs.unlocksUpTo; id++) {
		if (!mTs.studyUnl.includes("d" + id)) break
		var req = mTs.unlockReqDisplays["d" + id] && mTs.unlockReqDisplays["d" + id]()
		getEl("ds" + id + "Cost").textContent = "Cost: " + shorten(mTs.costs.dil[id]) + " Time Theorems"
		if (req) getEl("ds" + id + "Req").innerHTML = pH.did("ghostify") ? "" : "<br>Requirement: " + req
	}
}

function drawMasteryBranch(id1, id2) {
	var type1 = id1.split("ec")[1] ? "c" : id1.split("dil")[1] ? "d" : id1.split("mts")[1] ? "t" : undefined
	var type2 = id2.split("ec")[1] ? "c" : id2.split("dil")[1] ? "d" : id2.split("mts")[1] ? "t" : undefined
	var start = getEl(id1).getBoundingClientRect();
	var end = getEl(id2).getBoundingClientRect();
	var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
	msctx.lineWidth = 15;
	msctx.beginPath();
	var drawBoughtLine = true
	if (type1 == "t" || type1 == "d") drawBoughtLine = player.masterystudies.includes(type1 + (id1.split("study")[1] || id1.split("mts")[1]))
	if (type2 == "t" || type2 == "d") drawBoughtLine = drawBoughtLine && player.masterystudies.includes(type2 + (id2.split("study")[1] || id2.split("mts")[1]))
	if (type2 == "c") drawBoughtLine = drawBoughtLine && player.eternityChallUnlocked == id2.slice(2,4)
	if (drawBoughtLine) {
		if (type2 == "d" && player.options.theme == "Aarex's Modifications") {
			msctx.strokeStyle = parseInt(id2.split("study")[1]) < 8 ? "#D2E500" : parseInt(id2.split("study")[1]) > 9 ? "#333333" : "#009900";
		} else if (type2 == "c") {
			msctx.strokeStyle = "#490066";
		} else {
			msctx.strokeStyle = "#000000";
		}
	} else if (type2 == "d" && player.options.theme == "Aarex's Modifications") {
		msctx.strokeStyle = parseInt(id2.split("study")[1]) < 8 ? "#697200" : parseInt(id2.split("study")[1]) > 11 ? "#727272" : parseInt(id2.split("study")[1]) > 9 ? "#262626" : "#006600";
	} else msctx.strokeStyle = "#444";
	msctx.moveTo(x1, y1);
	msctx.lineTo(x2, y2);
	msctx.stroke()
}

function drawMasteryTree() {
	msctx.clearRect(0, 0, msc.width, msc.height);
	if (player === undefined) return
	if (getEl("eternitystore").style.display === "none" || getEl("masterystudies").style.display === "none" || player.masterystudies === undefined) return

	drawMasteryBranch("back", "mts241")
	for (var x = 0; x < mTs.studies.length; x++) {
		var id = mTs.studies[x]
		var paths = getMasteryStudyConnections(id)
		if (!mTs.studyUnl.includes(id)) break
		if (paths) for (var y = 0; y < paths.length; y++) if (mTs.studyUnl.includes(paths[y])) drawMasteryBranch(convertMasteryStudyIdToDisplay(id), convertMasteryStudyIdToDisplay(paths[y]))
	}

	for (var x = 0; x < mTs.timeStudies.length; x++) {
		var id = mTs.timeStudies[x]
		var d = mTs[shiftDown ? "timeStudyTitles" : "timeStudyDescs"][id]
		getEl("mts" + id + "Desc").innerHTML = (typeof(d)=="function" ? d() : d) || (shiftDown ? "Unknown title." : "Unknown desc.")

		if (shiftDown) {
			if (!mTs.studyUnl.includes(id)) break

			var start = getEl("mts" + id).getBoundingClientRect();
			var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
			var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
			var mult = getMasteryStudyCostMult("t" + id)
			var msg = "MS" + (id - 230) + " (" + (mult == "reset" ? "reset" : mult >= 1e3 ? shorten(mult) + "x" : mult.toFixed(2 - Math.floor(Math.log10(mult))) + "x") + ")"

			msctx.fillStyle = 'white';
			msctx.strokeStyle = 'black';
			msctx.lineWidth = 3;
			msctx.font = "15px Typewriter";
			msctx.strokeText(msg, x1 - start.width / 2, y1 - start.height / 2 - 1);
			msctx.fillText(msg, x1 - start.width / 2, y1 - start.height / 2 - 1);
		}
	}
}

function getMasteryStudyMultiplier(id, uses = ""){
	return mTs.eff(id, uses)
}

function getMTSMult(id, uses = ""){
	return mTs.eff(id, uses)
}

var upDown = {
	point: 0,
	times: 0
}

function recordUpDown(x) {
	if (upDown.point>0&&upDown.point==x) return
	upDown.point=x
	upDown.times++
	if (upDown.times>=200) giveAchievement("Up and Down and Up and Down...")
}