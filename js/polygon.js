addLayer("poly", {
    name: "poly", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PLY", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        vertices: new Decimal(0),
        vertGain: new Decimal(0),
        vertCap: new Decimal(1),

        edges: new Decimal(0),
        edgeGain: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(51,51,255)",
    requires: new Decimal("1e180"), // Can be a function that takes requirement increases into account
    resource: "Shapes", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.ar.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.24, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "poly"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "o", description: "O: Reset for Shapes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("mul", 41)) player.poly.unlocked = true
        return player.poly.unlocked
    },
    passiveGeneration() {return false}, //use autoPrestige() if static!
    milestonePopups() {return getClickableState("poly", 1001)},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        let keptPOLY1001State = getClickableState("poly", 1001)
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        setClickableState("poly", 1001, keptPOLY1001State)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(51,51,255); text-shadow: 0px 0px 10px rgb(51,51,255)">${format(player.poly.points)}</h2> Shapes (no short form)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                ["upgrades", [1, 2]],
            ],
        },
        "Vertices/Edges": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(51,51,255); text-shadow: 0px 0px 10px rgb(51,51,255)">${format(player.poly.points)}</h2> Shapes (no short form)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(102,153,255); text-shadow: 0px 0px 10px rgb(102,153,255)">${format(player.poly.vertices)}/${format(player.poly.vertCap)}</h2> Vertices (no short form)`}],
                ["display-text", function(){return `You are gaining ${format(player.poly.vertGain)} Vertices per second.`}],
                "blank",
                ["buyables", [1]],
                "blank",
                ["upgrades", [10]],
                "blank",
                function(){if (hasUpgrade("poly", 21)) return "h-line"},
                "blank",
                ["display-text", function(){if (hasUpgrade("poly", 21)) return `You have <h2 style="color: rgb(102,51,255); text-shadow: 0px 0px 10px rgb(102,51,255)">${format(player.poly.edges)}</h2> Edges (no short form)`}],
                ["display-text", function(){if (hasUpgrade("poly", 21)) return `You are gaining ${format(player.poly.edgeGain)} Edges per second. Edge gain is determined by Vertices.`}],
                "blank",
                ["upgrades", [20]],
                "blank",
                ["clickable", [1001]],
                "blank",
                "milestones",
            ],
            unlocked() {return hasUpgrade("poly", 11)},
        },
    },
    upgrades: {
        //11-41 are for shapes.
        //101-121 are for vertices
        //201-221 are for area
        11: {
            title: "Vertex Form of a Quadratic",
            description: "Unlock Vertices.",
            cost: new Decimal("1"),
        },
        12: {
            title: "Short and Sweet",
            description: "x1e100 Points. Take that, NNL!",
            cost: new Decimal("4"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        13: {
            title: "24-Dimensional Non-Euclide-",
            description: "Automate the first 24 Fundamental upgrades. Bonus points if you get the reference.",
            cost: new Decimal("16"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        14: {
            title: "Dysfunctional Button",
            description: "Click the Inequality button every tick. x1,000,000 all Ineqs. and x1e10 Functions.",
            cost: new Decimal("40"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        15: {
            title: "Pentachiliagon",
            description: "x5000 Operation Power and Subtraction. Unlock the first row of Vertex upgrades.",
            cost: new Decimal("5000"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        16: {
            title: "Year-Long Shapification",
            description: "x365 all Ineqs. and Subtraction. x3.65 max Vertices.",
            cost: new Decimal("365250"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        17: {
            title: "Shift in Your Perspective",
            description: "The second effects of FV and PV multiply instead of divide. x1e10 EP.",
            cost: new Decimal("1e6"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        21: {
            title: "Line Segment",
            description: "Unlock Edges and x500 to the Vertex cap.",
            cost: new Decimal("100e6"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },
        22: {
            title: "Definition of a Polygon",
            effect() {
                let base = player.poly.vertices.add(1)
                
                base = base.pow(0.1).mul(player.poly.edges.add(1).pow(0.25)).log("1e10").add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e33")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Multiplication"
                return text
            },
            description: "Edges and Vertices boost Multiplication.",
            cost: new Decimal("1e10"),
            unlocked() { return hasUpgrade(this.layer, 11) },
        },

        101: {
            title: "Similar Triangles",
            description: "Every bought \"Point-Slope Form\" adds to \"n-gon Expander\".",
            cost: new Decimal("1"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15)},
        },
        102: {
            title: "Congruency Theorems",
            description: "x2.5 to the Vertex cap, and x10,000 to the base effect of \"Point-Slope Form\".",
            cost: new Decimal("100"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15)},
        },
        103: {
            title: "Similar Triangles II",
            description: "Every bought \"Time Dilation\" adds to \"Point-Slope Form\".",
            cost: new Decimal("15000"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15)},
        },
        104: {
            title: "Buyable Boosts",
            description: "+0.25 to the base of \"Fundamental Acceleration\" and \"Rapid Generation\", and +0.4 to \"Duplication Machine\".",
            cost: new Decimal("40000"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15)},
        },
        105: {
            title: "Cap Dilation",
            effect() {
                let base = getBuyableAmount(this.layer, 13).add(1)

                base = base.log(2).add(1).div(100)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("10000")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "+" + format(upgradeEffect(this.layer, this.id)) + " to base"
                return text
            },
            description: "Each bought \"Time Dilation\" adds to the base of \"n-gon Expander\".",
            cost: new Decimal("1e12"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15)},
        },
        
        201: {
            title: "Lines",
            effect() {
                let base = player.poly.edges.add(1)
                let logbase = new Decimal(10)

                if (hasUpgrade("poly", 202)) logbase = new Decimal(1.05)
                
                base = base.pow(0.25).add(1).log(logbase).add(1)

                let softcap = new Decimal(0.35)
                let softcapStart = new Decimal("1e10")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Vertex cap"
                return text
            },
            description: "Edges multiply the Vertex cap.",
            cost: new Decimal("100"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21)},
        },
        202: {
            title: "Rays",
            description: "\"Lines\" effect is improved. ^1.05 to Vertex cap.",
            cost: new Decimal("5000"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21)},
        },
    },

    buyables: {
        //11-13 are vertices,
        //101-103 are edges,
        //201-202 are length/width
        //301-302 are const straightedge/compass
        11: {
            base() {return new Decimal("3")},
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
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "n-gon Expander",
            display() {
                let added = ""
                if (hasUpgrade("poly", 101)) added = "+" + formatWhole(getBuyableAmount("poly", 12))
                return "Multiplies the Vertices cap by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].vertices.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].vertices = player[this.layer].vertices.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].vertices = player[this.layer].vertices.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(1.1)
                if (hasUpgrade("poly", 105)) base = base.add(upgradeEffect("poly", 105))
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                if (hasUpgrade("poly", 101)) amt = amt.add(getBuyableAmount("poly", 12))

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].vertices
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
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Point-Slope Form",
            display() {
                let added = ""
                if (hasUpgrade("poly", 103)) added = "+" + formatWhole(getBuyableAmount("poly", 13))
                return "Multiplies Points by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].vertices.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].vertices = player[this.layer].vertices.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].vertices = player[this.layer].vertices.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal("1e6")
                if (hasUpgrade("poly", 101)) base = base.mul("1e4")
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                if (hasUpgrade("poly", 103)) amt = amt.add(getBuyableAmount("poly", 13))

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e500")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].vertices
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
            base() {return new Decimal("8")},
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
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Time Dilation",
            display() {
                return "Multiplies Vertex gain by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].vertices.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    player[this.layer].vertices = player[this.layer].vertices.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].vertices = player[this.layer].vertices.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = player.poly.vertices.add(1).log(10).add(1)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e10")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].vertices
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

    clickables: {
        1001: {
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
            unlocked() {return hasUpgrade("poly", 21)},
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 1,000 Edges",
            effectDescription: "<i>THE GREAT AUTOMATION.</i> Generate 100% of pending Fundamentality, Numbers, and Operation Power per second. Automate the first 14 Arithmetic upgrades. Automate and bulk-buy the buyables for Addition, Subtraction, and Multiplication.",
            done() { return player.poly.edges.gte("1e3") },
            unlocked() {return hasUpgrade("poly", 21)},
        },
    },

    update(diff) {
        let mult = new Decimal(0)
        //vertices
        //cap
        mult = new Decimal(10)
        mult = mult.mul(player.poly.points.add(1).pow(0.25))

        mult = mult.mul(buyableEffect("poly", 11))
        if (hasUpgrade("poly", 102)) mult = mult.mul(2.5)
        if (hasUpgrade("poly", 16)) mult = mult.mul(3.65)
        if (hasUpgrade("poly", 21)) mult = mult.mul(500)
        if (hasUpgrade("poly", 201)) mult = mult.mul(upgradeEffect("poly", 201))
        
        if (hasUpgrade("poly", 202)) mult = mult.pow(1.05)

        player.poly.vertCap = mult
        
        //gain
        mult = new Decimal(1)
        
        mult = mult.mul(buyableEffect("poly", 13))

        player.poly.vertGain = mult
        player.poly.vertices = Decimal.min(player.poly.vertices.add(player.poly.vertGain.times(diff)), player.poly.vertCap)

        //edges
        //gain
        mult = new Decimal(1)

        mult = mult.mul(player.poly.vertices.add(1).pow(0.05))

        player.poly.edgeGain = mult
        if (hasUpgrade("poly", 21)) player.poly.edges = player.poly.edges.add(player.poly.edgeGain.times(diff))
    },

    tooltip() {return format(player.poly.points) + " Shapes (+" + format(getResetGain("poly")) + " Shapes on reset)"},
})