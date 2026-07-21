addLayer("ddrm", {
    startData() { return {
        unlocked: false,
        points: new Decimal(0),

        marvelous: new Decimal(0),
        mEffect: new Decimal(1),
        great: new Decimal(0),
        gEffect: new Decimal(1),
        almost: new Decimal(0),
        aEffect: new Decimal(1),
        miss: new Decimal(0),

        combo: new Decimal(0),
        highestCombo: new Decimal(0),
        cEffect: new Decimal(0),    

        current: [],
        timer: 0,
        paused: false,
    }},
	color: "#C70078",
    symbol: "👯",

    resource: "Hits", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Dance Dance Revolution Minigame")
    },

    hotkeys: [
        {key: "ArrowLeft", onPress(){tmp.ddrm.arrowClicking_DDRM(1)}},
        {key: "ArrowDown", onPress(){tmp.ddrm.arrowClicking_DDRM(2)}},
        {key: "ArrowUp", onPress(){tmp.ddrm.arrowClicking_DDRM(3)}},
        {key: "ArrowRight", onPress(){tmp.ddrm.arrowClicking_DDRM(4)}},
        {key: "/", onPress(){player.ddrm.paused = !player.ddrm.paused}}
    ],

    findMults_DDRM(type){
        let mult = new Decimal(1)
        if (type == "m"){
            mult = mult.mul(player.ddrm.cEffect)
            if (hasUpgrade("ddr", 12)) mult = mult.mul(2)
            if (hasChallenge("ddr", 11)) mult = mult.mul(3)
            if (hasChallenge("ddr", 12)) mult = mult.mul(5)

            return mult
        }
        if (type == "g"){
            mult = mult.mul(player.ddrm.cEffect)
            if (hasChallenge("ddr", 11)) mult = mult.mul(3)
            if (hasChallenge("ddr", 12)) mult = mult.mul(5)

            return mult
        }
        if (type == "a"){
            mult = mult.mul(player.ddrm.cEffect)
            if (hasUpgrade("ddr", 12)) mult = mult.mul(2)
            if (hasChallenge("ddr", 12)) mult = mult.mul(5)

            return mult
        }
        if (type == "c"){
            mult = new Decimal(1)
            if (inChallenge("ddr", 11) ||
            inChallenge("ddr", 12)) mult = mult.mul(player.MEComboNerf)
            if (hasChallenge("ddr", 11)) mult = mult.mul(2.5)

            return mult
        }
    },

    arrowClicking_DDRM(column){
        if (getGridData("ddrm", 100 + column) == 1){
            setGridData("ddrm", 100 + column, 0)

            let index = player.ddrm.current.findIndex(x => x[1] == 100 + column)
            player.ddrm.current.splice(index, 1)

            player.ddrm.points = player.ddrm.points.add(1)
            player.ddrm.great = player.ddrm.great.add(tmp.ddrm.findMults_DDRM("g"))
            player.ddrm.combo = player.ddrm.combo.add(tmp.ddrm.findMults_DDRM("c"))
        } else if (getGridData("ddrm", 200 + column) == 1){
            setGridData("ddrm", 200 + column, 0)

            let index = player.ddrm.current.findIndex(x => x[1] == 200 + column)
            player.ddrm.current.splice(index, 1)

            player.ddrm.points = player.ddrm.points.add(1)
            player.ddrm.marvelous = player.ddrm.marvelous.add(tmp.ddrm.findMults_DDRM("m"))
            player.ddrm.combo = player.ddrm.combo.add(tmp.ddrm.findMults_DDRM("c"))
        } else if (getGridData("ddrm", 300 + column) == 1){
            setGridData("ddrm", 300 + column, 0)

            let index = player.ddrm.current.findIndex(x => x[1] == 300 + column)
            player.ddrm.current.splice(index, 1)

            player.ddrm.points = player.ddrm.points.add(1)
            player.ddrm.great = player.ddrm.great.add(tmp.ddrm.findMults_DDRM("g"))
            player.ddrm.combo = player.ddrm.combo.add(tmp.ddrm.findMults_DDRM("c"))
        } else if (getGridData("ddrm", 400 + column) == 1){
            setGridData("ddrm", 400 + column, 0)

            let index = player.ddrm.current.findIndex(x => x[1] == 400 + column)
            player.ddrm.current.splice(index, 1)

            player.ddrm.points = player.ddrm.points.add(1)
            player.ddrm.almost = player.ddrm.almost.add(tmp.ddrm.findMults_DDRM("a"))
        } else if (getGridData("ddrm", 500 + column) == 1){
            setGridData("ddrm", 500 + column, 0)

            let index = player.ddrm.current.findIndex(x => x[1] == 500 + column)
            player.ddrm.current.splice(index, 1)

            player.ddrm.points = player.ddrm.points.add(1)
            player.ddrm.almost = player.ddrm.almost.add(tmp.ddrm.findMults_DDRM("a"))
        }
    },

    grid: {
        rows: 10, // If these are dynamic make sure to have a max value as well!
        cols: 4,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            if (id == 201 || id == 202 || id == 203 || id == 204) return true
            return false
        },
        onClick(data, id) { 
                if (id % 100 == 1) tmp.ddrm.arrowClicking_DDRM(1)
                if (id % 100 == 2) tmp.ddrm.arrowClicking_DDRM(2)
                if (id % 100 == 3) tmp.ddrm.arrowClicking_DDRM(3)
                if (id % 100 == 4) tmp.ddrm.arrowClicking_DDRM(4)
        },
        getDisplay(data, id){
            return ""
        },
        getStyle(data, id){
            if (data == 1) {
                //moving arrows
                let value = 0.1
                if (id % 100 == 1){
                    if (id == 201) value += 0.15
                    return {
                    "background": `rgb(199,0,200,${value})`,
                    "background-image": "url('trgt_ddr_mg_arrow_red.png')",
                    "background-size": "contain",
                    "transform": `rotate(0deg)`
                    }
                }

                if (id % 100 == 2){
                    if (id == 202) value += 0.15
                    return {
                    "background": `rgb(199,0,200,${value})`,
                    "background-image": "url('trgt_ddr_mg_arrow_red.png')",
                    "background-size": "contain",
                    "transform": `rotate(270deg)`
                    }
                }

                if (id % 100 == 3){
                    if (id == 203) value += 0.15
                    return {
                    "background": `rgb(199,0,200,${value})`,
                    "background-image": "url('trgt_ddr_mg_arrow_red.png')",
                    "background-size": "contain",
                    "transform": `rotate(90deg)`
                    }
                }

                if (id % 100 == 4){
                    if (id == 204) value += 0.15
                    return {
                    "background": `rgb(199,0,200,${value})`,
                    "background-image": "url('trgt_ddr_mg_arrow_red.png')",
                    "background-size": "contain",
                    "transform": `rotate(180deg)`
                    }
                }
            }

            if (id == 201 || id == 202 || id == 203 || id == 204) {
                let num = 0
                if (id == 201) num = 0
                if (id == 202) num = 270
                if (id == 203) num = 90
                if (id == 204) num = 180

                return {
                    "background": "rgb(199,0,200,0.25)",
                    "background-image": "url('trgt_ddr_mg_arrow_white.png')",
                    "background-size": "contain",
                    "transform": `rotate(${num}deg)`
                }
            }

            if (id % 100 == 1) return {
                "background": "rgb(199,0,200,0.1)",
                "transform": `rotate(0deg)`
            }

            if (id % 100 == 2) return {
                "background": "rgb(199,0,200,0.1)",
                "transform": `rotate(270deg)`
            }

            if (id % 100 == 3) return {
                "background": "rgb(199,0,200,0.1)",
                "transform": `rotate(90deg)`
            }

            if (id % 100 == 4) return {
                "background": "rgb(199,0,200,0.1)",
                "transform": `rotate(180deg)`
            }
        },
    },

    clickables: {
        11: {
            title: "Clear DDR Board",
            canClick() {return true},
            onClick() {
                player.ddrm.current = [[1, 1001]]

                let others = [
                    101, 102, 103, 104,
                    201, 202, 203, 204,
                    301, 302, 303, 304,
                    401, 402, 403, 404,
                    501, 502, 503, 504,
                    601, 602, 603, 604,
                    701, 702, 703, 704,
                    801, 802, 803, 804,
                    901, 902, 903, 904,
                    1002, 1003, 1004
                ]

                others.forEach(function(i){
                    setGridData("ddrm", i, "0")
                })
            },
        },
        12: {
            title: "Pause DDR Board",
            canClick() {return true},
            onClick() {
                player.ddrm.paused = !player.ddrm.paused
            },
        },
    },

    update(diff){
        player.ddrm.timer += 1
        player.ddrm.timer = player.ddrm.timer % 12

        /*
        INFO:
        Each note is described as a two-element array in another array.
        Example: [1, 803]

        The first number determines the color:
        1 is red, meaning on beat.
        2 is blue, meaning on the "off" beat (halfway between beats)
        3 is yellow, meaning on the "e" or "a" beats (quarter of the way between beats)

        The second number determines its current position.
        x0y, where x is the current row (10 is the lowest row, 1 is the highest, and 2 is the step zone)
        */

        if (Math.random() > 0.1 && player.ddrm.timer == 0 && player.ddrm.paused){ //this conditional spawns the notes
            let num = Math.floor(Math.random() * 4) + 1 //chooses column
            let quantize = 1 //initializes color
            player.ddrm.current.push([quantize, 1100 + num]) //pushes the chosen color and column to the array
            
        }

        for (var DDRMC = 0; DDRMC < player.ddrm.current.length; DDRMC++){ //this loop moves the notes
            if (player.ddrm.timer % 3 == 0 && player.ddrm.paused){ //every other tick
                player.ddrm.current[DDRMC][1] = player.ddrm.current[DDRMC][1] - 100 //shift the note in the array
                setGridData("ddrm", player.ddrm.current[DDRMC][1], player.ddrm.current[DDRMC][0]) //changes the data
                setGridData("ddrm", player.ddrm.current[DDRMC][1] + 100, "0") //removes the data
                if (player.ddrm.current[DDRMC][1] < 0){ //is it out of the play area?
                    player.ddrm.current.shift() //delete it!
                    player.ddrm.miss = player.ddrm.miss.add(1) //add a miss
                    player.ddrm.combo = new Decimal(0)
                }
            }
        }

        //update the effects
        player.ddrm.mEffect = player.ddrm.marvelous.add(1).pow(0.5).mul(15)
        player.ddrm.gEffect = player.ddrm.great.add(1).pow(0.5).mul(2)
        player.ddrm.aEffect = player.ddrm.almost.add(1).log(100).div(25).add(1)

        if (hasChallenge("ddr", 12)) {
            player.ddrm.mEffect = player.ddrm.mEffect.mul(50).pow(1.25)
            player.ddrm.gEffect = player.ddrm.gEffect.mul(50).pow(1.25)
            player.ddrm.aEffect = player.ddrm.aEffect.mul(1.1).pow(1.1)
        }

        //combo stuff
        if (player.ddrm.combo.gte(player.ddrm.highestCombo)) player.ddrm.highestCombo = player.ddrm.combo
        player.ddrm.cEffect = player.ddrm.highestCombo.add(1).pow(0.15)
    },

    tabFormat: [
        "main-display",
        ["infobox", "minigame"],
        ["clickables", [1]],
        "blank",
        ["display-text", function(){return `You have hit <h2 style="color: #8000FF; text-shadow: 0px 0px 10px #8000FF">${format(player.ddrm.marvelous, 4)}</h2> Marvelous arrows, multiplying ME by x${format(player.ddrm.mEffect, 4)}`}],
        ["display-text", function(){return `You have hit <h2 style="color: #40FF40; text-shadow: 0px 0px 10px #40FF40">${format(player.ddrm.great, 4)}</h2> Great arrows, multiplying Notes by x${format(player.ddrm.gEffect, 4)}`}],
        ["display-text", function(){return `You have hit <h2 style="color: #FF4040; text-shadow: 0px 0px 10px #FF4040">${format(player.ddrm.almost, 4)}</h2> Almost arrows, multiplying Songs by x${format(player.ddrm.aEffect, 4)}`}],
        ["display-text", function(){return `You have missed <h2 style="color: #B0B0B0; text-shadow: 0px 0px 10px #B0B0B0">${format(player.ddrm.miss, 4)}</h2> arrows`}],
        ["blank", "8px"],
        ["display-text", function(){return `Your highest combo is <h2 style="color: #0080FF; text-shadow: 0px 0px 10px #0080FF">${format(player.ddrm.highestCombo, 4)}</h2> arrows, multiplying the gain of M, G, and A arrows by x${format(player.ddrm.cEffect, 4)}`}],
        ["display-text", function(){return `Your current combo is <h2 style="color: #0080FF; text-shadow: 0px 0px 10px #0080FF">${format(player.ddrm.combo, 4)}</h2> arrows`}],
        ["blank", "8px"],
        ["display-text", function(){return "Use arrow keys or click the white arrows to hit them! Hit / to pause DDR."}],
        "blank",
        "grid"
    ],

    infoboxes: {
        minigame: {
            title: "DDR Minigame",
            body() { return "This, is Ceiling Catapul- I mean the DDR minigame. Here's how it works. " +
                "You can either press the 2nd row of arrows (white) or use the arrow keys to hit the notes. " +
                "Depending on how close you get to the white arrows, you can either get Marvelous, Great, or Almost. M, G, and A for short. " +
                "M arrows are gained by hitting the notes directly on the white arrows, G arrows gained by hitting them just before or after, " +
                "and hit notes quite early for A arrows. <br><br> You also have a combo, in blue, and a highest combo, which has an effect. " +
                "Missed arrows do nothing and are gained by... doing nothing. All of these values can be influenced by each other or through tree features. " +
                "M and G hits increase the combo, usually by 1 but can be increased, and A hits do nothing. Missing an arrow resets your current combo. " +
                "The two buttons on the top are for clearing and pausing the board, respectively. Use them if you're not playing the minigame." },
            unlocked() {return true},
        },
    },

    layerShown(){
        if (player.ddr.points.gte(1)) player.ddrm.unlocked = true
        return player.ddrm.unlocked
    },
})