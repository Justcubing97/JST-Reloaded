addLayer("s", {
    name: "s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🎧", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#80FFB0",
    requires: new Decimal("1e20"), // Can be a function that takes requirement increases into account
    resource: "Songs", // Name of prestige currency
    baseResource: "Notes", // Name of resource prestige is based on
    baseAmount() {return player.n.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    base: 10,
    directMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "n"
        layer = "s"
        if (hasMilestone(layer, 5)) mult = mult.add(1)
        //mul
        layer = "n"
        if (hasUpgrade(layer, 204)) mult = mult.mul(1.5)
        if (hasUpgrade(layer, 42)) mult = mult.mul(1.25)
        if (hasUpgrade(layer, 112)) mult = mult.mul(1.1)
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //do everything inside the directMult()
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "S", description: "SHIFT+S: Reset for Songs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (player.n.points.gte("1e20")) player.s.unlocked = true
        return player.n.points.gte("1e20") || player.s.unlocked
    },
    passiveGeneration() {return false},
    resetDescription: "Compose ",
    canBuyMax() {return hasMilestone(this.layer, 1)},
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
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.n.points)} Notes.`}],
                "blank",
                ["display-text", function(){return `You have composed ${format(player.s.total)} Songs in total.`}],
                "blank",
                "upgrades",
                ["blank", "30px"],
                "challenges",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.n.points)} Notes.`}],
                "blank",
                ["display-text", function(){return `You have composed ${format(player.s.total)} Songs in total.`}],
                "blank",
                "milestones",
            ],
            unlocked() {return player.s.points.gte(3) || hasMilestone("s", 1)}
        },
    },

    upgrades: {
        11: {
            title: "Composition",
            effect() {
                let base = player.s.total.add(1).mul(5)
                base = base.pow(0.75).mul(25)
                if (hasUpgrade("n", 113)) base = base.mul(100).pow(1.5)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " ME"},
            description: "Total Songs composed boost ME.",
            cost: new Decimal("1"),
        },
        12: {
            title: "Rhythm Variation",
            description: "Unlock Half Notes (in Notes layer).",
            cost: new Decimal("2"),
        },
        13: {
            title: "Music Experience",
            effect() {
                let base = player.s.points.add(1)
                base = base.pow(1.25).mul(75)
                if (hasUpgrade(this.layer, 21)) base = base.pow(1.5)
                if (hasUpgrade("n", 113)) base = base.mul(50).pow(1.15)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " ME"},
            description: "Songs boost ME, and x15 HN.",
            cost: new Decimal("4"),
        },
        14: {
            title: "Automated Assistance (NOT AI 100%)",
            description: "Generate 100% of pending Notes per second, and +15 Notes.",
            cost: new Decimal("6"),
        },

        21: {
            title: "Repeated Assistance",
            description: "Unlock a Notes buyable and improve \"Music Experience\".",
            cost: new Decimal("8"),
            unlocked() {return hasUpgrade(this.layer, 14)}
        },
        22: {
            title: "Album Release",
            effect() {
                let base = player.s.points.add(1)
                base = new Decimal(1.5).pow(base)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " ME"},
            description: "Total Songs composed boost HN.",
            cost: new Decimal("12"),
            unlocked() {return hasUpgrade(this.layer, 14)}
        },
        23: {
            title: "Small but Powerful Boost",
            description: "x125 ME and Notes. Trust me!",
            cost: new Decimal("16"),
            unlocked() {return hasUpgrade(this.layer, 14)}
        },
        24: {
            title: "Purely Whole",
            description: "x1000 WN. And improve the 5th WN upgrade while I'm here.",
            cost: new Decimal("18"),
            unlocked() {return hasUpgrade(this.layer, 14)}
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 3 Songs",
            effectDescription: "You start to enjoy music a little more. x3 WN and x5 HN, and you can bulk-compose Songs.",
            done() { return player.s.points.gte(3) },
        },
        2: {
            requirementDescription: "2: 7 Songs",
            effectDescription: "You've created a playlist for your favorite tracks. Keep the first 12 Note upgrades on reset, and unlock another row of Note upgrades.",
            done() { return player.s.points.gte(7) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
        3: {
            requirementDescription: "3: 14 Songs",
            effectDescription: "Adding more sounds into the songs. Keep the first 4 WN and HN upgrades on reset, and x500 Notes.",
            done() { return player.s.points.gte(14) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
        4: {
            requirementDescription: "4: 17 Songs",
            effectDescription: "As many songs as Camellia's \"Chimera Dragons\"! Unlock 4 more WN upgrades, ^1.1 WN, and ^1.01 HN.",
            done() { return player.s.points.gte(17) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
        5: {
            requirementDescription: "5: 22 Songs",
            effectDescription: "You stumble on a strange cave while walking in nature. +1 Songs and Note buyable 1's scaling is 125.",
            done() { return player.s.points.gte(22) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
        6: {
            requirementDescription: "6: 44 Songs",
            effectDescription: "That's enough for 3 whole albums! \"Feel the Tempo\"'s softcap now starts at 1e50.",
            done() { return player.s.points.gte(44) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
        7: {
            requirementDescription: "6: 50 Songs",
            effectDescription: "You decide to venture into the cave. Unlock \"Power Outage\".",
            done() { return player.s.points.gte(50) },
            unlocked() { return hasMilestone(this.layer, this.id - 1) },
        },
    },

    challenges: {
        11: {
            name: "Power Outage",
            challengeDescription: "<i>\"Your laptop was running smoothly until the power cut off. Thankfully you have battery percentage, but it's <b>low.</b>\"</i> <br><br> ^0.5 to ME. The scaling of the first Note buyable is x1e10.",
            goalDescription: "Have 1e36 Notes.",
            rewardDescription: "Unlock Dance Dance Revolution.",
            canComplete: function() {return player.n.points.gte("1e36")},
            unlocked() {return hasMilestone("s", 7)},
            style() { return {
                "width": "400px",
                "height": "250px",
            } }
        },
    },

    branches: [["ddr", 1]],
    tooltip() {
        if (canReset(this.layer)) return format(player.s.points) + " Songs (+" + format(getResetGain("s")) + " Songs on reset)"
        return format(player.s.points) + " Songs (Unable to reset)"
    },
})