addLayer("d", {
    name: "d", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Δ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        movement: new Decimal(0),
        stamina: new Decimal(0),
        maxStamina: new Decimal(5),

        moveSEffect: new Decimal(0),
        moveCEffect: new Decimal(0),

        current: [],
        maxTiles: 3,

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "#ff80d0",
    requires: new Decimal("1e480"),
    resource: "Distance", // Name of prestige currency
    baseResource: "Arrows", // Name of resource prestige is based on
    baseAmount() {return player.ddr.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    resetDescription: "Move your hands ",
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        layer = "bs"
        mult = mult.mul(buyableEffect(layer, 51))

        layer = "d"
        mult = mult.mul(buyableEffect(layer, 13))
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "d"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "D", description: "SHIFT+D: Reset for Distance", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("bs", 63)) player.d.unlocked = true
        return player.d.unlocked
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
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.bs.points)} Cubes.`}],
                "blank",
                ["display-text", function(){return `You have moved <h2 style="color: #ff80d0; text-shadow: 0px 0px 10px #ff80d0">${format(player.d.movement)}</h2> units (Movement), increasing max Stamina by +${format(player.d.moveSEffect)} and multiplying Cubes by x${format(player.d.moveCEffect)}.`}],
                "blank",
                "buyables",
                "blank",
                "challenges",
                ["blank", "8px"],
                ["bar", "stamina"],
                ["blank", "8px"],
                "grid",
            ],
        },
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.bs.points)} Cubes.`}],
                "blank",
                "upgrades",
            ],
        },
    },

    findMults_DIST() {
        let mult = new Decimal(1)

        mult = mult.add(player.d.points.pow(0.25))

        mult = mult.mul(buyableEffect("d", 12))
        
        return mult
    },
    
    upgrades: {
        11: {
            title: "Quectometer 1 (10^<sup>-30</sup>)",
            description: "+2 to max Stamina and x2 Cubes.",
            cost: new Decimal("250"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return true},
        },
        12: {
            title: "Quectometer 2 (10^<sup>-30</sup>)",
            description: "+3 to max Stamina and x3 Cubes.",
            cost: new Decimal("500"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return true},
        },
        13: {
            title: "Quectometer 3 (10^<sup>-30</sup>)",
            description: "+5 to max Stamina and x5 Cubes.",
            cost: new Decimal("750"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return true},
        },
        14: {
            title: "Quectometer 4 (10^<sup>-30</sup>)",
            description: "+10 to max Stamina and x10 Cubes.",
            cost: new Decimal("1000"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return true},
        },

        21: {
            title: "Rontometer 1 (10^<sup>-27</sup>)",
            description: "x100 Cuts and x3 BS combo.",
            cost: new Decimal("3000"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return hasUpgrade("d", 14)},
        },
        22: {
            title: "Rontometer 2 (10^<sup>-27</sup>)",
            description: "x125 Cuts and x4 BS combo.",
            cost: new Decimal("6000"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return hasUpgrade("d", 14)},
        },
        23: {
            title: "Rontometer 3 (10^<sup>-27</sup>)",
            description: "x175 Cuts and x5 BS combo.",
            cost: new Decimal("12000"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return hasUpgrade("d", 14)},
        },
        24: {
            title: "Rontometer 4 (10^<sup>-27</sup>)",
            description: "x250 Cuts and x6 BS combo.",
            cost: new Decimal("12000"),
            currencyDisplayName: "Movement",
            currencyInternalName: "movement",
            currencyLayer: "d",
            unlocked() {return hasUpgrade("d", 14)},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("5")},
            exponentialBase() {
                let init = new Decimal("3")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "Energy Bars",
            display() {
                return "x1.05 max Stamina per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
            style() {
                return {
                    "height": "100px"
                }
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player.d.points
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
            base() {return new Decimal("25")},
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
            title: "Lightweight Material",
            display() {
                return "x1.25 Movement per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
                let base = new Decimal(1.25)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "height": "100px"
                }
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player.d.points
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
            base() {return new Decimal("10")},
            exponentialBase() {
                let init = new Decimal("250")
                if (getBuyableAmount(this.layer, this.id).gte(5)) init = init.mul(1.5)
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                return final //if you add anything to the cost formula, make sure to update the buymax()!
            },
            title: "Resource Abundance",
            display() {
                return "x5 Distance and Cubes per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
                let base = new Decimal(5)
                let effect = base.pow(x)
                return effect
            },
            style() {
                return {
                    "height": "100px"
                }
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player.d.points
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

    challenges: {
        11: {
            name: "Put the VR Headset On",
            challengeDescription: "How this works: enter this challenge, and Stamina will linearly decrease. You force-exit the challenge if it runs out. The tiles below this help you gain Movement, boosted by Distance.",
            goalDescription: "You can't complete this, silly!",
            rewardDescription: "What reward do you want? x1 Cubes?",
            canComplete: function() {return false},
            unlocked() {return true},
            style() {
                return {
                    "width": "350px",
                    "height": "250px",
                }
            },
        },
    },

    bars: {
        stamina: {
            direction: RIGHT,
            width: 500,
            height: 50,
            display() {
                let text = `You have <h2 style="color: #ff80d0; text-shadow: 0px 0px 10px #ff80d0">${format(player.d.stamina)}/${format(player.d.maxStamina)}</h2> Stamina remaining.`
                return text
            },
            progress() {
                let prog = new Decimal(0)
                prog = player.d.stamina.div(player.d.maxStamina)
                
                return prog
            },
            fillStyle() { return {"background-color": "#bb378b",} },
        },
    },

    grid: {
        rows: 5, // If these are dynamic make sure to have a max value as well!
        cols: 9,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return inChallenge("d", 11)
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 
            if (player.d.current.includes(id)){
                player.d.current.splice(player.d.current.indexOf(id), 1)
                player.d.movement = player.d.movement.add(tmp.d.findMults_DIST())
            }
        },
        getDisplay(data, id){
            return 
        },
        getStyle(data, id){
            if (player.d.current.includes(id)) return {
                "background-color": "#ff80d0"
            }

            return {
                "background-color": "#bb378b"
            }
        },
    },

    update(diff){
        //calculate max stamina
        let layer;
        let mult = new Decimal(5)
        layer = "d"

        mult = mult.add(player[layer].moveSEffect)
        if (hasUpgrade(layer, 11)) mult = mult.add(2)
        if (hasUpgrade(layer, 12)) mult = mult.add(3)
        if (hasUpgrade(layer, 13)) mult = mult.add(5)
        if (hasUpgrade(layer, 14)) mult = mult.add(10)

        mult = mult.mul(buyableEffect(layer, 11))


        player.d.maxStamina = mult

        //stamina logic
        if (!inChallenge("d", 11)) {
            player.d.stamina = Decimal.abs(Decimal.min(player.d.maxStamina, player.d.stamina.mul(1.25)))
        } else {
            player.d.stamina = player.d.stamina.sub(new Decimal(1).mul(diff))
            if (player.d.stamina.lte(0.05)) doReset("d", true)
        }

        //tiles
        //calculate max tiles
        mult = new Decimal(3)
        if (hasUpgrade("n", 403)) mult = mult.add(2)

        player.d.maxTiles = Decimal.min(mult, new Decimal(45))

        if (player.d.current.length < player.d.maxTiles) {
            let c = Math.floor(Math.random() * 9) + 1
            let r = Math.floor(Math.random() * 5) + 1
            if (!player.d.current.includes(r * 100 + c)) player.d.current.push(r * 100 + c)
        }

        //effects
        mult = player.d.movement.add(1).log("1e10")

        if (hasUpgrade("n", 404)) mult = mult.mul(25)

        player.d.moveSEffect = mult

        mult = player.d.movement.add(1).log(100).add(1)
        
        if (hasUpgrade("n", 404)) mult = mult.mul(25)

        player.d.moveCEffect = mult
    },

    tooltip() {return format(player.d.points) + " Distance (+" + format(getResetGain("d")) + " Distance on reset)"},
})