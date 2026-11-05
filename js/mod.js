let modInfo = {
	name: "JST: Reloaded",
	author: "Justcubing97",
	pointsName: "Points",
	modFiles: ["achievements.js", "logarithmicscale.js", "conway.js", "story.js", "fundamental.js", "primitive.js", "arithmetic.js", "addition.js", "subtraction.js", "multiplication.js", "division.js", "dimension.js", "polygon.js", "numbercore.js", "corebooster.js", "planetary.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "2.1",
	name: "Polygon progress change + Expedition",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v2.1</h2><br>
		- Added Expedition <br>
		- Added Chapter 1 of lore <br>
		- Softcap starts and exponents will always be corrected to prevent an unintentional softlock <br>
		- Changed Function's 16th milestone cost <br>
		- Functions' 10th effect now works even if the Core Booster cost goes below the requirement cost (which for some reason, by default, does not allow cost to go lower than the require amount) <br><br>
	<h2>v2.0</h2><br>
		- THE ENTIRE POLYGON LAYER. <br>
		- Changed the 4th Achievement <br>
		- Added an optional requirement to the 19th Achievement <br>
		- Changed "Addition Type(s)" to "Addition type(s)" <br>
		- Changed how tooltips for static layers work <br>
		- Removed the short form of Products <br>
		- Added a respec sentence in TMT <br>
		- Renamed "TMT Introduction" <br>
		- Added buyable highlights <br><br>
		- Changed achievement name "Millionare" to "Millionaire" <br>
		- More achievements <br>
		- Changed \"CRB\" node symbol to \"CBT\" <br>
		- Reformatted the Logarithmic Scale YET AGAIN <br>
		- Fixed Number gain fetching the wrong Addition type <br>
		- Added buyable highlights <br><br>
	<h2>v1.2</h2><br>
		- Tweaked wording for Inequality effects unlocked from \"Affect the Inequality\" <br>
		- Changed names for row 3 TMT upgrades <br>
		- Subtraction notifies when the NNL is completed, and the button is slightly tweaked <br><br>
	<h2>v1.1</h2><br>
		- Fixed Primitive/Polygon hotkey bug <br>
		- Fixed \"t0\" being an invalid value <br><br>
	<h2>v1.0</h2><br>
		- Everything up to Polygon layer! <br>
		- New side layers: Logarithmic Scale and Conway's Game of Life <br>
        - Reworked achievements to be more spread out, like TRGT and the later half of JST:C <br><br>
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
		- UI now reflects that of TRGT<br>
    `

let winText = `Congratulations! You have reached the end and beaten this game as of ${VERSION.num}! There's still more content if you haven't reached Dark Matter!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",
    "findEqPointsMult_ARH",
    "findIneqMult_ARH",
    "clickIneqButton_ARH",
    "convertTo_ADD",
    "findConstructorShapesMult_POLY",
    "giveResourcesFromExpedition_PFR",
    "findMultsForResourcesExpedition_PFR",
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
    softcap1Start: new Decimal("1e50000"),
    softcap2: new Decimal(0.2),
    softcap2Start: new Decimal("1e250000"),
    softcap3: new Decimal(0.15),
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
    if (hasAchievement("a", 35)) mult = mult.mul(player.mul.points.pow(5).add(1))

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
    if (hasUpgrade(layer, 44)) mult = mult.mul("1e500")
    if (hasUpgrade(layer, 45)) mult = mult.mul("1e750")
    if (hasUpgrade(layer, 46)) mult = mult.mul("1e1000")
    if (hasUpgrade(layer, 47)) mult = mult.mul("1e1500")

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
    if (hasUpgrade(layer, 33)) mult = mult.mul(upgradeEffect("div", 12).pow(50))
    if (hasMilestone(layer, 11)) mult = mult.mul(milestoneEffect(layer, 11))
        
    if (hasMilestone(layer, 1)) mult = mult.mul(player.ar.functionE1)
        
    if (hasMilestone(layer, 13)) mult = mult.mul(player.ar.effectLT)
    if (hasMilestone(layer, 13)) mult = mult.mul(player.ar.effectLTE)
    if (hasMilestone(layer, 13)) mult = mult.mul(player.ar.effectGTE)
    if (hasMilestone(layer, 13)) mult = mult.mul(player.ar.effectGT)
        
    layer = "sub"
    if (hasUpgrade(layer, 14)) mult = mult.mul("1e40")
        
    layer = "mul"
    if (hasUpgrade(layer, 21)) mult = mult.mul(upgradeEffect(layer, 21))

    layer = "d"
    if (hasMilestone(layer, 2)) mult = mult.mul("1e100")

    layer = "poly"
    mult = mult.mul(buyableEffect(layer, 12))
    if (hasUpgrade(layer, 12)) mult = mult.mul("1e100")
    if (hasUpgrade(layer, 115)) mult = mult.mul("1e100")
    mult = mult.mul(tmp.poly.challenges[11].rewardEffect[0])

    layer = "nc"
    mult = mult.mul(buyableEffect(layer, 12))

    layer = "pf"
    if (hasUpgrade(layer, 11)) mult = mult.mul("1e1000")
    mult = mult.mul(buyableEffect("pf", 11)[1])
    //exp
    layer = "p"
    if (hasMilestone(layer, 6)) mult = mult.pow(1.11)
    if (hasMilestone(layer, 13)) mult = mult.pow(1.05)

    layer = "mul"
    if (hasUpgrade(layer, 71)) mult = mult.pow(1.05)

    layer = "ar"
    if (hasChallenge(layer, 11)) mult = mult.pow(1.1)
    if (hasMilestone(layer, 16)) mult = mult.pow(player.ar.metaE1)

    layer = "div"
    if (hasMilestone(layer, 11)) mult = mult.pow(1.01)

    layer = "poly"
    if (hasMilestone(layer, 2)) mult = mult.pow(1.01)
    mult = mult.pow(player.poly.hexagonsEffect1)
    if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
    //hyper
    //time dilations/chals
    layer = "sub"
    if (getClickableState(layer, 1001)){
        if (getClickableState(layer, 11)) mult = mult.pow(0.75)
        if (getClickableState(layer, 12)) mult = mult.pow(0.5)
        if (getClickableState(layer, 13)) mult = mult.pow(0.25)
        if (getClickableState(layer, 43)) mult = mult.pow(0.8)
        if (getClickableState(layer, 14)) mult = mult.pow(0.1)
    }

    layer = "ar"
    if (inChallenge(layer, 11)) mult = mult.pow(0.5)
    if (inChallenge(layer, 12)) mult = mult.pow(0.5)
    if (inChallenge(layer, 21)) mult = mult.div(player.add.additionTypeLimit.pow(10).add(1))
    if (inChallenge(layer, 22)) mult = mult.pow(0.01)
    //=====
    //softcap stuff
    //fixing softcaps
    if (mult.gte(player.softcap1Start)) mult = mult.pow(player.softcap1).mul(new Decimal(player.softcap1Start).pow(decimalOne.sub(player.softcap1)))
    if (mult.gte(player.softcap2Start)) mult = mult.pow(player.softcap2).mul(new Decimal(player.softcap2Start).pow(decimalOne.sub(player.softcap2)))
    if (mult.gte(player.softcap3Start)) mult = mult.pow(player.softcap3).mul(new Decimal(player.softcap3Start).pow(decimalOne.sub(player.softcap3)))

	return mult
}

// Display extra things at the top of the page
var displayThings = [
    "Current endgame: 1 Planetary Fragment.",
    "Justcubing97's Something Tree: Reloaded - mod author: Justcubing97",
    "<br>",
    function() {if (player.points.gte(player.softcap1Start)) return `<b>FIRST SOFTCAP: ${format(player.softcap1Start)} - ^${format(player.softcap1)}</b>`},
    function() {if (player.points.gte(player.softcap2Start)) return `<b>SECOND SOFTCAP: ${format(player.softcap2Start)} - ^${format(player.softcap2)}</b>`},
    function() {if (player.points.gte(player.softcap3Start)) return `<b>THIRD SOFTCAP: ${format(player.softcap3Start)} - ^${format(player.softcap3)}</b>`},
    "<br><br><br>",
]

// Determines when the game "ends"
function isEndgame() {
	return player.pf.points.gte("1")
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