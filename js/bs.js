addLayer("bs", {
    name: "bs", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⚔️", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        level: 0,
        levelEffect: new Decimal(1),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "#E00000",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient(90deg, #E00000, #0000E0)";
		return style;
	},
    requires: new Decimal("1e300"), // Can be a function that takes requirement increases into account
    resource: "Cubes", // Name of prestige currency
    baseResource: "Arrows", // Name of resource prestige is based on
    baseAmount() {return player.ddr.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        if (hasAchievement("a", 36)) mult = mult.mul(4)
            
        layer = "n"
        if (hasUpgrade(layer, 52)) mult = mult.mul(upgradeEffect(layer, 52))
        if (hasUpgrade(layer, 53)) mult = mult.mul(4)

        layer = "ddr"
        
        if (player.ddrfc.points.gte(7)) mult = mult.mul(2.5)

        layer = "bs"
        if (hasUpgrade("bs", 33)) mult = mult.mul(15)
    
        mult = mult.mul(buyableEffect(layer, 11))
        mult = mult.mul(buyableEffect(layer, 41))
        
        layer = "d"
        mult = mult.mul(buyableEffect(layer, 13))
        if (hasUpgrade(layer, 11)) mult = mult.mul(2)
        if (hasUpgrade(layer, 12)) mult = mult.mul(3)
        if (hasUpgrade(layer, 13)) mult = mult.mul(5)
        if (hasUpgrade(layer, 14)) mult = mult.mul(10)

        mult = mult.mul(player.bsm.cEffect)
        mult = mult.mul(player.bs.levelEffect)
        mult = mult.mul(player.d.moveCEffect)
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "bs"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "C", description: "SHIFT+C: Reset for Cubes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("s", 44)) player.bs.unlocked = true
        return player.bs.unlocked
    },
    canReset(){return hasUpgrade("s", 44)},
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
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ddr.points)} Arrows.`}],
                ["blank", function() {if (!hasUpgrade("s", 44)) return ["8px", "17px"]; else return ["0px", "0px"]}],
                ["display-text", function(){if (!hasUpgrade("s", 44)) return "You need \"Mega Unlock\" first!"}],
                ["blank", "17px"],
                ["display-text", function(){return "Row 1 upgrades are for recovery."}],
                ["blank", "4px"],
                ["upgrades", [1]],
                "blank",
                ["display-text", function(){return "Row 2-5 upgrades are for progression."}],
                ["blank", "4px"],
                ["upgrades", [2, 3]],
                "blank",
                ["display-text", function(){return "Row 6 upgrades are for unlocking mechanics."}],
                ["blank", "4px"],
                ["upgrades", [6]],

            ],
        },
        "Campaign": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ddr.points)} Arrows.`}],
                ["blank", function() {if (!hasUpgrade("s", 44)) return ["8px", "17px"]; else return ["0px", "0px"]}],
                ["display-text", function(){if (!hasUpgrade("s", 44)) return "You need \"Mega Unlock\" first!"}],
                "blank",
                ["infobox", "campaignBox"],
                ["display-text", function(){return `Your highest mission level is <h2 style="color: #ff4040; text-shadow: 0px 0px 10px #ff4040">${player.bs.level}</h2>, multiplying Cubes by x${format(player.bs.levelEffect)}.`}],
                ["blank", "4px"],
                
                ["row", [["buyable", 11]]],
                ["blank", "40px"],
                ["row", [["buyable", 21], ["blank", ["30px", "10px"]], ["buyable", 22]]],
                ["blank", "40px"],
                ["row", [["buyable", 31]]],
                ["blank", "40px"],
                ["row", [["buyable", 41], ["blank", ["30px", "10px"]], ["buyable", 42]]],
                ["blank", "40px"],
                ["row", [["buyable", 51], ["blank", ["30px", "10px"]], ["buyable", 52]]],
            ],
            unlocked() {return hasUpgrade("bs", 62)},
        },
    },
    upgrades: {
        11: {
            title: "Skip the Basics.",
            description: "x1e1000 ME and always bulk-compose Songs. x100 Arrows.",
            cost: new Decimal("1"),
        },
        12: {
            title: "Skip the Minigame.",
            description: "Arrows in the DDR minigame are automatically hit. The threshold for Groove Power is reduced to 1e250.",
            tooltip: "Additionally, all 3 arrow types are influenced, and DANCE LEVELS do not restrict DDR combo gain.",
            cost: new Decimal("1"),
        },
        13: {
            title: "Skip the Buyables.",
            description: "Automatically bulk-buy the Note and DDR buyables.",
            cost: new Decimal("1"),
        },
        14: {
            title: "Skip the Upgrades.",
            description: "Automatically buy Note, Song, and Arrow upgrades.",
            tooltip: "All Groove Power milestones are also kept.",
            cost: new Decimal("1"),
        },

        21: {
            title: "Better Formulas",
            description: "Stream now gives 1e10 per level and Voltage gives 1e15 per level. Keep all DANCE LEVELS and the GROOVE RADAR unlocked.",
            cost: new Decimal("1"),
            unlocked() {return hasUpgrade("bs", 14)},
        },
        22: {
            title: "MORE EXPONENTS!",
            description: "^1.15 ME, Notes, Arrows, and DDR combo.",
            cost: new Decimal("3"),
            unlocked() {return hasUpgrade("bs", 14)},
        },
        23: {
            title: "Cubes for Arrows",
            effect() {
                let base = player.bs.points.add(1)
                base = base.pow(12.5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Arrows"
                return text
            },
            description: "Arrow gain is boosted by Cubes.",
            cost: new Decimal("10"),
            unlocked() {return hasUpgrade("bs", 14)},
        },
        24: {
            title: "VR Expansion",
            description: "Always generate Notes, Songs, Arrows, and DDR combo. x150 Arrows after softcap.",
            cost: new Decimal("30"),
            unlocked() {return hasUpgrade("bs", 14)},
        },

        31: {
            title: "Arm Strength",
            description: "Improve Cut and Bad Cut Effects.",
            cost: new Decimal("500"),
            unlocked() {return hasUpgrade("bs", 24)},
        },
        32: {
            title: "Less Time to Dance",
            description: "Keep DANCE LEVELS and Groove Power on reset.",
            cost: new Decimal("5e5"),
            unlocked() {return hasUpgrade("bs", 24)},
        },
        33: {
            title: "do campaign stuff first",
            description: "x15 Cuts, Bad Cuts, BS combo, and Cubes.",
            cost: new Decimal("1e15"),
            unlocked() {return hasUpgrade("bs", 24)},
        },
        34: {
            title: "Auto Combo",
            description: "Full Combo Tiers reset nothing, and automatically get them.",
            cost: new Decimal("1e30"),
            unlocked() {return hasUpgrade("bs", 24)},
        },

        61: {
            title: "Arm-Eye Coordination",
            description: "Unlock the Beat Saber minigame.",
            cost: new Decimal("100"),
            unlocked() {return hasUpgrade("bs", 24)},
        },
        62: {
            title: "Leveling Up",
            description: "Unlock the Campaign.",
            cost: new Decimal("10000"),
            unlocked() {return hasUpgrade("bs", 24)},
        },
        63: {
            title: "Relentless Slasher",
            description: "Unlock Distance.",
            cost: new Decimal("1e17"),
            unlocked() {return hasUpgrade("bs", 24)},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("5000")},
            exponentialBase() {
                let init = new Decimal("1.25")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "<h2>1</h2>",
            display() {
                return "x1.1 Cubes per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
                let base = new Decimal(1.1)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[21, 1], [22, 1]]
                return [[21, 2], [22, 2]]
            },
        },

        21: {
            base() {return new Decimal("50000")},
            exponentialBase() {
                let init = new Decimal("2")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "<h2>2A</h2>",
            display() {
                return "x15 Songs per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 11).gte(10) },
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
                let base = new Decimal(15)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[31, 1]]
                return [[31, 2]]
            },
        },

        22: {
            base() {return new Decimal("75000")},
            exponentialBase() {
                let init = new Decimal("2")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "<h2>2B</h2>",
            display() {
                return "x1e1000 ME per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 11).gte(10) },
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
                let base = new Decimal("1e1000")
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[31, 1], [52, 1]]
                return [[31, 2], [52, 2]]
            },
        },

        31: {
            base() {return new Decimal("2.5e9")},
            exponentialBase() {
                let init = new Decimal("2.5")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "<h2>3</h2>",
            display() {
                return "x12,500 Arrows per purchase (after first softcap)." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 21).gte(10) && getBuyableAmount(this.layer, 22).gte(10) },
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
                let base = new Decimal(12500)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[41, 1], [42, 1]]
                return [[41, 2], [42, 2]]
            },
        },

        41: {
            base() {return new Decimal("1e16")},
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
            title: "<h2>4A</h2>",
            display() {
                return "x2 Cubes and BS combo per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 31).gte(10) },
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
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

        42: {
            base() {return new Decimal("1e18")},
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
            title: "<h2>4B</h2>",
            display() {
                return "x4 Bad Cuts per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 31).gte(10) },
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
                let base = new Decimal(4)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[51, 1], [52, 1]]
                return [[51, 2], [52, 2]]
            },
        },

        51: {
            base() {return new Decimal("1e24")},
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
            title: "<h2>5A</h2>",
            display() {
                return "x1.5 Distance per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 42).gte(10) },
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
                let base = new Decimal(1.5)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[61, 1], [62, 1]]
                return [[61, 2], [62, 2]]
            },
        },

        52: {
            base() {return new Decimal("1e24")},
            exponentialBase() {
                let init = new Decimal("9")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "<h2>5B</h2>",
            display() {
                return "x25,000 Eighth Notes per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "/" + tmp[this.layer].buyables[this.id].purchaseLimit + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, 42).gte(10) },
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
                let base = new Decimal(25000)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "font-size": "14px"
                }
            },
            purchaseLimit() {return new Decimal(10)},
            unlocked() {return true},
            buyMax() {
                let timesBought = player.bs.points
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

            branches: function(){
                if (getBuyableAmount(this.layer, this.id).gte(10)) return [[72, 1]]
                return [[72, 2]]
            },
        },
    },

    infoboxes: {
        campaignBox: {
            title: "The Campaign",
            body() { return "This, is the Beat Saber Campaign. A fairly average progression mechanic that's a nightmare when you least expect it. " +
                "Okay, no. That was TOO Portal 2-like. Anyway, the Beat Saber Campaign (called the Campaign) " +
                "is TL;DR, 51 buyables split across 31 levels. You don't actually have to play Beat Saber to unlock levels- " +
                "no, wait, that might actually be a good idea. Anyway, you need to max out one mission " +
                "to unlock any connected to it, and ALL missions have to be maxed in order to have another node be available. "
            },
            unlocked() {return true},
        },
    },

    update(diff){
        //campaign
        let l = new Decimal(0)
        if (getBuyableAmount(this.layer, 11).gte(1)) l = l.add(1)
        if (getBuyableAmount(this.layer, 21).gte(1) || getBuyableAmount(this.layer, 22).gte(1)) l = l.add(1)
        if (getBuyableAmount(this.layer, 31).gte(1)) l = l.add(1)
        if (getBuyableAmount(this.layer, 41).gte(1) || getBuyableAmount(this.layer, 42).gte(1)) l = l.add(1)
        if (getBuyableAmount(this.layer, 51).gte(1) || getBuyableAmount(this.layer, 52).gte(1)) l = l.add(1)
        
        player.bs.level = l
        player.bs.levelEffect = player.bs.level.mul(1.5).pow(1.5).add(1)
    },

    glowColor() {
        let layer = "bs"
        for (id in tmp[layer].upgrades){
            if (isPlainObject(layers[layer].upgrades[id])){
                if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
                    return "red"
                }
            }
        }

        for (const id of [11]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return "cyan"
            }
        }

        return ""
    },
    shouldNotify() {
        let layer = "bs"
        for (const id of [11]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return true
            }
        }
        return false
    },

    branches: ["d", 1],

    tooltip() {
        text = format(player.bs.points) + " Cubes (+" + format(getResetGain("bs")) + " Cubes on reset)"
        if (!canReset(this.layer)) text = format(player.bs.points) + " Cubes (\"Mega Unlock\" needed to reset)"
        return text
    },
})