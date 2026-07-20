let modInfo = {
	name: "The Rhythm Game Tree",
	author: "Justcubing97",
	pointsName: "Musical Essence",
	modFiles: ["a.js", "notes.js", "songs.js", "ddr.js", "tree.js", "ddrm.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "2.0",
	name: "DDR minigame release",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v2.0</h2><br>
		- Fixed CSS for upgrades. <br>
        - New DDR minigame! <br>
        - Implemented one Arrow upgrade. <br><br>
	<h3>v1.1</h3><br>
		- Fixed CSS for elements. <br><br>
	<h2>v1.0</h2><br>
		- Three layers: Notes, Songs, and DDR! <br>
		- 7 Achievements.`

let winText = `Congratulations! You have reached the end and beaten this game as of ${VERSION.num}! If the version number is below 7, there's still more content!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "arrowClicking_DDRM"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

    let layer;
	let mult = new Decimal(1)
    //add
    layer = "n"
    if (hasUpgrade(layer, 23)) mult = mult.add(4)
    if (hasUpgrade(layer, 101)) mult = mult.add(3)
    if (hasUpgrade(layer, 103)) mult = mult.add(10)
    //mul
    layer = "n"
    if (hasUpgrade(layer, 11)) mult = mult.mul(2)
    if (hasUpgrade(layer, 12)) mult = mult.mul(upgradeEffect(layer, 12))
    if (hasUpgrade(layer, 14)) mult = mult.mul(4)
    if (hasUpgrade(layer, 21)) mult = mult.mul(6)
    if (hasUpgrade(layer, 34)) mult = mult.mul(4)
    if (hasUpgrade(layer, 102)) mult = mult.mul(upgradeEffect(layer, 102))
    if (hasUpgrade(layer, 202)) mult = mult.mul(500)
    if (hasUpgrade(layer, 42)) mult = mult.mul(1000)
    if (hasUpgrade(layer, 43)) mult = mult.mul(upgradeEffect(layer, 43))
    if (hasUpgrade(layer, 44)) mult = mult.mul(2500)
    if (hasUpgrade(layer, 112)) mult = mult.mul("2e4")

    layer = "s"
    if (hasUpgrade(layer, 11)) mult = mult.mul(upgradeEffect(layer, 11))
    if (hasUpgrade(layer, 13)) mult = mult.mul(upgradeEffect(layer, 13))
    if (hasUpgrade(layer, 23)) mult = mult.mul(125)

    layer = "ddr"
    if (hasUpgrade(layer, 11)) mult = mult.mul(upgradeEffect(layer, 11))
    //exp
    layer = "n"
    if (hasUpgrade(layer, 201)) mult = mult.pow(1.05)
    //hyper
    layer = "n"
    //time dilations/chals
    layer = "n"
    layer = "s"
    if (inChallenge(layer, 11)) mult = mult.pow(0.5)
    //finals
    layer = "n"
	return mult
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
    "Current endgame: 2 Arrows and have Arrow upgrade 1",
    "The Rhythm Game Tree made by Justcubing97",
]

// Determines when the game "ends"
function isEndgame() {
	return player.ddr.points.gte(2) && hasUpgrade("ddr", 11)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

/*

addLayer("[LAYER HERE]", {
    name: "[LAYER HERE]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "[SYMBOL HERE]", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: [POSITION HERE], // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "[COLOR HERE]",
    requires: new Decimal([NUMBER HERE]), // Can be a function that takes requirement increases into account
    resource: "[CURRENCY HERE]", // Name of prestige currency
    baseResource: "[CURRENCY HERE]", // Name of resource prestige is based on
    baseAmount() {return player.[LAYER HERE].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: [NUMBER HERE], // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        //add
        //mul
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //do everything inside the gainMult()
    row: [ROW HERE], // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "[KEY HERE]", description: "[KEY HERE]: Reset for [CURRENCY HERE", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.[LAYER HERE].unlocked},
    passiveGeneration() {[PASSIVE GEN REQUIREMENT HERE]},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    upgrades: {
        11: {
            title: "placeholder",
            description: "???",
            cost: new Decimal("1e234987234987234"),
        },
    },
    tooltip() {return format(player.[LAYER HERE].points) + " [CURRENCY HERE] (+" + format(getResetGain([LAYER HERE])) + " [CURRENCY HERE] on reset)"},
})

*/