addLayer("sub", {
    name: "sub", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "-", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        initiated: false,

        negativity: new Decimal(0),
        negativityGain: new Decimal(0),
        currentGain: new Decimal(0),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
    }},
    color: "rgb(255,153,255)",
	nodeStyle() {
		const style = {};
		style.background = "linear-gradient( rgb(102,51,204), rgb(255,153,255))";
		return style;
	},
    requires: new Decimal("1e140"), // Can be a function that takes requirement increases into account
    resource: "Subtraction", // Name of prestige currency
    baseResource: "Operation Power", // Name of resource prestige is based on
    baseAmount() {return player.ar.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        layer = "ar"
        if (hasMilestone(layer, 9)) mult = mult.mul(player.ar.effectFV3)
            
        layer = "mul"
        mult = mult.mul(buyableEffect(layer, 11))

        layer = "d"
        if (player.d.points.gte(3)) mult = mult.mul(25)
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    getResetGain() {
        let layer = "sub"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    prestigeButtonText() {return "Press this button to initiate the layer. (REQ: 1e140 OP)"},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        if (player.d.points.gte(2)) player.sub.unlocked = true
        return player.sub.unlocked
    },
    resetsNothing() {return true},
    passiveGeneration() {if (player.sub.initiated) return 1}, //use autoPrestige() if static!
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        let isInit = player.sub.initiated
        let isNNL = getClickableState("sub", 1001)
        let keptNegGain = player.sub.negativityGain
        let keptCurGain = player.sub.currentGain
        let keptNeg = player.sub.negativity
        let keptRestricts = [
            getClickableState("sub", 11),
            getClickableState("sub", 12),
            getClickableState("sub", 13),
            getClickableState("sub", 14),
            getClickableState("sub", 21),
            getClickableState("sub", 22),
            getClickableState("sub", 23),
            getClickableState("sub", 24),
            getClickableState("sub", 31),
            getClickableState("sub", 32),
            getClickableState("sub", 33),
            getClickableState("sub", 34),
        ]

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["buyables", "upgrades"];

        if (resettingLayer == "poly"){
            keep = []
            keptNegGain = new Decimal(0)
            keptCurGain = new Decimal(0)
            keptNeg = new Decimal(0)
            isNNL = false
        }

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player.sub.initiated = isInit

        setClickableState("sub", 11, keptRestricts[0])
        setClickableState("sub", 12, keptRestricts[1])
        setClickableState("sub", 13, keptRestricts[2])
        setClickableState("sub", 14, keptRestricts[3])

        setClickableState("sub", 21, keptRestricts[4])
        setClickableState("sub", 22, keptRestricts[5])
        setClickableState("sub", 23, keptRestricts[6])
        setClickableState("sub", 24, keptRestricts[7])

        setClickableState("sub", 31, keptRestricts[8])
        setClickableState("sub", 32, keptRestricts[9])
        setClickableState("sub", 33, keptRestricts[10])
        setClickableState("sub", 34, keptRestricts[11])

        setClickableState("sub", 1001, isNNL)

        player.sub.negativityGain = keptNegGain
        player.sub.negativity = keptNeg
        player.sub.currentGain = keptCurGain
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    onPrestige() {player.sub.initiated = true},
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.sub.points)}</h2> Subtraction (Sub)`}],
                function() {if (!player.sub.initiated) return "prestige-button"},
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                "h-line",
                "blank",
                ["display-text", function(){return `You are gaining +${format(getResetGain(this.layer))} Subtraction per second.`}],
                ["display-text", function(){return `You will increase your gain at ${format(getNextAt(this.layer))} Operation Power.`}],
                "blank",
                ["display-text", "1: Select an arrangement of restrictions below."],
                ["display-text", "1A: Each additional restriction will multiply Negativity gain by x2."],
                ["display-text", "1B: You will only gain the difference between your current Negativity and your new highest Negativity."],
                ["display-text", "2: Click the big pink/purple button to enter the Negative Number Line, or NNL."],
                ["display-text", "3: Have 1e800 Points to gain Negativity upon exiting the NNL."],
                "blank",
                "h-line",
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(204,153,204); text-shadow: 0px 0px 10px rgb(204,153,204)">${format(player.sub.negativity)}</h2> Negativity (Neg)`}],
                "blank",
                ["row", [["display-text", `Point<br>restrictions:`], ["blank", "4px", "4px"], ["clickable", 11], ["clickable", 12], ["clickable", 13], ["clickable", 14]]],
                ["row", [["display-text", `Fundamental<br>restrictions:`], ["blank", "4px", "4px"], ["clickable", 21], ["clickable", 22], ["clickable", 23], ["clickable", 24]]],
                ["row", [["display-text", `Primitive<br>restrictions:`], ["blank", "4px", "4px"], ["clickable", 31], ["clickable", 32], ["clickable", 33], ["clickable", 34]]],
                "blank",
                ["clickable", 1001],
                "blank",
                "upgrades",
            ],
        },
        "Buyable": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.sub.points)}</h2> Subtraction (Sub)`}],
                function() {if (!player.sub.initiated) return "prestige-button"},
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                "buyables",
            ],
        },
    },

    upgrades: {
        11: {
            title: "Negative Boost",
            description: "-(-25) to EP and all Ineqs. gain.",
            cost: new Decimal("3"),
            currencyDisplayName: "Negativity",
            currencyInternalName: "negativity",
            currencyLayer: "sub",
            unlocked() {return true},
        },
        12: {
            title: "Negative Multi",
            description: "x-(-50,000) to FV and PV.",
            cost: new Decimal("12"),
            currencyDisplayName: "Negativity",
            currencyInternalName: "negativity",
            currencyLayer: "sub",
            unlocked() {return true},
        },
        13: {
            title: "Negative Inequalities",
            description: "x-(-38) to all Ineqs.",
            cost: new Decimal("25"),
            currencyDisplayName: "Negativity",
            currencyInternalName: "negativity",
            currencyLayer: "sub",
            unlocked() {return true},
        },
        14: {
            title: "Love <333",
            description: "x1e40 Points. No negative consequences!",
            cost: new Decimal("32"),
            currencyDisplayName: "Negativity",
            currencyInternalName: "negativity",
            currencyLayer: "sub",
            unlocked() {return true},
        },
        15: {
            title: "TMT First",
            description: "x1.25 Mul.",
            cost: new Decimal("290"),
            currencyDisplayName: "Negativity",
            currencyInternalName: "negativity",
            currencyLayer: "sub",
            unlocked() {return true},
        },
        16: {
            title: "n - 1 = n",
            description: "x1.25 Products.",
            cost: new Decimal("400"),
            currencyDisplayName: "Negativity",
            currencyInternalName: "negativity",
            currencyLayer: "sub",
            unlocked() {return true},
        },
    },

    buyables: {
        11: {
            base() {return new Decimal("10")},
            exponentialBase() {
                let init = new Decimal("32")
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
            title: "Inversion",
            display() {
                return "Multiplies Addition and Addition Types cap gain by " + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
                let base = new Decimal(1.25)
                return base
            },
            effect(x) {
                let base = tmp[this.layer].buyables[this.id].effectBase
                let effect = base.pow(x)
                
                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal(100)

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

    clickables: {
        11: {
            title: "^0.75 Points",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255,255,255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        12: {
            title: "^0.5 Points",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255,255,255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        13: {
            title: "^0.25 Points",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255,255,255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        14: {
            title: "^0.1 Points",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255,255,255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        
        21: {
            title: "^0.5 Funda",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255, 204, 0)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        22: {
            title: "^0.25 Funda",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255, 204, 0)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        23: {
            title: "Disable \"Progressing\" and \"Mutual Relationship\"",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255, 204, 0)",
                    "font-size": "8px",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "font-size": "8px",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        24: {
            title: "Disable row 1-3 upgrades",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(255, 204, 0)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        
        31: {
            title: "^0.5 Nums",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(0, 204, 255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        32: {
            title: "^0.25 Nums",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(0, 204, 255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        33: {
            title: "Buyable softcaps ^0.01",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(0, 204, 255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        34: {
            title: "Buyable cost scaling ^25",
            canClick() {return !getClickableState(this.layer, 1001)},
            onClick() {
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
            },
            style() {
                if (getClickableState(this.layer, this.id)) return {
                    "background-color": "rgb(0, 204, 255)",
                    "width": "120px",
                    "height": "120px",
                }
                return {
                    "background-color": "rgb(102,102,102)",
                    "width": "120px",
                    "height": "120px",
                }
            }
        },
        
        1001: {
            title: "<h2>Enter the Negative Number Line</h2>",
            display() {
                let extra = ""
                if (getClickableState(this.layer, this.id) && player.points.gte("1e800")) extra = `<br><br>You have at least 1e800 Points, therefore you will gain Negativity upon exiting the NNL.`
                return `<span style="font-size: 16px"><i>\"Nothing is negative down here. I don't hope that you won't have a negative time.\"</i><br><br>Restrictions apply inside the Negative Number Line if they are lit up.<br><br>You will gain +${format(player.sub.negativityGain)} (${format(player.sub.currentGain)}) Negativity upon completing this NNL.${extra}</span>`
            },
            canClick() {return true},
            onClick() {
                if (getClickableState(this.layer, this.id) && player.points.gte("1e800")) player.sub.negativity = player.sub.negativity.add(player.sub.negativityGain)
                setClickableState(this.layer, this.id, !getClickableState(this.layer, this.id))
                doReset("ar", true)
            },
            style() {
                if (getClickableState(this.layer, this.id) && player.points.gte("1e800")) return {
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

    update(diff){
        let restrictions = new Decimal(0)

        if (getClickableState("sub", 11)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 12)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 13)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 14)) restrictions = restrictions.add(1)

        if (getClickableState("sub", 21)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 22)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 23)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 24)) restrictions = restrictions.add(1)

        if (getClickableState("sub", 31)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 32)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 33)) restrictions = restrictions.add(1)
        if (getClickableState("sub", 34)) restrictions = restrictions.add(1)

        let mult = new Decimal(0)
        if (player.sub.points.gte(1)) mult = mult.add(player.sub.points.log(100))
        if (restrictions.gte(1)) mult = mult.mul(new Decimal(2).pow(restrictions))
        else mult = new Decimal(0)
        //add negativity boosts here

        if (hasMilestone("ar", 10)) mult = mult.mul(player.ar.functionE7)

        if (!getClickableState(this.layer, 1001)) player.sub.currentGain = mult
        mult = mult.sub(player.sub.negativity)

        if (!getClickableState(this.layer, 1001)) player.sub.negativityGain = Decimal.max(mult, 0)
    },

    tooltip() {return format(player.sub.points) + " Subtraction (+" + format(getResetGain("sub")) + " Subtraction/s)"},
})