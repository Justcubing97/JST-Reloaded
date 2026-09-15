addLayer("d", {
    name: "d", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DIM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(204, 255, 204)",
    requires: new Decimal("1e640"), // Can be a function that takes requirement increases into account
    resource: "Dimensions", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 10, // Prestige currency exponent
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
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "d", description: "D: Reset for Dimensions", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasChallenge("ar", 12)) player.d.unlocked = true
        return player.d.unlocked
    },
    resetDescription: "Ascend ",
    autoPrestige() {return false}, //use autoPrestige() if static!
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
    tabFormat: [
        ["display-text", function(){return `<h2>You are in Dimension <span style="color: rgb(204, 255, 204); text-shadow: 0px 0px 10px rgb(204, 255, 204); font-size: 35px">${formatWhole(player.d.points)}</span></h2>`}],
        "prestige-button",
        ["blank", "4px"],
        ["display-text", function(){return `You have ${format(player.points)} Points.`}],
        "blank",
        ["infobox", "dimensionExplainBox"],
        "blank",
        "milestones",
    ],

    milestones: {
        1: {
            requirementDescription: "The 1st Dimension",
            effectDescription: "^1.05 Funda, Numbers, and OP. x25 Addition and all Ineqs.",
            done() { return player.d.points.gte(1) },
        },
        2: {
            requirementDescription: "The 2nd Dimension",
            effectDescription: "x125 Functions, FV, PV, and x1e100 Points. Unlock Subtraction.",
            done() { return player.d.points.gte(2) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
        3: {
            requirementDescription: "The 3rd Dimension",
            effectDescription: "x25 Subtraction, x5 to Addition Type cap, and x8 Ineqs.",
            done() { return player.d.points.gte(3) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
    },

    infoboxes: {
        dimensionExplainBox: {
            title: "<s>Antimatter</s> Dimensions",
            body() { return "Welcome to Dimensions. No, there are not 8 dimensions. " +
                "This is basically a tier system. They work identical to TRGT's Full Combo Tiers (my other major TMT mod). " +
                "Basically, each Dimension will unlock and/or boost multiple things. These can be currency " +
                "multipliers, exponents, base additions, unlocking upgrades, challenges, buyables, milestones, " +
                "quality of life changes, and more genre switches." +
                "<br><br>Later in this game you'll unlock Hyperdimensions, which require normal Dimensions to <i>transcend</i>. " +
                "Those will work very similary to Dimensions. Good luck!"
            },
        },
    },

    tooltip() {
        if (!canReset("d")) return format(player.d.points) + " Dimensions (Unable to reset)"
        return format(player.d.points) + " Dimensions (+" + format(getResetGain("d")) + " Dimensions on reset)"
    },
})