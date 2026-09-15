addLayer("ls", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),

        t0: new Decimal(0),
        t1: new Decimal(0),
        t2: new Decimal(0),
        t3: new Decimal(0),
        t4: new Decimal(0),
        t5: new Decimal(0),
        t6: new Decimal(0),
    }},
    color: "rgb(97,97,97)",
    resource: "Achievement Power",
    row: "side",
    position: 1,
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Logarithmic Scale")
    },
    symbol: "log",
    tabFormat: [
        ["display-text", "<h3>The Logarithmic Scale"],
        ["display-text", "Basically, this is another way to track your progress in JST:R."],
        ["display-text", "This feature is native to JST:R and does not appear in JST."],
        ["display-text", "Each tier is determined by the log10() of the tier below it."],
        "blank",
        ["display-text", "<b>Tier 0 Points is a product of all important currencies along with challenge multipliers.</b>"],
        "blank",
        "h-line",
        "blank",
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t0)}</h2> Tier 0 Points`}],
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t1)}</h2> Tier 1 Points`}],
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t2)}</h2> Tier 2 Points`}],
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t3)}</h2> Tier 3 Points`}],
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t4)}</h2> Tier 4 Points`}],
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t5)}</h2> Tier 5 Points`}],
        ["display-text", function(){return `You have <h2 style="color: rgb(97, 97, 97); text-shadow: 0px 0px 10px rgb(97, 97, 97)">${format(player.ls.t6)}</h2> Tier 6 Points`}],
        "blank",
        "h-line",
        "blank",
        ["display-text", function(){
            let text = "Tier 0 Points formula:<br>" + 
            "Points * (Funda + 1)<sup>1.1</sup> * (Nums + 1)<sup>1.25</sup>" +
            " * (\"Fundamental Acceleration\" effect + 1)<sup>1.05</sup>" +
            " * (\"Rapid Generation\" effect + 1)<sup>1.05</sup>" +
            " * (\"Duplication Machine\" effect + 1)<sup>1.05</sup>" +
            " * (OP + 1)<sup>1.5</sup>" +
            " * (EP + 1)<sup>2</sup>" +
            " * (FV + 1)<sup>1.4</sup>" +
            " * (PV + 1)<sup>1.4</sup>" +
            " * (LT + 1)<sup>2.25</sup>" +
            " * (LTE + 1)<sup>2.25</sup>" +
            " * (GTE + 1)<sup>2.25</sup>" +
            " * (GT + 1)<sup>2.25</sup>" +
            " * (FN + 1)<sup>1.5</sup>" +
            " * 1e100 (if AC1 completed)" +
            " * 1e200 (if AC2 completed)" +
            " * 1e300 (if AC3 completed)" +
            " * (Add + 1)<sup>1.75</sup>" +
            " * (Add-FND + 1)<sup>3</sup>" +
            " * (Add-PRM + 1)<sup>3</sup>" +
            " * (Add-POINT + 1)<sup>5</sup>" +
            " * (Sub + 1)<sup>2.5</sup>" +
            " * (Neg + 1)<sup>25</sup>" +
            " * (\"Multi Boost\" effect + 1)<sup>5</sup>" +
            " * (\"Inversion\" effect + 1)<sup>10</sup>" +
            " * (Mul + 1)<sup>25</sup>" +
            " * (Prod Total + 1)<sup>15</sup> (if at least 1)" +
            " * 1e10^10^<sup>Dimensions</sup> (if at least 1)" +
            " * (Shapes + 1)<sup>5</sup>"

            return text
        }],
    ],

    update(diff){
        player.ls.t0 = player.points
        if (player.f.points.add(1).gte(1)) player.ls.t0 = player.ls.t0.mul(player.f.points.add(1).pow(1.1))

        if (player.p.points.add(1).gte(1)) player.ls.t0 = player.ls.t0.mul(player.p.points.add(1).pow(1.25))
        if (buyableEffect("p", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("p", 11).pow(1.05))
        if (buyableEffect("p", 12).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("p", 12).pow(1.05))
        if (buyableEffect("p", 13).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("p", 13).pow(1.05))

        if (player.ar.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.points.add(1).pow(1.5))
        if (player.ar.eqPoints.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.eqPoints.add(1).pow(2))
        if (player.ar.fundaVariables.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.fundaVariables.add(1).pow(1.4))
        if (player.ar.primVariables.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.primVariables.add(1).pow(1.4))
        
        if (player.ar.LT.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.LT.add(1).pow(2.25))
        if (player.ar.LTE.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.LTE.add(1).pow(2.25))
        if (player.ar.GTE.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.GTE.add(1).pow(2.25))
        if (player.ar.GT.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.GT.add(1).pow(2.25))
        if (player.ar.arFunction.gte(1)) player.ls.t0 = player.ls.t0.mul(player.ar.arFunction.add(1).pow(1.5))
            
        if (hasChallenge("ar", 11)) player.ls.t0 = player.ls.t0.mul("1e100")
        if (hasChallenge("ar", 12)) player.ls.t0 = player.ls.t0.mul("1e200")
        if (hasChallenge("ar", 13)) player.ls.t0 = player.ls.t0.mul("1e300")
            
        if (player.add.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.add.points.add(1).pow(1.75))
        if (player.add.additionTypeFunda.gte(1)) player.ls.t0 = player.ls.t0.mul(player.add.additionTypeFunda.add(1).pow(3))
        if (player.add.additionTypePrim.gte(1)) player.ls.t0 = player.ls.t0.mul(player.add.additionTypePrim.add(1).pow(3))
        if (player.add.additionTypePoint.gte(1)) player.ls.t0 = player.ls.t0.mul(player.add.additionTypePoint.add(1).pow(5))
        if (buyableEffect("add", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("add", 11).pow(5))
            
        if (player.sub.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.sub.points.add(1).pow(2.5))
        if (player.sub.negativity.gte(1)) player.ls.t0 = player.ls.t0.mul(player.sub.negativity.add(1).pow(25))
        if (buyableEffect("sub", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("sub", 11).pow(10))
            
        if (player.sub.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.sub.points.add(1).pow(2.5))
            
        if (player.mul.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.mul.points.add(1).pow(25))
        if (player.mul.productsTotal.gte(1)) player.ls.t0 = player.ls.t0.mul(player.mul.productsTotal.add(1).pow(15))
            
        if (player.d.points.gte(1)) player.ls.t0 = player.ls.t0.mul(new Decimal("1e10").pow(new Decimal(10).pow(player.d.points)))
            
        if (player.poly.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.poly.points.add(1).pow(5))
        
        //=====
        if (player.ls.t0.gt(0)) player.ls.t1 = player.ls.t0.add(1).log(10)
        if (player.ls.t1.gt(0)) player.ls.t2 = player.ls.t1.add(1).log(10)
        if (player.ls.t2.gt(0)) player.ls.t3 = player.ls.t2.add(1).log(10)
        if (player.ls.t3.gt(0)) player.ls.t4 = player.ls.t3.add(1).log(10)
        if (player.ls.t4.gt(0)) player.ls.t5 = player.ls.t4.add(1).log(10)
        if (player.ls.t5.gt(0)) player.ls.t6 = player.ls.t5.add(1).log(10)
    },
})