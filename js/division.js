addLayer("div", {
    name: "div", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "÷", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        timeInLD: new Decimal(0),
        gain: new Decimal(0),
        nextAt: new Decimal(0),

        timeToNextBase: new Decimal(60),
        timeMultiplier: new Decimal(5),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e100"), //defaults for normal layers
    }},
    color: "rgb(255,153,255)",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( rgb(102,51,204), rgb(255,153,255))";
		return style;
	},
    resource: "Division", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        if (hasUpgrade("poly", 27)) player.div.unlocked = true
        return player.div.unlocked
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        let isInLD = getClickableState("div", 1001)
        let keptTTNB = player.div.timeToNextBase

        let keptDIV11State = getClickableState("div", 11)
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["points", "upgrades", "milestones", "buyables"];

        if (resettingLayer == "pf"){
            keep = []
        }

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        setClickableState("div", 1001, isInLD)
        player.div.timeToNextBase = keptTTNB
        setClickableState("div", 11, keptDIV11State)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.div.points)}</h2> Division (Div)`}],
                "blank",
                "h-line",
                "blank",
                ["display-text", function(){return `Division works completely differently from the other three arithmetic operations.`}],
                ["display-text", function(){return `As promised, the Division gimmick will be reworked.`}],
                ["display-text", function(){return `Long Division will now be based on time instead of Numbers.`}],
                ["display-text", function(){return `You must have the 14th Polygon upgrade to enter Long Division.`}],
                ["display-text", function(){return `You will gain 1 Division in ${formatTime(player.div.timeToNextBase)} (Division time).`}],
                "blank",
                ["display-text", function(){return `Division will be gained inside Long Division based on time inside Long Division.`}],
                ["display-text", function(){return `Long Division will cause a Polygon reset. Inside Long Division...`}],
                ["display-text", function(){return `Primitive/Number Core buyables do not work.`}],
                ["display-text", function(){return `Addition types do not work.`}],
                ["display-text", function(){return `Function effects do not work.`}],
                "blank",
                "h-line",
                "blank",
                ["clickable", 1001],
                "blank",
                "upgrades",
            ],
        },
        "Milestones": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.div.points)}</h2> Division (Div)`}],
                "blank",
                ["clickable", [11]],
                "blank",
                "milestones",
            ],
        },
        "Buyable": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.div.points)}</h2> Division (Div)`}],
                "blank",
                "buyables",
            ],
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
            },
        },
        1001: {
            title: "<h2>Enter Long Division</h2>",
            display() {
                let extra = `You are not in Long Division. Enter Long Division to start gaining Division.`
                if (getClickableState(this.layer, this.id)) extra = `You are in Long Division. You have spent ${formatTime(player.div.timeInLD)} in Long Division, granting you ${formatWhole(player.div.gain)} Division once you exit.<br><br>You will gain your next Division after ${formatTime(player.div.nextAt)} of being in Long Division.`
                return `<span style="font-size: 16px"><i>\"Long Division. An operation, when done by hand, becomes one of the longest arithmetic operations in mathematics.\"</i><br><br>${extra}</span>`
            },
            canClick() {return hasUpgrade("poly", 27)},
            onClick() {
                if (player.div.gain.neq(0)) player.div.points = player.div.points.add(player.div.gain)
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
                doReset("poly", true)
            },
            style() {
                if (getClickableState(this.layer, this.id) && player.div.gain.gte(player.div.points.div(100)))return {
                    "background-color": "rgb(153,102,255)",
                    "width": "525px",
                    "height": "275px",
                }
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(102,51,204)",
                    "width": "500px",
                    "height": "250px",
                }
                return {
                    "background-color": "rgb(255,153,255)",
                    "width": "500px",
                    "height": "250px",
                }
            }
        },
    },

    upgrades: {
        11: {
            title: "5 MINUTE TIMEWALL???",
            description: "I am SO sorry for that. x100 NC, Shapes, and Vertex cap. Gain Division x4 faster.",
            cost: new Decimal("5"),
        },
        12: {
            title: "Does Division Do Something?",
            effect() {
                let base = player.div.points.add(1)
                
                base = base.pow(1.5).mul(base.add(1).log(2)).mul(5).add(1)

                if (hasMilestone("div", 5)) base = base.mul(base.log("1e10").add(1))
                if (hasUpgrade("div", 24)) base = base.mul(base.pow(0.1)).pow(1.5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Edges"
                return text
            },
            description: "Division boosts Edges. ÷10 to Division time.",
            cost: new Decimal("20"),
        },
        13: {
            title: "Triaconta",
            description: "Division time scaling is reduced by -2.",
            cost: new Decimal("45"),
        },
        14: {
            title: "Square Root Rebel",
            description: "^1.1 Shapes and Number Cores.",
            cost: new Decimal("700"),
        },
        15: {
            title: "2 1 1",
            effect() {
                let base = player.mul.points.add(1)
                
                base = base.mul(base.log("1e10").add(1)).pow(5)

                if (hasMilestone("div", 6)) base = base.mul(base.log(1.05).add(1)).mul(base.pow(0.1))

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "÷" + format(upgradeEffect(this.layer, this.id)) + " to Division time"
                return text
            },
            description: "Multiplication divides Division time.",
            cost: new Decimal("2048"),
        },
        16: {
            title: "Expand Your Worldview",
            description: "Unlock a 4th row of NNL restrictions.",
            cost: new Decimal("10000"),
        },
        17: {
            title: "Quotient Rule",
            effect() {
                let base = player.div.points.add(1)
                
                base = base.pow(base.log(10)).add(1)
                
                if (hasMilestone("div", 6)) base = base.pow(1.5)

                let softcap1 = new Decimal(0.25)
                let softcap1Start = new Decimal("1e200")

                if (base.gte(softcap1Start)) base = base.pow(softcap1).mul(new Decimal(softcap1Start).pow(decimalOne.sub(softcap1))) //softcap

                return Decimal.min(base, new Decimal("1e2000"))
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Functions"
                return text
            },
            description: "Division multiplies Functions after softcap.",
            cost: new Decimal("5e4"),
        },

        21: {
            title: "Power of Sixteen",
            description: "The softcap start of \"Inversion\" is raised to the power of ^16.",
            cost: new Decimal("1e16"),
            unlocked() {return hasUpgrade("cb", 15)},
        },
        22: {
            title: "Tiny QoL",
            description: "Automate the 8th row of TMT.",
            cost: new Decimal("5e16"),
            tooltip() {
                if (hasUpgrade(this.layer, this.id)) return "Well... also -0.0001 to Division time scaling."
                return
            },
            unlocked() {return hasUpgrade("cb", 15)},
        },
        23: {
            title: "LET'S GRIND",
            effect() {
                let base = player.div.points.add(1)
                
                base = base.mul(base.log(10)).add(1)
                base = base.pow(0.1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e10")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Division"
                return text
            },
            description: "Division boosts itself.",
            cost: new Decimal("1e18"),
            unlocked() {return hasUpgrade("cb", 15)},
        },
        24: {
            title: "Division Does Do Something!",
            description: "Improve \"Does Division Do Something?\". Bonus multiplier if you get the U.U.F.O. reference.",
            cost: new Decimal("5e21"),
            unlocked() {return hasUpgrade("cb", 15)},
        },
        25: {
            title: "Trixponent",
            description: "^1.25 Division, ^1.1 Edges, and ^1.05 Number Cores.",
            cost: new Decimal("1e23"),
            unlocked() {return hasUpgrade("cb", 15)},
        },
        26: {
            title: "Dividing Points",
            effect() {
                let base = player.points.add(1)
                
                base = base.log(10).add(1)

                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1e10")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Division"
                return text
            },
            description: "Points boost Division.",
            cost: new Decimal("1e30"),
            unlocked() {return hasUpgrade("cb", 15)},
        },
        27: {
            title: "Polynomial Division",
            description: "Unlock Arithmetic Challenge 5.",
            cost: new Decimal("1e50"),
            unlocked() {return hasUpgrade("cb", 15)},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("10")},
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
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Timewall Bypass",
            display() {
                return "Divides time to gain Division by ÷" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: ÷" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 10)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    if (!hasMilestone("div", 8)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(3)
                if (hasMilestone("div", 5)) base = base.add(3)
                if (hasUpgrade("cb", 12)) base = base.add(14)
                if (hasMilestone("div", 8)) base = base.add(5)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("100000")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
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

    milestones: {
        1: {
            requirementDescription: "1: 250 Division",
            effect(){
                let base = player.div.points.add(1)

                base = base.pow(0.01)

                let softcap = new Decimal(0.1)
                let softcapStart = new Decimal(5)

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDescription() { return "Decrease the Division time scaling by -1. Division raises the Addition type cap. Currently: ^" + format(milestoneEffect(this.layer, this.id)) + " to Addition type cap" },
            done() { return player.div.points.gte("250") },
        },
        2: {
            requirementDescription: "2: 1,500 Division",
            effectDescription: "Are we forgetting basic arithmetic? x1e10 FV and PV, x1,000,000 EP and all Ineqs. ^1.05 Functions after softcap.",
            done() { return player.div.points.gte("1.5e3") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        3: {
            requirementDescription: "3: 3,333 Division",
            effectDescription: "You would think you unlock the Constructor here. But good luck getting that... you're only halfway through the Polygons. -0.75 to Division time scaling and unlock another row of Negativity upgrades.",
            done() { return player.div.points.gte("3333") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        4: {
            requirementDescription: "4: 666,666 Division",
            effectDescription: "x1e15 Vertex cap. That's all you get here.",
            done() { return player.div.points.gte("666666") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        5: {
            requirementDescription: "5: 2,500,000 Division",
            effectDescription: "Automatically bulk-buy the Vertex buyables and NC buyables 1-3. +3 to the base of \"Timewall Bypass\" and it divides the cost of Length and Width. Improve \"Does Division Do Something?\".",
            done() { return player.div.points.gte("2.5e6") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        6: {
            requirementDescription: "6: 11,111,111 Division",
            effectDescription: "Improve \"2 1 1\" and \"Quotient Rule\". -0.005 to Division time scaling.",
            done() { return player.div.points.gte("11111111") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        7: {
            requirementDescription: "7: 1e11 Division",
            effectDescription: "Improve \"Recursion\" SIGNIFICANTLY (in Fundamental layer). -0.001 to Division time scaling and ÷1,000,000 to Division time. Unlock another row of Edge upgrades.",
            done() { return player.div.points.gte("1e11") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        8: {
            requirementDescription: "8: 1e14 Division",
            effectDescription: "x1e50 to the Vertex cap. Also, ^0.75 to all CS construction times if the chosen time is above 1s. The Division buyable no longer subtracts cost, and +5 to its base.",
            done() { return player.div.points.gte("1e14") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        9: {
            requirementDescription: "9: 1e21 Division",
            effectDescription: "I think you're worthy. Unlock Constructor Sacrifice.",
            done() { return player.div.points.gte("1e21") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        10: {
            requirementDescription: "10: 1e28 Division",
            effectDescription: "\"Distributive Property\" uses Products instead of Multiplication. Automatically bulk-buy the Division buyable.",
            done() { return player.div.points.gte("1e28") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        11: {
            requirementDescription: "11: 1e42 Division",
            effectDescription: "^1.01 Points. -0.00005 to Division time scaling.",
            done() { return player.div.points.gte("1e42") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        12: {
            requirementDescription: "12: 1e55 Division",
            effectDescription: "FIVE FIVE! x55 CS and improve Triangles' effect.",
            done() { return player.div.points.gte("1e55") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        13: {
            requirementDescription: "13: 1e60 Division",
            effectDescription: "The base effect to Funda, Nums, and OP from Constructor Sacrifice is now ^1.015.",
            done() { return player.div.points.gte("1e60") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        14: {
            requirementDescription: "14: 1e70 Division",
            effectDescription: "Unlock a meta-effect of Functions.",
            done() { return player.div.points.gte("1e70") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
    },

    update(diff){
        //calculate time to next
        let mult = new Decimal(60)

        //division time
        mult = mult.div(buyableEffect("div", 11))
        if (hasUpgrade("div", 11)) mult = mult.div(4)
        if (hasUpgrade("div", 12)) mult = mult.div(10)
        if (hasMilestone("poly", 5)) mult = mult.div(milestoneEffect("poly", 4))
        if (hasUpgrade("poly", 112)) mult = mult.div(500)
        if (hasUpgrade("div", 15)) mult = mult.div(upgradeEffect("div", 15))
        if (player.poly.area.gte(140)) mult = mult.div(player.poly.areaEffect2)
        if (hasMilestone("div", 7)) mult = mult.div("1e6")

        player.div.timeToNextBase = mult
        
        mult = new Decimal(5)
        
        //division time scaling
        if (hasUpgrade("div", 13)) mult = mult.sub(2) //gives 3
        if (hasMilestone("div", 1)) mult = mult.sub(1) //gives 2
        if (hasMilestone("div", 3)) mult = mult.sub(0.75) //gives 1.25
        if (hasMilestone("poly", 8)) mult = mult.sub(0.2) //gives 1.05
        if (hasMilestone("poly", 9)) mult = mult.sub(0.04) //gives 1.01
        if (hasMilestone("div", 6)) mult = mult.sub(0.005) //gives 1.005
        if (hasMilestone("poly", 13)) mult = mult.sub(0.002) //gives 1.003
        if (hasMilestone("div", 7)) mult = mult.sub(0.001) //gives 1.002
        if (hasMilestone("ar", 17)) mult = mult.sub(0.0008) //gives 1.0012
        if (player.d.points.gte(4)) mult = mult.sub(0.001) //gives 1.0002
        if (hasUpgrade("div", 22)) mult = mult.sub(0.0001) //gives 1.0001
        if (hasMilestone("div", 11)) mult = mult.sub(0.00005) //gives 1.00005
        if (hasUpgrade("cb", 16)) mult = mult.sub(0.00001) //gives 1.00004

        player.div.timeMultiplier = mult

        if (getClickableState(this.layer, 1001)){
            let mult = new Decimal(1)
            //time dilation
            if (hasUpgrade("poly", 217)) mult = mult.mul(3)
            if (hasChallenge("ar", 22)) mult = mult.mul(4)
            if (hasUpgrade("cb", 16)) mult = mult.mul(25)

            player.div.timeInLD = player.div.timeInLD.add(mult.mul(diff))

            if (player.div.timeInLD.lt(player.div.timeToNextBase)) player.div.gain = new Decimal(0)
            else mult = Decimal.floor(player.div.timeInLD.div(player.div.timeToNextBase.div(player.div.timeMultiplier)).log(player.div.timeMultiplier));

            //put multi here - division boost
            let reduction = new Decimal(1)
            if (hasMilestone("poly", 8)) reduction = reduction.mul(1.05)
            if (hasUpgrade("poly", 116)) reduction = reduction.mul(upgradeEffect("poly", 116))
            if (player.poly.area.gte(782)) reduction = reduction.mul(player.poly.areaEffect3)
            if (hasUpgrade("cb", 11)) reduction = reduction.mul(player.cb.e1)
            if (hasMilestone("poly", 14)) reduction = reduction.mul(milestoneEffect("poly", 14))
            if (hasAchievement("a", 51)) reduction = reduction.mul(player.ar.arFunction.add(1).log(100).add(1))
            if (hasUpgrade("div", 23)) reduction = reduction.mul(upgradeEffect("div", 23))
            if (hasUpgrade("div", 26)) reduction = reduction.mul(upgradeEffect("div", 26))

            reduction = reduction.pow(player.poly.pentagonsEffect1)
            if (player.d.points.gte(4)) reduction = reduction.pow(1.05)
            if (hasUpgrade("div", 25)) reduction = reduction.pow(1.25)

            player.div.gain = mult.mul(reduction)

            let layer = "div"
            if (mult.gte(player[layer].softcap1Start)) mult = mult.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))

            player.div.nextAt = new Decimal(player.div.timeToNextBase).mul(player.div.timeMultiplier.pow(player.div.gain.div(reduction)))
        }

        let automationBoolean = false

        if (hasMilestone("div", 10)) automationBoolean = true

        if (automationBoolean){
            let layer = "div"
            let list = [11]
            for (const id of list){
                if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                    tmp[layer].buyables[id].buy()
                }
            }
        }
    },

    glowColor() {
        let layer = "div"
        for (id in tmp[layer].upgrades){
            if (isPlainObject(layers[layer].upgrades[id])){
                if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
                    return "red"
                }
            }
        }
        if (player.div.gain.gte(player.div.points.div(100)) && hasUpgrade("poly", 27)) return "rgb(255,153,255)"
        for (const id of [11]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return "cyan"
            }
        }

        return ""
    },
    shouldNotify() {
        let layer = "div"
        if (player.div.gain.gte(player.div.points.div(100)) && hasUpgrade("poly", 27)) return true
        for (const id of [11]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return true
            }
        }
        return false
    },

    tooltip() {
        if (getClickableState(this.layer, 1001)) return format(player.div.points) + " Division (+" + format(player.div.gain) + " Division on reset)"
        return format(player.div.points) + " Division (not in Long Division)"
    },
})