addLayer("p", {
    name: "p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PRM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(0,204,255)",
    requires: new Decimal("1e10"), // Can be a function that takes requirement increases into account
    resource: "Numbers", // Name of prestige currency
    baseResource: "Fundamentality", // Name of resource prestige is based on
    baseAmount() {return player.f.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "f"
        if (!getClickableState("sub", 1001) || (getClickableState("sub", 1001) && !getClickableState("sub", 24))){
            if (hasUpgrade(layer, 31)) mult = mult.add(2)
            if (hasUpgrade(layer, 35)) mult = mult.add(upgradeEffect(layer, 35))
            if (hasUpgrade(layer, 37)) mult = mult.add(21)
        }

        layer = "add"
        mult = mult.add(player.add.additionTypeFunda.pow(5))
        //mul
        layer = "f"
        if (!getClickableState("sub", 1001) || (getClickableState("sub", 1001) && !getClickableState("sub", 24))){
            if (hasUpgrade(layer, 36)) mult = mult.mul(2)
        }
    
        if (hasUpgrade(layer, 41)) mult = mult.mul(377)

        layer = "p"
        if (hasMilestone(layer, 3)) mult = mult.mul(3)
        if (hasMilestone(layer, 4)) mult = mult.mul(3)
        if (hasMilestone(layer, 10)) mult = mult.mul(2)
        if (hasMilestone(layer, 12)) mult = mult.mul(5)
        if (hasMilestone(layer, 13)) mult = mult.mul(10000)

        mult = mult.mul(buyableEffect(layer, 13))

        layer = "ar"
        mult = mult.mul(player[layer].effectPV1)

        if (hasMilestone(layer, 4)) mult = mult.mul(player.ar.functionE3)
        //exp 
        layer = "d"
        if (player.d.points.gte(1)) mult = mult.pow(1.05)
        //other hypers
        //time dilations/chals
        layer = "sub"
        if (getClickableState(layer, 1001)){
            if (getClickableState(layer, 31)) mult = mult.pow(0.5)
            if (getClickableState(layer, 32)) mult = mult.pow(0.25)
        }

        layer = "ar"
        if (inChallenge("ar", 11)) mult = mult.pow(0.5)
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "p"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "p", description: "P: Reset for Numbers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("f", 27)) player.p.unlocked = true
        return player.p.unlocked
    },
    passiveGeneration() {
        if (hasUpgrade("ar", 24)) return 1
        return 0
    }, //use autoPrestige() if static!
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptMilestones = []

        let keptP11State = getClickableState("p", 11)
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        setClickableState("p", 11, keptP11State)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    milestonePopups() {return getClickableState("p", 11)},

    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(0, 200, 255); text-shadow: 0px 0px 10px #379be2">${format(player.p.points)}</h2> Numbers (Nums)`}],
                ["display-text", function(){return `You have made a total of ${format(player.p.total)} Numbers`}],
                ["blank", "4px"],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.f.points)} Fundamentality.`}],
                "blank",
                "buyables",
                "blank",
                "h-line",
                "blank",
                "clickables",
                "blank",
                "milestones",
            ],
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 1 total Number",
            effectDescription: "x5 and +10 Funda.",
            done() { return player.p.total.gte("1") },
        },
        2: {
            requirementDescription: "2: 100 total Numbers",
            effectDescription: "x10 and +10 Points. Generate 100% of your pending Fundamentality per second.",
            done() { return player.p.total.gte("100") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        3: {
            requirementDescription: "3: 2,500 total Numbers",
            effectDescription: "+1.5 to the exponents in the formulas of \"Progressing\" and \"Mutual Relationship\". x3 Numbers.",
            done() { return player.p.total.gte("2500") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        4: {
            requirementDescription: "4: 20,000 total Numbers",
            effectDescription: "+0.25 to the bases of \"Fundamental Acceleration\" and \"Rapid Generation\". x3 Numbers, again.",
            done() { return player.p.total.gte("20000") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        5: {
            requirementDescription: "5: 500,000 total Numbers",
            effectDescription: "Automate the first 14 Funda upgrades. Unlock another Primitive buyable.",
            done() { return player.p.total.gte("5e5") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        6: {
            requirementDescription: "6: 10,000,000 total Numbers",
            effectDescription: "Exponent time! Raise Points to ^1.11.",
            done() { return player.p.total.gte("1e7") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        7: {
            requirementDescription: "7: 300,000,000 total Numbers",
            effectDescription: "+0.5 to the base of \"Rapid Generation\", and x250 Points!",
            done() { return player.p.total.gte("3e8") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        8: {
            requirementDescription: "8: 1e11 total Numbers",
            effectDescription: "The logarithm's base in \"Progressing\" is reduced by -0.49, and unlock 3 Funda upgrades.",
            done() { return player.p.total.gte("1e11") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        9: {
            requirementDescription: "9: 2e12 total Numbers",
            effect(){
                let base = player.p.points.add(1)

                base = base.pow(0.25).add(1)

                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e6")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDescription() { return "Numbers boost Funda. Currently: x" + format(milestoneEffect(this.layer, this.id)) + " to Funda" },
            done() { return player.p.total.gte("2e12") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        10: {
            requirementDescription: "10: 1e15 total Numbers",
            effectDescription: "x1,000,000 Points! And x2 Numbers! Automate the 15th-17th Funda upgrades and keep \"Buyable Bargain\".",
            done() { return player.p.total.gte("1e15") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        11: {
            requirementDescription: "11: 1e20 total Numbers",
            effectDescription: "Unlock 4 more Funda upgrades. +0.15 to the base of \"Duplication Machine\". Hint: you'll get the 21st upgrade in the next layer.",
            done() { return player.p.total.gte("1e20") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        12: {
            requirementDescription: "12: 1e32 total Numbers",
            effectDescription: "Unlock the next layer. x5 Numbers.",
            done() { return player.p.total.gte("1e32") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        13: {
            requirementDescription: "13: 1e80 total Numbers",
            effectDescription: "x10,000 Funda and Numbers, and ^1.05 Points. You'll get this in the next layer.",
            done() { return player.p.total.gte("1e80") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        14: {
            requirementDescription: "14: 1e190 total Numbers",
            effectDescription: "Unlock three Fundamental upgrades.",
            done() { return player.p.total.gte("1e190") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("1")},
            exponentialBase() {
                let init = new Decimal("3")
                if (hasUpgrade("f", 32)) init = init.sub(0.1)
                
                if (inChallenge("ar", 12)) init = init.pow(10)
                    
                if (getClickableState("sub", 1001) && getClickableState("sub", 34)) init = init.pow(25)
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasMilestone("ar", 6)) final = final.div(player.ar.functionE4)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Fundamental Acceleration",
            display() {
                return "Multiplies Funda by " + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("ar", 2)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(2.5)
                if (hasMilestone(this.layer, 4)) base = base.add(0.25)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.5)

                if (getClickableState("sub", 1001) && getClickableState("sub", 33)) softcap = new Decimal(0.01)
                    
                let softcapStart = new Decimal("1e10")
                if (hasMilestone("ar", 3)) softcapStart = softcapStart.mul("1e20")
                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                
                let softcap2 = new Decimal(0.4)
                let softcapStart2 = new Decimal("1e250")
                if (effect.gte(softcapStart2)) effect = effect.pow(softcap2).mul(new Decimal(softcapStart2).pow(decimalOne.sub(softcap2))) //softcap2

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasMilestone("ar", 6)) timesBought = timesBought.mul(player.ar.functionE4)

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasMilestone("ar", 6)) totalCost = totalCost.div(player.ar.functionE4)

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        12: {
            base() {return new Decimal("1")},
            exponentialBase() {
                let init = new Decimal("5")
                if (hasUpgrade("f", 32)) init = init.sub(0.1)

                if (inChallenge("ar", 12)) init = init.pow(10)
                    
                if (getClickableState("sub", 1001) && getClickableState("sub", 34)) init = init.pow(25)
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasMilestone("ar", 6)) final = final.div(player.ar.functionE4)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Rapid Generation",
            display() {
                return "Multiplies Points by " + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("ar", 3)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(5)
                if (hasMilestone(this.layer, 4)) base = base.add(0.25)
                if (hasMilestone(this.layer, 7)) base = base.add(0.5)
                if (hasMilestone("ar", 6)) base = base.add(1.75)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.5)

                if (getClickableState("sub", 1001) && getClickableState("sub", 33)) softcap = new Decimal(0.01)

                let softcapStart = new Decimal("1e10")
                if (hasMilestone("ar", 2)) softcapStart = softcapStart.mul("1e20")
                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let softcap2 = new Decimal(0.4)
                let softcapStart2 = new Decimal("1e400")
                if (effect.gte(softcapStart2)) effect = effect.pow(softcap2).mul(new Decimal(softcapStart2).pow(decimalOne.sub(softcap2))) //softcap2

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasMilestone("ar", 6)) timesBought = timesBought.mul(player.ar.functionE4)

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasMilestone("ar", 6)) totalCost = totalCost.div(player.ar.functionE4)

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        13: {
            base() {return new Decimal("2e5")},
            exponentialBase() {
                let init = new Decimal("12")
                if (hasUpgrade("f", 32)) init = init.sub(0.1)

                if (inChallenge("ar", 12)) init = init.pow(10)

                if (getClickableState("sub", 1001) && getClickableState("sub", 34)) init = init.pow(25)
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasMilestone("ar", 6)) final = final.div(player.ar.functionE4)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Duplication Machine",
            display() {
                return "Multiplies Numbers by " + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("ar", 5)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(1.5)
                if (hasMilestone(this.layer, 11)) base = base.add(0.15)
                if (hasUpgrade("ar", 14)) base = base.add(0.15)
                if (hasChallenge(layer, 11)) base = base.add(0.05)

                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.5)

                if (getClickableState("sub", 1001) && getClickableState("sub", 33)) softcap = new Decimal(0.01)

                let softcapStart = new Decimal("1e7")
                if (hasMilestone("ar", 5)) softcapStart = softcapStart.mul("1e8")
                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let softcap2 = new Decimal(0.4)
                let softcapStart2 = new Decimal("1e100")
                if (effect.gte(softcapStart2)) effect = effect.pow(softcap2).mul(new Decimal(softcapStart2).pow(decimalOne.sub(softcap2))) //softcap2

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasMilestone("ar", 6)) timesBought = timesBought.mul(player.ar.functionE4)

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasMilestone("ar", 6)) totalCost = totalCost.div(player.ar.functionE4)

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
            unlocked() {return hasMilestone(this.layer, 5)},
        },
    },

    clickables: {
        11: {
            title() {return `Toggle milestone popups (${getClickableState(this.layer, this.id)})`},
            canClick() {return true},
            onClick() {
                if (getClickableState(this.layer, this.id) != false && getClickableState(this.layer, this.id) != true) setClickableState(this.layer, this.id, false)
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                return {
                    "width": "160px",
                    "height": "80px",
                }
            }
        },
    },

    update(diff){
        //automation
        let automationBoolean = false

        if (hasMilestone("ar", 2)) automationBoolean = true

        if (automationBoolean){
            let layer = "p"
            let list = [11]
            if (hasMilestone("ar", 3)) list.push(12)
            if (hasMilestone("ar", 5)) list.push(13)
            for (const id of list){
                if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                    tmp[layer].buyables[id].buy()
                }
            }
        }
    },

    branches: [["ar", 1]],
    tooltip() {return format(player.p.points) + " Numbers (+" + format(getResetGain("p")) + " Numbers on reset)"},
})