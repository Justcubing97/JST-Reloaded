addLayer("pbooster", {
    name: "pbooster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PLB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        e1: new Decimal(1),
        e2: new Decimal(1),
        e3: new Decimal(1),
        e4: new Decimal(1),
        e5: new Decimal(1),
    }},
    color: "#60C0FF",
    requires: new Decimal("1e330"), // Can be a function that takes requirement increases into account
    resource: "Planetary Boosters", // Name of prestige currency
    baseResource: "Shapes", // Name of resource prestige is based on
    baseAmount() {return player.polygon.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let base = new Decimal(4)
        return base
    }, // Prestige currency exponent
    base() {
        let initial = new Decimal(5)
        return initial
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        //add
        //mul
        //exp 
        //other hypers
        //final
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1) //DO NOT USE
        return exp
    },
    directMult() {
        let dMult = new Decimal(1)
        return dMult
    },
    row: 6, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "N", description: "SHIFT+N: Reset for Planetary Boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.pbooster.unlocked},
    passiveGeneration() {return false},
    onPrestige() {
        player.corebooster.points = player.corebooster.points.add(getResetGain("corebooster"))
        if (!hasMilestone("corebooster", 3)) doReset("polygon", true)

        if (hasMilestone("division", 11)) player.corebooster.useful = player.corebooster.useful.add(player.corebooster.points.mul(0.0001))
        else {
            player.corebooster.useful = player.corebooster.points
            if (player.corebooster.useful.gte(12)){
                let remainder = player.corebooster.points.sub(12)
                let divid = new Decimal(3)
                if (hasUpgrade("multiplication", 92)) divid = divid.sub(1)
                if (hasMilestone("corebooster", 2)) divid = divid.sub(0.5)

                remainder = remainder.div(divid).floor()

                player.corebooster.useful = new Decimal(12).add(remainder)
                player.corebooster.trueUseful = player.corebooster.useful

                let buff = player.corebooster.points
                let multi = new Decimal(1.2)
                if (hasMilestone("corebooster", 3)) multi = multi.add(0.3)
                if (hasUpgrade("division", 22)) player.corebooster.useful = buff.mul(multi)
            }
        }

        let e1b = player.corebooster.useful
        e1b = e1b.add(1).log(20).add(1)
        if (hasAchievement("achievements", 53)) e1b = e1b.pow(3)
        player.corebooster.e1 = e1b

        let e2b = player.corebooster.useful
        e2b = e2b.add(1).pow(0.5)
        if (hasAchievement("achievements", 53)) e1b = e1b.pow(2)
        player.corebooster.e2 = e2b

        let e3b = player.corebooster.useful
        e3b = e3b.add(1).pow(0.25)
        if (!hasAchievement("achievements", 53)) player.corebooster.e3 = new Decimal(1)
        else player.corebooster.e3 = e3b

        let e4b = player.corebooster.useful
        e4b = e4b.add(1).pow(new Decimal(13).mul(player.corebooster.useful))
        if (!hasMilestone("primitive", 11)) player.corebooster.e4 = new Decimal(1)
        else player.corebooster.e4 = e4b

        let e5b = player.corebooster.useful
        e5b = e5b.add(1).pow(1.5)
        if (!hasMilestone("primitive", 11)) player.corebooster.e5 = new Decimal(1)
        else player.corebooster.e5 = e5b
    },
    autoPrestige() {return false},
    resetsNothing() {return false},
    canBuyMax() {return false},
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
        "main-display",
        "prestige-button",
        ["display-text", function() { return "You have " + format(player.polygon.points) + " Shapes"}],
        "blank",
        ["display-text", function() { return "<h2>You have " + format(player.pbooster.points) + " Planetary Boosters, which..."}],
        "blank",
        ["display-text", function() { return "<h3>x" + format(player.pbooster.e1) + " to Planetary Fragments"}],
        "blank",
        ["display-text", function() {
            if (!hasAchievement("achievements", 53) && !player.planetary.unlocked) return ""
            return "<h3>/" + format(player.corebooster.e2) + " to Pentagon and Hexagon construction time"
        }],
        "blank",
        ["display-text", function() {
            if (!hasAchievement("achievements", 53) && !player.planetary.unlocked) return ""
            return "<h3>/" + format(player.corebooster.e3) + " to Pentagon and Hexagon construction time"
        }],
        "blank",
        ["display-text", function() {
            if (!hasMilestone("primitive", 11) && !player.planetary.unlocked) return ""
            return "<h3>x" + format(player.corebooster.e4) + " to Points, Fundamentality, and Addition"
        }],
        "blank",
        ["display-text", function() {
            if (!hasUpgrade("arithmetic", 37) && !player.planetary.unlocked) return ""
            return "<h3>x" + format(player.corebooster.e5) + " to Shapes and Division"
        }],
        "blank",
        "milestones",
        "blank",
        "upgrades",
    ],
    milestones: {
        1: {
            requirementDescription: "1: 2 Planetary Boosters",
            effectDescription: "Remove all Multiplication scalings and x1e25 Division. ^1.3 Number Cores and Fundamentality. Unlock the 11th row of TMT.",
            done() { return player.pbooster.points.gte(2) },
            unlocked() {return true}
        },
        2: {
            requirementDescription: "2: 5 Planetary Boosters",
            effectDescription: "Improve \"THE LARGEST COST GAP\" and unlock three Polygon upgrades. Keep the Multiplication buyables.",
            done() { return player.pbooster.points.gte(5) },
            unlocked() {return true}
        },
    },
    update(diff){
        let amount = player.pbooster.points

        let e1b = amount.add(1)
        e1b = e1b.pow(0.5)
        player.pbooster.e1 = e1b
    },
    tooltip() {return format(player.pbooster.points) + " Planetary Boosters (" + format(getNextAt("pbooster")) + " Shapes for next Planetary Booster)"},
})