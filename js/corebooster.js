addLayer("cb", {
    name: "cb", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CBT", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        e1: new Decimal(1),
        e2: new Decimal(1),
        e3: new Decimal(1),
    }},
    color: "rgb(153,255,0)",
    requires: new Decimal("1e520"), // Can be a function that takes requirement increases into account
    resource: "Core Boosters", // Name of prestige currency
    baseResource: "Number Cores", // Name of resource prestige is based on
    baseAmount() {return player.nc.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(5)

        if (hasUpgrade("cb", 14)) exp = exp.sub(1) //gives 4
        if (hasUpgrade("ar", 35)) exp = exp.sub(0.5) //gives 3.5

        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        //to lower the cost of cb, use the RECIP function so mul -> div, do 1/pow, etc.
        let layer;
        let mult = new Decimal(1)
        //add
        //mul
        layer = "ar"
        if (hasMilestone(layer, 15)) mult = mult.div(player.ar.functionE10)

        layer = "poly"
        if (player.poly.area.gte(9641)) mult = mult.div(player.poly.areaEffect5)
        if (hasMilestone(layer, 15)) mult = mult.div("1e500")

        layer = "d"
        if (player.d.points.gte(4)) mult = mult.div("1e200")
        //exp 
        //other hypers
        //time dilations/chals
        //final
        return mult
    }, //primary multi
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [ //use shift for currencies, regulars for minigames
        {key: "c", description: "C: Reset for Core Boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (hasUpgrade("sub", 27)) player.cb.unlocked = true
        return player.cb.unlocked
    },
    autoPrestige() {return false}, //use autoPrestige() if static!
    doReset(resettingLayer) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (resettingLayer == "cb") doReset("poly", true)
        if (layers[resettingLayer].row <= this.row) return;

        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
        let keptUpgrades = []

        let keptBuyables = []

        // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
        let keep = ["points", "upgrades"];

        if (resettingLayer == "pf"){
            keep = []
        }

        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);

        // Stage 5, add back in the specific subfeatures you saved earlier
    }, //THANK YOU ESCAPEE FROM THE TMT SERVER
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function(){return `You have <h2 style="color: rgb(153,255,0); text-shadow: 0px 0px 10px rgb(153,255,0)">${format(player.cb.points)}</h2> Core Boosters (CB)`}],
                "prestige-button",
                ["blank", "4px"],
                ["display-text", function(){return `You have ${format(player.nc.points)} Number Cores.`}],
                "blank",
                "h-line",
                "blank",
                ["display-text", `Resetting for Core Boosters will cause a Polygon reset!`],
                "blank",
                ["display-text", `Core Booster effects:`],
                ["display-text", function(){if (hasUpgrade("cb", 11)) return `Core Boosters are multiplying Shapes and Division by x${format(player.cb.e1)}`}],
                ["display-text", function(){
                    let extra = ""
                    if (hasUpgrade("cb", 14)) extra = " and Straightedge"
                    if (hasUpgrade("cb", 13)) return `Core Boosters add to the Compass${extra} level by +${format(player.cb.e2)}`
                }],
                ["display-text", function(){if (hasUpgrade("cb", 15)) return `Core Boosters are multiplying Edges and CS by x${format(player.cb.e3)}`}],
                "blank",
                "h-line",
                "blank",
                "upgrades",
            ],
        },
    },
    upgrades: {
        11: {
            title: "Another Static Layer?",
            description: "^1.05 OP and Nums after softcap. Unlock an effect of Core Boosters.",
            cost: new Decimal("2"),
        },
        12: {
            title: "UNDER/OVER OPERATIONS",
            description: "Add crazy amounts to the bases of the operation buyables.",
            tooltip: "More specifically, \"Multi Boost\", \"Inversion\", \"Distributive Property\", and \"Timewall Bypass\".",
            cost: new Decimal("4"),
        },
        13: {
            title: "Degrees, Minutes, Seconds",
            description: "Unlock an effect of Core Boosters. x2.5 CS. Unlock the 8th row of TMT.",
            cost: new Decimal("5"),
        },
        14: {
            title: "SI Units",
            description: "The second effect of CBs is improved, and also affects the Straightedge. -1 to Core Booster cost exponent.",
            cost: new Decimal("6"),
        },
        15: {
            title: "Unlock Unlock Unlock",
            description: "Unlock an effect of Core Boosters, a meta-effect of Functions, and a 2nd row of Division upgrades.",
            cost: new Decimal("9"),
        },
        16: {
            title: "Speed Booster",
            description: "Time in Division passes by x25 faster, and -0.00001 to Division time scaling.",
            cost: new Decimal("10"),
        },
        17: {
            title: "Super Construction",
            description: "^1.15 Hexagons. x100 Pentagons as well.",
            cost: new Decimal("15"),
        },
    },

    update(diff){
        let mult = new Decimal(1)

        //e1
        mult = player.cb.points.add(1)

        mult = mult.pow(new Decimal(1).div(3))
        if (hasUpgrade("ar", 35)) mult = mult.pow(5)

        player.cb.e1 = mult
        //e2
        mult = player.cb.points.add(1)

        mult = mult.log(4).div(4)
        if (hasUpgrade("cb", 14)) mult = mult.mul(3)

        player.cb.e2 = mult
        //e3
        mult = player.cb.points.add(1)

        mult = mult.pow(2.5).mul(mult.log(2).add(1))

        player.cb.e3 = mult
    },

    tooltip() {
        if (!canReset("cb")) return format(player.cb.points) + " Core Boosters (next at " + format(getNextAt("cb")) + " Number Cores)"
        return format(player.cb.points) + " Core Boosters (+" + format(getResetGain("cb")) + " Core Boosters)"
    },
})