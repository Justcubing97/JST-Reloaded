addLayer("add", {
    name: "add", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        initiated: false,
        best: new Decimal(0),
        bestEffect: new Decimal(1),

        //1 is 10%, 2 is 50%, 3 is ALL
        splitSetting: 1,

        additionTypePoint: new Decimal(0),
        additionTypeFunda: new Decimal(0),
        additionTypePrim: new Decimal(0),
        additionTypeArith: new Decimal(0),
        
        additionTypeLimit: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(255,153,255)",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( rgb(102,51,204), rgb(255,153,255))";
		return style;
	},
    requires: new Decimal("1e70"), // Can be a function that takes requirement increases into account
    resource: "Addition", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.ar.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        layer = "ar"
        if (hasMilestone(layer, 8)) mult = mult.mul(player.ar.functionE6)
        if (hasMilestone(layer, 9)) mult = mult.mul(player.ar.effectFV3)
            
        layer = "sub"
        mult = mult.mul(buyableEffect(layer, 11))

        layer = "mul"
        mult = mult.mul(buyableEffect(layer, 11))

        layer = "d"
        if (player.d.points.gte(1)) mult = mult.mul(25)
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "add"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    prestigeButtonText() {return "Press this button to initiate the layer. (REQ: 1e70 OP)"},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        if (hasChallenge("ar", 12)) player.add.unlocked = true
        return player.add.unlocked
    },
    resetsNothing() {return true},
    passiveGeneration() {if (player.add.initiated) return 1}, //use autoPrestige() if static!
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []
        let isInit = player.add.initiated

        let keptTypeFunda = player.add.additionTypeFunda
        let keptTypePrim = player.add.additionTypePrim
        let keptTypePoint = player.add.additionTypePoint

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["best", "buyables"];

        if (resettingLayer == "poly"){
            keep = []
            keptTypeFunda = new Decimal(0)
            keptTypePrim = new Decimal(0)
            keptTypePoint =new Decimal(0)
        }

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player.add.initiated = isInit
        player.add.additionTypeFunda = keptTypeFunda.div(10)
        player.add.additionTypePrim = keptTypePrim.div(10)
        player.add.additionTypePoint = keptTypePoint.div(10)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    onPrestige() {player.add.initiated = true},
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.add.points)}</h2> Addition (Add)`}],
                function() {if (!player.add.initiated) return "prestige-button"},
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                "h-line",
                "blank",
                ["display-text", function(){return `You are gaining +${format(getResetGain(this.layer))} Addition per second.`}],
                ["display-text", function(){return `You will increase your gain at ${format(getNextAt(this.layer))} Operation Power.`}],
                ["display-text", function(){return `Your highest Addition is ${format(player.add.best)}, which multiplies the cap of Addition Types by ${format(player.add.bestEffect)}.`}],
                ["blank", "8px"],
                ["display-text", function(){return `1: Pick any conversion option.`}],
                ["display-text", function(){return `2: Find your currency of interest.`}],
                ["display-text", function(){return `3: Click \"Convert to [currency]\".`}],
                ["blank", "8px"],
                ["display-text", function(){return `On higher resets, your best Addition and 10% of each Addition Type are kept.`}],
                ["display-text", function(){return `The bars here are measured logarithmically.`}],
                "blank",
                "h-line",
                "blank",
                ["clickables", [1]],
                "blank",
                ["row", [["bar", "addFundaBar"], ["blank", "8px", "8px"], ["clickable", 21]]],
                "blank",
                ["row", [["bar", "addPrimBar"], ["blank", "8px", "8px"], ["clickable", 22]]],
                "blank",
                ["row", [["bar", "addPointBar"], ["blank", "8px", "8px"], ["clickable", 23]]],
            ],
        },
        "Buyable": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.add.points)}</h2> Addition (Add)`}],
                function() {if (!player.add.initiated) return "prestige-button"},
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                "buyables",
            ],
        },
    },

    convertTo_ADD(type){
        let takenAmount;
        switch(player.add.splitSetting){
            case 1: takenAmount = player.add.points.div(10); break;
            case 2: takenAmount = player.add.points.div(2); break;
            case 3: takenAmount = player.add.points; break;
        }

        player.add.points = player.add.points.sub(takenAmount)

        if (type == "f"){
            if (takenAmount.add(player.add.additionTypeFunda).gte(player.add.additionTypeLimit)) player.add.additionTypeFunda = player.add.additionTypeLimit
            else player.add.additionTypeFunda = player.add.additionTypeFunda.add(takenAmount)
        }
        
        if (type == "p"){
            if (takenAmount.add(player.add.additionTypePrim).gte(player.add.additionTypeLimit)) player.add.additionTypePrim = player.add.additionTypeLimit
            else player.add.additionTypePrim = player.add.additionTypePrim.add(takenAmount)
        }
        
        if (type == "poi"){
            if (takenAmount.add(player.add.additionTypePoint).gte(player.add.additionTypeLimit)) player.add.additionTypePoint = player.add.additionTypeLimit
            else player.add.additionTypePoint = player.add.additionTypePoint.add(takenAmount)
        }
    },
    
    clickables: {
        11: {
            title: "Convert 10%",
            canClick() {return true},
            onClick() {
                player.add.splitSetting = 1
            },
            style() {
                let color = "rgb(255,153,255)"
                if (player.add.splitSetting == 1) color = "rgb(102,51,204)"
                return {
                    "background": color,
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        12: {
            title: "Convert 50%",
            canClick() {return true},
            onClick() {
                player.add.splitSetting = 2
            },
            style() {
                let color = "rgb(255,153,255)"
                if (player.add.splitSetting == 2) color = "rgb(102,51,204)"
                return {
                    "background": color,
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        13: {
            title: "Convert all",
            canClick() {return true},
            onClick() {
                player.add.splitSetting = 3
            },
            style() {
                let color = "rgb(255,153,255)"
                if (player.add.splitSetting == 3) color = "rgb(102,51,204)"
                return {
                    "background": color,
                    "width": "80px",
                    "height": "80px",
                }
            }
        },

        21: {
            title: "Convert to Type-FND",
            canClick() {return true},
            onClick() {
                tmp.add.convertTo_ADD("f")
            },
            style() {
                return {
                    "background": "rgb(255,204,0)",
                    "width": "120px",
                    "height": "80px",
                }
            },
        },
        
        22: {
            title: "Convert to Type-PRM",
            canClick() {return true},
            onClick() {
                tmp.add.convertTo_ADD("p")
            },
            style() {
                return {
                    "background": "rgb(0,204,255)",
                    "width": "120px",
                    "height": "80px",
                }
            },
            unlocked() {return hasMilestone("ar", 8)},
        },
        
        23: {
            title: "Convert to Type-POINT",
            canClick() {return true},
            onClick() {
                tmp.add.convertTo_ADD("poi")
            },
            style() {
                return {
                    "background": "rgb(255,255,255)",
                    "width": "120px",
                    "height": "80px",
                }
            },
            unlocked() {return hasMilestone("ar", 12)},
        },
    },

    bars: {
        addFundaBar: {
            direction: RIGHT,
            width: 500,
            height: 75,
            display() {
                let text = `Type-FND Addition: ${format(player.add.additionTypeFunda)}/${format(player.add.additionTypeLimit)}.`
                return text
            },
            progress() {
                let prog = player.add.additionTypeFunda.add(1).log(10).div(player.add.additionTypeLimit.add(1).log(10))
                
                return prog
            },
            fillStyle() {
                if (player.add.additionTypeFunda.gte(player.add.additionTypeLimit)) return {"background-color": "rgb(255, 227, 128)",}
                return {"background-color": "rgb(255,204,0)",}
            },
            style() {
                return {
                    "color": "black",
                    "text-shadow": "0px 0px 5px rgb(0,0,0)",
                } 
            },
            baseStyle() {
                return {"background-color": "rgb(102,51,204)",}
            },
        },
        addPrimBar: {
            direction: RIGHT,
            width: 500,
            height: 75,
            display() {
                let text = `Type-PRM Addition: ${format(player.add.additionTypePrim)}/${format(player.add.additionTypeLimit)}.`
                return text
            },
            progress() {
                let prog = player.add.additionTypePrim.add(1).log(10).div(player.add.additionTypeLimit.add(1).log(10))
                
                return prog
            },
            fillStyle() {
                if (player.add.additionTypePrim.gte(player.add.additionTypeLimit)) return {"background-color": "rgb(128, 227, 255)",}
                return {"background-color": "rgb(0,204,255)",}
            },
            style() {
                return {
                    "color": "black",
                    "text-shadow": "0px 0px 5px rgb(0,0,0)",
                } 
            },
            baseStyle() {
                return {"background-color": "rgb(102,51,204)",}
            },
            unlocked() {return hasMilestone("ar", 8)},
        },
        addPointBar: {
            direction: RIGHT,
            width: 500,
            height: 75,
            display() {
                let text = `Type-POINT Addition: ${format(player.add.additionTypePoint)}/${format(player.add.additionTypeLimit)}.`
                return text
            },
            progress() {
                let prog = player.add.additionTypePoint.add(1).log(10).div(player.add.additionTypeLimit.add(1).log(10))
                
                return prog
            },
            fillStyle() {
                if (player.add.additionTypePoint.gte(player.add.additionTypeLimit)) return {"background-color": "rgb(255, 255, 255)",}
                return {"background-color": "rgb(204,204,204)",}
            },
            style() {
                return {
                    "color": "black",
                    "text-shadow": "0px 0px 5px rgb(0,0,0)",
                } 
            },
            baseStyle() {
                return {"background-color": "rgb(102,51,204)",}
            },
            unlocked() {return hasMilestone("ar", 12)},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("50")},
            exponentialBase() {
                let init = new Decimal("12")
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
            title: "Multi Boost",
            display() {
                return "Multiplies OP and all Ineqs. gain by " + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
                let base = new Decimal(1.1)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1e10")

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
        //best addition effect
        player.add.bestEffect = player.add.best.pow(0.05)

        //addition type limit
        let mult = new Decimal("10000")

        mult = mult.mul(player.add.bestEffect)
        if (hasMilestone("ar", 8)) mult = mult.mul(player.ar.functionE6)
        mult = mult.mul(buyableEffect("sub", 11))
        if (player.d.points.gte(3)) mult = mult.mul(5)

        player.add.additionTypeLimit = mult
    },

    tooltip() {return format(player.add.points) + " Addition (+" + format(getResetGain("add")) + " Addition/s)"},
})