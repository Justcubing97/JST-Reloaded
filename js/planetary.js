addLayer("pf", {
    name: "pf", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PFR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(153,255,255)",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( rgb(51,153,255), rgb(153,255,255))";
		return style;
	},
    requires: new Decimal("1e650"), // Can be a function that takes requirement increases into account
    resource: "Planetary Fragments", // Name of prestige currency
    baseResource: "Shapes", // Name of resource prestige is based on
    baseAmount() {return player.poly.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
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
        let layer = "pf"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "l", description: "L: Reset for Planetary Fragments", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (maxedChallenge("poly", 11)) player.pf.unlocked = true
        return player.pf.unlocked
    },
    passiveGeneration() {return false}, //use autoPrestige() if static!
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

    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(153,255,255); text-shadow: 0px 0px 10px rgb(153,255,255)">${format(player.pf.points)}</h2> Planetary Fragments (PF)`}],
                "blank",
                ["infobox", "resetWarning"],
                "blank",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.poly.points)} Shapes.`}],
                "blank",
                "upgrades",
            ],
        },
    },

    upgrades: {
        11: {
            title: "Adventurous",
            description: "Unlock Expedition and multiply Points by x1e1000.",
            cost: new Decimal("1"),
        },
    },

    infoboxes: {
        resetWarning: {
            title: "Planetary Reset",
            body() { return "Welcome to the next reset layer. Before resetting, you should know that this reset layer will reset a LOT. " +
                "This will reset everything that Polygon reset does, along with all content included in the Polygon layer, such as Number Cores, " +
                "Core Boosters, Division, and everything unlocked. Additionally, you will be sent back to the 0th Dimension. " +
                "Not all hope is lost, however. You will unlock a mechanic called Expedition after the first Planetary upgrade, which itself will greatly improve your progress."
            },
        },
    },

    tooltip() {return format(player.pf.points) + " Planetary Fragments (+" + format(getResetGain("pf")) + " Planetary Fragments on reset)"},
})

//expedition
//planetary challenges
//planetary generators
//planetary boosters
//booster challenges