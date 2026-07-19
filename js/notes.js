addLayer("n", {
    name: "n", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "♪", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        whole: new Decimal(0),
        half: new Decimal(0),
        quarter: new Decimal(0),
        eighth: new Decimal(0),

        wholeGain: new Decimal(0),
        halfGain: new Decimal(0),
        quarterGain: new Decimal(0),
        eighthGain: new Decimal(0),
    }},
    color: "#EEEEEE",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Notes", // Name of prestige currency
    baseResource: "Musical Essence", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        if (hasAchievement("a", 16)) mult = mult.add(100)

        layer = "n"
        if (hasUpgrade(layer, 41)) mult = mult.add(3)

        layer = "s"
        if (hasUpgrade(layer, 14)) mult = mult.add(15)
        //mul
        if (hasAchievement("a", 16)) mult = mult.mul(100)

        layer = "n"
        if (hasUpgrade(layer, 13)) mult = mult.mul(3)
        if (hasUpgrade(layer, 14)) mult = mult.mul(4)
        if (hasUpgrade(layer, 22)) mult = mult.mul(upgradeEffect(this.layer, 22))
        if (hasUpgrade(layer, 31)) mult = mult.mul(10)
        if (hasUpgrade(layer, 33)) mult = mult.mul(upgradeEffect(this.layer, 33))
        if (hasUpgrade(layer, 103)) mult = mult.mul(5)
        if (hasUpgrade(layer, 104)) mult = mult.mul(25)
        if (hasUpgrade(layer, 41)) mult = mult.mul(25)

        mult = mult.mul(buyableEffect(this.layer, 11))

        layer = "s"
        if (hasMilestone(layer, 3)) mult = mult.mul(500)
        if (hasUpgrade(layer, 23)) mult = mult.mul(125)
        //exp 
        layer = "n"
        if (hasUpgrade(this.layer, 201)) mult = mult.pow(1.05)

        layer = "s"
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //do everything inside the gainMult()
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "N", description: "SHIFT+N: Reset for Notes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.n.unlocked},
    passiveGeneration() {return hasUpgrade("s", 14)},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasMilestone("s", 2)) keptUpgrades.push(11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34)
        if (hasMilestone("s", 3)) keptUpgrades.push(101, 102, 103, 104, 201, 202, 203, 204)

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.points)} Musical Essence.`}],
                "blank",
                ["upgrades", [1, 2, 3, 4]],
                ["blank", "25px"],
                ["display-text", function(){if (hasUpgrade("n", 34)) return `You have <h2 style="color: #EEEEEE; text-shadow: 0px 0px 10px #EEEEEE">${format(player.n.whole)}</h2> Whole Notes <br> (${format(player.n.wholeGain)}/sec)`; else return}],
                ["display-text", function(){if (hasUpgrade("n", 34)) return `<span style="color:#BBBBBB">Start gaining Whole Notes at 1e12 Notes!`; else return}],
                "blank",
                ["upgrades", [10, 11]],
                ["blank", function() {if (hasUpgrade("s", 12)) return ["1px", "30px"]; else return ["0px", "0px"]}],
                ["display-text", function(){if (hasUpgrade("s", 12)) return `You have <h2 style="color: #EEEEEE; text-shadow: 0px 0px 10px #EEEEEE">${format(player.n.half)}</h2> Half Notes <br> (${format(player.n.halfGain)}/sec)`; else return}],
                ["display-text", function(){if (hasUpgrade("s", 12)) return `<span style="color:#BBBBBB">Start gaining Half Notes at 1e18 Notes!`; else return}],
                "blank",
                ["upgrades", [20]],
                ["blank", function() {if (false) return ["1px", "30px"]; else return ["0px", "0px"]}],
                ["display-text", function(){if (false) return `You have <h2 style="color: #EEEEEE; text-shadow: 0px 0px 10px #EEEEEE">${format(player.n.whole)}</h2> Whole Notes <br> (${format(player.n.wholeGain)}/sec)`; else return}],
                ["display-text", function(){if (false) return `<span style="color:#BBBBBB">Start gaining Whole Notes at 1e12 Notes!`; else return}],
            ],
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.points)} Musical Essence.`}],
                "blank",
                "buyables",
            ],
            unlocked() {return hasUpgrade("s", 21)},
        },
    },

    upgrades: {
        11: {
            title: "The Simple Ascent",
            description: "x2 Musical Essence.",
            cost: new Decimal("1"),
            unlocked() {return true},
        },
        12: {
            title: "Feel the Tempo",
            effect() {
                let base = player.n.points.add(1)
                base = base.pow(0.25)
                if (hasUpgrade(this.layer, 24)) base = base.mul(3)
                if (hasUpgrade(this.layer, 24)) base = base.pow(1.25)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e25")
                if (hasMilestone("s", 6)) softcapStart = softcapStart.mul("1e25")
                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " ME"
                if (upgradeEffect(this.layer, this.id).gte("1e35") && hasMilestone("s", 6)) text += " (softcapped)"
                else if (upgradeEffect(this.layer, this.id).gte("1e25")) text += " (softcapped)"
                return text
            },
            description: "Notes boost Musical Essence.",
            cost: new Decimal("3"),
            unlocked() {return true},
        },
        13: {
            title: "Feedback Loop",
            description: "x3 Notes.",
            cost: new Decimal("10"),
            unlocked() {return true},
        },
        14: {
            title: "4K Setup",
            description: "x4 Notes and ME.",
            cost: new Decimal("25"),
            unlocked() {return true},
        },

        21: {
            title: "Row 2!",
            description: "x3! ME.",
            cost: new Decimal("300"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        22: {
            title: "More Dynamic Boosts",
            effect() {
                let base = player.points.add(1)
                base = base.pow(0.1)
                if (hasUpgrade(this.layer, 24)) base = base.mul(2)
                if (hasUpgrade(this.layer, 32)) base = base.mul(15)

                if (hasUpgrade(this.layer, 24)) base = base.pow(1.25)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " Notes"},
            description: "ME boosts Notes.",
            cost: new Decimal("1000"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        23: {
            title: "Base-ic Manipulation",
            description: "+4 to ME base.",
            cost: new Decimal("4000"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        24: {
            title: "Improvement",
            description: "Improve \"Feel the Tempo\" and \"More Dynamic Boosts.\"",
            cost: new Decimal("15000"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },

        31: {
            title: "Advanced Pitch Training",
            description: "x10 Notes. Wow!",
            cost: new Decimal("1e5"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        32: {
            title: "Scale Mastery",
            description: "x15 to \"More Dynamic Boosts\" effect.",
            cost: new Decimal("3e6"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        33: {
            title: "Sheet Music Discovery",
            effect() {
                let base = player.n.points.add(1)
                let lb = new Decimal(1.4)
                if (hasUpgrade(this.layer, 103)) lb = new Decimal(1.05)
                base = base.log(lb).add(2).div(2)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " Notes"},
            description: "Notes boost themselves.",
            cost: new Decimal("2e8"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        34: {
            title: "4 Beats",
            description: "Unlock Whole Notes and x4 ME.",
            cost: new Decimal("1e10"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },

        41: {
            title: "DAW Arpeggiator",
            description: "x25 Notes, WN, and HN",
            cost: new Decimal("1e40"),
            unlocked() {return hasMilestone("s", 2)},
        },
        42: {
            title: "Rhythm Expert",
            description: "x1000 ME and x1.25 Songs!",
            cost: new Decimal("1e48"),
            unlocked() {return hasMilestone("s", 2)},
        },
        43: {
            title: "Not Half as Good",
            effect() {
                let base = player.n.half.add(1)
                let lb = new Decimal(1.75)
                base = base.log(lb).pow(1.5)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " ME"},
            description: "Half Notes boost ME.",
            cost: new Decimal("1e60"),
            unlocked() {return hasMilestone("s", 2)},
        },
        44: {
            title: "Full Square Timewall",
            description: "Trust me, the wait is worth it! x2500 ME and x500 WN.",
            cost: new Decimal("1e80"),
            unlocked() {return hasMilestone("s", 2)},
        },



        101: {
            title: "Slow and Steady",
            description: "+3 ME and Notes.",
            cost: new Decimal("5"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        102: {
            title: "Whole > Parts",
            effect() {
                let base = player.n.whole.add(1)
                base = base.pow(0.5)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " ME"},
            description: "Whole Notes boost ME.",
            cost: new Decimal("60"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        103: {
            title: "Triple Effect",
            description: "Improve \"Sheet Music Discovery\", +10 ME, and x5 Notes!",
            cost: new Decimal("250"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        104: {
            title: "BIG Multiplier",
            description: "x25 Notes! The next layer is at 1e20 Notes.",
            cost: new Decimal("1e4"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        111: {
            title: "Googol's Buyable",
            effect() {
                let base = player.n.whole.add(1)
                base = base.pow(0.05).mul(1.5)
                if (hasUpgrade("s", 24)) base = base.mul(4).pow(1.1)
                
                return base
            },
            effectDisplay() {return `<span style="font-size:10px">/${format(upgradeEffect(this.layer, this.id))} to cost</span>`},
            description: `<span style="font-size:10px">Whole Notes lower the cost of the first Note buyable.</span>`,
            cost: new Decimal("1e100"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasMilestone("s", 4)},
        },
        112: {
            title: "BIGGER Multiplier",
            description: "x20,000 ME and x1.1 Songs.",
            cost: new Decimal("1e110"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasMilestone("s", 4)},
        },
        113: {
            title: "Music Mastery",
            description: "Improve \"Composition\" and \"Music Experience\".",
            cost: new Decimal("1e120"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasMilestone("s", 4)},
        },
        114: {
            title: "Quirky Rhythms",
            effect() {
                let base = player.points.add(1)
                base = base.log(1.25)
    
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " WN and HN"},
            description: "ME boosts WN and HN.",
            cost: new Decimal("1e130"),
            currencyDisplayName: "Whole Notes",
            currencyInternalName: "whole",
            currencyLayer: "n",
            unlocked() {return hasMilestone("s", 4)},
        },

        201: {
            title: "Exponent Time!",
            description: "^1.05 ME and Notes.",
            cost: new Decimal("1000"),
            currencyDisplayName: "Half Notes",
            currencyInternalName: "half",
            currencyLayer: "n",
            unlocked() {return hasUpgrade("s", 12)},
        },
        202: {
            title: "Musical Multi",
            description: "x500 ME.",
            cost: new Decimal("5e6"),
            currencyDisplayName: "Half Notes",
            currencyInternalName: "half",
            currencyLayer: "n",
            unlocked() {return hasUpgrade("s", 12)},
        },
        203: {
            title: "Whole Expansion",
            effect() {
                let base = player.n.whole.add(1)
                base = base.pow(0.01)
                return base
            },
            effectDisplay() {return "x" + format(upgradeEffect(this.layer, this.id)) + " HN"},
            description: "Whole Notes boost Half Notes.",
            cost: new Decimal("1e10"),
            currencyDisplayName: "Half Notes",
            currencyInternalName: "half",
            currencyLayer: "n",
            unlocked() {return hasUpgrade("s", 12)},
        },
        204: {
            title: "Efficient Workspace",
            description: "x1.5 Songs.",
            cost: new Decimal("1e18"),
            currencyDisplayName: "Half Notes",
            currencyInternalName: "half",
            currencyLayer: "n",
            unlocked() {return hasUpgrade("s", 12)},
        },
    },

    buyables: {
        11: {
            cost(x) {
                let base = new Decimal("1e20")
                let expbase = new Decimal("200")
                if (hasMilestone("s", 5)) expbase = expbase.sub(75)
                if (inChallenge("s", 11)) expbase = new Decimal("1e10")
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasUpgrade(this.layer, 111)) final = final.div(upgradeEffect(this.layer, 111))
                return final
            },
            title: "Consistent Production",
            display() { return "Multiplies Notes by 2 per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = new Decimal(2)
                let effect = base.pow(x)
                return effect
            },
            unlocked() {return hasMilestone("s", 2)},
        },
    },

    update(diff){
        //whole notes
        if (hasUpgrade("n", 34) && player.n.points.gte("1e12")){
            let mult = player.n.points.div("1e12")
            if (hasMilestone("s", 1)) mult = mult.mul(3)
            if (hasUpgrade(this.layer, 41)) mult = mult.mul(25)
            if (hasUpgrade(this.layer, 44)) mult = mult.mul(500)
            if (hasUpgrade("s", 24)) mult = mult.mul(1000)
            if (hasUpgrade(this.layer, 114)) mult = mult.mul(upgradeEffect(this.layer, 114))

            if (hasMilestone("s", 4)) mult = mult.pow(1.1)

            player.n.wholeGain = mult
            player.n.whole = player.n.whole.add(player.n.wholeGain.mul(diff))
        }

        //half notes
        if (hasUpgrade("s", 12) && player.n.points.gte("1e18")){
            let mult = player.n.points.div("1e18")
            if (hasUpgrade(this.layer, 203)) mult = mult.mul(upgradeEffect(this.layer, 203))
            if (hasMilestone("s", 1)) mult = mult.mul(5)
            if (hasUpgrade("s", 13)) mult = mult.mul(15)
            if (hasUpgrade(this.layer, 41)) mult = mult.mul(25)
            if (hasUpgrade("s", 22)) mult = mult.mul(upgradeEffect("s", 22))
            if (hasUpgrade(this.layer, 114)) mult = mult.mul(upgradeEffect(this.layer, 114))

            if (hasMilestone("s", 4)) mult = mult.pow(1.01)

            player.n.halfGain = mult
            player.n.half = player.n.half.add(player.n.halfGain.mul(diff))
        }
    },

    glowColor() {
        let layer = "n"
        for (id in tmp[layer].upgrades){
            if (isPlainObject(layers[layer].upgrades[id])){
                if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
                    return "red"
                }
            }
        }

        for (const id of [11]) {
            if (canBuyBuyable(layer, id)) {
                return "cyan"
            }
        }

        return ""
    },
    shouldNotify() {
        let layer = "n"
        for (const id of [11]) {
            if (canBuyBuyable(layer, id) && hasUpgrade("s", 21)) {
                return true
            }
        }
        return false
    },

    branches: [["s", 1]],
    tooltip() {return format(player.n.points) + " Notes (+" + format(getResetGain("n")) + " Notes on reset)"},
})