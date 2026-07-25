addLayer("ddr", {
    name: "ddr", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⇅", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        
        groovePower: new Decimal(0),
        gpg: new Decimal(1),
        gpe: new Decimal(1),

        stream: new Decimal(1),
        voltage: new Decimal(1),
        air: new Decimal(1),
        freeze: new Decimal(1),
        chaos: new Decimal(1),

        streamImpact: new Decimal(20),
        gpThreshold: new Decimal("1e350"),
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
        layer = "n"
        if (hasUpgrade(layer, 303)) mult = mult.mul(10)

        layer = "s"
        if (hasUpgrade(layer, 31)) mult = mult.mul(player.ddrm.aEffect)

        layer = "ddr"
        if (hasUpgrade(layer, 22)) mult = mult.mul(2)
        if (hasChallenge(layer, 12)) mult = mult.mul(5)
        if (hasUpgrade(layer, 31)) mult = mult.mul(5)

        mult = mult.mul(buyableEffect(layer, 11))
        //exp
        layer = "s"
        if (hasMilestone(layer, 10)) mult = mult.pow(1.25)
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
                if (hasUpgrade("n", 312)) base = base.pow(base.log("1e6"))
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
        31: {
            title: "Better Machine",
            description: "Missing a note now reduces the combo by 50 (stays above zero), Almost arrows now add to the combo, and Marvelous arrows add x3 times more. x5 Arrows.",
            cost: new Decimal("3000"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        32: {
            title: "1 2 3 4",
            description: "Unlock Quarter Notes (in Notes tab).",
            cost: new Decimal("15000"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        33: {
            title: "⇧ x → 🎼 💪",
            effect() {
                let base = player.ddr.points.add(1)
                base = base.log(1.5).div(35).add(1)
                return base
            },
            effectDisplay() {
                let text = "^" + format(upgradeEffect(this.layer, this.id)) + " to effect"
                return text
            },
            description: "\"Sheet Music Discovery\"'s effect is raised to Arrows at a reduced rate.",
            cost: new Decimal("40000"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        34: {
            title: "Practice Required",
            description: "Unlock \"DIFFICULT\".",
            cost: new Decimal("250000"),
            unlocked() {return hasUpgrade(this.layer, 24)},
        },
        41: {
            title: "Gameplay Variety Intro",
            description: "Unlock GROOVE RADAR.",
            cost: new Decimal("8e5"),
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        42: {
            title: "smol qol",
            description: "keep the 4th row of note upgs and 2nd row of wn upgs, x1e10 hn",
            cost: new Decimal("3.5e6"),
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        43: {
            title: "Preserving Production",
            description: "Composing Songs no longer resets anything. x1e20 ME.",
            cost: new Decimal("12.5e6"),
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
        44: {
            title: "Auto Production",
            description: "You can automatically compose Songs. Unlock a third row of Song upgrades.",
            cost: new Decimal("30e6"),
            unlocked() {return hasUpgrade(this.layer, 34)},
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 1e25 Groove Power",
            effectDescription: "Others are impressed by your skill on the dance floor. x1.05 Songs and unlock another Note buyable.",
            done() { return player.ddr.groovePower.gte("1e25") },
        },
        2: {
            requirementDescription: "2: 1e28 Groove Power",
            effectDescription: "Some people are donating out of respect. The effect of Stream is reduced to ÷10 per level and improve Groove Power's effect. ^1.1 ME and Notes, and ^1.25 QN.",
            done() { return player.ddr.groovePower.gte("1e28") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        3: {
            requirementDescription: "3: 1e35 Groove Power",
            effectDescription: "A severe thunderstorm breaks the local transformer. Unlock \"Week-Long Outage\" (in Song layer).",
            done() { return player.ddr.groovePower.gte("1e35") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        4: {
            requirementDescription: "4: 1e50 Groove Power.",
            effectDescription: "After a week, power returns to normal. Unlock a DDR buyable, and you passively generate 1% of Marvelous arrows you would gain from playing the DDR minigame.",
            done() { return player.ddr.groovePower.gte("1e50") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        5: {
            requirementDescription: "5: 1e63 Groove Power.",
            effectDescription: "You start to love DDR. x15 Great arrows and QN.",
            done() { return player.ddr.groovePower.gte("1e63") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        6: {
            requirementDescription: "6: 1e68 Groove Power.",
            effectDescription: "You get EVEN MORE musical inspiration from DDR! Quarter Notes' formula now uses an exponent instead of a logarithm.",
            done() { return player.ddr.groovePower.gte("1e68") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("1e6")},
            exponentialBase() {
                let init = new Decimal("5")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "DanceDanceRevolution",
            display() {
                return "The original 1998 version! I was NOT alive when this came out. x2 Arrows per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effect(x) {
                let base = new Decimal(2)
                let effect = base.pow(x)
                return effect
            },
            unlocked() {return hasMilestone("ddr", 4)},
            buyMax() {
                let timesBought = player.n.points
                //insert cost effects here

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        12: {
            base() {return new Decimal("1e10")},
            exponentialBase() {
                let init = new Decimal("8")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "DDR MAX",
            display() {
                return "The introduction of Freeze Arrows. I can't say anything good nor bad about these. x125 Groove Power per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effect(x) {
                let base = new Decimal(125)
                let effect = base.pow(x)
                return effect
            },
            unlocked() {return getBuyableAmount("ddr", 11).gte(10)},
            buyMax() {
                let timesBought = player.n.points
                //insert cost effects here

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        13: {
            base() {return new Decimal("1e6")},
            exponentialBase() {
                let init = new Decimal("10")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "DDR EXTREME",
            display() {
                return "Welcome to the \"Marvelous\" judgement era. I personally love the idea of something better than \"Perfect\". x1.05 Songs per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effect(x) {
                let base = new Decimal(1.05)
                let effect = base.pow(x)
                return effect
            },
            unlocked() {return getBuyableAmount("ddr", 12).gte(4)},
            buyMax() {
                let timesBought = player.n.points
                //insert cost effects here

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        21: {
            base() {return new Decimal("1e10")},
            exponentialBase() {
                let init = new Decimal("20")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "DDR SuperNOVA",
            display() {
                return "You can now use e-AMUSEMENT! I don't use this feature as I'm a casual player. x1e10 ME per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effect(x) {
                let base = new Decimal("1e10")
                let effect = base.pow(x)
                return effect
            },
            unlocked() {return getBuyableAmount("ddr", 13).gte(10)},
            buyMax() {
                let timesBought = player.n.points
                //insert cost effects here

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
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
            rewardDescription: "Improve Marvelous, Great, and Almost arrow effects, and x5 to all of their gains and Arrows.",
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
        21: {
            name: "DIFFICULT",
            challengeDescription: "<i>\"This difficulty is aimed at <b>intermediate players.</b> I hope your rhythm is good.\"</i> <br><br> Combo multiplies combo gain. Combo boosts do not work. This challenge resets your combo upon entry and exit.",
            goalDescription: "Have a combo of at least 40.",
            rewardDescription: "Autobuy Note buyable 1, and unlock another row of HN upgrades. x5 QN.",
            canComplete: function() {return player.ddrm.combo.gte(40)},
            unlocked() {return hasUpgrade(this.layer, 34)},
            style() {
                if (!hasChallenge(this.layer, this.id)) return {
                    "width": "400px",
                    "height": "275px",
                }
                return {
                    "width": "400px",
                    "height": "275px",
                    "background": "#FF3333",
                }
            },
            onEnter() {player.ddrm.combo = new Decimal(0)},
            onExit() {player.ddrm.combo = new Decimal(0)},
        },
        22: {
            name: "EXPERT",
            challengeDescription: "<i>\"This difficulty is aimed at <b>experienced players.</b> A wonderful challenge for the avid.\"</i> <br><br> ME multiplies combo gain, ME and Notes are raised to ^0.1, and Almost arrows reset your combo. This challenge resets your combo upon entry and exit.",
            goalDescription: "Have a combo of at least 75.",
            rewardDescription: "Keep Song milestones 5-10 and x5 QN. ÷1e25 to Note buyable 1's cost.",
            canComplete: function() {return player.ddrm.combo.gte(75)},
            unlocked() {return hasUpgrade("n", 214)},
            style() {
                if (!hasChallenge(this.layer, this.id)) return {
                    "width": "400px",
                    "height": "275px",
                }
                return {
                    "width": "400px",
                    "height": "275px",
                    "background": "#00E700",
                }
            },
            onEnter() {player.ddrm.combo = new Decimal(0)},
            onExit() {player.ddrm.combo = new Decimal(0)},
        },
        31: {
            name: "CHALLENGE",
            challengeDescription: "<i>\"This difficulty is aimed at <b>very experienced players.</b> Do not try this at home!\"</i> <br><br> Almost and Great arrows reset your combo. Combo boosts do not work. This challenge resets your combo upon entry and exit.",
            goalDescription: "Have a combo of at least 65k.",
            rewardDescription: "Unlock another row of QN upgrades. QN now uses a logarithm of base 2.",
            canComplete: function() {return player.ddrm.combo.gte(65000)},
            unlocked() {return hasUpgrade("s", 34)},
            style() {
                if (!hasChallenge(this.layer, this.id)) return {
                    "width": "400px",
                    "height": "275px",
                }
                return {
                    "width": "400px",
                    "height": "275px",
                    "background": "#CB0BCD",
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
                "blank",
                "buyables",
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
        "GROOVE RADAR": {
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
                ["infobox", "grooveRadar"],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: #379be2; text-shadow: 0px 0px 10px #379be2">${format(player.ddr.groovePower)}</h2> Groove Power, which multiplies ME, Notes, WN, and HN by x${format(player.ddr.gpe)} <br> (${format(player.ddr.gpg)}/sec)`}],
                ["display-text", function(){return `<span style="color:#BBBBBB">Start gaining Groove Power at 1e350 Notes!`}],
                "blank",
                "milestones",
                "blank",
                ["bar", "stream"],
                ["blank", "8px"],
                ["clickables", [1]],
                "blank",
                ["bar", "voltage"],
                ["blank", "8px"],
                ["clickables", [2]],
            ],
            unlocked() {return hasUpgrade("ddr", 41)}
        },
    },

    infoboxes: {
        grooveRadar: {
            title: "GROOVE RADAR Mechanic",
            body() { return "Guys, there's something wrong with my GROOVE RADA- Sorry, I just love Portal 2. " +
                "Anyway, the GROOVE RADAR (GR) functions very similarly to Tuba Tree 2's Energies. In layman's terms, " +
                "\"more groove radar fill, more difficult the game.\" Each of the five values affect a different " +
                "aspect of the game. So far, you only have two unlocked: Stream and Voltage. Depending on how " +
                "powerful your GR values are, you can generate GROOVE POWER (GP). GROOVE POWER affects " +
                "currencies and whatnot. <i>Changing any GR values will result in a layer reset, " +
                "depending on where the value was unlocked from.</i>"
            },
            unlocked() {return true},
        },
    },

    bars: {
        stream: {
            direction: RIGHT,
            width: 727,
            height: 75,
            display() {
                let text = `Stream: M, G, and A arrow effects are divided by ÷${format(player.ddr.stream)}. Boost per value: x10`
                return text
            },
            progress() {
                let prog = new Decimal(0)
                prog = player.ddr.stream.log(player.ddr.streamImpact).div(10)
                
                return prog
            },
            fillStyle() { return {"background-color": "#2280C2",} },
        },

        voltage: {
            direction: RIGHT,
            width: 727,
            height: 75,
            display() {
                let text = `Voltage: Musical Essence and Notes are raised to ^${format(player.ddr.voltage)}. Boost per value: x1000`
                return text
            },
            progress() {
                let prog = new Decimal(0)
                prog = player.ddr.voltage.log(1.2).div(-10)
                
                return prog
            },
            fillStyle() { return {"background-color": "#2280C2",} },
        },
    },

    clickables: {
        11: {
            title: "Increase Stream level by +1",
            canClick() {return true},
            onClick() {
                if (player.ddr.stream.gte(player.ddr.streamImpact.pow(10))) return;
                player.ddr.stream = player.ddr.stream.mul(player.ddr.streamImpact)
                doReset("ddr", true)
            },
        },
        12: {
            title: "Decrease Stream level by -1",
            canClick() {return true},
            onClick() {
                if (player.ddr.stream.lte(1)) return;
                player.ddr.stream = player.ddr.stream.div(player.ddr.streamImpact)
                doReset("ddr", true)
            },
        },
        13: {
            title: "Maximize Stream level",
            canClick() {return true},
            onClick() {
                player.ddr.stream = player.ddr.streamImpact.pow(10)
                doReset("ddr", true)
            },
        },
        14: {
            title: "Minimize Stream level",
            canClick() {return true},
            onClick() {
                player.ddr.stream = new Decimal(1)
                doReset("ddr", true)
            },
        },

        21: {
            title: "Increase Voltage level by +1",
            canClick() {return true},
            onClick() {
                if (player.ddr.voltage.lte(0.0174)) return;
                player.ddr.voltage = player.ddr.voltage.div(1.2)
                doReset("ddr", true)
            },
        },
        22: {
            title: "Decrease Voltage level by -1",
            canClick() {return true},
            onClick() {
                if (player.ddr.voltage.gte(1)) return;
                player.ddr.voltage = player.ddr.voltage.mul(1.2)
                doReset("ddr", true)
            },
        },
        23: {
            title: "Maximize Voltage level",
            canClick() {return true},
            onClick() {
                player.ddr.voltage = new Decimal(1).div(new Decimal(1.2).pow(10))
                doReset("ddr", true)
            },
        },
        24: {
            title: "Minimize Voltage level",
            canClick() {return true},
            onClick() {
                player.ddr.voltage = new Decimal(1)
                doReset("ddr", true)
            },
        },
    },

    update(diff){
        //stream impact
        player.ddr.streamImpact = new Decimal("1e10")
        if (hasMilestone(this.layer, 2)) player.ddr.streamImpact = player.ddr.streamImpact.div("1e9")

        //gp threshold
        player.ddr.gpThreshold = new Decimal("1e350")
        if (hasUpgrade("n", 311)) player.ddr.gpThreshold = player.ddr.gpThreshold.div("1e50")

        //groove power
        let mult = new Decimal(0)
        if (player.points.gte(player.ddr.gpThreshold) && (player.ddr.stream.neq(1) || player.ddr.voltage.neq(1))) mult = mult.add(1)
        mult = mult.mul(player.points.add(1).log(10).div(5))

        mult = mult.mul(new Decimal(10).pow(player.ddr.stream.log(player.ddr.streamImpact)))
        mult = mult.mul(new Decimal(1000).pow(player.ddr.voltage.log(1.2).div(-1)))

        //gp boosts
        if (hasUpgrade("s", 32)) mult = mult.mul("1e10")
        if (hasChallenge("s", 12)) mult = mult.mul("1e15")
        mult = mult.mul(buyableEffect("ddr", 12))

        player.ddr.gpg = mult

        player.ddr.groovePower = player.ddr.groovePower.add(player.ddr.gpg.mul(diff))
        player.ddr.gpe = player.ddr.groovePower.add(1).log(player.ddr.streamImpact).mul(100).pow(10)
        
    },

    tooltip() {
        if (!canReset(this.layer)) return format(player.ddr.points) + " Arrows (\"Power Outage\" needed to reset)"
        return format(player.ddr.points) + " Arrows (+" + format(getResetGain("ddr")) + " Arrows on reset)"
    },
})