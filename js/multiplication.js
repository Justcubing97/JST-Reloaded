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
            
        layer = "poly"
        if (hasUpgrade(layer, 22)) mult = mult.mul(upgradeEffect(layer, 22))
        //exp 
        layer = "poly"
        mult = mult.pow(player.poly.pentagonsEffect1)
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

        if (resettingLayer == "poly" || resettingLayer == "pf"){
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
                ["display-text", function(){return `You have ${format(player.mul.products)}/${format(player.mul.productsTotal)} Products (no short form).`}],
                ["display-text", function(){return `You will gain more Multiplication at ${format(getNextAt(this.layer))} Operation Power.`}],
                "blank",
                ["display-text", "Products are based on your Multiplication. Each upgrade requires the ones above it."],
                ["display-text", "For an easy respec, Arithmetic reset."],
                "blank",
                "h-line",
                "blank",
                ["upgrade-tree", 
                    [
                        [11],
                        [21, 22],
                        [31, 32],
                        [41],
                        [51, 52, 53],
                        [61, 62],
                        [71],
                        [81, 82],
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
            title: "The Multiplication Tree (TMT)",
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
            title: "Affect the Equality",
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
            title: "Affect the Inequality",
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
            description: "Unlock the next layer. <i>Will not consume Products.</i>",
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
                return [[51, color], [52, color], [53, color]]
            },
        },
        
        51: {
            title: "Addition Amplifier",
            effect() {
                let base = player.add.points.add(1)

                base = base.pow(0.05)

                if (hasUpgrade("poly", 113)) base = base.pow(3)
                if (hasUpgrade("mul", 62)) base = base.pow(1.5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e50")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Addition type cap"
                return text
            },
            description: "Addition multiplies its type cap.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("1700"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 41)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasMilestone("poly", 4)},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [61, color]
            },
        },
        52: {
            title: "Subtraction Summation",
            effect() {
                let base = player.sub.points.add(1)

                base = base.pow(0.15)

                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1000")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                
                if (hasUpgrade("mul", 62)) base = base.pow(1.05)

                return base
            },
            effectDisplay() {
                let text =  "+" + format(upgradeEffect(this.layer, this.id)) + " to Negativity base"
                return text
            },
            description: "Subtraction adds to Negativity base.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("1700"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 41)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasMilestone("poly", 4)},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[61, color], [62, color]]
            },
        },
        53: {
            title: "Multiplication Manipulation",
            effect() {
                let base = player.mul.points.add(1)

                base = base.pow(0.1)
                
                if (hasUpgrade("mul", 62)) base = base.pow(1.101)

                let softcap = new Decimal(0.1)
                let softcapStart = new Decimal("100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "x" + format(upgradeEffect(this.layer, this.id)) + " to Product cap"
                return text
            },
            description: "Multiplication boosts the Product cap.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("1700"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 41)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasMilestone("poly", 4)},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[62, color]]
            },
        },
        
        61: {
            title: "Spherical Geometry",
            description: "Length and Width are raised to ^1.1 before being multiplied.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("125000"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 51)) return false
                if (!hasUpgrade(this.layer, 52)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasMilestone("poly", 11)},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[71, color]]
            },
        },
        62: {
            title: "Distributive Distributive Property",
            description: "Improve the effects of the above three upgrades.",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("125000"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 53)) return false
                if (!hasUpgrade(this.layer, 52)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasMilestone("poly", 11)},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[71, color]]
            },
        },

        71: {
            title: "Complex Variables",
            description: "x1e15 EP, FV, PV, and all Ineqs. ^1.05 Points and Functions after softcap. x10,000 Edges and x1e100 Vertex cap. <i>This upgrade only requires one of the above upgrades.</i>",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("100000"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 61) && !hasUpgrade(this.layer, 62)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasMilestone("poly", 12)},
            branches() {
                let color = 3
                if (hasUpgrade(this.layer, this.id)) color = 1
                return [[81, color]]
            },
        },

        81: {
            title: "Unstable Change of Base",
            effect() {
                let base = player.mul.products.add(1)

                base = base.log(100).div(20)

                let softcap = new Decimal(0.33)
                let softcapStart = new Decimal("100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text =  "+" + format(upgradeEffect(this.layer, this.id)) + " to Vertex buyable base"
                return text
            },
            description: "Products add to the base of \"n-gon Expander\".",
            currencyDisplayName: "Products",
            currencyInternalName: "products",
            currencyLayer: "mul",
            cost: new Decimal("600000"),
            pay() {return new Decimal(0)},
            canAfford() {
                if (!hasUpgrade(this.layer, 71)) return false
                return player.mul.products.gte(this.cost)
            },
            unlocked() {return hasUpgrade("cb", 13)},
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
                return "Multiplies Addition and Subtraction by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() {
                if (hasMilestone("div", 10)) return player[this.layer].products.gte(this.cost())
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if (hasMilestone("poly", 1)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    if (hasMilestone("div", 10)) player[this.layer].products = player[this.layer].products.sub(this.cost())
                    else player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(5)
                if (hasUpgrade("cb", 12)) base = base.add(245)
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
                if (hasMilestone("div", 10)) timesBought = player[this.layer].products
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
        let mult = new Decimal(0)
        if (player.mul.points.gte(1)) mult = player.mul.points.pow(2)
        //products boost

        if (hasUpgrade("sub", 16)) mult = mult.mul(1.5)
        if (hasUpgrade("mul", 53)) mult = mult.mul(upgradeEffect("mul", 53))
        if (player.poly.area.gte(782)) mult = mult.mul(player.poly.areaEffect3)
        if (hasMilestone("poly", 12)) mult = mult.mul(1.1)

        if (hasMilestone("poly", 2)) mult = mult.pow(1.01)

        player.mul.productsTotal = mult

        let difference = new Decimal(0)

        if (hasUpgrade(this.layer, 11)) difference = difference.add(1)

        if (hasUpgrade(this.layer, 21)) difference = difference.add(10)
        if (hasUpgrade(this.layer, 22)) difference = difference.add(10)

        if (hasUpgrade(this.layer, 31)) difference = difference.add(25)
        if (hasUpgrade(this.layer, 32)) difference = difference.add(25)
            
        if (hasUpgrade(this.layer, 51)) difference = difference.add(1700)
        if (hasUpgrade(this.layer, 52)) difference = difference.add(1700)
        if (hasUpgrade(this.layer, 53)) difference = difference.add(1700)

        if (hasUpgrade(this.layer, 61)) difference = difference.add(125000)
        if (hasUpgrade(this.layer, 62)) difference = difference.add(125000)
            
        if (hasUpgrade(this.layer, 71)) difference = difference.add(100000)
            
        if (hasUpgrade(this.layer, 81)) difference = difference.add(600000)

        player.mul.products = player.mul.productsTotal.sub(difference)

        //automation
        let automationBooleanBuyable = false

        if (hasMilestone("poly", 1)) automationBooleanBuyable = true

        if (automationBooleanBuyable){
            let layer = "mul"
            let list = [11]
            for (const id of list){
                if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                    tmp[layer].buyables[id].buy()
                }
            }
        }

        //automation
        let automationBooleanUpgrade = false

        if (hasMilestone("poly", 4)) automationBooleanUpgrade = true

        if (automationBooleanUpgrade){
            let list = [11, 21, 22, 31, 32, 41]
            if (hasMilestone("poly", 6)) list.push(51, 52, 53)
            if (hasMilestone("poly", 13)) list.push(61, 62, 71)
            if (hasUpgrade("div", 22)) list.push(81)
            for (const id of list){
                if (!hasUpgrade("mul", id) && canAffordUpgrade("mul", id) && tmp.mul.upgrades[id].unlocked) buyUpgrade("mul", id)
            }
        }
    },

    glowColor() {
        let layer = "mul"
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
        let layer = "mul"
        for (const id of [11]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return true
            }
        }
        return false
    },

    tooltip() {
        if (!canReset("mul")) return format(player.mul.points) + " Multiplication (next at " + format(getNextAt("mul")) + " Operation Power)"
        return format(player.mul.points) + " Multiplication (+" + format(getResetGain("mul")) + " Multiplication)"
    },
})