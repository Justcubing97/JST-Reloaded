addLayer("f", {
    name: "f", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FND", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"),
    }},
    color: "rgb(255, 204, 0)",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Fundamentality", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "f"
        if (!getClickableState("sub", 1001) || (getClickableState("sub", 1001) && !getClickableState("sub", 24))){
            if (hasUpgrade(layer, 21)) mult = mult.add(3)
            if (hasUpgrade(layer, 27)) mult = mult.add(25)
        }

        mult = mult.add(player.add.additionTypeFunda.pow(5))

        layer = "p"
        if (hasMilestone(layer, 1)) mult = mult.add(10)
        //mul
        layer = "f"
        if (!getClickableState("sub", 1001) || (getClickableState("sub", 1001) && !getClickableState("sub", 24))){
            if (hasUpgrade(layer, 15)) mult = mult.mul(2)
            if (hasUpgrade(layer, 16)) mult = mult.mul(8)
            if (hasUpgrade(layer, 22)) mult = mult.mul(upgradeEffect(layer, 22))
            if (hasUpgrade(layer, 24)) mult = mult.div(5)
            if (hasUpgrade(layer, 25)) mult = mult.mul(25)
            if (hasUpgrade(layer, 36)) mult = mult.mul(20)
        }
    
        if (hasUpgrade(layer, 41)) mult = mult.mul(377377)
            
        layer = "p"
        if (hasMilestone(layer, 1)) mult = mult.mul(5)
        if (hasMilestone(layer, 9)) mult = mult.mul(milestoneEffect(layer, 9))
        if (hasMilestone(layer, 13)) mult = mult.mul(10000)

        mult = mult.mul(buyableEffect(layer, 11))
        
        layer = "ar"
        mult = mult.mul(player[layer].effectFV1)
        //exp 
        layer = "f"
        if (hasUpgrade(layer, 43)) mult = mult.pow(1.044)

        layer = "d"
        if (player.d.points.gte(1)) mult = mult.pow(1.05)
        //other hypers
        //time dilations/chals
        layer = "sub"
        if (getClickableState(layer, 1001)){
            if (getClickableState(layer, 21)) mult = mult.pow(0.5)
            if (getClickableState(layer, 22)) mult = mult.pow(0.25)
        }
        layer = "ar"
        if (inChallenge("ar", 11)) mult = mult.pow(0.5)
        //softcaps
        //final
        return mult
    }, //do everything inside the gainMult()
    getResetGain() {
        let layer = "f"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let mult = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (mult.gte(player[layer].softcap1Start)) mult = mult.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))

		return mult.floor().max(0);
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for Fundamental", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        player.f.unlocked = true
        return player.f.unlocked
    },
    passiveGeneration() {
        if (hasMilestone("p", 2)) return 1
        if (hasUpgrade("ar", 24)) return 1
        return 0
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (hasMilestone("p", 10)) keptUpgrades.push(32)

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
                ["display-text", function(){return `You have <h2 style="color: rgb(255, 200, 0); text-shadow: 0px 0px 10px rgb(255, 200, 0)">${format(player.f.points)}</h2> Fundamentality (Funda)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.points)} Points.`}],
                "blank",
                "upgrades",
            ],
        },
    },

    upgrades: {
        11: {
            title: "The First Upgrade",
            description: "x2 Points.",
            cost: new Decimal("1"),
            unlocked() {return true},
        },
        12: {
            title: "Point Boost",
            description: "x3 Points.",
            cost: new Decimal("3"),
            unlocked() {return hasUpgrade(this.layer, 11)},
        },
        13: {
            title: "The Order of Operations",
            description: "+1 Points. Boosts are applied +, *, ^, tetration, followed by time dilations and challenges.",
            cost: new Decimal("10"),
            unlocked() {return hasUpgrade(this.layer, 11)},
        },
        14: {
            title: "Multiply!",
            description: "x5 Points!",
            cost: new Decimal("50"),
            unlocked() {return hasUpgrade(this.layer, 15)},
        },
        15: {
            title: "Wrong Order",
            description: "x2 Fundamentality and Points.",
            cost: new Decimal("20"),
            unlocked() {return hasUpgrade(this.layer, 11)},
        },
        16: {
            title: "Fundamental Boost",
            description: "x8 Funda! And +5 Points!",
            cost: new Decimal("200"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },
        17: {
            title: "Progressing",
            effect() {
                if (getClickableState("sub", 1001) && getClickableState("sub", 23)) return new Decimal(1)
                
                let base = player.f.points.add(1)
                let logbase = new Decimal(2)
                let expbase = new Decimal(2.5)

                if (hasUpgrade("f", 23)) logbase = logbase.sub(0.5)
                if (hasMilestone("p", 8)) logbase = logbase.sub(0.49)
                    
                if (hasMilestone("p", 3)) expbase = expbase.add(1.5)
                if (hasUpgrade("ar", 26)) expbase = expbase.add(25)

                base = base.pow(expbase).add(1).log(logbase).add(1)
                
                if (hasUpgrade("ar", 26)) base = base.pow(4)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Points"
                return text
            },
            description: "Fundamentality boosts Points. Things are getting spicy.",
            cost: new Decimal("1000"),
            unlocked() {return hasUpgrade(this.layer, 14)},
        },

        21: {
            title: "NOT Identical to JST!",
            description: "+3 Funda.",
            cost: new Decimal("12000"),
            unlocked() {return hasUpgrade(this.layer, 17)},
        },
        22: {
            title: "Mutual Relationship",
            effect() {
                if (getClickableState("sub", 1001) && getClickableState("sub", 23)) return new Decimal(1)
                let base = player.points.add(1)
                let logbase = new Decimal(3)
                let expbase = new Decimal(0.875)

                if (hasUpgrade("f", 23)) logbase = logbase.sub(0.5)
                    
                if (hasAchievement("a", 13)) expbase = expbase.add(0.375)
                if (hasMilestone("p", 3)) expbase = expbase.add(1.5)

                base = base.pow(expbase).add(1).log(logbase).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Funda"
                return text
            },
            description: "Points boost Funda. Things are getting spicier.",
            cost: new Decimal("1e5"),
            unlocked() {return hasUpgrade(this.layer, 17)},
        },
        23: {
            title: "Indirect Effect",
            description: "The logarithm bases in \"Progressing\" and \"Mutual Relationship\" are reduced by -0.5.",
            cost: new Decimal("1e6"),
            unlocked() {return hasUpgrade(this.layer, 17)},
        },

        24: {
            title: "Buying one of these upgrades",
            description: "x150 Points, but ÷5 Funda.",
            cost() {
                if (hasUpgrade(this.layer, 25)) return new Decimal("1e7")
                return new Decimal("1.5e6")
            },
            unlocked() {return hasUpgrade(this.layer, 23)},
        },
        25: {
            title: "Increases the cost of the other",
            description: "x25 Funda, but ÷10 Points.",
            cost() {
                if (hasUpgrade(this.layer, 24)) return new Decimal("3e6")
                return new Decimal("1.5e6")
            },
            unlocked() {return hasUpgrade(this.layer, 23)},
        },

        26: {
            title: "Affection <3",
            description: "x75 Points. No strings attached! <3",
            cost: new Decimal("25e6"),
            unlocked() {return hasUpgrade(this.layer, 24) && hasUpgrade(this.layer, 25)},
        },
        27: {
            title: "Last of Layer 1",
            description: "+25 Points and Funda! <3 Unlock the next layer~",
            cost: new Decimal("5e8"),
            unlocked() {return hasUpgrade(this.layer, 26)},
        },
        
        31: {
            title: "The Third Row!",
            description: "+2 Numbers.",
            cost: new Decimal("1e30"),
            unlocked() {return hasMilestone("p", 8)},
        },
        32: {
            title: "Buyable Bargain",
            description: "-0.1 to the first three Primitive buyable scalings.",
            cost: new Decimal("1e36"),
            unlocked() {return hasMilestone("p", 8)},
        },
        33: {
            title: "Recursion",
            effect() {
                let base = player.points.add(1)
                let logbase = new Decimal(3)
                let expbase = new Decimal(3)

                base = base.pow(expbase).add(1).log(logbase).add(1)

                let softcap = new Decimal(0.1)
                let softcapStart = new Decimal("1e1000")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Points"
                return text
            },
            description: "Points boost themselves.",
            cost: new Decimal("1e45"),
            unlocked() {return hasMilestone("p", 8)},
        },
        34: {
            title: "More Upgrades!",
            description: "x1e10 Points! The largest multiplier so far.",
            cost: new Decimal("1e50"),
            unlocked() {return hasMilestone("p", 11)},
        },
        35: {
            title: "Upgrade Multiplier",
            effect() {
                let base = new Decimal(player.f.upgrades.length)
                
                base = base.pow(0.75)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e500")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Numbers"
                return text
            },
            description: "The number of bought Funda upgrades multplies Numbers.",
            cost: new Decimal("1e64"),
            unlocked() {return hasMilestone("p", 11)},
        },
        36: {
            title: "Triple Effect",
            description: "x2 Numbers, x20 Funda, and x200,000 Points.",
            cost: new Decimal("1e70"),
            unlocked() {return hasMilestone("p", 11)},
        },
        37: {
            title: "x1e21",
            description: "+21 Numbers and x21,000,000 Points.",
            cost: new Decimal("1e91"),
            unlocked() {return hasMilestone("p", 11)},
        },
        
        41: {
            title: "Random Number",
            description: "x377 Numbers, x377,377 Funda and x377,377,377 Points.",
            cost: new Decimal("3.77e377"),
            unlocked() {return hasMilestone("p", 14)},
        },
        42: {
            title: "404: Inequalities not Found",
            description: "x4.04 all Ineqs., Functions, EP, and OP.",
            cost: new Decimal("1e404"),
            unlocked() {return hasMilestone("p", 14)},
        },
        43: {
            title: "A = 440 Hz",
            description: "^1.0440 Funda.",
            cost: new Decimal("1e440"),
            unlocked() {return hasMilestone("p", 14)},
        },
    },

    buyables: {

    },

    update(diff){
        //automation
        let automationBoolean = false

        if (hasMilestone("p", 5)) automationBoolean = true
        if (hasUpgrade("ar", 15)) automationBoolean = true

        if (automationBoolean){
            let list = [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27]
            if (hasMilestone("p", 10) || hasUpgrade("ar", 15)) list.push(31, 32, 33)
            if (hasUpgrade("ar", 15)) list.push(34, 35, 36, 37)
            for (const id of list){
                if (!hasUpgrade("f", id) && canAffordUpgrade("f", id) && tmp.f.upgrades[id].unlocked) buyUpgrade("f", id)
            }
        }
    },

    glowColor() {
        let layer = "f"
        for (id in tmp[layer].upgrades){
            if (isPlainObject(layers[layer].upgrades[id])){
                if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
                    return "red"
                }
            }
        }

        return ""
    },

    branches: [["p", 1]],
    tooltip() {
        let text = format(player.f.points) + " Fundamentality (+" + format(getResetGain("f")) + " Fundamentality on reset)"
        if (player.f.points.gte(player.f.softcap1Start)) text += `<br>[FIRST SOFTCAP - ${player.f.softcap1Start} - ^${player.f.softcap1}]`
        return text
    },
})