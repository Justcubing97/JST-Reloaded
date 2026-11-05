addLayer("nc", {
    name: "nc", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NCR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e750"), //defaults for normal layers
    }},
    color: "rgb(0, 255, 204)",
    requires: new Decimal("1e750"), // Can be a function that takes requirement increases into account
    resource: "Number Cores", // Name of prestige currency
    baseResource: "Numbers", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "add"
        let typencraddexp = new Decimal(0.33)
        if (hasUpgrade("poly", 212)) typencraddexp = new Decimal(1)
        mult = mult.add(player.add.additionTypeNC.pow(typencraddexp))
        //mul
        if (hasAchievement("a", 41)) mult = mult.mul(player.poly.vertCap.add(1).log(10).add(1))
        if (hasAchievement("a", 51)) mult = mult.mul(player.ar.arFunction.add(1).log(1.0001).pow(10).add(1))
        mult = mult.mul(buyableEffect(this.layer, 11))

        layer = "ar"
        if (hasChallenge(layer, 21)) mult = mult.mul(5)

        layer = "sub"
        if (hasUpgrade(layer, 21)) mult = mult.mul("1e6")
        if (hasUpgrade(layer, 22)) mult = mult.mul("1e4")
        if (hasUpgrade(layer, 23)) mult = mult.mul("1e10")

        layer = "poly"
        if (hasMilestone(layer, 4)) mult = mult.mul(milestoneEffect(layer, 4))
        if (hasUpgrade(layer, 26)) mult = mult.mul(upgradeEffect(layer, 26)[0])
        if (hasUpgrade(layer, 113)) mult = mult.mul(upgradeEffect("mul", 51))
        if (hasMilestone(layer, 9)) mult = mult.mul("1e10")
        if (hasMilestone(layer, 17)) mult = mult.mul("1e100")

        layer = "div"
        if (hasUpgrade(layer, 11)) mult = mult.mul(100)
        //exp 
        layer = "ar"
        if (hasMilestone(layer, 17)) mult = mult.pow(player.ar.metaE2)

        layer = "div"
        if (hasUpgrade(layer, 14)) mult = mult.pow(1.1)

        layer = "poly"
        if (hasMilestone(layer, 11)) mult = mult.pow(1.05)
        if (hasMilestone(layer, 12)) mult = mult.pow(1.05)
        if (player.poly.area.gte(2544)) mult = mult.pow(player.poly.areaEffect4)
         if (hasUpgrade("div", 25)) mult = mult.pow(1.05)
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "nc"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
        if (hasUpgrade("poly", 216)) gain = gain.mul(upgradeEffect("f", 22))
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        if (hasUpgrade("poly", 107)) player.nc.unlocked = true
        return player.nc.unlocked
    },
    passiveGeneration() {return 1}, //use autoPrestige() if static!
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["points", "buyables"];
        if (resettingLayer == "pf") keep = []

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: [
        ["display-text", function(){return `You have <h2 style="color: rgb(0, 255, 204); text-shadow: 0px 0px 10px rgb(0, 255, 204)">${format(player.nc.points)}</h2> Number Cores (NC)`}],
        ["display-text", function(){return `You have ${format(player.p.points)} Numbers.`}],
        "blank",
        "h-line",
        "blank",
        ["display-text", `Welcome to what I affectionately call Buyable Mania: Number Cores!`],
        ["display-text", `There are going to be a LOT of buyables here.`],
        "blank",
        ["display-text", function() {return `You are gaining +${format(getResetGain(this.layer))} Number Cores per second.`}],
        ["display-text", function() {return `You will gain more Number Cores at ${format(getNextAt(this.layer))} Numbers.`}],
        "blank",
        "h-line",
        "blank",
        "buyables",
    ],
    buyables: {
        11: {
            base() {return new Decimal("10")},
            exponentialBase() {
                let init = new Decimal("5")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasChallenge("ar", 21)) final = final.div(player.ar.functionE9)
                if (player.poly.area.gte(140)) final = final.div(player.poly.areaEffect2)
                final = final.div(player.poly.trianglesEffect1)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Core Condensation",
            display() {
                let added = ""
                if (hasMilestone("poly", 10)) added = "+" + format(player.poly.areaEffect1)
                return "Multiplies Number Core gain by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 5) || hasUpgrade("pf", 103)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(2)
                return base
            },
            effect(x) {
                if (getClickableState("div", 1001)) return new Decimal(1)
                if (inChallenge("poly", 11)) return new Decimal(1)
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                amt = amt.add(player.poly.areaEffect1)

                let effect = base.pow(amt)

                if (player.d.points.gte(4)) effect = effect.pow(1.01)
                
                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1e1000")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasChallenge("ar", 21)) timesBought = timesBought.mul(player.ar.functionE9)
                if (player.poly.area.gte(140)) timesBought = timesBought.mul(player.poly.areaEffect2)
                timesBought = timesBought.mul(player.poly.trianglesEffect1)

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasChallenge("ar", 21)) totalCost = totalCost.div(player.ar.functionE9)
                if (player.poly.area.gte(140)) totalCost = totalCost.div(player.poly.areaEffect2)
                totalCost = totalCost.div(player.poly.trianglesEffect1)

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        12: {
            base() {return new Decimal("250")},
            exponentialBase() {
                let init = new Decimal("15")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasChallenge("ar", 21)) final = final.div(player.ar.functionE9)
                if (player.poly.area.gte(140)) final = final.div(player.poly.areaEffect2)
                final = final.div(player.poly.trianglesEffect1)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Recursive Energy",
            display() {
                let added = ""
                if (hasMilestone("poly", 10)) added = "+" + format(player.poly.areaEffect1)
                return "Multiplies Point gain by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase (depends on Points)." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 5) || hasUpgrade("pf", 103)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = player.points.add(1)
                base = base.log("1e6").add(1)
                return base
            },
            effect(x) {
                if (getClickableState("div", 1001)) return new Decimal(1)
                if (inChallenge("poly", 11)) return new Decimal(1)
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                amt = amt.add(player.poly.areaEffect1)

                let effect = base.pow(amt)

                if (player.d.points.gte(4)) effect = effect.pow(1.01)
                
                let softcap = new Decimal(0.1)
                let softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasChallenge("ar", 21)) timesBought = timesBought.mul(player.ar.functionE9)
                if (player.poly.area.gte(140)) timesBought = timesBought.mul(player.poly.areaEffect2)
                timesBought = timesBought.mul(player.poly.trianglesEffect1)

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasChallenge("ar", 21)) totalCost = totalCost.div(player.ar.functionE9)
                if (player.poly.area.gte(140)) totalCost = totalCost.div(player.poly.areaEffect2)
                totalCost = totalCost.div(player.poly.trianglesEffect1)

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
                let init = new Decimal("250")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (player.poly.area.gte(140)) final = final.div(player.poly.areaEffect2)
                final = final.div(player.poly.trianglesEffect1)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Polygon Proliferation",
            display() {
                let added = ""
                if (hasMilestone("poly", 10)) added = "+" + format(player.poly.areaEffect1)
                return "Multiplies Shapes gain by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 5) || hasUpgrade("pf", 103)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(1.5)
                return base
            },
            effect(x) {
                if (getClickableState("div", 1001)) return new Decimal(1)
                if (inChallenge("poly", 11)) return new Decimal(1)
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                amt = amt.add(player.poly.areaEffect1)

                let effect = base.pow(amt)

                if (player.d.points.gte(4)) effect = effect.pow(1.01)
                
                let softcap = new Decimal(0.1)
                let softcapStart = new Decimal("1e200")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (player.poly.area.gte(140)) timesBought = timesBought.mul(player.poly.areaEffect2)
                timesBought = timesBought.mul(player.poly.trianglesEffect1)

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (player.poly.area.gte(140)) totalCost = totalCost.div(player.poly.areaEffect2)
                totalCost = totalCost.div(player.poly.trianglesEffect1)

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
        },
        21: {
            base() {return new Decimal("1e1700")},
            exponentialBase() {
                let init = new Decimal("1e25")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Doing It Later",
            display() {
                let added = ""
                return "Delays the start of the Number Core softcap by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal("1e10")
                return base
            },
            effect(x) {
                if (getClickableState("div", 1001)) return new Decimal(1)
                if (inChallenge("poly", 11)) return new Decimal(1)
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.1)
                let softcapStart = new Decimal("1e10000")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return player.poly.challenges[11] >= 8},
            buyMax() {
                let timesBought = player[this.layer].points
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

    update(diff){
        //automation
        let automationBoolean = false

        if (hasMilestone("div", 5)) automationBoolean = true
        if (hasUpgrade("pf", 103)) automationBoolean = true

        if (automationBoolean){
            let layer = "nc"
            let list = [11, 12, 13]
            for (const id of list){
                if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                    tmp[layer].buyables[id].buy()
                }
            }
        }

        //softcap
        let mult = new Decimal("1e750")
        if (hasUpgrade("ar", 31)) mult = mult.mul("1e250")
        mult = mult.mul(buyableEffect("nc", 21))
        player.nc.softcap1Start = mult
    
        mult = new Decimal("0.25")
        player.nc.softcap1 = mult
    },

    glowColor() {
        let layer = "nc"
        for (const id of [11, 12, 13, 21]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return "cyan"
            }
        }

        return ""
    },
    shouldNotify() {
        let layer = "nc"
        for (const id of [11, 12, 13, 21]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return true
            }
        }
        return false
    },
    branches: [["cb", 3]],

    tooltip() {return format(player.nc.points) + " Number Cores (+" + format(getResetGain("nc")) + "/s)"},
    tooltip() {
        let text = format(player.nc.points) + " Number Cores (+" + format(getResetGain("nc")) + "/s)"
        if (player.nc.points.gte(player.nc.softcap1Start)) text += `<br>[FIRST SOFTCAP - ${format(player.nc.softcap1Start)} - ^${format(player.nc.softcap1)}]`
        return text
    },
})