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
            name: "Millionaire",
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
            name: "Ah ---- Here we go again",
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
        34: {
            name: "Megagons",
            done() {return player.poly.points.gte("1e6")},
            unlocked() {return true},
            tooltip() {return "Have 1,000,000 Shapes. This is inflating quickly."},
        },
        35: {
            name: "Broken Exponents",
            done() {return (player.ar.points.eq("0") && getResetGain("ar").gte("1e150")) || player.nc.unlocked},
            unlocked() {return true},
            tooltip() {return "Gain 1e150 Operation Power with 0 current Operation Power. (Also obtainable by unlocking Number Cores.) EFFECT: Multiplication boosts Points."},
            style() {return {
                "border-color": "red"
            }},
        },
        36: {
            name: "Yoyle Mountain",
            done() {return player.points.gte("1e2763")},
            unlocked() {return true},
            tooltip() {return "Have 1e2763 Points. That's 2,763 miles away from the last achievement!"},
        },
        37: {
            name: "Three of Them (slowed+ reverb)",
            done() {return hasUpgrade("poly", 204)},
            unlocked() {return true},
            tooltip() {return "Unlock the third <s>Primitive</s> Number Core buyable."},
        },
        41: {
            name: "Overkill Gain",
            done() {return player.poly.vertGain.gte(player.poly.vertices.mul("1e200"))},
            unlocked() {return true},
            tooltip() {return "Have your Vertex gain be x1e200 greater than your Vertex cap. EFFECT: Vertices cap boosts NC."},
        },
        42: {
            name: "Triple Operation Strength",
            done() {return hasUpgrade("mul", 51) && hasUpgrade("mul", 52) && hasUpgrade("mul", 53)},
            unlocked() {return true},
            tooltip() {return "Have all 3 upgrades in the 5th row of TMT."},
        },
        43: {
            name: "Polytope of Insanity",
            done() {return player.poly.points.gte("1e50")},
            unlocked() {return true},
            tooltip() {return "Have 1e50 Shapes. What are you doing at this point."},
        },
        44: {
            name: "Long Division Apprentice",
            done() {return hasUpgrade("div", 17)},
            unlocked() {return true},
            tooltip() {return "Have 7 Division upgrades. <i>I hope you didn't waste 6 weeks to get this.</i>"},
        },
        45: {
            name: "Certain 4-Sided Polygon",
            done() {return hasMilestone("poly", 10)},
            unlocked() {return true},
            tooltip() {return "Unlock Area."},
        },
        46: {
            name: "Static Layerism (spoilers, uh oh!)",
            done() {return player.cb.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Have 1 Core Booster."},
            style() {return {
                "border-color": "blue"
            }},
        },
        47: {
            name: "Can You Draw Every Flag In Powerpoint?",
            done() {return hasMilestone("poly", 13)},
            unlocked() {return true},
            tooltip() {return "Unlock the Constructor."},
        },
        51: {
            name: "Subplanck Time",
            done() {return player.div.timeToNextBase.lt("5e-44")},
            unlocked() {return true},
            tooltip() {return "Have your Division time be less than 5e-44s (approximately the length of a Planck Time). EFFECT: Functions multiply Division at a very reduced rate, and Number Cores at a slightly less very reduced rate."},
            style() {return {
                "border-color": "red"
            }},
        },
        52: {
            name: "Truly Omnipotent",
            done() {return player.d.points.gte(4)},
            unlocked() {return true},
            tooltip() {return "Ascend to the 4th Dimension."},
        },
        53: {
            name: "End of The Beginning. For Now.",
            done() {return hasUpgrade("f", 47)},
            unlocked() {return true},
            tooltip() {return "Have 28 Fundamental upgrades."},
        },
        54: {
            name: "Enclosed Polygonally",
            done() {return player.poly.points.gte("1e500")},
            unlocked() {return true},
            tooltip() {return "Have 1e500 Shapes. EFFECT: Division boosts Addition."},
            style() {return {
                "border-color": "red"
            }},
        },
        55: {
            name: "Sacrificial Achievement",
            done() {return maxedChallenge("poly", 11)},
            unlocked() {return true},
            tooltip() {return "Sacrifice your Constructor. EFFECT: \"Mutual Relationship\" is much improved."},
            style() {return {
                "border-color": "red"
            }},
        },
        56: {
            name: "When will this layer end?",
            done() {return hasUpgrade("ar", 37)},
            unlocked() {return true},
            tooltip() {return "Have 21 Arithmetic upgrades."},
        },
        57: {
            name: "Finality of Polygon Layer",
            done() {return player.poly.points.gte("1e650")},
            unlocked() {return true},
            tooltip() {return "Have 21 Arithmetic upgrades."},
        },
        61: {
            name: "Blast Off",
            done() {return player.pf.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "Have 1 Planetary Fragment."},
            style() {return {
                "border-color": "cyan"
            }},
        },
    },
})