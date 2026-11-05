addLayer("pf", {
    name: "pf", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PFR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        //expedition
        tentativeTime: new Decimal(5),
        currentTime: new Decimal(0),
        onExpedition: false,

        stone: new Decimal(0),
        stoneGain: new Decimal(0),
        copper: new Decimal(0),
        copperGain: new Decimal(0),
        iron: new Decimal(0),
        ironGain: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(153,255,255)",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( rgb(51,153,255), rgb(153,255,255))";
		return style;
	},
    requires: new Decimal("1e650"), // Can be a function that takes requirement increases into account
    resource: "Planetary Fragments", // Name of prestige currency
    baseResource: "Shapes", // Name of resource prestige is based on
    baseAmount() {return player.poly.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0175, // Prestige currency exponent
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
        let layer = "pf"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "l", description: "L: Reset for Planetary Fragments", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (maxedChallenge("poly", 11)) player.pf.unlocked = true
        return player.pf.unlocked
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
                ["display-text", function(){return `You have <h2 style="color: rgb(153,255,255); text-shadow: 0px 0px 10px rgb(153,255,255)">${format(player.pf.points)}</h2> Planetary Fragments (PF)`}],
                "blank",
                ["infobox", "resetWarning"],
                "blank",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.poly.points)} Shapes.`}],
                "blank",
                ["upgrades", [1]],
            ],
        },
        "Expedition": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(153,255,255); text-shadow: 0px 0px 10px rgb(153,255,255)">${format(player.pf.points)}</h2> Planetary Fragments (PF)`}],
                "blank",
                ["infobox", "resetWarning"],
                "blank",
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.poly.points)} Shapes.`}],
                "blank",
                ["bar", "expeditionDistance"],
                "blank",
                ["clickables", [1]],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(153,153,153); text-shadow: 0px 0px 10px rgb(153,153,153)">${format(player.pf.stone)}</h2> Stone`}],
                ["display-text", function(){return `This Expedition will give you ${format(player.pf.stoneGain)} Stone`}],
                "blank",
                ["buyable", [11]],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(255, 153, 102); text-shadow: 0px 0px 10px rgb(255, 153, 102)">${format(player.pf.copper)}</h2> Copper`}],
                ["display-text", function(){return `This Expedition will give you ${format(player.pf.copperGain)} Copper`}],
                "blank",
                ["buyable", [12]],
                "blank",
                ["display-text", function(){if (hasUpgrade("pf", 13)) return `You have <h2 style="color: rgb(204, 204, 204); text-shadow: 0px 0px 10px rgb(204, 204, 204)">${format(player.pf.iron)}</h2> Iron`}],
                ["display-text", function(){if (hasUpgrade("pf", 13)) return `This Expedition will give you ${format(player.pf.ironGain)} Iron`}],
                "blank",
                ["buyable", [13]],
                "blank",
                "h-line",
                "blank",
                ["display-text", `Quality Upgrade Grid!`],
                "blank",
                ["upgrades", [10]],
                ["upgrades", [11]],
                ["upgrades", [12]],
            ],
            unlocked() {return hasUpgrade("pf", 11)}
        },
    },

    giveResourcesFromExpedition_PFR(){
        player.pf.onExpedition = !player.pf.onExpedition
        player.pf.stone = player.pf.stone.add(player.pf.stoneGain)
        player.pf.copper = player.pf.copper.add(player.pf.copperGain)
        if (hasUpgrade("pf", 13)) player.pf.iron = player.pf.iron.add(player.pf.ironGain)
    },

    findMultsForResourcesExpedition_PFR(){
        let mult
        mult = player.pf.tentativeTime.div(5).pow(player.pf.tentativeTime.add(1).log(100).pow(1))
        mult = mult.mul(buyableEffect("pf", 11)[0])
        player.pf.stoneGain = mult

        mult = player.pf.tentativeTime.div(5).pow(player.pf.tentativeTime.add(1).log(200).pow(0.9))
        mult = mult.mul(buyableEffect("pf", 12)[0])
        player.pf.copperGain = mult

        mult = player.pf.tentativeTime.div(5).pow(player.pf.tentativeTime.add(1).log(300).pow(0.8))
        mult = mult.mul(buyableEffect("pf", 13)[0])
        player.pf.ironGain = mult
    },

    upgrades: {
        11: {
            title: "Adventurous",
            description: "Unlock Expedition and multiply Points by x1e1000.",
            cost: new Decimal("1"),
        },
        12: {
            title: "Accelerate",
            description: "Keep Vertices, Edges, Area, and the Constructor unlocked. x100 Edges, Division, and CS. Construct CS x50 faster.",
            cost: new Decimal("2"),
            unlocked() {return hasUpgrade(this.layer, 11)},
        },
        13: {
            title: "Better Rocket Fuel",
            description: "Expeditions are x10 faster, and unlock Iron.",
            cost: new Decimal("4"),
            unlocked() {return hasUpgrade(this.layer, 11)},
        },

        //========================================
        
        101: {
            title: "Stone QoL 1",
            description: "Automate Fundamental upgrade rows 1-2.",
            cost() {
                let base = new Decimal("20")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 102)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 103)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 104)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Stone",
            currencyInternalName: "stone",
            currencyLayer: "pf",
        },
        102: {
            title: "Stone QoL 2",
            description: "Automate Fundamental upgrade rows 3-4.",
            cost() {
                let base = new Decimal("20")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 101)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 103)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 104)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Stone",
            currencyInternalName: "stone",
            currencyLayer: "pf",
        },
        103: {
            title: "Stone QoL 3",
            description: "Automate Number Core buyables 1-3.",
            cost() {
                let base = new Decimal("20")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 102)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 101)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 104)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Stone",
            currencyInternalName: "stone",
            currencyLayer: "pf",
        },
        104: {
            title: "Stone QoL 4",
            description: "Generate 100% of pending Funda and Nums.",
            cost() {
                let base = new Decimal("20")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 102)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 103)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 101)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Stone",
            currencyInternalName: "stone",
            currencyLayer: "pf",
        },
        111: {
            title: "Copper QoL 1",
            description: "Automate conversion to first five Addition types.",
            cost() {
                let base = new Decimal("30")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 112)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 113)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 114)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Copper",
            currencyInternalName: "copper",
            currencyLayer: "pf",
        },
        112: {
            title: "Copper QoL 2",
            description: "Automate first 8 rows of TMT.",
            cost() {
                let base = new Decimal("30")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 111)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 113)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 114)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Copper",
            currencyInternalName: "copper",
            currencyLayer: "pf",
        },
        113: {
            title: "Copper QoL 3",
            description: "Automate first 3 rows of Arithmetic upgrades and generate 100% of pending OP.",
            cost() {
                let base = new Decimal("30")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 112)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 111)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 114)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Copper",
            currencyInternalName: "copper",
            currencyLayer: "pf",
        },
        114: {
            title: "Copper QoL 4",
            description: "Keep Arithmetic challenges 1-3.",
            cost() {
                let base = new Decimal("30")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 112)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 113)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 111)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Copper",
            currencyInternalName: "copper",
            currencyLayer: "pf",
        },
        121: {
            title: "Iron QoL 1",
            description: "Automatically bulk-buy Core Boosters.",
            cost() {
                let base = new Decimal("40")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 122)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 123)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 124)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Iron",
            currencyInternalName: "iron",
            currencyLayer: "pf",
        },
        122: {
            title: "Iron QoL 2",
            description: "Automate Division upgrades and its buyable.",
            cost() {
                let base = new Decimal("40")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 121)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 123)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 124)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Iron",
            currencyInternalName: "iron",
            currencyLayer: "pf",
        },
        123: {
            title: "Iron QoL 3",
            description: "Automate Vertex upgrades and buyables.",
            cost() {
                let base = new Decimal("40")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 122)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 121)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 124)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Iron",
            currencyInternalName: "iron",
            currencyLayer: "pf",
        },
        124: {
            title: "Iron QoL 4",
            description: "Automate Polygon and Edge upgrades.",
            cost() {
                let base = new Decimal("40")
                let multi = new Decimal("1")
                if (hasUpgrade(this.layer, 122)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 123)) multi = multi.add(1)
                if (hasUpgrade(this.layer, 121)) multi = multi.add(1)
                
                return base.mul(multi)
            },
            currencyDisplayName: "Iron",
            currencyInternalName: "iron",
            currencyLayer: "pf",
        },
    },

    infoboxes: {
        resetWarning: {
            title: "Planetary Reset",
            body() { return "Welcome to the next reset layer. Before resetting, you should know that this reset layer will reset a LOT. " +
                "This will reset everything that Polygon reset does, along with all content included in the Polygon layer, such as Number Cores, " +
                "Core Boosters, Division, and everything unlocked. Additionally, you will be sent back to the 0th Dimension. " +
                "Not all hope is lost, however. You will unlock a mechanic called Expedition after the first Planetary upgrade, which itself will greatly improve your progress."
            },
        },
    },

    bars: {
        expeditionDistance: {
            direction: RIGHT,
            width: 600,
            height: 75,
            display() {
                let text = `You will travel ${format(player.pf.tentativeTime.pow(player.pf.tentativeTime.div(100)).log(2))} light-years on your next Expedition, which equates to ${formatTime(player.pf.tentativeTime)}.`
                if (player.pf.onExpedition) text = `You are currently on an Expedition. This Expedition will continue for ${formatTime(player.pf.currentTime)}.`
                return text
            },
            progress() {
                let prog = player.pf.tentativeTime.div(5).log(10).div(12).add(new Decimal(1).div(12))
                if (player.pf.onExpedition) prog = player.pf.currentTime.div(player.pf.tentativeTime)
                
                return prog
            },
            fillStyle() {
                let color = "rgb(153,255,255)"
                return {"background-color": color}
            },
            style() {
                return {
                    "color": "black",
                    "text-shadow": "0px 0px 5px black",
                } 
            },
            baseStyle() {
                return {"background-color": "rgb(51,153,153)",}
            },
        },
    },

    clickables: {
        12: {
            title() {
                if (player.pf.onExpedition) return "Cancel the Expedition"
                return "Start the Expedition"
            },
            canClick() {return true},
            onClick() {
                player.pf.onExpedition = !player.pf.onExpedition
                if (player.pf.onExpedition){
                    player.pf.currentTime = player.pf.tentativeTime
                }
            },
            style() {
                return {
                    "background-color": "rgb(153, 255, 255)",
                    "width": "120px",
                    "height": "120px",
                }
            },
        },
        11: {
            title() {
                return "<"
            },
            canClick() {return !player.pf.onExpedition},
            onClick() {
                player.pf.tentativeTime = Decimal.max(5, player.pf.tentativeTime.div(10))
            },
            style() {
                return {
                    "background-color": "rgb(153, 255, 255)",
                    "width": "120px",
                    "height": "120px",
                    "font-size": "40px",
                }
            },
        },
        13: {
            title() {
                return ">"
            },
            canClick() {return !player.pf.onExpedition},
            onClick() {
                player.pf.tentativeTime = Decimal.min("5e10", player.pf.tentativeTime.mul(10))
            },
            style() {
                return {
                    "background-color": "rgb(153, 255, 255)",
                    "width": "120px",
                    "height": "120px",
                    "font-size": "40px",
                }
            },
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("2")},
            exponentialBase() {
                let init = new Decimal("6")
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
            title: "Sculpture Creation",
            display() {
                let added = ""
                return "Multiplies Stone by x" + format(tmp[this.layer].buyables[this.id].effectBase[0]) + " and Points by x" + format(tmp[this.layer].buyables[this.id].effectBase[1]) + " each purchase." + "\n" + "Level: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()[0]) + " and x" + format(this.effect()[1])
            },
            canAfford() { return player[this.layer].stone.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].stone = player[this.layer].stone.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base1 = new Decimal(2)
                let base2 = new Decimal("1e10")
                return [base1, base2]
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase[0]

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let final1 = effect
                //===========================
                amt = x
                base = tmp[this.layer].buyables[this.id].effectBase[1]

                effect = base.pow(amt)
                
                softcap = new Decimal(0.75)
                softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let final2 = effect

                return [final1, final2]
            },
            buyMax() {
                let timesBought = player[this.layer].stone
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
            style() {
                return {
                    "width": "300px",
                    "height": "120px",
                }
            },
        },
        12: {
            base() {return new Decimal("2")},
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
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Lightning Rods",
            display() {
                let added = ""
                return "Multiplies Copper by x" + format(tmp[this.layer].buyables[this.id].effectBase[0]) + " and CS by x" + format(tmp[this.layer].buyables[this.id].effectBase[1]) + " each purchase." + "\n" + "Level: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()[0]) + " and x" + format(this.effect()[1])
            },
            canAfford() { return player[this.layer].copper.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].copper = player[this.layer].copper.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base1 = new Decimal(2)
                let base2 = new Decimal(35)
                return [base1, base2]
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase[0]

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let final1 = effect
                //===========================
                amt = x
                base = tmp[this.layer].buyables[this.id].effectBase[1]

                effect = base.pow(amt)
                
                softcap = new Decimal(0.75)
                softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let final2 = effect

                return [final1, final2]
            },
            buyMax() {
                let timesBought = player[this.layer].copper
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
            style() {
                return {
                    "width": "300px",
                    "height": "120px",
                }
            },
        },
        13: {
            base() {return new Decimal("2")},
            exponentialBase() {
                let init = new Decimal("13")
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
            title: "Stainless Steel",
            display() {
                let added = ""
                return "Multiplies Iron by x" + format(tmp[this.layer].buyables[this.id].effectBase[0]) + " and Ineqs. by x" + format(tmp[this.layer].buyables[this.id].effectBase[1]) + " each purchase." + "\n" + "Level: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect()[0]) + " and x" + format(this.effect()[1])
            },
            canAfford() { return player[this.layer].iron.gte(this.cost()) },
            buy() {
                if (false){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].iron = player[this.layer].iron.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base1 = new Decimal(2)
                let base2 = new Decimal(125)
                return [base1, base2]
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase[0]

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let final1 = effect
                //===========================
                amt = x
                base = tmp[this.layer].buyables[this.id].effectBase[1]

                effect = base.pow(amt)
                
                softcap = new Decimal(0.75)
                softcapStart = new Decimal("1e100")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                let final2 = effect

                return [final1, final2]
            },
            buyMax() {
                let timesBought = player[this.layer].iron
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
            style() {
                return {
                    "width": "300px",
                    "height": "120px",
                }
            },
            unlocked() {return hasUpgrade("pf", 13)},
        },
    },

    update(diff){
        let mult
        tmp.pf.findMultsForResourcesExpedition_PFR()
        if (player.pf.onExpedition){
            mult = new Decimal(1)
            if (hasUpgrade("pf", 13)) mult = mult.mul(10)

            player.pf.currentTime = player.pf.currentTime.sub(mult.mul(diff))
            if (player.pf.currentTime.lte(0)) tmp.pf.giveResourcesFromExpedition_PFR()
        }
    },

    tooltip() {return format(player.pf.points) + " Planetary Fragments (+" + format(getResetGain("pf")) + " Planetary Fragments on reset)"},
})

//expedition
//planetary challenges
//planetary generators
//planetary boosters
//booster challenges