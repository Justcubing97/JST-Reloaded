let modInfo = {
	name: "JST: Reloaded",
	author: "Justcubing97",
	pointsName: "Points",
	modFiles: ["achievements.js", "logarithmicscale.js", "conway.js", "fundamental.js", "primitive.js", "arithmetic.js", "addition.js", "subtraction.js", "multiplication.js", "dimension.js", "polygon.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "JST:R release",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v1.0</h2><br>
		- Everything up to Polygon layer! <br>
		- New side layers: Logarithmic Scale and Conway's Game of Life <br>
        - Reworked achievements to be more spread out, like TRGT and the later half of JST:C. <br><br>
    <h3>Changes from classic JST</h3><br>
		- Improved softcap logic <br>
		- Added shorthands for currencies (like in TRGT) <br>
		- Slightly reworked upgrades in Fundamental layer <br>
		- Removed Unlock layer (therefore, no lore, but maybe later!) <br>
		- Reworked Primitive milestones <br>
		- Primitive main gimmick is now currency multipliers <br>
		- Reworked Arithmetic upgrades <br>
		- Shifted Addition, Subtraction, and Multiplication unlocks <br>
		- Arithmetic main gimmicks are Variables and Functions <br>
		- Reworked Arithmetic Challenges <br>
		- Just barely changed Addition gimmick (core idea is still there) <br>
		- COMPLETELY overhauled Subtraction mechanic (Division's mechanic will be changed to account for this) <br>
		- Reworked The Multiplication Tree's upgrade layout <br>
		- Dimensions now use Points instead of Numbers <br>
		- Slightly changed node appearances of row 3 layers (+, -, ×, ÷) <br>
		- Reworked achievements<br>
		- Achievements are now color-coded<br>
		- Version number no longer counts in 0.1 increments<br>
		- UI now reflects that of TRGT<br>
    `

let winText = `Congratulations! You have reached the end and beaten this game as of ${VERSION.num}! There's still more content if you haven't reached Dark Matter!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",
    "findEqPointsMult_ARH",
    "findIneqMult_ARH",
    "convertTo_ADD",
]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    softcap1: new Decimal(0.25),
    softcap1Start: new Decimal("1e10000"),
    softcap2: new Decimal(0.25),
    softcap2Start: new Decimal("1e250000"),
    softcap3: new Decimal(0.25),
    softcap3Start: new Decimal("e1e7"),
}}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

    let layer;
	let mult = new Decimal(1)
    //add
    layer = "f"
    if (!getClickableState("sub", 1001) || (getClickableState("sub", 1001) && !getClickableState("sub", 24))){
        if (hasUpgrade(layer, 13)) mult = mult.add(1)
        if (hasUpgrade(layer, 16)) mult = mult.add(5)
        if (hasUpgrade(layer, 27)) mult = mult.add(25)
    }
        
    layer = "p"
    if (hasMilestone(layer, 2)) mult = mult.add(10)

    layer = "add"

    mult = mult.add(player.add.additionTypePoint.pow(5))
    //mul
    layer = "f"
    if (!getClickableState("sub", 1001) || (getClickableState("sub", 1001) && !getClickableState("sub", 24))){
        if (hasUpgrade(layer, 11)) mult = mult.mul(2)
        if (hasUpgrade(layer, 12)) mult = mult.mul(3)
        if (hasUpgrade(layer, 15)) mult = mult.mul(2)
        if (hasUpgrade(layer, 14)) mult = mult.mul(5)
        if (hasUpgrade(layer, 17)) mult = mult.mul(upgradeEffect(layer, 17))
        if (hasUpgrade(layer, 24)) mult = mult.mul(150)
        if (hasUpgrade(layer, 25)) mult = mult.div(10)
        if (hasUpgrade(layer, 26)) mult = mult.mul(75)
        if (hasUpgrade(layer, 33)) mult = mult.mul(upgradeEffect(layer, 33))
        if (hasUpgrade(layer, 34)) mult = mult.mul("1e10")
        if (hasUpgrade(layer, 36)) mult = mult.mul("2e5")
        if (hasUpgrade(layer, 37)) mult = mult.mul("21e6")
    }

    if (hasUpgrade(layer, 41)) mult = mult.mul(377377377)

    layer = "p"
    if (hasMilestone(layer, 2)) mult = mult.mul(10)
    if (hasMilestone(layer, 7)) mult = mult.mul(250)
    if (hasMilestone(layer, 10)) mult = mult.mul("1e6")

    mult = mult.mul(buyableEffect(layer, 12))
    if (hasAchievement("a", 17)) mult = mult.mul(buyableEffect(layer, 13))
    if (hasAchievement("a", 26)) mult = mult.mul(buyableEffect(layer, 11).pow(0.1))

    layer = "ar"
    if (hasUpgrade(layer, 11)) mult = mult.mul(upgradeEffect(layer, 11))
    if (hasUpgrade(layer, 14)) mult = mult.mul("1e6")
    if (hasMilestone(layer, 11)) mult = mult.mul(milestoneEffect(layer, 11))
        
    if (hasMilestone(layer, 1)) mult = mult.mul(player.ar.functionE1)
        
    layer = "sub"
    if (hasUpgrade(layer, 14)) mult = mult.mul("1e40")
        
    layer = "mul"
    if (hasUpgrade(layer, 21)) mult = mult.mul(upgradeEffect(layer, 21))

    layer = "d"
    if (hasMilestone(layer, 2)) mult = mult.mul("1e100")
    //exp
    layer = "f"
    layer = "p"
    if (hasMilestone(layer, 6)) mult = mult.pow(1.11)
    if (hasMilestone(layer, 13)) mult = mult.pow(1.05)

    layer = "ar"
    if (hasChallenge(layer, 11)) mult = mult.pow(1.1)
    //hyper
    //time dilations/chals
    layer = "sub"
    if (getClickableState(layer, 1001)){
        if (getClickableState(layer, 11)) mult = mult.pow(0.75)
        if (getClickableState(layer, 12)) mult = mult.pow(0.5)
        if (getClickableState(layer, 13)) mult = mult.pow(0.25)
        if (getClickableState(layer, 14)) mult = mult.pow(0.1)
    }

    layer = "ar"
    if (inChallenge(layer, 11)) mult = mult.pow(0.5)
    if (inChallenge(layer, 12)) mult = mult.pow(0.5)
    //=====
    //softcap stuff
    if (mult.gte(player.softcap1Start)) mult = mult.pow(player.softcap1).mul(new Decimal(player.softcap1Start).pow(decimalOne.sub(player.softcap1)))
    if (mult.gte(player.softcap2Start)) mult = mult.pow(player.softcap2).mul(new Decimal(player.softcap2Start).pow(decimalOne.sub(player.softcap2)))
    if (mult.gte(player.softcap3Start)) mult = mult.pow(player.softcap3).mul(new Decimal(player.softcap3Start).pow(decimalOne.sub(player.softcap3)))

	return mult
}

