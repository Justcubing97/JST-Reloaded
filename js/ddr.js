addLayer("ddr", {
    name: "ddr", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⇅", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
	color: "#2280C2",

	nodeStyle() {
		const style = {};
		style.background = "linear-gradient(#C70078, #2280C2)";
		return style;
	},
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "Arrows", // Name of prestige currency
    baseResource: "Songs", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 5, // Prestige currency exponent
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
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "D", description: "SHIFT+D: Reset for Arrows", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasChallenge("s", 11)) player.ddr.unlocked = true
        return player.ddr.unlocked
    },
    passiveGeneration() {return false},
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
    tooltip() {return format(player.ddr.points) + " Arrows (+" + format(getResetGain("ddr")) + " Arrows on reset)"},
})