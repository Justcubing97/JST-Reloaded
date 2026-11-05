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

        polyLength: new Decimal(1),
        polyWidth: new Decimal(1),
        area: new Decimal(1),

        areaEffect1: new Decimal(0),
        areaEffect2: new Decimal(1),
        areaEffect3: new Decimal(1),
        areaEffect4: new Decimal(1),
        areaEffect5: new Decimal(1),
        areaEffect6: new Decimal(1),

        areaMeta1: new Decimal(1),
        areaMeta2: new Decimal(1),

        triangles: new Decimal(0),
        squares: new Decimal(0),
        pentagons: new Decimal(0),
        hexagons: new Decimal(0),

        trianglesEffect1: new Decimal(1),

        squaresEffect1: new Decimal(1),

        pentagonsEffect1: new Decimal(1),

        hexagonsEffect1: new Decimal(1),
        hexagonsEffect2: new Decimal(1),

        focus: "triangles",
        baseTime: new Decimal(30),
        currentTime: new Decimal(30),

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
        layer = "nc"
        mult = mult.mul(buyableEffect(layer, 13))
        
        layer = "poly"
        if (hasUpgrade(layer, 26)) mult = mult.mul(upgradeEffect(layer, 26)[1])
        if (hasUpgrade(layer, 214)) mult = mult.mul(upgradeEffect(layer, 214))

        layer = "div"
        if (hasUpgrade(layer, 11)) mult = mult.mul(100)

        layer = "cb"
        if (hasUpgrade(layer, 11)) mult = mult.mul(player.cb.e1)
        //exp 
        layer = "div"
        if (hasUpgrade(layer, 14)) mult = mult.pow(1.1)
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
        let keptConstFocus = player.poly.focus
        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = [];

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
        setClickableState("poly", 1001, keptPOLY1001State)
        player.poly.focus = keptConstFocus
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
                ["upgrades", [10, 11]],
                "blank",
                function(){if (hasUpgrade("poly", 21) || hasUpgrade("pf", 12)) return "h-line"},
                "blank",
                ["display-text", function(){if (hasUpgrade("poly", 21) || hasUpgrade("pf", 12)) return `You have <h2 style="color: rgb(102,51,255); text-shadow: 0px 0px 10px rgb(102,51,255)">${format(player.poly.edges)}</h2> Edges (no short form)`}],
                ["display-text", function(){if (hasUpgrade("poly", 21) || hasUpgrade("pf", 12)) return `You are gaining ${format(player.poly.edgeGain)} Edges per second. Edge gain is determined by Vertices.`}],
                "blank",
                ["upgrades", [20, 21]],
                "blank",
                ["clickable", [1001]],
                "blank",
                "milestones",
            ],
            unlocked() {return hasUpgrade("poly", 11) || hasUpgrade("pf", 12)},
        },
        "Area": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(51,51,255); text-shadow: 0px 0px 10px rgb(51,51,255)">${format(player.poly.points)}</h2> Shapes (no short form)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                ["display-text", function(){return `Your rectangle is <h2 style="color: rgb(204,102,204); text-shadow: 0px 0px 10px rgb(204,102,204)">${format(player.poly.polyLength)}</h2> units long (Length) and <h2 style="color: rgb(255,102,153); text-shadow: 0px 0px 10px rgb(255,102,153)">${format(player.poly.polyWidth)}</h2> units wide (Width)`}],
                "blank",
                ["buyables", [10]],
                "blank",
                ["display-text", function(){return `Your rectangle has an Area of <h2 style="color: rgb(153,51,153); text-shadow: 0px 0px 10px rgb(153,51,153)">${format(player.poly.area)}</h2> units squared`}],
                ["display-text", function(){return `Area adds +${format(player.poly.areaEffect1)} to Vertex and Number Core buyables`}],
                ["display-text", function(){
                    if (player.poly.area.gte(140)) return `Area divides NC buyable and Division time by ÷${format(player.poly.areaEffect2)}`
                    return `Unlocked at 140.000 Area`
                }],
                ["display-text", function(){
                    if (player.poly.area.gte(782)) return `Area multiplies Addition type cap, Negativity, Products, and Division by x${format(player.poly.areaEffect3)}`
                    return `Unlocked at 782.000 Area`
                }],
                ["display-text", function(){
                    if (player.poly.area.gte(2544)) return `Area raises Number Cores, Operation Power, and Subtraction by ^${format(player.poly.areaEffect4)}`
                    return `Unlocked at 2,544 Area`
                }],
                ["display-text", function(){
                    if (player.poly.area.gte(9641)) return `Area divides Core Booster cost by ÷${format(player.poly.areaEffect5)}`
                    return `Unlocked at 9,641 Area`
                }],
                ["display-text", function(){
                    if (player.poly.area.gte(54667)) return `Area multiplies the Vertex cap and Edges by x${format(player.poly.areaEffect6)}`
                    return `Unlocked at 54,667 Area`
                }],
                "blank",
                ["display-text", function(){
                    if (player.poly.area.gte(347163)) return `Area raises the first 6 effects, the first 10 Function effects, and Points by ^${format(player.poly.areaMeta1)}`
                    return `Unlocked at 347,163 Area`
                }],
                ["display-text", function(){
                    if (player.poly.area.gte(1735105)) return `Area raises the first 7 effects, the first 4 Function meta-effects, and CS by ^${format(player.poly.areaMeta2)}`
                    return `Unlocked at 1,735,105 Area`
                }],
            ],
            unlocked() {return hasMilestone("poly", 10) || hasUpgrade("pf", 12)},
        },
        "Constructor": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(51,51,255); text-shadow: 0px 0px 10px rgb(51,51,255)">${format(player.poly.points)}</h2> Shapes (no short form)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.ar.points)} Operation Power.`}],
                "blank",
                ["bar", "constructorTime"],
                "blank",
                ["clickable", [11]],
                "blank",
                ["buyables", [20]],
                "blank",
                ["display-text", `<i>Triangles, Squares, Pentagons, and Hexagons are collectively called Constructor Shapes (CS).</i>`],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(51,0,153); text-shadow: 0px 0px 10px rgb(51,0,153)">${format(player.poly.triangles)}</h2> Triangles`}],
                ["display-text", function(){return `Triangles divide the cost of Primitive and Number Core buyables by ÷${format(player.poly.trianglesEffect1)}`}],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(51,0,153); text-shadow: 0px 0px 10px rgb(51,0,153)">${format(player.poly.squares)}</h2> Squares`}],
                ["display-text", function(){return `Squares multiply FV, PV, EP, all Ineqs., and Functions by x${format(player.poly.squaresEffect1)}`}],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(51,0,153); text-shadow: 0px 0px 10px rgb(51,0,153)">${format(player.poly.pentagons)}</h2> Pentagons`}],
                ["display-text", function(){return `Pentagons raise Addition, Subtraction, Multiplication, and Division by ^${format(player.poly.pentagonsEffect1)}`}],
                "blank",
                ["display-text", function(){return `You have <h2 style="color: rgb(51,0,153); text-shadow: 0px 0px 10px rgb(51,0,153)">${format(player.poly.hexagons)}</h2> Hexagons`}],
                ["display-text", function(){return `Hexagons raise Points, Fundamentality, Numbers, and Operation Power by ^${format(player.poly.hexagonsEffect1)}`}],
                ["display-text", function(){return `Hexagons raise Triangles, Squares, and Pentagons by ^${format(player.poly.hexagonsEffect2)}`}],
                "blank",
                ["challenge", [11]]
            ],
            unlocked() {return hasMilestone("poly", 13) || hasUpgrade("pf", 12)},
        },
    },
    findConstructorShapesMult_POLY(type){
        let mult = new Decimal(1)

        //global mults
        mult = mult.mul(buyableEffect("poly", 201))
        if (hasUpgrade("cb", 13)) mult = mult.mul(2.5)
        if (hasUpgrade("poly", 214)) mult = mult.mul(upgradeEffect("poly", 214))
        if (hasMilestone("poly", 15)) mult = mult.mul(125)
        if (player.d.points.gte(4)) mult = mult.mul(500)
        if (hasUpgrade("cb", 15)) mult = mult.mul(player.cb.e3)
        mult = mult.mul(tmp.poly.challenges[11].rewardEffect[2])
        if (hasMilestone("div", 12)) mult = mult.mul(55)
        mult = mult.mul(buyableEffect("pf", 12)[1])
        if (hasUpgrade("pf", 12)) mult = mult.mul(100)
            
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        if (type == "t"){
            mult = mult.pow(player.poly.hexagonsEffect2)
        }
        if (type == "s"){
            mult = mult.pow(player.poly.hexagonsEffect2)
        }
        if (type == "p"){
            if (hasUpgrade("cb", 17)) mult = mult.mul(100)

            mult = mult.pow(player.poly.hexagonsEffect2)
        }
        if (type == "h"){
            if (hasMilestone("ar", 18)) mult = mult.pow(1.05)
            if (hasUpgrade("cb", 17)) mult = mult.pow(1.15)
        }
        return mult
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
            unlocked() { return hasUpgrade(this.layer, 17) },
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
            unlocked() { return hasUpgrade(this.layer, 17) },
        },
        23: {
            title: "Challenging QoL",
            description: "Keep Arithmetic Challenges 1-3, Negativity, and the first row of Negativity upgrades on reset. ^1.1 Numbers.",
            cost: new Decimal("1e11"),
            unlocked() { return hasUpgrade(this.layer, 17) },
        },
        24: {
            title: "IT'S ALL MULTIPLIERS",
            description: "x1e10 Funda (after softcap), Nums, EP, and Functions (after softcap).",
            cost: new Decimal("1e16"),
            unlocked() { return hasUpgrade(this.layer, 17) },
        },
        25: {
            title: "Edgy Upgrade",
            effect() {
                let base = player.poly.points.add(1)
                
                base = base.pow(0.1).mul(player.poly.points.add(1).log(10).add(1))

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e10")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Edges"
                return text
            },
            description: "Shapes boost Edges.",
            cost: new Decimal("1e20"),
            unlocked() { return hasUpgrade(this.layer, 17) },
        },
        26: {
            title: "Shape Cores",
            effect() {
                let baseToNC = player.poly.points.add(1)
                
                baseToNC = baseToNC.pow(0.15)

                let softcapToNC = new Decimal(0.25)
                let softcapStartToNC = new Decimal("1e50")

                if (baseToNC.gte(softcapStartToNC)) baseToNC = baseToNC.pow(softcapToNC).mul(new Decimal(softcapStartToNC).pow(decimalOne.sub(softcapToNC))) //softcap

                let baseToSh = player.nc.points.add(1)
                
                baseToSh = baseToSh.pow(0.2)

                let softcapToSh1 = new Decimal(0.25)
                let softcapStartToSh1 = new Decimal("1e50")

                if (baseToSh.gte(softcapStartToSh1)) baseToSh = baseToSh.pow(softcapToSh1).mul(new Decimal(softcapStartToSh1).pow(decimalOne.sub(softcapToSh1))) //softcap
                
                let softcapToSh2 = new Decimal(0.1)
                let softcapStartToSh2 = new Decimal("1e75")

                if (baseToSh.gte(softcapStartToSh2)) baseToSh = baseToSh.pow(softcapToSh2).mul(new Decimal(softcapStartToSh2).pow(decimalOne.sub(softcapToSh2))) //softcap
                return [baseToNC, baseToSh]
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)[0]) + " to NC, x" + format(upgradeEffect(this.layer, this.id)[1]) + " to Shapes"
                return text
            },
            description: "Shapes and Number Cores boost each other.",
            cost: new Decimal("1e25"),
            unlocked() { return hasUpgrade(this.layer, 17) },
        },
        27: {
            title: "Bisection",
            description: "Unlock Division.",
            cost: new Decimal("1e28"),
            unlocked() { return hasUpgrade(this.layer, 17) },
        },

        101: {
            title: "Similar Triangles",
            description: "Every bought \"Point-Slope Form\" adds to \"n-gon Expander\".",
            cost: new Decimal("1"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        102: {
            title: "Congruency Theorems",
            description: "x2.5 to the Vertex cap, and x10,000 to the base effect of \"Point-Slope Form\".",
            cost: new Decimal("100"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        103: {
            title: "Similar Triangles II",
            description: "Every bought \"Time Dilation\" adds to \"Point-Slope Form\".",
            cost: new Decimal("15000"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        104: {
            title: "Buyable Boosts",
            description: "+0.25 to the base of \"Fundamental Acceleration\" and \"Rapid Generation\", and +0.4 to \"Duplication Machine\".",
            cost: new Decimal("40000"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        105: {
            title: "Cap Dilation",
            effect() {
                let base = getBuyableAmount(this.layer, 13).add(1)

                base = base.log(2).add(1).div(100)

                if (hasUpgrade("poly", 111)) base = base.mul(1.2)

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
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        106: {
            title: "Time Expander",
            description: "Every bought \"n-gon Expander\" adds to \"Time Dilation\" x1,000,000 to the Vertex cap.",
            cost: new Decimal("2.5e16"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        107: {
            title: "Buyable Mania",
            description: "Unlock Number Cores.",
            cost: new Decimal("1e28"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 15) || hasUpgrade("pf", 12)},
        },
        111: {
            title: "Vertex Manipulation",
            description: "\"Cap Dilation\" is improved.",
            cost: new Decimal("1e55"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
        },
        112: {
            title: "Hyperbolic Geometry",
            description: "That previous upgrade was almost TOO much. ÷500 to Division time.",
            cost: new Decimal("1e63"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
        },
        113: {
            title: "3D Polygon",
            description: "Cube \"Addition Amplifier\" and it affects Number Cores and Edges.",
            cost: new Decimal("1e69"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
        },
        114: {
            title: "Bismuth Square",
            effect() {
                let base = getBuyableAmount(this.layer, 11).add(getBuyableAmount(this.layer, 12)).add(getBuyableAmount(this.layer, 13))

                base = base.pow(1.5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e10")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Vertex cap"
                return text
            },
            description: "The sum of bought Vertex buyables multiplies the Vertex cap.",
            cost: new Decimal("1e83"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
        },
        115: {
            title: "INFATUATION",
            description: "x1e100 Points, Funda, and Nums.",
            cost: new Decimal("1e100"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
        },
        116: {
            title: "Dividing Shapes",
            effect() {
                let base = player.poly.points.add(1)

                base = base.pow(0.1).log(1000).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e4")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Division and Edges"
                return text
            },
            description: "Shapes boost Division and Edges.",
            cost: new Decimal("1e130"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
        },
        117: {
            title: "SSS",
            description: "Improve the Edges formula.",
            cost: new Decimal("1e172"),
            currencyDisplayName: "Vertices",
            currencyInternalName: "vertices",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 206) || hasUpgrade("pf", 12)},
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
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        202: {
            title: "Rays",
            description: "\"Lines\" effect is improved. ^1.05 to Vertex cap.",
            cost: new Decimal("5000"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        203: {
            title: "Angles From Rays",
            description: "\"A Negative Variable\" uses a better formula. x1.5 Negativity.",
            cost: new Decimal("200000"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        204: {
            title: "Acute Angles",
            description: "Unlock a Number Core buyable. x100 Edges.",
            cost: new Decimal("1e7"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        205: {
            title: "Obtuse Angles",
            effect() {
                let base = player.poly.edges.add(1)
                
                base = base.pow(0.8).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e20")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "+" + format(upgradeEffect(this.layer, this.id)) + " to Addition type Base"
                return text
            },
            description: "Edges add to the Addition type base. Keep Arithmetic Challenge 4.",
            cost: new Decimal("2e10"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        206: {
            title: "Reflexive Angles",
            effect() {
                let base = player.poly.edges.add(1)
                
                base = base.log(2).add(1)

                let softcap = new Decimal(0.05)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Edges"
                return text
            },
            description: "Unlock another row of Vertex upgrades. Edges boost themselves.",
            cost: new Decimal("1e17"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        207: {
            title: "2τ",
            description: "Number Core buyables 1-3 add to their respective Primitive buyables (but buffed).",
            cost: new Decimal("5e19"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasUpgrade(this.layer, 21) || hasUpgrade("pf", 12)},
        },
        211: {
            title: "Cyclic Upgrade",
            effect() {
                let base = player.cb.points.add(1)
                
                base = base.pow(5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e50")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Edges"
                return text
            },
            description: "Core Boosters boost Edges.",
            cost: new Decimal("8.57e142"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
        },
        212: {
            title: "Number Line is an Edge",
            description: "Type-NCR Addition contributes more to Number Cores. x1e50 Addition type cap.",
            cost: new Decimal("1e148"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
        },
        213: {
            title: "Furrycore",
            description: "Bonus exponent if you get the reference. Width is multiplied by x2.13 before being considered by the area formula.",
            cost: new Decimal("1e155"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
        },
        214: {
            title: "More Edges, More Shapes!",
            effect() {
                let base = player.poly.edges.add(1)
                
                base = base.pow(0.025)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e50")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDisplay() {
                let text = "x" + format(upgradeEffect(this.layer, this.id)) + " to Shapes and CS"
                return text
            },
            description: "Edges boost Shapes and Constructor Shapes.",
            cost: new Decimal("1e190"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
        },
        215: {
            title: "Another Bar",
            description: "Unlock Type-ARH Addition.",
            cost: new Decimal("1e210"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
        },
        216: {
            title: "<i>INCREASING</i>",
            description: "\"Progressing\" is heavily, heavily improved. \"Mutual Relationship\" also boosts NC and OP.",
            cost: new Decimal("1e218"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
        },
        217: {
            title: "Atomic Clock Malfunction",
            description: "Time to construct CS and time in Long Division passes by x3 faster.",
            cost: new Decimal("1e250"),
            currencyDisplayName: "Edges",
            currencyInternalName: "edges",
            currencyLayer: "poly",
            unlocked() {return hasMilestone("div", 7) || hasUpgrade("pf", 12)},
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
                if (hasUpgrade("poly", 101)) added = "+" + format(getBuyableAmount("poly", 12).add(player.poly.areaEffect1))
                return "Multiplies the Vertices cap by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].vertices.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 5) || hasUpgrade("pf", 123)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].vertices = player[this.layer].vertices.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(1.1)
                if (hasUpgrade("poly", 105)) base = base.add(upgradeEffect("poly", 105))
                if (hasUpgrade("mul", 81)) base = base.add(upgradeEffect("mul", 81))
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                if (hasUpgrade("poly", 101)) amt = amt.add(getBuyableAmount("poly", 12))
                amt = amt.add(player.poly.areaEffect1)

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
                if (hasUpgrade("poly", 103)) added = "+" + format(getBuyableAmount("poly", 13).add(player.poly.areaEffect1))
                return "Multiplies Points by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].vertices.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 5) || hasUpgrade("pf", 123)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
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
                amt = amt.add(player.poly.areaEffect1)

                let effect = base.pow(amt)
                
                let softcap1 = new Decimal(0.25)
                let softcap1Start = new Decimal("1e500")

                if (effect.gte(softcap1Start)) effect = effect.pow(softcap1).mul(new Decimal(softcap1Start).pow(decimalOne.sub(softcap1))) //softcap
                
                let softcap2 = new Decimal(0.1)
                let softcap2Start = new Decimal("1e2500")

                if (effect.gte(softcap2Start)) effect = effect.pow(softcap2).mul(new Decimal(softcap2Start).pow(decimalOne.sub(softcap2))) //softcap

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
                let added = ""
                if (hasUpgrade("poly", 106)) added = "+" + format(getBuyableAmount("poly", 11).add(player.poly.areaEffect1))
                return "Multiplies Vertex gain by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
            },
            canAfford() { return player[this.layer].vertices.gte(this.cost()) },
            buy() {
                if (hasMilestone("div", 5) || hasUpgrade("pf", 123)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
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
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                if (hasUpgrade("poly", 106)) amt = amt.add(getBuyableAmount("poly", 11))
                amt = amt.add(player.poly.areaEffect1)

                let effect = base.pow(amt)
                
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
        101: {
            base() {return new Decimal("1e100")},
            exponentialBase() {
                let init = new Decimal("100")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasMilestone("div", 5)) final = final.div(buyableEffect("div", 11))

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Increase Length",
            display() {
                return "Add +" + format(tmp[this.layer].buyables[this.id].effectBase) + " to Length per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: +" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasUpgrade("ar", 34)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                let effect = base.mul(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e10")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasMilestone("div", 5)) timesBought = timesBought.mul(buyableEffect("div", 11))

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasMilestone("div", 5)) totalCost = totalCost.div(buyableEffect("div", 11))

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
            style() {
                return {
                    "height": "100px"
                }
            },
        },
        102: {
            base() {return new Decimal("1e100")},
            exponentialBase() {
                let init = new Decimal("1000")
                return init
            },
            cost(x) {
                let base = tmp[this.layer].buyables[this.id].base
                let expbase = tmp[this.layer].buyables[this.id].exponentialBase
                let multi = new Decimal(expbase).pow(x)

                let final = base.mul(multi)
                if (hasMilestone("div", 5)) final = final.div(buyableEffect("div", 11))

                return final //if you add anything to the cost formula, make sure to update the buymax()!
                //do this by using the reciprocoal function, and right after let timesBought
                //also, after the line after initializing totalCost, use it with same function
            },
            title: "Increase Width",
            display() {
                return "Add +" + format(tmp[this.layer].buyables[this.id].effectBase) + " to Width per purchase." + "\n" + "Bought: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: +" + format(this.effect())
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasUpgrade("ar", 34)){
                    let cost = tmp[this.layer].buyables[this.id].buyMax()[0]
                    let amount = tmp[this.layer].buyables[this.id].buyMax()[1]
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                } else {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effectBase() {
                let base = new Decimal(1)
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                let effect = base.mul(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e10")

                if (effect.gte(softcapStart)) effect = effect.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap

                return effect
            },
            unlocked() {return true},
            buyMax() {
                let timesBought = player[this.layer].points
                //insert cost effects here
                if (hasMilestone("div", 5)) timesBought = timesBought.mul(buyableEffect("div", 11))

                timesBought = timesBought.mul(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].base)
                timesBought = timesBought.div(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))
                timesBought = timesBought.add(1).log(tmp[this.layer].buyables[this.id].exponentialBase)
                timesBought = timesBought.floor()

                let totalCost = tmp[this.layer].buyables[this.id].base
                totalCost = totalCost.mul(tmp[this.layer].buyables[this.id].exponentialBase.pow(getBuyableAmount(this.layer, this.id)))

                //insert cost effects here
                if (hasMilestone("div", 5)) totalCost = totalCost.div(buyableEffect("div", 11))

                let polynomial = new Decimal(tmp[this.layer].buyables[this.id].exponentialBase)
                polynomial = polynomial.pow(timesBought).sub(1)
                polynomial = polynomial.div(tmp[this.layer].buyables[this.id].exponentialBase.sub(1))
                totalCost = totalCost.mul(polynomial)
                return [totalCost, timesBought]
            },
            style() {
                return {
                    "height": "100px"
                }
            },
        },
        
        201: {
            base() {return new Decimal("1e240")},
            exponentialBase() {
                let init = new Decimal("1e5")
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
            title: "Upgrade Compass",
            display() {
                let added = ""
                if (hasUpgrade("cb", 13)) added = "+" + format(player.cb.e2)
                return "Upgrading the compass level multiplies Constructor Shapes by x" + format(tmp[this.layer].buyables[this.id].effectBase) + " each purchase." + "\n" + "Level: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: x" + format(this.effect())
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
                let base = new Decimal(1.5)
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                if (hasUpgrade("cb", 13)) amt = amt.add(player.cb.e2)

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e100")

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
            style() {
                return {
                    "width": "300px",
                    "height": "100px",
                }
            },
        },
        202: {
            base() {return new Decimal("1e240")},
            exponentialBase() {
                let init = new Decimal("1e8")
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
            title: "Upgrade Straightedge",
            display() {
                let added = ""
                if (hasUpgrade("cb", 14)) added = "+" + format(player.cb.e2)
                return "Upgrading the straightedge level divides construction time by ÷" + format(tmp[this.layer].buyables[this.id].effectBase) + " each purchase." + "\n" + "Level: " + getBuyableAmount(this.layer, this.id) + added + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: ÷" + format(this.effect())
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
                let base = new Decimal(1.75)
                return base
            },
            effect(x) {
                let amt = x
                let base = tmp[this.layer].buyables[this.id].effectBase

                if (hasUpgrade("cb", 14)) amt = amt.add(player.cb.e2)

                let effect = base.pow(amt)
                
                let softcap = new Decimal(0.75)
                let softcapStart = new Decimal("1e100")

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
            style() {
                return {
                    "width": "300px",
                    "height": "100px",
                }
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
        
        11: {
            title() {return `Switch Focus`},
            display() {return `Currently constructing: ${player.poly.focus}`},
            canClick() {return true},
            onClick() {
                if (player.poly.focus == "triangles") player.poly.focus = "squares"
                else if (player.poly.focus == "squares") player.poly.focus = "pentagons"
                else if (player.poly.focus == "pentagons") player.poly.focus = "hexagons"
                else player.poly.focus = "triangles"

                tmp.poly.update()
                
                player.poly.currentTime = player.poly.baseTime
            },
            style() {
                return {
                    "width": "160px",
                    "height": "80px",
                }
            },
        },
    },

    milestones: {
        1: {
            requirementDescription: "1: 1,000 Edges",
            effectDescription: "<i>THE GREAT AUTOMATION.</i> Generate 100% of pending Fundamentality, Numbers, and Operation Power per second. Automate the first 14 Arithmetic upgrades. Automate and bulk-buy the buyables for Addition, Subtraction, and Multiplication.",
            done() { return player.poly.edges.gte("1e3") },
            unlocked() {return hasUpgrade("poly", 21) || hasUpgrade("pf", 12)},
        },
        2: {
            requirementDescription: "2: 30,000 Edges",
            effectDescription: "<i>THE GREAT EXPONENTIAL REIGN.</i> ^1.01 Points, Funda (after softcap), Nums, OP, Addition cap, Negativity, Products, and Functions (after softcap).",
            done() { return player.poly.edges.gte("3e4") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        3: {
            requirementDescription: "3: 1,000,000 Edges",
            effectDescription: "<i>THE GREAT... SOMETHING.</i> Unlock Arithmetic Challenge 4, and Type-FND Addition is converted to every tick. Keep the EP generation even if the bar is centered.",
            done() { return player.poly.edges.gte("1e6") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        4: {
            requirementDescription: "4: 1e9 Edges",
            effect(){
                let base = player.poly.edges.add(1)

                base = base.pow(0.05).add(1)
                if (hasMilestone(this.layer, 5)) base = base.pow(1.5)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDescription() { return "Automate the first 4 rows of TMT. Unlock the 5th row. Edges boost Number Cores. Currently: x" + format(milestoneEffect(this.layer, this.id)) + " to Number Cores" },
            done() { return player.poly.edges.gte("1e9") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        5: {
            requirementDescription: "5: 1e15 Edges",
            effectDescription: "Type-PRM Addition is converted to every tick. Improve the 4th Edge milestone, and it now divides Division time.",
            done() { return player.poly.edges.gte("1e15") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        6: {
            requirementDescription: "6: 1e21 Edges",
            effectDescription: "Get some QoL! Type-POINT Addition is converted to every tick. Automate the 5th row of TMT. Also, x1,000,000 OP.",
            done() { return player.poly.edges.gte("1e21") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        7: {
            requirementDescription: "7: 1e33 Edges",
            effectDescription: "The Fundamentality softcap is delayed to 1e1250 and it raises to ^0.5.",
            done() { return player.poly.edges.gte("1e33") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        8: {
            requirementDescription: "8: 1e40 Edges",
            effectDescription: "-0.2 to Division time scaling. x1.05 Division.",
            done() { return player.poly.edges.gte("1e40") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        9: {
            requirementDescription: "9: 1e56 Edges",
            effectDescription: "You're almost at the next stage! x1e10 all Ineqs. and NC. -0.04 to Division time scaling.",
            done() { return player.poly.edges.gte("1e56") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        10: {
            requirementDescription: "10: 1e65 Edges",
            effectDescription: "Unlock Area.",
            done() { return player.poly.edges.gte("1e65") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        11: {
            requirementDescription: "11: 1e72 Edges",
            effectDescription: "Unlock the 6th row of TMT and ^1.05 Number Cores.",
            done() { return player.poly.edges.gte("1e72") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        12: {
            requirementDescription: "12: 1e86 Edges",
            effectDescription: "Unlock the 7th row of TMT and ^1.05 Number Cores. Yes I just repeated the exact same milestone. BUT... x1.1 Products.",
            done() { return player.poly.edges.gte("1e86") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        13: {
            requirementDescription: "13: 1e115 Edges",
            effectDescription: "Unlock the Constructor. Automate the 6th and 7th rows of TMT, and -0.002 to Division time scaling.",
            done() { return player.poly.edges.gte("1e115") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        14: {
            requirementDescription: "14: 1e135 Edges",
            effect(){
                let base = player.poly.edges.add(1)

                base = base.pow(0.01).add(1)

                let softcap = new Decimal(0.25)
                let softcapStart = new Decimal("1e100")

                if (base.gte(softcapStart)) base = base.pow(softcap).mul(new Decimal(softcapStart).pow(decimalOne.sub(softcap))) //softcap
                return base
            },
            effectDescription() { return "Edges boost Division and all Ineqs. Currently: x" + format(milestoneEffect(this.layer, this.id)) + " to Division and Ineqs." },
            done() { return player.poly.edges.gte("1e135") },
            unlocked() { return hasMilestone(this.layer, this.id - 1)},
        },
        15: {
            requirementDescription: "15: 1e214 Edges",
            effectDescription: "This is a reference to THAT early Polygon QoL upgrade. Anyway, x125 CS, all Ineqs., and divide the Core Booster cost by ÷1e500.",
            done() { return player.poly.edges.gte("1e214") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        16: {
            requirementDescription: "16: 1e377 Edges",
            effectDescription: "THE RANDOM NUMBER IS BACK!!! Convert to Type-NCR and Type-ARH Addition every tick. Automate the 25th-28th Fundamental upgrades.",
            done() { return player.poly.edges.gte("1e377") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
        17: {
            requirementDescription: "17: 1e420 Edges",
            effectDescription: "x1e100 Number Cores.",
            done() { return player.poly.edges.gte("1e420") },
            unlocked() {return hasMilestone("poly", this.id - 1)},
        },
    },

    bars: {
        constructorTime: {
            direction: RIGHT,
            width: 600,
            height: 75,
            display() {
                let shape = "Triangles"
                if (player.poly.focus == "squares") shape = "Squares"
                if (player.poly.focus == "pentagons") shape = "Pentagons"
                if (player.poly.focus == "hexagons") shape = "Hexagons"
                let type = "t"
                if (player.poly.focus == "squares") type = "s"
                if (player.poly.focus == "pentagons") type = "p"
                if (player.poly.focus == "hexagons") type = "h"
                let text = `You will construct your next ${format(tmp.poly.findConstructorShapesMult_POLY(type))} ${shape} in ${formatTime(player.poly.currentTime)}/${formatTime(player.poly.baseTime)}`
                return text
            },
            progress() {
                let prog = player.poly.baseTime.sub(player.poly.currentTime)

                prog = prog.div(player.poly.baseTime)
                
                return prog
            },
            fillStyle() {
                let color = "rgb(51,51,255)"
                return {"background-color": color}
            },
            style() {
                return {
                    "color": "white",
                    "text-shadow": "0px 0px 5px rgb(255,255,255)",
                } 
            },
            baseStyle() {
                return {"background-color": "rgb(17,17,102)",}
            },
        },
    },

    challenges: {
        11: {
            name: "Constructor Sacrifice",
            fullDisplay() {
                let PointBase = new Decimal("1e1000")
                let FNOBase = new Decimal(1.005)
                if (hasMilestone("div", 13)) FNOBase = new Decimal(1.015)
                let CSBase = new Decimal(25)
                if (hasUpgrade("ar", 32)) CSBase = new Decimal(625)
                let progress = `Have ${format(tmp.poly.challenges[11].goal)} Points`
                if (maxedChallenge("poly", 11)) progress = "Fully Sacrificed."
                let text = `<i>"The only way to proceed is to do the unthinkable: <br><b>sacrifice the mechanic that allowed you to progress to this point in the first place.</b>"</i><br><br>
                While sacrificing your Constructor, CS effects, NC buyables, non-meta Function effects, and Area effects don't work, and you're trapped in the NNL with certain restrictions.
                Primitive buyable scaling is raised ^8, and their first softcaps start at 1 and raise by ^0.05. The Addition type cap is hardcapped at 1e50.<br><br>

                Every completion multiplies Points by x${format(PointBase)}, raises Funda, Nums, and OP to ^${format(FNOBase)} after softcap, and multiplies gain of CS by x${format(CSBase)}.<br><br>

                <b>Goal: ${progress}<b><br>
                <b>Currently: ${challengeCompletions(this.layer, this.id) * 10}% Sacrificed<b><br>
                <b>Effects: x${format(tmp.poly.challenges[11].rewardEffect[0])} Points, ^${format(tmp.poly.challenges[11].rewardEffect[1])} Funda, Nums, OP, x${format(tmp.poly.challenges[11].rewardEffect[2])} CS<b><br><br>

                <i>At 40% Sacrificed, unlock a third row of Arithmetic upgrades. The new row is kept until the next layer.</i><br>
                <i>At 80% Sacrificed, unlock a Number Core buyable. The new buyable is kept until the next layer.</i><br>
                <i>At 100% Sacrificed, passively construct the Constructor Shapes and unlock the next layer.</i><br>
                `
                return text
            },
            completionLimit: 10,
            rewardEffect() {
                let base = challengeCompletions(this.layer, this.id)

                let pointBoostBase = new Decimal("1e1000")
                let pointBoost = new Decimal(pointBoostBase).pow(base)
                
                let FNOBoostBase = new Decimal(1.005)
                if (hasMilestone("div", 13)) FNOBoostBase = new Decimal(1.015)
                let FNOBoost = new Decimal(FNOBoostBase).pow(base)

                let CSBoostBase = new Decimal(25)
                if (hasUpgrade("ar", 32)) CSBoostBase = CSBoostBase.pow(2)
                let CSBoost = CSBoostBase.pow(base)

                return [pointBoost, FNOBoost, CSBoost]
            },
            canComplete: function() {return player.points.gte(tmp[this.layer].challenges[this.id].goal)},
            goal() {
                let base = [
                    new Decimal("1e5400"),
                    new Decimal("1e6550"),
                    new Decimal("1e8400"),
                    new Decimal("1e10100"),
                    new Decimal("1e12350"),
                    new Decimal("1e14000"),
                    new Decimal("1e23450"),
                    new Decimal("1e25900"),
                    new Decimal("1e28100"),
                    new Decimal("1e33500"),
                ]

                return base[challengeCompletions(this.layer, this.id)]
            },
            unlocked() {return hasMilestone("div", 9)},
            style() {
                if (!hasChallenge(this.layer, this.id)) return {
                    "width": "700px",
                    "height": "480px",
                }
                if (hasChallenge(this.layer, this.id)) return {
                    "width": "700px",
                    "height": "480px",
                    "background": "#77bf5f",
                }
            },
            onEnter() {
                setClickableState("sub", 11, true)
                setClickableState("sub", 12, false)
                setClickableState("sub", 13, false)
                setClickableState("sub", 14, false)

                setClickableState("sub", 21, false)
                setClickableState("sub", 22, true)
                setClickableState("sub", 23, true)
                setClickableState("sub", 24, false)

                setClickableState("sub", 31, true)
                setClickableState("sub", 32, false)
                setClickableState("sub", 33, false)
                setClickableState("sub", 34, true)

                setClickableState("sub", 41, false)
                setClickableState("sub", 42, false)
                setClickableState("sub", 43, false)
                setClickableState("sub", 44, false)
                
                setClickableState("sub", 1001, true)
                player.sub.negativityGain = new Decimal(0)
                player.sub.currentGain = new Decimal(0)
            },
            onExit() {
                setClickableState("sub", 1001, false)
            },
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
        if (hasUpgrade("poly", 106)) mult = mult.mul("1e6")
        if (hasChallenge("ar", 21)) mult = mult.mul(player.ar.functionE8)
        if (hasUpgrade("poly", 25)) mult = mult.mul(upgradeEffect("poly", 25))
        if (hasUpgrade("div", 11)) mult = mult.mul(100)
        if (hasUpgrade("poly", 114)) mult = mult.mul(upgradeEffect("poly", 114))
        if (hasUpgrade("sub", 24)) mult = mult.mul("1e10")
        if (hasMilestone("div", 4)) mult = mult.mul("1e15")
        if (hasUpgrade("mul", 71)) mult = mult.mul("1e100")
        if (player.poly.area.gte(54667)) mult = mult.mul(player.poly.areaEffect6)
        if (hasMilestone("div", 8)) mult = mult.mul("1e50")
        if (player.d.points.gte(4)) mult = mult.mul("1e10")
        
        if (hasUpgrade("poly", 202)) mult = mult.pow(1.05)

        player.poly.vertCap = mult
        
        //gain
        mult = new Decimal(1)
        
        mult = mult.mul(buyableEffect("poly", 13))

        player.poly.vertGain = mult
        if (hasUpgrade("poly", 11) || hasUpgrade("pf", 12)) player.poly.vertices = Decimal.min(player.poly.vertices.add(player.poly.vertGain.times(diff)), player.poly.vertCap)

        //edges
        //gain
        mult = new Decimal(1)

        mult = mult.mul(player.poly.vertices.add(1).pow(0.1))
        if (hasUpgrade("poly", 117)) mult = mult.mul(mult.pow(0.05))
        
        if (hasChallenge("ar", 21)) mult = mult.mul(player.ar.functionE8)
        if (hasUpgrade("poly", 204)) mult = mult.mul(100)
        if (hasUpgrade("div", 12)) mult = mult.mul(upgradeEffect("div", 12))
        if (hasUpgrade("poly", 206)) mult = mult.mul(upgradeEffect("poly", 206))
        if (hasUpgrade("poly", 113)) mult = mult.mul(upgradeEffect("mul", 51))
        if (hasUpgrade("sub", 24)) mult = mult.mul("1e10")
        if (hasUpgrade("poly", 116)) mult = mult.mul(upgradeEffect("poly", 116))
        if (hasUpgrade("mul", 71)) mult = mult.mul(10000)
        if (hasUpgrade("poly", 211)) mult = mult.mul(upgradeEffect("poly", 211))
        if (player.poly.area.gte(54667)) mult = mult.mul(player.poly.areaEffect6)
        if (player.d.points.gte(4)) mult = mult.mul("1e10")
        if (hasUpgrade("cb", 15)) mult = mult.mul(player.cb.e3)
        if (hasUpgrade("poly", 117)) mult = mult.mul(mult.add(1).log(2))
        if (hasUpgrade("pf", 12)) mult = mult.mul(100)

        if (hasUpgrade("div", 25)) mult = mult.pow(1.1)
            
        player.poly.edgeGain = mult
        if (hasUpgrade("poly", 21) || hasUpgrade("pf", 12)) player.poly.edges = player.poly.edges.add(player.poly.edgeGain.times(diff))

        //length width area
        //length
        mult = new Decimal(1)

        mult = mult.add(buyableEffect("poly", 101))

        player.poly.polyLength = mult
        
        //width
        mult = new Decimal(1)

        mult = mult.add(buyableEffect("poly", 102))

        player.poly.polyWidth = mult
        
        //area
        let m1 = player.poly.polyWidth
        let m2 = player.poly.polyLength

        if (hasUpgrade("ar", 34)) m2 = m2.mul(1.2)
        if (hasUpgrade("poly", 213)) m2 = m2.mul(2.13)

        if (hasUpgrade("mul", 61)) m1 = m1.pow(1.1)
        if (hasUpgrade("mul", 61)) m2 = m2.pow(1.1)

        mult = m1.mul(m2)

        if (hasUpgrade("ar", 37)) mult = mult.mul(3)

        player.poly.area = Decimal.ceil(mult)

        //area effects
        //1
        mult = player.poly.area.sub(1)

        mult = mult.pow(0.75)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        let softcapAE11 = new Decimal(0.25)
        let softcapAE11Start = new Decimal("100")

        if (mult.gte(softcapAE11Start)) mult = mult.pow(softcapAE11).mul(new Decimal(softcapAE11Start).pow(decimalOne.sub(softcapAE11))) //softcap
        
        if (!inChallenge("poly", 11)) player.poly.areaEffect1 = mult
        else player.poly.areaEffect1 = new Decimal(1)
        
        //2
        mult = player.poly.area

        mult = mult.pow(1.125)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)
        
        if (!inChallenge("poly", 11)) player.poly.areaEffect2 = mult
        else player.poly.areaEffect2 = new Decimal(1)
        
        //3
        mult = player.poly.area

        mult = mult.log("1e6").add(1)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)
        
        if (!inChallenge("poly", 11)) player.poly.areaEffect3 = mult
        else player.poly.areaEffect3 = new Decimal(1)
        
        //4
        mult = player.poly.area

        mult = mult.log("1e50").add(1)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)
        
        if (!inChallenge("poly", 11)) player.poly.areaEffect4 = mult
        else player.poly.areaEffect4 = new Decimal(1)
        
        //5
        mult = player.poly.area

        mult = mult.pow(15)
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)

        let softcapAE51 = new Decimal(0.25)
        let softcapAE51Start = new Decimal("1e1000")

        if (mult.gte(softcapAE51Start)) mult = mult.pow(softcapAE51).mul(new Decimal(softcapAE51Start).pow(decimalOne.sub(softcapAE51))) //softcap
        
        if (!inChallenge("poly", 11)) player.poly.areaEffect5 = mult
        else player.poly.areaEffect5 = new Decimal(1)
        
        //6
        mult = player.poly.area

        mult = mult.pow(4).pow(mult.log("1e10").add(1))
        if (player.poly.area.gte(347163)) mult = mult.pow(player.poly.areaMeta1)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)
        
        if (!inChallenge("poly", 11)) player.poly.areaEffect6 = mult
        else player.poly.areaEffect6 = new Decimal(1)
        
        //meta 1
        mult = player.poly.area

        mult = mult.pow(0.001)
        if (player.poly.area.gte(1735105)) mult = mult.pow(player.poly.areaMeta2)
        
        player.poly.areaMeta1 = mult
        
        //meta 2
        mult = player.poly.area

        mult = mult.pow(0.002)
        
        player.poly.areaMeta2 = mult

    
        //automation
        let automationBooleanBuyable = false

        if (hasMilestone("div", 5)) automationBooleanBuyable = true
        if (hasUpgrade("pf", 123)) automationBooleanBuyable = true

        if (automationBooleanBuyable){
            let layer = "poly"
            let list = [11, 12, 13]
            if (hasUpgrade("ar", 34)) list.push(101, 102)
            for (const id of list){
                if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                    tmp[layer].buyables[id].buy()
                }
            }
        }

        let automationBooleanUpgrade = false

        if (hasUpgrade("pf", 123)) automationBooleanUpgrade = true

        if (automationBooleanUpgrade){
            let layer = "poly"
            let list = [101, 102, 103, 104, 105, 106, 107, 111, 112, 113, 114, 115, 116, 117]
            if (hasUpgrade("pf", 124)){
                if (hasUpgrade("pf", 123)) list.push(11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 201, 202, 203, 204, 205, 206, 207, 211, 212, 213, 214, 215, 216, 217)
                else list = [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 201, 202, 203, 204, 205, 206, 207, 211, 212, 213, 214, 215, 216, 217]
            }
            for (const id of list){
                if (!hasUpgrade(layer, id) && canAffordUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked) buyUpgrade(layer, id)
            }
        }

        //constructor
        //find base time
        mult = new Decimal(30)
        mult = mult.div(buyableEffect("poly", 202))

        if (mult.gte(1) && hasMilestone("div", 8)) mult = mult.pow(0.75)

        if (player.poly.focus == "squares"){
            mult = new Decimal(600)
            mult = mult.div(buyableEffect("poly", 202))

            if (mult.gte(1) && hasMilestone("div", 8)) mult = mult.pow(0.75)
        }
        if (player.poly.focus == "pentagons"){
            mult = new Decimal(14400)
            mult = mult.div(buyableEffect("poly", 202))

            if (mult.gte(1) && hasMilestone("div", 8)) mult = mult.pow(0.75)
        }
        if (player.poly.focus == "hexagons"){
            mult = new Decimal(86400)
            mult = mult.div(buyableEffect("poly", 202))

            if (mult.gte(1) && hasMilestone("div", 8)) mult = mult.pow(0.75)
        }
        player.poly.baseTime = mult

        //function time
        if (hasMilestone("poly", 13) || hasUpgrade("pf", 12)){
            let mult = new Decimal(1)
            //add "timewarp" boosts here
            if (hasUpgrade("poly", 217)) mult = mult.mul(3)
            if (hasUpgrade("pf", 12)) mult = mult.mul(50)

            player.poly.currentTime = Decimal.min(player.poly.currentTime.sub(mult.mul(diff)), player.poly.baseTime)

            //is it done?
            if (player.poly.currentTime.lte(0)){
                player.poly.currentTime = player.poly.baseTime
                if (player.poly.focus == "squares") player.poly.squares = player.poly.squares.add(tmp.poly.findConstructorShapesMult_POLY("s"))
                else if (player.poly.focus == "pentagons") player.poly.pentagons = player.poly.pentagons.add(tmp.poly.findConstructorShapesMult_POLY("p"))
                else if (player.poly.focus == "hexagons") player.poly.hexagons = player.poly.hexagons.add(tmp.poly.findConstructorShapesMult_POLY("h"))
                else player.poly.triangles = player.poly.triangles.add(tmp.poly.findConstructorShapesMult_POLY("t"))
            }

            //softcaps
            let softcapTrianglesEffect11 = new Decimal(0.25)
            let softcapTrianglesEffect1Start = new Decimal("1e100")
            
            let softcapPentagonsEffect11 = new Decimal(0.5)
            let softcapPentagonsEffect1Start = new Decimal("1.25")

            //effects
            mult = player.poly.triangles.add(1)
            mult = mult.pow(25).log(1.001).add(1).pow(8)
            if (hasMilestone("div", 12)) mult = mult.pow(5)
            
            if (mult.gte(softcapTrianglesEffect1Start)) mult = mult.pow(softcapTrianglesEffect11).mul(new Decimal(softcapTrianglesEffect1Start).pow(decimalOne.sub(softcapTrianglesEffect11))) //softcap
            if (!inChallenge("poly", 11)) player.poly.trianglesEffect1 = mult
            else player.poly.trianglesEffect1 = new Decimal(1)
            //
            mult = player.poly.squares.add(1)
            mult = mult.pow(20).log(1.01).add(1).pow(2.2).mul(mult.pow(0.25)).pow(mult.log(100).div(20).add(1))
            
            if (!inChallenge("poly", 11)) player.poly.squaresEffect1 = mult
            else player.poly.squaresEffect1 = new Decimal(1)
            //
            mult = player.poly.pentagons.add(1)
            mult = mult.pow(0.05).log(100).add(1)
            
            if (mult.gte(softcapPentagonsEffect1Start)) mult = mult.pow(softcapPentagonsEffect11).mul(new Decimal(softcapPentagonsEffect1Start).pow(decimalOne.sub(softcapPentagonsEffect11))) //softcap
            if (!inChallenge("poly", 11)) player.poly.pentagonsEffect1 = mult
            else player.poly.pentagonsEffect1 = new Decimal(1)
            //
            mult = player.poly.hexagons.add(1)
            mult = mult.pow(0.01).log(1000000).add(1)
            
            if (!inChallenge("poly", 11)) player.poly.hexagonsEffect1 = mult
            else player.poly.hexagonsEffect1 = new Decimal(1)
            
            mult = player.poly.hexagons.add(1)
            mult = mult.pow(0.02).log(10000).add(1)
            if (hasUpgrade("ar", 32)) mult = mult.pow(1.25)
            
            if (!inChallenge("poly", 11)) player.poly.hexagonsEffect2 = mult
            else player.poly.hexagonsEffect2 = new Decimal(1)
        }

        //sacrifice
        if (maxedChallenge("poly", 11)){
            player.poly.triangles = player.poly.triangles.add(tmp.poly.findConstructorShapesMult_POLY("t"))
            player.poly.squares = player.poly.squares.add(tmp.poly.findConstructorShapesMult_POLY("s"))
            player.poly.pentagons = player.poly.pentagons.add(tmp.poly.findConstructorShapesMult_POLY("p"))
            player.poly.hexagons = player.poly.hexagons.add(tmp.poly.findConstructorShapesMult_POLY("h"))
        }

        mult = new Decimal(0.25)
        player.add.softcap1 = mult
        
        mult = new Decimal("1e1000")
        player.add.softcap1Start = mult
    },

    glowColor() {
        let layer = "poly"
        if (tmp.poly.challenges[11].canComplete && inChallenge(layer, 11)) return "red"
        for (id in tmp[layer].upgrades){
            if (isPlainObject(layers[layer].upgrades[id])){
                if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
                    return "red"
                }
            }
        }
        for (const id of [11, 12, 13, 101, 102, 201, 202]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return "cyan"
            }
        }

        return ""
    },
    shouldNotify() {
        let layer = "poly"
        if (tmp.poly.challenges[11].canComplete && inChallenge(layer, 11)) return true
        for (const id of [11, 12, 13, 101, 102, 201, 202]) {
            if (canBuyBuyable(layer, id) && tmp[layer].buyables[id].unlocked) {
                return true
            }
        }
        return false
    },

    branches: [["pf", 1]],
    tooltip() {return format(player.poly.points) + " Shapes (+" + format(getResetGain("poly")) + " Shapes on reset)"},
})