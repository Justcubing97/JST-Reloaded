addLayer("mul", {
    name: "mul", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "×", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        initiated: false,

        products: new Decimal(0),
        productsTotal: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(255,153,255)",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( rgb(102,51,204), rgb(255,153,255))";
		return style;
	},
    requires: new Decimal("1e165"), // Can be a function that takes requirement increases into account
    resource: "Multiplication", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.ar.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    directMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        layer = "sub"
        if (hasUpgrade(layer, 15)) mult = mult.mul(1.25)
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    prestigeButtonText() {return "Press this button to initiate the layer. (REQ: 1e165 OP)"},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        if (hasChallenge("ar", 13)) player.mul.unlocked = true
        return player.mul.unlocked
    },
    resetsNothing() {return true},
    autoPrestige() {if (player.mul.initiated) return 1}, //use autoPrestige() if static!
    canBuyMax() {return true},
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["buyables"];
        
        let isInit = player.mul.initiated

        if (resettingLayer == "poly"){
            keep = []
        }

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player.mul.initiated = isInit
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    onPrestige() {
        player.mul.initiated = true
    },
    resetsNothing() {return true},
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.mul.points)}</h2> Multiplication (Mul)`}],
                function() {if (!player.mul.initiated) return "prestige-button"},
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                "h-line",
                "blank",
                ["display-text", function(){return `You have ${format(player.mul.products)}/${format(player.mul.productsTotal)} Products (Prod).`}],
                ["display-text", function(){return `You will gain more Multiplication at ${format(getNextAt(this.layer))} Operation Power.`}],
                "blank",
                ["display-text", "Products are based on your Multiplication. Each upgrade requires the ones above it."],
                "blank",
                "h-line",
                "blank",
                ["upgrade-tree", 
                    [
                        [11],
                        [21, 22],
                        [31, 32],
                        [41],
                    ],
                ],
            ],
        },
        "Buyable": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.mul.points)}</h2> Multiplication (Mul)`}],
                function() {if (!player.mul.initiated) return "prestige-button"},
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                "buyables",
            ],
        },
    },

    upgrades: {
        11: {
            title: "TMT Introduction",
            description: "x100,000 Variables, EP, and all Ineqs. gain.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("1"),
            pay() {return new Decimal(0)},
            canAfford() {
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return true},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[21, color], [22, color]]
            },
        },
        
        21: {
            title: "PointX",
            effect() {
                let base = player.mul.productsTotal.add(1)
                let logbase = new Decimal(1.5)
                let expbase = new Decimal(10)

                base = base.pow(expbase).add(1).log(logbase).add(1).pow(5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e1000")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Points"
                return text
            },
            description: "Total products multiply Point gain.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("10"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 11)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return true},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[31, color]]
            },
        },
        
        22: {
            title: "FunctionX",
            effect() {
                let base = player.mul.productsTotal.add(1)
                let logbase = new Decimal(1.5)
                let expbase = new Decimal(10)

                base = base.pow(expbase).add(1).log(logbase).add(1).pow(3)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e1000")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Functions"
                return text
            },
            description: "Total products multiply Functions gain.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("10"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 11)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return true},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[32, color]]
            },
        },
        
        31: {
            title: "Equality",
            description: "Improve the 1st and 3rd effects of FV and PV.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("25"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 21)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return true},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[41, color]]
            },
        },
        32: {
            title: "Inequality",
            description: "Unlock effects of the individual inequalities.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("25"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 22)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return true},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[41, color]]
            },
        },
        
        41: {
            title: "A = bh/2",
            description: "Unlock the next layer.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("50"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 31)) return false
                if (!hasUpgrade(this.layer, 32)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return true},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return
            },
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("3")},
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
            title: "Distributive Property",
            display() {
                return "Multiplies Addition and Subtraction by " + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
            effectBase() {
                let base = new Decimal(5)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1e50")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id).pow(1.1)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id).pow(1.1)))

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
        let mult = new Decimal(0)
        if (player.mul.points.gte(1)) mult = player.mul.points.pow(2)

        if (hasUpgrade("sub", 16)) mult = mult.mul(1.5)

        player.mul.productsTotal = mult

        let difference = new Decimal(0)

        if (hasUpgrade(this.layer, 11)) difference = difference.add(1)

        if (hasUpgrade(this.layer, 21)) difference = difference.add(10)
        if (hasUpgrade(this.layer, 22)) difference = difference.add(10)

        if (hasUpgrade(this.layer, 31)) difference = difference.add(25)
        if (hasUpgrade(this.layer, 32)) difference = difference.add(25)

        player.mul.products = player.mul.productsTotal.sub(difference)
    },

    tooltip() {
        if (!canReset("mul")) return format(player.mul.points) + " Multiplication (Unable to reset)"
        return format(player.mul.points) + " Multiplication (+" + format(getResetGain("mul")) + " Multiplication on reset)"
    },
})