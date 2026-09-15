addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "Achievement Power",
    row: "side",
    position: 0,
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    tabFormat: [
        ["display-text", "<h3>Achievements! The completely useless side tab that shows progress!"],
        ["display-text", "Cyan - major reset layer"],
        ["display-text", "Blue - minor reset layer"],
        ["display-text", "Red - gives boost"],
        "blank",
        "achievements",
    ],
    achievementPopups: true,
    achievements: {
        11: {
            name: "Conception",
            done() {return player.f.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Have 1 Fundamentality."},
            style() {return {
                "border-color": "cyan"
            }},
        },
        12: {
            name: "Millionare",
            done() {return player.points.gte("1e6")},
            unlocked() {return true},
            tooltip() {return "Have 1,000,000 Points."},
        },
        13: {
            name: "14 Upgrades",
            done() {return hasUpgrade("f", 27)},
            unlocked() {return true},
            tooltip() {return "Buy 14 upgrades in total. EFFECT: the exponent in \"Mutual Relationship\" is increased +0.375."},
            style() {return {
                "border-color": "red"
            }},
        },
        14: {
            name: "Ah #### Here we go again",
            done() {return player.p.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Have 1 Number."},
            style() {return {
                "border-color": "cyan"
            }},
        },
        15: {
            name: "Three of Them",
            done() {return hasMilestone("p", 5)},
            unlocked() {return true},
            tooltip() {return "Unlock the third Primitive buyable."},
        },
        16: {
            name: "UPGRADE UPGRADE UPGRADE",
            done() {return hasMilestone("p", 8)},
            unlocked() {return true},
            tooltip() {return "Unlock the third row of Funda upgrades."},
        },
        17: {
            name: "Tick Tick Tick Tick",
            done() {return getBuyableAmount("p", 11).gte(60)},
            unlocked() {return true},
            tooltip() {return "Buy 60 of \"Fundamental Acceleration\". EFFECT: \"Duplication Machine\" now affects Points."},
            style() {return {
                "border-color": "red"
            }},
        },
        21: {
            name: "Who Added Math Into This Game?",
            done() {return player.ar.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Have 1 Operation Power."},
            style() {return {
                "border-color": "cyan"
            }},
        },
        22: {
            name: "Unstable Variable",
            done() {return player.ar.fundaVariables.add(player.ar.primVariables).gte("1e4")},
            unlocked() {return true},
            tooltip() {return "Have a combined total of 10,000 FV and PV."},
        },
        23: {
            name: "Googolism",
            done() {return player.points.gte("1e100")},
            unlocked() {return true},
            tooltip() {return "Have 1e100 Points. A googol is where the real fun begins."},
        },
        24: {
            name: "Pythagorean Theorem",
            done() {return hasUpgrade("ar", 21) && hasUpgrade("ar", 22) && hasUpgrade("ar", 23)},
            unlocked() {return true},
            tooltip() {return "Have the 8th-10th Arithmetic upgrades. The currency triangle is complete!"},
        },
        25: {
            name: "1 x 10<sup>100</sup>",
            done() {return player.p.total.gte("1e100")},
            unlocked() {return true},
            tooltip() {return "Have a total of 1e100 Numbers."},
        },
        26: {
            name: "Conquered",
            done() {return hasChallenge("ar", 11)},
            unlocked() {return true},
            tooltip() {return "Complete Arithmetic Challenge 1. EFFECT: \"Fundamental Acceleration\" now affects Points at a reduced rate."},
            style() {return {
                "border-color": "red"
            }},
        },
        27: {
            name: "This is NOT Antimatter Dimensions!",
            done() {return player.d.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Ascend to the first Dimension."},
            style() {return {
                "border-color": "blue"
            }},
        },
        31: {
            name: "Scientific Notation Recursion Level 1 (SNR1)",
            done() {return player.points.gte("1e1000")},
            unlocked() {return true},
            tooltip() {return "Have 1e1000 Points."},
        },
        32: {
            name: "<i>softcapped</i>",
            done() {return player.f.points.gte("1e1000")},
            unlocked() {return true},
            tooltip() {return "Have 1e1000 Fundamentality. The first real currency softcap is in effect."},
        },
        33: {
            name: "Be There or Be Square",
            done() {return player.poly.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Have 1 Shape."},
            style() {return {
                "border-color": "cyan"
            }},
        },
    },
})