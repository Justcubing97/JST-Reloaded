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
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        layer = "ddr"
        if (hasUpgrade(this.layer, 22)) mult = mult.mul(2)
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //do everything inside the gainMult()
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "A", description: "SHIFT+A: Reset for Arrows", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasChallenge("s", 11)) player.ddr.unlocked = true
        return player.ddr.unlocked
    },
    canReset(){return hasChallenge("s", 11)},
    
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
            title: "⇧ x → ♪ & 🎧",
            effect() {
                let base = player.ddr.total.add(2)
                base = base.log(1.01).add(1).mul(base.pow(1.5)).pow(1.25)
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " ME and Notes"
                return text
            },
            description: "Total arrows boost ME and Notes.",
            cost: new Decimal("1"),
        },
        12: {
            title: "Multi-hit",
            description: "x2 Marvelous and Almost arrows, and you can always bulk-compose Songs.",
            cost: new Decimal("2"),
        },
        13: {
            title: "More Power = Improve Skill",
            description: "You can buy max of the first Note buyable and keep it unlocked. x1,000,000 ME!",
            cost: new Decimal("5"),
        },
        14: {
            title: "More Time to Dance",
            description: "x25,000 ME and Notes, and keep all Note, WN, and HN upgrades up to this point unlocked. Improve \"More Dynamic Boosts\".",
            cost: new Decimal("10"),
        },
        21: {
            title: "DANCE LEVEL INTRODUCTION",
            description: "Unlock \"BEGINNER\".",
            cost: new Decimal("25"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        22: {
            title: "Unstoppable Dancing",
            description: "Keep the first 8 Song upgrades and the first 4 Song milestones. x2 Arrows.",
            cost: new Decimal("100"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        23: {
            title: "⇧ ÷ → ♪ 💵",
            effect() {
                let base = player.ddr.points.add(1)
                base = base.pow(5)
                return base
            },
            effectDisplay() {
                let text = "÷" + format(upgradeEffect(this.layer, this.id)) + " to cost"
                return text
            },
            description: "Arrows divide the Note buyable 1 cost, keep total Songs, and x1e15 ME.",
            cost: new Decimal("300"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        24: {
            title: "Charting Challenge",
            description: "Unlock \"BASIC\".",
            cost: new Decimal("750"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
    },

    challenges: { //The softcaps of \"Feel the Tempo\" and \"More Dynamic Boosts\" start at 1,000,000.
        11: {
            name: "BEGINNER",
            challengeDescription: "<i>\"This difficulty is aimed at <b>newcomers.</b> A perfect first test on the dance floor.\"</i> <br><br> ^0.75 ME and Notes. ME multiplies combo gain. This challenge resets your combo upon entry and exit.",
            goalDescription: "Have a combo of at least 20.",
            rewardDescription: "x3 Marvelous and Great arrows, x1.25 Songs, x2.5 combo gain, and x1e10 ME!",
            canComplete: function() {return player.ddrm.combo.gte(20)},
            unlocked() {return hasUpgrade(this.layer, 21)},
            style() {
                if (!hasChallenge(this.layer, this.id)) return {
                    "width": "400px",
                    "height": "275px",
                }
                return {
                    "width": "400px",
                    "height": "275px",
                    "background": "#21C1CC",
                }
            },
            onEnter() {player.ddrm.combo = new Decimal(0)},
            onExit() {player.ddrm.combo = new Decimal(0)},
        },
        12: {
            name: "BASIC",
            challengeDescription: "<i>\"This difficulty is aimed at players who are <b>more familiar.</b> Let's crank the difficulty up a notch.\"</i> <br><br> The cost of Songs is <i>ever so slightly raised</i>. ME more harshly multiplies combo gain. This challenge resets your combo upon entry and exit.",
            goalDescription: "Have a combo of at least 35.",
            rewardDescription: "Improve Marvelous, Great, and Almost arrow effects, and x5 to all of their gains.",
            canComplete: function() {return player.ddrm.combo.gte(35)},
            unlocked() {return hasUpgrade(this.layer, 24)},
            style() {
                if (!hasChallenge(this.layer, this.id)) return {
                    "width": "400px",
                    "height": "275px",
                }
                return {
                    "width": "400px",
                    "height": "275px",
                    "background": "#FFBA00",
                }
            },
            onEnter() {player.ddrm.combo = new Decimal(0)},
            onExit() {player.ddrm.combo = new Decimal(0)},
        },
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.s.points)} Songs.`}],
                ["blank", function() {if (!hasChallenge("s", 11)) return ["8px", "17px"]; else return ["0px", "0px"]}],
                ["display-text", function(){if (!hasChallenge("s", 11)) return "You need to complete \"Power Outage\" first!"}],
                "blank",
                ["display-text", function(){return `You have made ${format(player.ddr.total)} Arrows in total.`}],
                "blank",
                "upgrades",
            ]
        },
        "DANCE LEVELS": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.s.points)} Songs.`}],
                ["blank", function() {if (!hasChallenge("s", 11)) return ["8px", "17px"]; else return ["0px", "0px"]}],
                ["display-text", function(){if (!hasChallenge("s", 11)) return "You need to complete \"Power Outage\" first!"}],
                "blank",
                ["display-text", function(){return `You have made ${format(player.ddr.total)} Arrows in total.`}],
                "blank",
                "challenges",
            ],
            unlocked() {return hasUpgrade("ddr", 21)}
        },
    },

    tooltip() {
        if (!canReset(this.layer)) return format(player.ddr.points) + " Arrows (\"Power Outage\" needed to reset)"
        return format(player.ddr.points) + " Arrows (+" + format(getResetGain("ddr")) + " Arrows on reset)"
    },
})