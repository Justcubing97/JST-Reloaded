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
        ["display-text", "<b>Tier 0 Points is a product of all important currencies along with challenge multipliers, buyable effects, and other things.</b>"],
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
        ["display-text", "Contributions:"],
        "blank",
        ["display-text", function(){return `Points: x${format(player.points.add(1))}`}],

        ["display-text", function(){return `<span style="color: rgb(255,204,0)">Fundamentality: x${format(player.f.points.add(1).pow(1.1))}</span>`}],

        ["display-text", function(){return `<span style="color: rgb(0,204,255)">Numbers: x${format(player.p.points.add(1).pow(1.25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(153,204,255)">Fundamental Acceleration (Primitive buyable): x${format(buyableEffect("p", 11).pow(1.05))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(153,204,255)">Rapid Generation (Primitive buyable): x${format(buyableEffect("p", 12).pow(1.05))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(153,204,255)">Duplication Machine (Primitive buyable): x${format(buyableEffect("p", 13).pow(1.05))}</span>`}],

        ["display-text", function(){return `<span style="color: rgb(255,0,102)">Operation Power: x${format(player.ar.points.add(1).pow(1.5))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,0,102)">Equation Points: x${format(player.ar.eqPoints.add(1).pow(2))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,204,153)">Fundamental Variables: x${format(player.ar.fundaVariables.add(1).pow(1.4))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(153,204,255)">Primitive Variables: x${format(player.ar.primVariables.add(1).pow(1.4))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,153,255)">Less-Than Inequalities: x${format(player.ar.LT.add(1).pow(2.25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,170,220)">Less-Equal-Than Inequalities: x${format(player.ar.LTE.add(1).pow(2.25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,187,187)">Greater-Equal-Than Inequalities: x${format(player.ar.GTE.add(1).pow(2.25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,204,153)">Greater-Than Inequalities: x${format(player.ar.GT.add(1).pow(2.25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(204,0,80)">Functions: x${format(player.ar.arFunction.add(1).pow(1.5))}</span>`}],
        ["display-text", function(){
            if (hasChallenge("ar", 11)) return `<span style="color: rgb(255,0,102)">Arithmetic Challenge 1: x1.000e100</span>`
            return `<span style="color: rgb(255,0,102)">Arithmetic Challenge 1: x1.000</span>`
        }],
        ["display-text", function(){
            if (hasChallenge("ar", 12)) return `<span style="color: rgb(255,0,102)">Arithmetic Challenge 2: x1.000e200</span>`
            return `<span style="color: rgb(255,0,102)">Arithmetic Challenge 2: x1.000</span>`
        }],
        ["display-text", function(){
            if (hasChallenge("ar", 13)) return `<span style="color: rgb(255,0,102)">Arithmetic Challenge 3: x1.000e300</span>`
            return `<span style="color: rgb(255,0,102)">Arithmetic Challenge 3: x1.000</span>`
        }],

        ["display-text", function(){return `<span style="color: rgb(255,153,255)">Addition: x${format(player.add.points.add(1).pow(1.75))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255, 227, 128)">Type-FND Addition: x${format(player.add.additionTypeFunda.add(1).pow(3))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(128, 227, 255)">Type-PRM Addition: x${format(player.add.additionTypePrim.add(1).pow(3))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255, 255, 255)">Type-POINT Addition: x${format(player.add.additionTypePoint.add(1).pow(3))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,204,255)">Multi Boost (Addition buyable): x${format(buyableEffect("add", 11).pow(5))}</span>`}],
        
        ["display-text", function(){return `<span style="color: rgb(255,153,255)">Subtraction: x${format(player.sub.points.add(1).pow(2.5))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(204,153,204)">Negativity: x${format(player.sub.negativity.add(1).pow(25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,204,255)">Inversion (Subtraction buyable): x${format(buyableEffect("sub", 11).pow(10))}</span>`}],
        
        ["display-text", function(){return `<span style="color: rgb(255,153,255)">Multiplication: x${format(player.mul.points.add(1).pow(25))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,153,255)">Products: x${format(player.mul.points.add(1).pow(15))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(255,204,255)">Distributive Property (Subtraction buyable): x${format(buyableEffect("mul", 11).pow(15))}</span>`}],
        
        ["display-text", function(){return `<span style="color: rgb(204, 255, 204)">Dimensions: x${format(new Decimal("1e10").pow(new Decimal(10).pow(player.d.points)))}</span>`}],
        
        ["display-text", function(){return `<span style="color: rgb(51,51,255)">Shapes: x${format(player.poly.points.add(1).pow(5))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(102,153,255)">Vertices: x${format(player.poly.vertices.add(1).pow(3.5))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(204,204,255)">n-gon Expander (Vertex buyable): x${format(buyableEffect("poly", 11).pow(50))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(204,204,255)">Point-Slope Form (Vertex buyable): x${format(buyableEffect("poly", 12).pow(3))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(204,204,255)">Time Dilation (Vertex buyable): x${format(buyableEffect("poly", 13).pow(20))}</span>`}],
        ["display-text", function(){return `<span style="color: rgb(102,51,255)">Edges: x${format(player.poly.edges.add(1).pow(15))}</span>`}],
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
        if (player.add.additionTypePoint.gte(1)) player.ls.t0 = player.ls.t0.mul(player.add.additionTypePoint.add(1).pow(3))
        if (buyableEffect("add", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("add", 11).pow(5))
            
        if (player.sub.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.sub.points.add(1).pow(2.5))
        if (player.sub.negativity.gte(1)) player.ls.t0 = player.ls.t0.mul(player.sub.negativity.add(1).pow(25))
        if (buyableEffect("sub", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("sub", 11).pow(10))
            
        if (player.mul.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.mul.points.add(1).pow(25))
        if (player.mul.productsTotal.gte(1)) player.ls.t0 = player.ls.t0.mul(player.mul.productsTotal.add(1).pow(15))
        if (buyableEffect("mul", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("mul", 11).pow(15))
            
        if (player.d.points.gte(1)) player.ls.t0 = player.ls.t0.mul(new Decimal("1e10").pow(new Decimal(10).pow(player.d.points)))
            
        if (player.poly.points.gte(1)) player.ls.t0 = player.ls.t0.mul(player.poly.points.add(1).pow(5))
        if (player.poly.vertices.gte(1)) player.ls.t0 = player.ls.t0.mul(player.poly.vertices.add(1).pow(3.5))
        if (buyableEffect("poly", 11).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("poly", 11).pow(50))
        if (buyableEffect("poly", 12).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("poly", 12).pow(3))
        if (buyableEffect("poly", 13).gte(1)) player.ls.t0 = player.ls.t0.mul(buyableEffect("poly", 13).pow(20))
        if (player.poly.edges.gte(1)) player.ls.t0 = player.ls.t0.mul(player.poly.edges.add(1).pow(15))
        
        //=====
        if (player.ls.t0.gt(0)) player.ls.t1 = player.ls.t0.add(1).log(10)
        if (player.ls.t1.gt(0)) player.ls.t2 = player.ls.t1.add(1).log(10)
        if (player.ls.t2.gt(0)) player.ls.t3 = player.ls.t2.add(1).log(10)
        if (player.ls.t3.gt(0)) player.ls.t4 = player.ls.t3.add(1).log(10)
        if (player.ls.t4.gt(0)) player.ls.t5 = player.ls.t4.add(1).log(10)
        if (player.ls.t5.gt(0)) player.ls.t6 = player.ls.t5.add(1).log(10)
    },
})