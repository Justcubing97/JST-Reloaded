addLayer("ar", {
    name: "ar", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ARH", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        eqPoints: new Decimal(0),
        varGain: new Decimal(0),
        arithBar1Value: new Decimal(0.5),
        
        fundaVariables: new Decimal(0),
        primVariables: new Decimal(0),
        effectFV1: new Decimal(1),
        effectFV2: new Decimal(1),
        effectFV3: new Decimal(1),
        effectPV1: new Decimal(1),
        effectPV2: new Decimal(1),
        effectPV3: new Decimal(1),

        LT: new Decimal(0),
        LTE: new Decimal(0),
        GTE: new Decimal(0),
        GT: new Decimal(0),
        effectLT: new Decimal(0),
        effectLTE: new Decimal(0),
        effectGTE: new Decimal(0),
        effectGT: new Decimal(0),
        arFunction: new Decimal(0),
        arFunctionGain: new Decimal(0),

        functionE1: new Decimal(1),
        functionE2: new Decimal(1),
        functionE3: new Decimal(1),
        functionE4: new Decimal(1),
        functionE5: new Decimal(1),
        functionE6: new Decimal(1),
        functionE7: new Decimal(1),
        functionE8: new Decimal(1),
        functionE9: new Decimal(1),
        functionE10: new Decimal(1),

        metaE1: new Decimal(1),
        metaE2: new Decimal(1),
        metaE3: new Decimal(1),
        metaE4: new Decimal(1),

        softcap1: new Decimal(0.25),
        softcap1Start: new Decimal("1e1000"), //defaults for normal layers
        
        softcapFunc1: new Decimal(0.25),
        softcapFunc1Start: new Decimal("1e250"), //defaults for normal layers
        softcapFunc2: new Decimal(0.2),
        softcapFunc2Start: new Decimal("1e3000"), //defaults for normal layers
    }},
    color: "rgb(255,0,102)",
    requires: new Decimal("1e40"), // Can be a function that takes requirement increases into account
    resource: "Operation Power", // Name of prestige currency
    baseResource: "Numbers ", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.32, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "add"
        let typearithaddexp = new Decimal(0.1)
        mult = mult.add(player.add.additionTypeArith.pow(typearithaddexp))
        //mul
        layer = "f"
        if (hasUpgrade(layer, 42)) mult = mult.mul(4.04)
            
        layer = "add"
        mult = mult.mul(buyableEffect(layer, 11))

        layer = "sub"
        if (hasUpgrade(layer, 25)) mult = mult.mul(479001600)
        
        layer = "poly"
        if (hasUpgrade(layer, 15)) mult = mult.mul(5000)
        if (hasMilestone(layer, 6)) mult = mult.mul("1e6")
        if (hasUpgrade(layer, 216)) mult = mult.mul(upgradeEffect("f", 22))

        layer = "d"
        if (player.d.points.gte(4)) mult = mult.mul("1e10")
        //exp 
        layer = "d"
        if (player.d.points.gte(1)) mult = mult.pow(1.05)

        layer = "poly"
        if (hasMilestone(layer, 2)) mult = mult.pow(1.01)
        if (player.poly.area.gte(2544)) mult = mult.pow(player.poly.areaEffect4)
        mult = mult.pow(player.poly.hexagonsEffect1)
        mult = mult.pow(tmp.poly.challenges[11].rewardEffect[1])
            
        layer = "cb"
        if (hasUpgrade(layer, 11)) mult = mult.pow(1.05)
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi

    getResetGain() {
        let layer = "ar"
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)

        if (gain.gte(player[layer].softcap1Start)) gain = gain.pow(player[layer].softcap1).mul(new Decimal(player[layer].softcap1Start).pow(decimalOne.sub(player[layer].softcap1)))
        //put after first softcap things after this line

        if (getClickableState("sub", 1001)){
            if (getClickableState("sub", 41)) gain = gain.pow(0.01)
        }
            
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "a", description: "A: Reset for Operation Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasMilestone("p", 12)) player.ar.unlocked = true
        return player.ar.unlocked
    },
    milestonePopups() {return getClickableState("ar", 1001)},
    passiveGeneration() { 
        if (hasMilestone("poly", 1)) return 1
        if (hasUpgrade("pf", 113)) return 1
        return 0
    }, //use autoPrestige() if static!
    findEqPointsMult_ARH(){
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "sub"
        if (hasUpgrade(layer, 11)) mult = mult.add(25)
        //mul
        layer = "f"
        if (hasUpgrade(layer, 42)) mult = mult.mul(4.04)

        layer = "ar"
        if (hasUpgrade(layer, 12)) mult = mult.mul(1.5)
        if (hasUpgrade(layer, 21)) mult = mult.mul(upgradeEffect(layer, 21))
        if (hasUpgrade(layer, 24)) mult = mult.mul(5)
        if (hasUpgrade(layer, 36)) mult = mult.mul(upgradeEffect(layer, 36))
            
        layer = "mul"
        if (hasUpgrade(layer, 11)) mult = mult.mul(100000)
        if (hasUpgrade(layer, 71)) mult = mult.mul("1e15")

        layer = "d"
        if (player.d.points.gte(2)) mult = mult.mul(125)
            
        layer = "poly"
        if (hasUpgrade(layer, 17)) mult = mult.mul("1e10")
        mult = mult.mul(player.poly.squaresEffect1)

        layer = "div"
        if (hasMilestone(layer, 2)) mult = mult.mul("1e6")
        //exp 
        layer = "d"
        if (player.d.points.gte(4)) mult = mult.pow(1.05)
        //other hypers
        //time dilations/chals
        //softcaps + after softcap boosts
        return mult
    },
    findIneqMult_ARH(type){
        let layer;
        let mult = new Decimal(1)
        //add
        layer = "sub"
        if (hasUpgrade(layer, 11)) mult = mult.add(25)
        //mul
        layer = "f"
        if (hasUpgrade(layer, 42)) mult = mult.mul(4.04)

        layer = "ar"
        if (hasUpgrade(layer, 24)) mult = mult.mul(5)
        if (hasUpgrade(layer, 25)) mult = mult.mul(10)
        if (hasUpgrade(layer, 26)) mult = mult.mul(15)

        if (hasMilestone(layer, 7)) mult = mult.mul(player.ar.functionE5.add(1))

        layer = "add"
        mult = mult.mul(buyableEffect(layer, 11))

        layer = "sub"
        if (hasUpgrade(layer, 13)) mult = mult.mul(38)
            
        layer = "mul"
        if (hasUpgrade(layer, 11)) mult = mult.mul(100000)
        if (hasUpgrade(layer, 71)) mult = mult.mul("1e15")

        if (hasUpgrade(layer, 32)){
            if (type == 2) mult = mult.mul(player.ar.effectLT.add(1))
            if (type == 1) mult = mult.mul(player.ar.effectLTE.add(1))
            if (type == 4) mult = mult.mul(player.ar.effectGTE.add(1))
            if (type == 3) mult = mult.mul(player.ar.effectGT.add(1))
        }
        
        layer = "d"
        if (player.d.points.gte(1)) mult = mult.mul(25)
        if (player.d.points.gte(3)) mult = mult.mul(8)
        if (player.d.points.gte(4)) mult = mult.mul(500)

        layer = "poly"
        if (hasUpgrade(layer, 14)) mult = mult.mul("1e6")
        if (hasMilestone(layer, 9)) mult = mult.mul("1e10")
        mult = mult.mul(player.poly.squaresEffect1.add(1))
        if (hasMilestone("poly", 14)) mult = mult.mul(milestoneEffect("poly", 14).add(1))
        if (hasMilestone("poly", 15)) mult = mult.mul(125)

        layer = "div"
        if (hasMilestone(layer, 2)) mult = mult.mul("1e6")

        layer = "pf"
        mult = mult.mul(buyableEffect(layer, 13)[1])
        //exp 
        //other hypers
        //time dilations/chals
        //softcaps + after softcap boosts
        return mult
    },
    clickIneqButton_ARH(){
        let flick = Math.floor(Math.random() * 4 + 1)
        switch(flick){
            case 1:
                player.ar.LT = player.ar.LT.add(tmp.ar.findIneqMult_ARH(1))
                break;
            case 2:
                player.ar.LTE = player.ar.LTE.add(tmp.ar.findIneqMult_ARH(2))
                break;
            case 3:
                player.ar.GTE = player.ar.GTE.add(tmp.ar.findIneqMult_ARH(3))
                break;
            case 4:
                player.ar.GT = player.ar.GT.add(tmp.ar.findIneqMult_ARH(4))
                break;
        }
        if (Math.random() < 0.5){
            flick = Math.floor(Math.random() * 4 + 1)
            switch(flick){
                case 1:
                    if (player.ar.LT.gt(0) && tmp.ar.findIneqMult_ARH(1).lt(player.ar.LT)) player.ar.LT = player.ar.LT.sub(tmp.ar.findIneqMult_ARH(1))
                    break;
                case 2:
                    if (player.ar.LTE.gt(0) && tmp.ar.findIneqMult_ARH(2).lt(player.ar.LTE)) player.ar.LTE = player.ar.LTE.sub(tmp.ar.findIneqMult_ARH(2))
                    break;
                case 3:
                    if (player.ar.GTE.gt(0) && tmp.ar.findIneqMult_ARH(3).lt(player.ar.GTE)) player.ar.GTE = player.ar.GTE.sub(tmp.ar.findIneqMult_ARH(3))
                    break;
                case 4:
                    if (player.ar.GT.gt(0) && tmp.ar.findIneqMult_ARH(4).lt(player.ar.GT)) player.ar.GT = player.ar.GT.sub(tmp.ar.findIneqMult_ARH(4))
                    break;
            }
        }
        if (hasMilestone("ar", 4) && Math.random() < 0.25){
            flick = Math.floor(Math.random() * 4 + 1)
            switch(flick){
                case 1:
                    if (player.ar.LT.gt(0)) player.ar.LT = player.ar.LT.add(tmp.ar.findIneqMult_ARH(1).mul(2))
                    break;
                case 2:
                    if (player.ar.LTE.gt(0)) player.ar.LTE = player.ar.LTE.add(tmp.ar.findIneqMult_ARH(2).mul(2))
                    break;
                case 3:
                    if (player.ar.GTE.gt(0)) player.ar.GTE = player.ar.GTE.add(tmp.ar.findIneqMult_ARH(3).mul(2))
                    break;
                case 4:
                    if (player.ar.GT.gt(0)) player.ar.GT = player.ar.GT.add(tmp.ar.findIneqMult_ARH(4).mul(2))
                    break;
            }
        }
    },
    onPrestige(){
        player.ar.eqPoints = player.ar.eqPoints.add(tmp.ar.findEqPointsMult_ARH())
    },
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []
        if (resettingLayer == "d"){
            for (const id of [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33, 34, 35, 36, 37]) {
                if (hasUpgrade("ar", id)) {
                    keptUpgrades.push(id)
                }
            }
        }
        if (hasUpgrade("poly", 14)) keptUpgrades.push(17)

        if (challengeCompletions("poly", 11) >= 4){
            for (const id of [31, 32, 33, 34, 35, 36, 37]) {
                if (hasUpgrade("ar", id)) {
                    keptUpgrades.push(id)
                }
            }
        }

        let keptBuyables = []

        let keptAR1001State = getClickableState("ar", 1001)

        let keptChallenges = []
        if (hasUpgrade("poly", 23)) keptChallenges.push(11, 12, 13)
        if (hasUpgrade("poly", 205)) keptChallenges.push(21)
        if (hasChallenge("ar", 22)) keptChallenges.push(22)
        if (resettingLayer == "pf") keptChallenges = []
        if (hasUpgrade("pf", 114)) keptChallenges.push(11, 12, 13)

        let keptMilestones = []
        if (hasMilestone("ar", 16)) keptMilestones.push("16")
        if (resettingLayer == "pf") keptMilestones = []
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades)
        player[this.layer].milestones.push(...keptMilestones)
        setClickableState("ar", 1001, keptAR1001State)
        keptChallenges.forEach(element => player[this.layer].challenges[element] = 1)
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER

    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,0,102); text-shadow: 0px 0px 10px rgb(255,0,102)">${format(player.ar.points)}</h2> Operation Power (OP)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.p.points)} Numbers.`}],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(255,0,102); text-shadow: 0px 0px 10px rgb(255,0,102)">${format(player.ar.eqPoints)}</h2> Equation Points (EP)`}],
                "blank",
                ["bar", "arithBar1"],
                ["blank", "4px"],
                ["clickables", [1]],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(255,204,0); text-shadow: 0px 0px 10px rgb(255,204,0)">${format(player.ar.fundaVariables)}</h2> Fundamental Variables (FV)`}],
                ["blank", "4px"],
                ["display-text", function(){
                    if (getClickableState("sub", 1001) && getClickableState("sub", 42)) return `<span style="color: rgb(255,204,0);">Fundamental Variables divide Funda gain by ÷${format(player.ar.effectFV1)}</span>`
                    return `<span style="color: rgb(255,204,0);">Fundamental Variables multiply Funda gain by x${format(player.ar.effectFV1)}</span>`
                }],
                ["blank", "4px"],
                ["display-text", function(){
                    if (getClickableState("sub", 1001) && getClickableState("sub", 42)) return `<span style="color: rgb(255,204,0);">They also divide Primitive Variables gain by ÷${format(player.ar.effectFV2)}</span>`
                    if (hasUpgrade("poly", 17)) return `<span style="color: rgb(255,204,0);">They also multiply Primitive Variables gain by x${format(player.ar.effectFV2)}</span>`
                    return `<span style="color: rgb(255,204,0);">They also divide Primitive Variables gain by ÷${format(player.ar.effectFV2)}</span>`
                }],
                ["blank", "4px"],
                ["display-text", function(){
                    if (getClickableState("sub", 1001) && getClickableState("sub", 42)) return `<span style="color: rgb(255,204,0);">They also divide Addition and Subtraction gain by ÷${format(player.ar.effectFV3)}</span>`
                    if (hasMilestone(this.layer, 9)) return `<span style="color: rgb(255,204,0);">They also multiply Addition and Subtraction gain by x${format(player.ar.effectFV3)}</span>`
                }],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(0,204,255); text-shadow: 0px 0px 10px rgb(0,204,255)">${format(player.ar.primVariables)}</h2> Primitive Variables (PV)`}],
                ["blank", "4px"],
                ["display-text", function(){
                    if (getClickableState("sub", 1001) && getClickableState("sub", 42)) return `<span style="color: rgb(0,204,255);">Primitive Variables divide Nums gain by ÷${format(player.ar.effectPV1)}</span>`
                    return `<span style="color: rgb(0,204,255);">Primitive Variables multiply Nums gain by x${format(player.ar.effectPV1)}</span>`
                }],
                ["blank", "4px"],
                ["display-text", function(){
                    if (getClickableState("sub", 1001) && getClickableState("sub", 42)) return `<span style="color: rgb(0,204,255);">They also divide Fundamental Variables gain by ÷${format(player.ar.effectPV2)}</span>`
                    if (hasUpgrade("poly", 17)) return `<span style="color: rgb(0,204,255);">They also multiply Fundamental Variables gain by x${format(player.ar.effectPV2)}</span>`
                    return `<span style="color: rgb(0,204,255);">They also divide Fundamental Variables gain by ÷${format(player.ar.effectPV2)}</span>`
                }],
                ["blank", "4px"],
                ["display-text", function(){
                    if (getClickableState("sub", 1001) && getClickableState("sub", 42)) return `<span style="color: rgb(0,204,255);">They also divide Function gain by ÷${format(player.ar.effectPV3)}</span>`
                    if (hasMilestone(this.layer, 9)) return `<span style="color: rgb(0,204,255);">They also multiply Function gain by x${format(player.ar.effectPV3)}</span>`
                }],
                "blank",
                "h-line",
                "blank",
                "upgrades",
            ],
        },
        "Inequalities": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,0,102); text-shadow: 0px 0px 10px rgb(255,0,102)">${format(player.ar.points)}</h2> Operation Power (OP)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.p.points)} Numbers.`}],
                "blank",
                ["clickables", [2]],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(255,153,255); text-shadow: 0px 0px 10px rgb(255,153,255)">${format(player.ar.LT)}</h2> Less-Than Inequalities (LT)`}],
                ["display-text", function(){if (hasUpgrade("mul", 32)) return `<span style="color: rgb(255,153,255);">LT multiplies LTE by x${format(player.ar.effectLT)}</span>`}],
                ["display-text", function(){return `You have <h2 style="color: rgb(255,170,220); text-shadow: 0px 0px 10px rgb(255,170,220)">${format(player.ar.LTE)}</h2> Less-Equal-Than Inequalities (LTE)`}],
                ["display-text", function(){if (hasUpgrade("mul", 32)) return `<span style="color: rgb(255,170,220);">LTE multiplies LT by x${format(player.ar.effectLTE)}</span>`}],
                ["display-text", function(){return `You have <h2 style="color: rgb(255,187,187); text-shadow: 0px 0px 10px rgb(255,187,187)">${format(player.ar.GTE)}</h2> Greater-Equal-Than Inequalities (GTE)`}],
                ["display-text", function(){if (hasUpgrade("mul", 32)) return `<span style="color: rgb(255,187,187);">GTE multiplies GT by x${format(player.ar.effectGTE)}</span>`}],
                ["display-text", function(){return `You have <h2 style="color: rgb(255,204,153); text-shadow: 0px 0px 10px rgb(255,204,153)">${format(player.ar.GT)}</h2> Greater-Than Inequalities (GT)`}],
                ["display-text", function(){if (hasUpgrade("mul", 32)) return `<span style="color: rgb(255,204,153);">GT multiplies GTE by x${format(player.ar.effectGT)}</span>`}],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(204,0,80); text-shadow: 0px 0px 10px rgb(204,0,80)">${format(player.ar.arFunction)}</h2> Functions (FN)`}],
                ["display-text", function(){return `You are gaining ${format(player.ar.arFunctionGain)} Functions per second.`}],
                ["blank", "4px"],
                ["display-text", function(){if (hasMilestone("ar", 1)) return `Functions multiply Points by x${format(player.ar.functionE1)}`}],
                ["display-text", function(){if (hasUpgrade("ar", 23)) return `Functions multiply Variables by x${format(player.ar.functionE2)}`}],
                ["display-text", function(){if (hasMilestone("ar", 4)) return `Functions multiply Numbers by x${format(player.ar.functionE3)}`}],
                ["display-text", function(){if (hasMilestone("ar", 6)) return `Functions divide Primitive buyables 1-3 cost by ÷${format(player.ar.functionE4)}`}],
                ["display-text", function(){if (hasMilestone("ar", 7)) return `Functions multiply all Ineqs. by x${format(player.ar.functionE5)}`}],
                ["display-text", function(){if (hasMilestone("ar", 8)) return `Functions multiply Addition and Addition type cap by x${format(player.ar.functionE6)}`}],
                ["display-text", function(){if (hasMilestone("ar", 10)) return `Functions multiply Negativity and Functions by x${format(player.ar.functionE7)}`}],
                ["display-text", function(){if (hasChallenge("ar", 21)) return `Functions multiply the Vertex cap and Edge gain by x${format(player.ar.functionE8)}`}],
                ["display-text", function(){if (hasChallenge("ar", 21)) return `Functions divide Number Core buyables 1-2 cost by ÷${format(player.ar.functionE9)}`}],
                ["display-text", function(){if (hasMilestone("ar", 15)) return `Functions divide Core Booster cost by ÷${format(player.ar.functionE10)}`}],
                "blank",
                ["display-text", function(){if (hasMilestone("ar", 16)) return `<b>Meta-effect 1: Functions raise the above 10 effects and Points by ^${format(player.ar.metaE1, 6)}</b>`}],
                ["display-text", function(){if (hasMilestone("ar", 17)) return `<b>Meta-effect 2: Functions raise the above 11 effects and Number Cores by ^${format(player.ar.metaE2, 6)}</b>`}],
                ["display-text", function(){if (hasUpgrade("cb", 15)) return `<b>Meta-effect 3: Functions raise the above 12 effects and Addition by ^${format(player.ar.metaE3, 6)}</b>`}],
                ["display-text", function(){if (hasMilestone("div", 14)) return `<b>Meta-effect 4: Functions raise the above 13 effects and Constructor Shapes by ^${format(player.ar.metaE4, 6)}</b>`}],
                "blank",
                ["display-text", function(){if (player.ar.arFunction.gte(player.ar.softcapFunc1Start)) return `<span style="color: rgb(255,0,0);">Function softcap 1: ${format(player.ar.softcapFunc1Start)} - ^${format(player.ar.softcapFunc1)}</span>`}],
                ["display-text", function(){if (player.ar.arFunction.gte(player.ar.softcapFunc2Start)) return `<span style="color: rgb(255,0,0);">Function softcap 2: ${format(player.ar.softcapFunc2Start)} - ^${format(player.ar.softcapFunc2)}</span>`}],
                "blank",
                "h-line",
                "blank",
                ["clickable", [1001]],
                "blank",
                "milestones",
            ],
            unlocked() {return hasUpgrade("ar", 17)},
        },
        "Challenges": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(255,0,102); text-shadow: 0px 0px 10px rgb(255,0,102)">${format(player.ar.points)}</h2> Operation Power (OP)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.p.points)} Numbers.`}],
                "blank",
                "challenges",
            ],
            unlocked() {return hasUpgrade("ar", 27)},
        },
    },

    upgrades: {
        11: {
            title: "(Literal) Variable Boosts",
            effect() {
                let base = player.ar.fundaVariables.mul(player.ar.primVariables).add(1)
                
                base = base.pow(0.5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Points"
                return text
            },
            description: "The product of your FV and PV multiply Points.",
            cost: new Decimal("1"),
        },
        12: {
            title: "((Not) Metaphorical) Variable Boosts",
            description: "Improve PV's effects and x1.5 EP.",
            cost: new Decimal("4"),
        },
        13: {
            title: "(Point) Variable Boosts",
            effect() {
                let base = player.points.add(1)
                
                base = base.pow(0.1).log(10).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Variables"
                return text
            },
            description: "Points boost Variables.",
            cost: new Decimal("12"),
        },
        14: {
            title: "No More Variable Boosts",
            description: "+0.15 to the base of \"Duplication Machine\". x1,000,000 Points.",
            cost: new Decimal("24"),
        },
        15: {
            title: "WHAT HAPPENED TO THE PRICES",
            description: "Improve FV's effects and automate the first 21 Funda upgrades.",
            cost: new Decimal("1e4"),
        },
        16: {
            effect() {
                let base = player.ar.points.add(1)
                
                base = base.pow(2).log(1.5).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Variables"
                return text
            },
            title: "Varying Variable Boost",
            description: "Operation Power boosts Variables.",
            cost: new Decimal("5e4"),
        },
        17: {
            title: "Instability",
            description: "Unlock Inequalities.",
            cost: new Decimal("150e3"),
        },
        
        21: {
            effect() {
                let base = player.ar.fundaVariables.mul(player.ar.primVariables)
                
                base = base.pow(0.1).add(1).log(10).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to EP"
                return text
            },
            title: "Equation Variable Boost",
            description: "The product of your FV and PV multiply EP.",
            cost: new Decimal("1e7"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        22: {
            effect() {
                let base = player.ar.eqPoints
                
                base = base.pow(5).add(1).log(1.01).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to FN"
                return text
            },
            title: "Function Equation Boost",
            description: "EP boosts Functions. Improve Function's first effect.",
            cost: new Decimal("5e7"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        23: {
            title: "Variable Function Boost",
            description: "Unlock an effect of Functions.",
            cost: new Decimal("1e9"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        24: {
            title: "Super Generation",
            description: "Generate 100% of pending Funda and Nums per second. Also, x5 EP and all Ineqs.",
            cost: new Decimal("1e18"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        25: {
            title: "Multifaceted",
            description: "Intermediate levels of the Variable bar generate EP. x10 all Ineqs.",
            cost: new Decimal("1e22"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        26: {
            title: "ADVANCING",
            description: "Heavily improve \"Progressing\". x15 all Ineqs.",
            cost: new Decimal("1e26"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        27: {
            title: "Challenging",
            description: "Unlock Arithmetic Challenge 1.",
            cost: new Decimal("1e30"),
            unlocked() {return hasUpgrade(this.layer, 17)}
        },
        
        31: {
            title: "Procrastinate",
            description: "Delay the softcap of Number Cores to 1e1000.",
            cost: new Decimal("1e1050"),
            unlocked() {return challengeCompletions("poly", 11) >= 4},
        },
        32: {
            title: "Straighter Edge",
            description: "The base multiplier to CS from Constructor Sacrifice is ^2. Hexagon's second effect is better.",
            cost: new Decimal("1e1070"),
            unlocked() {return challengeCompletions("poly", 11) >= 4},
        },
        33: {
            title: "Division, In Fact, Does Something.",
            description: "\"Does Division Do Something?\" now boosts Points.",
            cost: new Decimal("1e1140"),
            unlocked() {return challengeCompletions("poly", 11) >= 4},
        },
        34: {
            title: "2560x1440",
            description: "Automatically bulk-buy Length and Width. Length is multiplied by x1.2 before being used in the Area formula.",
            cost: new Decimal("1e1175"),
            unlocked() {return challengeCompletions("poly", 11) >= 4},
        },
        35: {
            title: "Cost Weakening",
            description: "Reduce the exponent in the Core Booster cost formula by -0.5. Improve the first Core Booster effect.",
            cost: new Decimal("1e1265"),
            unlocked() {return challengeCompletions("poly", 11) >= 4},
        },
        36: {
            effect() {
                let base = player.ar.fundaVariables.mul(player.ar.primVariables).add(1)
                
                base = base.pow(0.1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e150")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to EP"
                return text
            },
            title: "Equal Equality",
            description: "FV and PV boost EP.",
            cost: new Decimal("1e1350"),
            unlocked() {return challengeCompletions("poly", 11) >= 4}
        },
        37: {
            title: "Irrational Side Length",
            description: "The end is here. x3 to Area.",
            cost: new Decimal("1e1460"),
            unlocked() {return challengeCompletions("poly", 11) >= 4},
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 100,000,000 Functions",
            effectDescription: "Unlock an effect of Functions.",
            done() { return player.ar.arFunction.gte("1e8") },
        },
        2: {
            requirementDescription: "2: 1e10 Functions",
            effectDescription: "Automate and bulk buy \"Fundamental Acceleration\" without spending. Delay the effect softcap of \"Rapid Generation\" to 1e30.",
            done() { return player.ar.arFunction.gte("1e10") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        3: {
            requirementDescription: "3: 1e14 Functions",
            effectDescription: "Automate and bulk buy \"Rapid Generation\" without spending. Delay the effect softcap of \"Fundamental Acceleration\" to 1e30.",
            done() { return player.ar.arFunction.gte("1e14") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        4: {
            requirementDescription: "4: 1e16 Functions",
            effectDescription: "Unlock an effect of Functions. Gaining Ineqs. has a 25% chance to give double.",
            done() { return player.ar.arFunction.gte("1e16") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        5: {
            requirementDescription: "5: 1e20 Functions",
            effectDescription: "Automate and bulk buy \"Duplication Machine\" without spending. Delay its effect softcap to 1e15.",
            done() { return player.ar.arFunction.gte("1e20") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        6: {
            requirementDescription: "6: 1e36 Functions",
            effectDescription: "Unlock an effect of Functions. +1.75 to the base of \"Rapid Generation\".",
            done() { return player.ar.arFunction.gte("1e36") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        7: {
            requirementDescription: "7: 1e40 Functions",
            effectDescription: "Unlock an effect of Functions. Unlock Arithmetic Challenge 2.",
            done() { return player.ar.arFunction.gte("1e40") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        8: {
            requirementDescription: "8: 1e60 Functions",
            effectDescription: "Unlock an effect of Functions and unlock Type-PRM Addition.",
            done() { return player.ar.arFunction.gte("1e60") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        9: {
            requirementDescription: "9: 1e80 Functions",
            effectDescription: "Unlock an effect of Fundamental Variables and Primitive Variables.",
            done() { return player.ar.arFunction.gte("1e80") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        10: {
            requirementDescription: "10: 1e100 Functions",
            effectDescription: "Unlock an effect of Functions and Arithmetic Challenge 3.",
            done() { return player.ar.arFunction.gte("1e100") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        11: {
            requirementDescription: "11: 1e135 Functions",
            effect(){
                let base = player.ar.points.add(1)

                base = base.pow(0.1).add(1)

                if (hasMilestone("ar", 15)) base = base.pow(3.5)

                let softcap = new Decimal(0.5)
                let softcapStart = new Decimal("1e1000")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDescription() { return "Operation Power boosts Points. Currently: x" + format(milestoneEffect(this.layer, this.id)) + " to Points" },
            done() { return player.ar.arFunction.gte("1e135") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        12: {
            requirementDescription: "12: 1e150 Functions",
            effectDescription: "Unlock Addition Type-POINT.",
            done() { return player.ar.arFunction.gte("1e150") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        13: {
            requirementDescription: "13: 1e300 Functions",
            effectDescription: "THIS IS LITERALLY THE SQUARE OF THE PREVIOUS MILESTONE!!! The individual Ineq. effects boost Points and Numbers (after softcap).",
            done() { return player.ar.arFunction.gte("1e300") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        14: {
            requirementDescription: "14: 1e330 Functions",
            effectDescription: "The softcap's doing some heavy lifting. Unlock 4 more Fundamental upgrades.",
            done() { return player.ar.arFunction.gte("1e330") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        15: {
            requirementDescription: "15: 1e404 Functions",
            effectDescription: "This milestone cannot be found. Heavily improve the 11th Function milestone, and unlock an effect of Functions.",
            done() { return player.ar.arFunction.gte("1e404") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        16: {
            requirementDescription: "16: 1e430 Functions",
            effectDescription: "A lengthy timewall... but worth it! Unlock a <b>meta-effect</b> of Functions. Unlock Type-NCR Addition. <i>This milestone is kept until the next reset layer.</i>",
            done() { return player.ar.arFunction.gte("1e430") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        17: {
            requirementDescription: "17: 7.270e727 Functions",
            effectDescription: "WHEN YOU SEE IT!!! Unlock a meta-effect of Functions and -0.0008 to Division time scaling.",
            done() { return player.ar.arFunction.gte("7.270e727") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        18: {
            requirementDescription: "18: 1e2500 Functions",
            effectDescription: "When is this layer going to end??? ^1.05 CS and Multiplication boosts Hexagons.",
            done() { return player.ar.arFunction.gte("1e2500") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
    },

    bars: {
        arithBar1: {
            direction: RIGHT,
            width: 500,
            height: 75,
            display() {
                let extra = ""
                if (player.ar.arithBar1Value.lte(0.4)) extra = "Fundamental"
                if (player.ar.arithBar1Value.gte(0.6)) extra = "Primitive"
                let text = `You are producing ${format(player.ar.varGain)} ${extra} Variables per second.`
                return text
            },
            progress() {
                let prog = player.ar.arithBar1Value
                
                return prog
            },
            fillStyle() {
                let color = "rgb(128,204,128)"
                if (player.ar.arithBar1Value.lte(0.4)) color = "rgb(192,204,64)"
                if (player.ar.arithBar1Value.lte(0.25)) color = "rgb(255,204,0)"
                
                if (player.ar.arithBar1Value.gte(0.6)) color = "rgb(64,204,192)"
                if (player.ar.arithBar1Value.gte(0.75)) color = "rgb(0,204,255)"
                return {"background-color": color,}
            },
            style() {
                return {
                    "color": "black",
                    "text-shadow": "0px 0px 5px rgb(0,0,0)",
                } 
            },
            baseStyle() {
                return {"background-color": "rgb(153,0,67)",}
            },
        },
    },
    
    clickables: {
        11: {
            title: "⇤",
            canClick() {return true},
            onClick() {
                player.ar.arithBar1Value = new Decimal(0.2)
            },
            style() {
                return {
                    "font-size": "20px",
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        12: {
            title: "←",
            canClick() {return true},
            onClick() {
                if (player.ar.arithBar1Value.lte(0.21)) return
                player.ar.arithBar1Value = player.ar.arithBar1Value.sub(0.15)
            },
            style() {
                return {
                    "font-size": "20px",
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        13: {
            title: "→←",
            canClick() {return true},
            onClick() {
                player.ar.arithBar1Value = new Decimal(0.5)
            },
            style() {
                return {
                    "font-size": "20px",
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        14: {
            title: "→",
            canClick() {return true},
            onClick() {
                if (player.ar.arithBar1Value.gte(0.69)) return
                player.ar.arithBar1Value = player.ar.arithBar1Value.add(0.15)
            },
            style() {
                return {
                    "font-size": "20px",
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        15: {
            title: "⇥",
            canClick() {return true},
            onClick() {
                player.ar.arithBar1Value = new Decimal(0.8)
            },
            style() {
                return {
                    "font-size": "20px",
                    "width": "80px",
                    "height": "80px",
                }
            }
        },
        
        21: {
            title: "Gain an Inequality",
            canClick() {return true},
            onClick() {
                tmp.ar.clickIneqButton_ARH()
            },
            style() {
                return {
                    "font-size": "18px",
                    "width": "200px",
                    "height": "80px",
                }
            }
        },

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
            }
        },
    },

    challenges: {
        11: {
            name: "Challenge Intro",
            challengeDescription: "<i>\"Oh ho ho, you're here now. Trust me, you'll like it here.\"</i><br><br>^0.5 Points, Funda, and Numbers.",
            goalDescription: "Have 1e80 Points.",
            rewardDescription: "^1.1 Points. Each Ineq. is raised to ^1.5 before being multiplied in the Functions formula.",
            canComplete: function() {return player.points.gte("1e80")},
            unlocked() {return hasUpgrade("ar", 27)},
            onEnter() {},
            onExit() {},
        },
        12: {
            name: "Economic Failure",
            challengeDescription: "<i>\"What? Since when did it cost this much?\"</i><br><br>Primitive buyable scaling is raised ^10. ^0.5 Points.",
            goalDescription: "Have 1e100 Points.",
            rewardDescription: "Generate 100% of FV and PV per second as if you used the bar. Unlock Addition and Dimensions. x125 Function gain.",
            canComplete: function() {return player.points.gte("1e100")},
            unlocked() {return hasMilestone("ar", 7)},
            onEnter() {},
            onExit() {},
        },
        13: {
            name: "Subtraction Realm",
            challengeDescription: "<i>\"Negativity = Life. Negativity = Everything.\"</i><br><br>You are in the NNL with select restrictions active.",
            goalDescription: "Have 1e188 Points.",
            rewardDescription: "Unlock Multiplication.",
            canComplete: function() {return player.points.gte("1e188")},
            unlocked() {return hasMilestone("ar", 10)},
            onEnter() {
                setClickableState("sub", 11, true)
                setClickableState("sub", 12, true)
                setClickableState("sub", 13, false)
                setClickableState("sub", 14, false)

                setClickableState("sub", 21, true)
                setClickableState("sub", 22, false)
                setClickableState("sub", 23, true)
                setClickableState("sub", 24, true)

                setClickableState("sub", 31, true)
                setClickableState("sub", 32, false)
                setClickableState("sub", 33, true)
                setClickableState("sub", 34, false)
                
                setClickableState("sub", 1001, true)
                player.sub.negativityGain = new Decimal(0)
                player.sub.currentGain = new Decimal(0)
            },
            onExit() {setClickableState("sub", 1001, false)},
        },
        21: {
            name: "Anti-Addition Movement",
            challengeDescription: "<i>\"Addition? What's that? You mean THAT hideous thing??\"</i><br><br>Addition types do not work. In fact, Addition type cap divides Point, Funda, and Nums gain. Resets and disables some Arithmetic currencies.",
            goalDescription: "Have 1e1800 Points.",
            rewardDescription: "x1e10 Functions after softcap. x5 Number Cores. Unlock two effects of Functions.",
            canComplete: function() {return player.points.gte("1e1800")},
            unlocked() {return hasMilestone("poly", 3)},
            onEnter() {
                player.add.additionTypeFunda = new Decimal(0)
                player.add.additionTypePrim = new Decimal(0)
                player.add.additionTypePoint = new Decimal(0)

                player.ar.points = new Decimal(0)
                player.ar.eqPoints = new Decimal(0)
                player.ar.arFunction = new Decimal(0)
                player.ar.fundaVariables = new Decimal(0)
                player.ar.primVariables = new Decimal(0)
            },
            onExit() {
                player.add.additionTypeFunda = new Decimal(0)
                player.add.additionTypePrim = new Decimal(0)
                player.add.additionTypePoint = new Decimal(0)

                player.ar.points = new Decimal(0)
                player.ar.eqPoints = new Decimal(0)
                player.ar.arFunction = new Decimal(0)
                player.ar.fundaVariables = new Decimal(0)
                player.ar.primVariables = new Decimal(0)
            },
        },
        22: {
            name: "Fraction of a Fraction",
            challengeDescription: "<i>\"The Points have been reduced to a fraction of a fraction of their original value!\"</i><br><br>You are trapped in Long Division. Additionally, ^0.1 Points, and Operation Power is reset.",
            goalDescription: "Have 5600 Multiplication.",
            rewardDescription: "Time passes x4 faster in Long Division.",
            canComplete: function() {return player.mul.points.gte("5600")},
            unlocked() {return hasUpgrade("div", 27)},
            onEnter() {
                setClickableState("div", 1001, true)
                player.ar.points = new Decimal(0)
            },
            onExit() {
                setClickableState("div", 1001, false)
                player.ar.points = new Decimal(0)
            },
        },
    },

    update(diff){
        //calculate variable gain
        let mult = new Decimal(0)
        if (player.ar.arithBar1Value.neq(0.5) || hasChallenge("ar", 12)){
            mult = player.ar.eqPoints.pow(1.1)

            if (player.ar.arithBar1Value.lte(0.25) || hasChallenge("ar", 12)) mult = mult.mul(player.ar.eqPoints.pow(1.1).add(1))
            if (player.ar.arithBar1Value.gte(0.75) || hasChallenge("ar", 12)) mult = mult.mul(player.ar.eqPoints.pow(1.1).add(1))

            //put variable gain things here
            if (hasUpgrade(this.layer, 13)) mult = mult.mul(upgradeEffect(this.layer, 13))
            if (hasUpgrade(this.layer, 16)) mult = mult.mul(upgradeEffect(this.layer, 16))
            if (hasUpgrade(this.layer, 23)) mult = mult.mul(player.ar.functionE2)
            if (hasUpgrade("sub", 12)) mult = mult.mul(50000)
            if (hasUpgrade("mul", 11)) mult = mult.mul(100000)
            if (hasUpgrade("sub", 17)) mult = mult.mul(upgradeEffect("sub", 17))
            if (hasUpgrade("poly", 24)) mult = mult.mul("1e10")
            if (hasMilestone("div", 2)) mult = mult.mul("1e10")
            if (hasUpgrade("mul", 71)) mult = mult.mul("1e15")
            mult = mult.mul(player.poly.squaresEffect1)

            if (hasUpgrade("poly", 17) && !(getClickableState("sub", 1001) && getClickableState("sub", 42))){
                if (player.ar.arithBar1Value.lte(0.4) || hasChallenge("ar", 12)) mult = mult.mul(player.ar.effectPV2)
                if (player.ar.arithBar1Value.gte(0.6) || hasChallenge("ar", 12)) mult = mult.mul(player.ar.effectFV2)
            } else {
                if (player.ar.arithBar1Value.lte(0.4) || hasChallenge("ar", 12)) mult = mult.div(player.ar.effectPV2)
                if (player.ar.arithBar1Value.gte(0.6) || hasChallenge("ar", 12)) mult = mult.div(player.ar.effectFV2)
            }

            if (player.d.points.gte(4)) mult = mult.pow(1.05)
        }
        if (!inChallenge("ar", 21)) player.ar.varGain = mult
        else player.ar.varGain = new Decimal(0)
        
        //funda + prim variables and their effects
        if (player.ar.arithBar1Value.lte(0.4) || hasChallenge("ar", 12)) player.ar.fundaVariables = player.ar.fundaVariables.add(player.ar.varGain.mul(diff))
            
        let FV1logbase = new Decimal(10)
        if (hasUpgrade("ar", 15)) FV1logbase = FV1logbase.sub(8)
        if (hasUpgrade("mul", 31)) FV1logbase = FV1logbase.sub(0.995)
        //below is arithmetic restriction
        if (getClickableState("sub", 1001) && getClickableState("sub", 42)) player.ar.effectFV1 = player.ar.fundaVariables.add(1).pow(10)
        else player.ar.effectFV1 = player.ar.fundaVariables.add(1).pow(5).log(FV1logbase).add(1)

        let FV2expbase = new Decimal(1.5)
        if (hasUpgrade("ar", 15)) FV2expbase = FV2expbase.sub(0.5)
        //below is arithmetic restriction
        if (getClickableState("sub", 1001) && getClickableState("sub", 42)) player.ar.effectFV2 = player.ar.fundaVariables.add(1).log(1.01).add(1)
        else player.ar.effectFV2 = player.ar.fundaVariables.add(1).pow(FV2expbase).log(100).add(1)

        let FV3logbase = new Decimal(10)
        if (hasUpgrade("mul", 31)) FV3logbase = FV3logbase.sub(8.5)
        //below is arithmetic restriction
        if (getClickableState("sub", 1001) && getClickableState("sub", 42)) player.ar.effectFV3 = player.ar.fundaVariables.add(1).pow(0.5)
        else player.ar.effectFV3 = player.ar.fundaVariables.add(1).pow(4).log(FV3logbase).add(1)
        
        if (player.ar.arithBar1Value.gte(0.6) || hasChallenge("ar", 12)) player.ar.primVariables = player.ar.primVariables.add(player.ar.varGain.mul(diff))

        let PV1logbase = new Decimal(25)
        if (hasUpgrade("ar", 12)) PV1logbase = PV1logbase.sub(23)
        if (hasUpgrade("mul", 31)) PV1logbase = PV1logbase.sub(0.995)
        //below is arithmetic restriction
        if (getClickableState("sub", 1001) && getClickableState("sub", 42)) player.ar.effectPV1 = player.ar.primVariables.add(1).pow(10)
        else player.ar.effectPV1 = player.ar.primVariables.add(1).pow(3).log(PV1logbase).add(1)

        let PV2expbase = new Decimal(1.5)
        if (hasUpgrade("ar", 12)) PV2expbase = PV2expbase.sub(0.5)
        //below is arithmetic restriction
        if (getClickableState("sub", 1001) && getClickableState("sub", 42)) player.ar.effectPV2 = player.ar.primVariables.add(1).log(1.01).add(1)
        else player.ar.effectPV2 = player.ar.primVariables.add(1).pow(PV2expbase).log(100).add(1)

        let PV3expbase = new Decimal(3)
        if (hasUpgrade("mul", 31)) PV3expbase = PV3expbase.add(7)
        //below is arithmetic restriction
        if (getClickableState("sub", 1001) && getClickableState("sub", 42)) player.ar.effectPV3 = player.ar.primVariables.add(1).pow(0.5)
        else player.ar.effectPV3 = player.ar.primVariables.add(1).pow(PV3expbase).log(5).add(1).pow(1.5)

        //externally boosting variable effects
        if (hasUpgrade("mul", 31)) player.ar.effectFV1 = player.ar.effectFV1.pow(2)
        if (hasUpgrade("mul", 31)) player.ar.effectFV3 = player.ar.effectFV3.pow(1.25)
        if (hasUpgrade("mul", 31)) player.ar.effectPV1 = player.ar.effectPV1.pow(2)
        if (hasUpgrade("mul", 31)) player.ar.effectPV3 = player.ar.effectPV3.pow(2.5)

        //arith upgrade 25
        if (player.ar.arithBar1Value.gte(0.25) && player.ar.arithBar1Value.lte(0.75) && (player.ar.arithBar1Value.neq(0.5) || hasMilestone("poly", 3))){
            if (hasUpgrade("ar", 25)) player.ar.eqPoints = player.ar.eqPoints.add(tmp.ar.findEqPointsMult_ARH().mul(new Decimal(diff).pow(2)))
        }

        //functions
        let auxMult = new Decimal(1)
        mult = new Decimal(1)

        auxMult = player.ar.LT
        if (hasChallenge("ar", 11)) auxMult = auxMult.pow(1.5)
        mult = mult.mul(auxMult.add(1))

        auxMult = player.ar.LTE
        if (hasChallenge("ar", 11)) auxMult = auxMult.pow(1.5)
        mult = mult.mul(auxMult.add(1))

        auxMult = player.ar.GTE
        if (hasChallenge("ar", 11)) auxMult = auxMult.pow(1.5)
        mult = mult.mul(auxMult.add(1))

        auxMult = player.ar.GT
        if (hasChallenge("ar", 11)) auxMult = auxMult.pow(1.5)
        mult = mult.mul(auxMult.add(1))

        //function boosts
        if (hasUpgrade("ar", 22)) mult = mult.mul(upgradeEffect("ar", 22))
        if (hasUpgrade("f", 42)) mult = mult.mul(4.04)
        if (hasChallenge("ar", 12)) mult = mult.mul(125)
        if (player.d.points.gte(2)) mult = mult.mul(125)
        if (hasMilestone("ar", 9)){
            if (getClickableState("sub", 1001) && getClickableState("sub", 42)) mult = mult.div(player.ar.effectPV3)
            else mult = mult.mul(player.ar.effectPV3)
        }
        if (hasMilestone("ar", 10)) mult = mult.mul(player.ar.functionE7)
        if (hasUpgrade("mul", 22)) mult = mult.mul(upgradeEffect("mul", 22))
        if (hasUpgrade("poly", 14)) mult = mult.mul("1e10")

        let layer = "ar"
        if (mult.gte(player[layer].softcapFunc1Start)) mult = mult.pow(player[layer].softcapFunc1).mul(new Decimal(player[layer].softcapFunc1Start).pow(decimalOne.sub(player[layer].softcapFunc1)))
        if (mult.gte(player[layer].softcapFunc2Start)) mult = mult.pow(player[layer].softcapFunc2).mul(new Decimal(player[layer].softcapFunc2Start).pow(decimalOne.sub(player[layer].softcapFunc2)))

        if (hasUpgrade("poly", 24)) mult = mult.mul("1e10")
        if (hasChallenge("ar", 21)) mult = mult.mul("1e10")
        if (hasUpgrade("div", 17)) mult = mult.mul(upgradeEffect("div", 17))
        mult = mult.mul(player.poly.squaresEffect1)
        if (player.d.points.gte(4)) mult = mult.mul("1e10")

        if (hasMilestone("poly", 2)) mult = mult.pow(1.01)
        if (hasMilestone("div", 2)) mult = mult.pow(1.05)
        if (hasUpgrade("mul", 71)) mult = mult.pow(1.05)


        //applying functions
        if (hasUpgrade("ar", 17) && (player.ar.LT.gt(0) || player.ar.LTE.gt(0) || player.ar.GTE.gt(0) || player.ar.GT.gt(0))){
            player.ar.arFunctionGain = mult
            if (getClickableState("sub", 1001) && getClickableState("sub", 43)) player.ar.arFunctionGain = new Decimal(0)
            if (!inChallenge(layer, 21)) player.ar.arFunction = player.ar.arFunction.add(player.ar.arFunctionGain.mul(diff))
        }

        //function effects
        let inLD = getClickableState("div", 1001)

        if (hasMilestone("ar", 1) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.5)
        else mult = new Decimal(1)
        if (hasUpgrade("ar", 22)) mult = mult.pow(2.5)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE1 = mult

        if (hasUpgrade("ar", 23) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.1)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE2 = mult
            
        if (hasMilestone("ar", 4) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.15)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE3 = mult
            
        if (hasMilestone("ar", 6) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.3)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE4 = mult
            
        if (hasMilestone("ar", 7) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.075)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE5 = mult
            
        if (hasMilestone("ar", 8) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.01)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE6 = mult
    
        if (hasMilestone("ar", 10) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.005).log(100).add(1)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE7 = mult
    
        if (hasChallenge("ar", 21) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.005)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)

        player.ar.functionE8 = mult
    
        if (hasChallenge("ar", 21) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.001)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)

        player.ar.functionE9 = mult
    
        if (hasMilestone("ar", 15) && !inLD && !inChallenge("poly", 11)) mult = player.ar.arFunction.add(1).pow(0.05)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 16)) mult = mult.pow(player.ar.metaE1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)

        player.ar.functionE10 = mult
    
        //meta!
        if (hasMilestone("ar", 16) && !inLD) mult = player.ar.arFunction.add(1).log("1e1000").div(12.5).add(1)
        else mult = new Decimal(1)
        if (hasMilestone("ar", 17)) mult = mult.pow(player.ar.metaE2)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        player.ar.metaE1 = mult
        
        if (hasMilestone("ar", 17) && !inLD) mult = player.ar.arFunction.add(1).log("1e1000").div(10).add(1)
        else mult = new Decimal(1)
        if (hasUpgrade("cb", 15)) mult = mult.pow(player.ar.metaE3)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        player.ar.metaE2 = mult
        
        if (hasUpgrade("cb", 15) && !inLD) mult = player.ar.arFunction.add(1).log("1e2000").div(8).add(1)
        else mult = new Decimal(1)
        if (hasMilestone("div", 14)) mult = mult.pow(player.ar.metaE4)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        player.ar.metaE3 = mult
        
        if (hasMilestone("div", 14) && !inLD) mult = player.ar.arFunction.add(1).log("1e2500").div(25).add(1)
        else mult = new Decimal(1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        player.ar.metaE4 = mult

        //effect softcaps
        let softcapFE5 = new Decimal(0.25)
        let softcapStartFE5 = new Decimal(2763)
        
        let softcap2FE5 = new Decimal(0.2)
        let softcapStart2FE5 = new Decimal("1e6")

        if (player.ar.functionE5.gte(softcapStartFE5)) player.ar.functionE5 = player.ar.functionE5.pow(softcapFE5).mul(new Decimal(softcapStartFE5).pow(decimalOne.sub(softcapFE5))) //softcap
        if (player.ar.functionE5.gte(softcapStart2FE5)) player.ar.functionE5 = player.ar.functionE5.pow(softcap2FE5).mul(new Decimal(softcapStart2FE5).pow(decimalOne.sub(softcap2FE5))) //softcap

        //individ inequality effects
        if (hasUpgrade("mul", 32)){
            player.ar.effectLT = player.ar.LT.div("1e18").pow(0.75).add(1)
            player.ar.effectLTE = player.ar.LTE.div("1e18").pow(0.75).add(1)
            player.ar.effectGTE = player.ar.GTE.div("1e18").pow(0.75).add(1)
            player.ar.effectGT = player.ar.GT.div("1e18").pow(0.75).add(1)
            
            //softcaps
            let softcapIneqEff = new Decimal(0.25)
            let softcapStarIneqEff = new Decimal(250)

            if (player.ar.effectLT.gte(softcapStarIneqEff)) player.ar.effectLT = player.ar.effectLT.pow(softcapIneqEff).mul(new Decimal(softcapStarIneqEff).pow(decimalOne.sub(softcapIneqEff))) //softcap
            if (player.ar.effectLTE.gte(softcapStarIneqEff)) player.ar.effectLTE = player.ar.effectLTE.pow(softcapIneqEff).mul(new Decimal(softcapStarIneqEff).pow(decimalOne.sub(softcapIneqEff))) //softcap
            if (player.ar.effectGTE.gte(softcapStarIneqEff)) player.ar.effectGTE = player.ar.effectGTE.pow(softcapIneqEff).mul(new Decimal(softcapStarIneqEff).pow(decimalOne.sub(softcapIneqEff))) //softcap
            if (player.ar.effectGT.gte(softcapStarIneqEff)) player.ar.effectGT = player.ar.effectGT.pow(softcapIneqEff).mul(new Decimal(softcapStarIneqEff).pow(decimalOne.sub(softcapIneqEff))) //softcap
        } else {
            player.ar.effectLT = new Decimal(1)
            player.ar.effectLTE = new Decimal(1)
            player.ar.effectGTE = new Decimal(1)
            player.ar.effectGT = new Decimal(1)
        }

        if (hasUpgrade("poly", 14)) tmp.ar.clickIneqButton_ARH()

        //automation
        let automationBoolean = false

        if (hasMilestone("poly", 1)) automationBoolean = true
        if (hasUpgrade("pf", 113)) automationBoolean = true

        if (automationBoolean){
            let list = [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27]
            if (hasUpgrade("pf", 113)) list.push(31, 32, 33, 34, 35, 36, 37)
            for (const id of list){
                if (!hasUpgrade("ar", id) && canAffordUpgrade("ar", id) && tmp.ar.upgrades[id].unlocked) buyUpgrade("ar", id)
            }
        }

        mult = new Decimal(0.25)
        player.ar.softcap1 = mult
        
        mult = new Decimal("1e1000")
        player.ar.softcap1Start = mult
    },

    branches: [["add", 3], ["sub", 3], ["mul", 3], ["div", 3], ["d", 3], ["poly", 1]],
    tooltip() {
        let text = format(player.ar.points) + " Operation Power (+" + format(getResetGain("ar")) + " Operation Power on reset)"
        if (player.ar.points.gte(player.ar.softcap1Start)) text += `<br>[FIRST SOFTCAP - ${format(player.ar.softcap1Start)} - ^${format(player.ar.softcap1)}]`
        return text
    },
})