// Display extra things at the top of the page
var displayThings = [
    "Current endgame: 1 Shape.",
    "Justcubing97's Something Tree: Reloaded - mod author: Justcubing97",
    "<br>",
    function() {if (player.points.gte(player.softcap1Start)) return `<b>FIRST SOFTCAP: ${format(player.softcap1Start)} - ${format(player.softcap1)}</b>`},
    function() {if (player.points.gte(player.softcap2Start)) return `<b>SECOND SOFTCAP: ${format(player.softcap2Start)} - ${format(player.softcap1)}</b>`},
    function() {if (player.points.gte(player.softcap3Start)) return `<b>THIRD SOFTCAP: ${format(player.softcap3Start)} - ${format(player.softcap1)}</b>`},
    "<br><br><br>",
]

// Determines when the game "ends"
function isEndgame() {
	return player.poly.points.gte(1)
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

addLayer("LAYERHERE", {
    name: "LAYERHERE", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SYMBOLHERE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: POSITIONHERE, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "COLORHERE",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( SECCOLORHERE, PRIMCOLORHERE)";
		return style;
	},
    requires: new Decimal(NUMBERHERE), // Can be a function that takes requirement increases into account
    resource: "CURRENCYHERE", // Name of prestige currency
    baseResource: "CURRENCYHERE", // Name of resource prestige is based on
    baseAmount() {return player.LAYERHERE.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: NUMBERHERE, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "LAYERHERE"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: ROWHERE, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "KEYHERE", description: "KEYDESCHERE: Reset for CURRENCYHERE", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (BOOLHERE) player.LAYERHERE.unlocked = true
        return player.LAYERHERE.unlocked
    },
    passiveGeneration() {BOOLHERE}, //use autoPrestige() if static!
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
    tooltip() {return format(player.LAYERHERE.points) + " CURRENCYHERE (+" + format(getResetGain("LAYERHERE")) + " CURRENCYHERE on reset)"},
})

*/