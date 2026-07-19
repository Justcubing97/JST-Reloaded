addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "Achievement Power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Your Rhythmic Journey",
            done() {return hasUpgrade("n", 11)},
            unlocked() {return true},
            tooltip() {return "Buy the first Note upgrade. +1 AP"},
            onComplete() {player.a.points = player.a.points.add(1)}
        },
        12: {
            name: "First Million Steps",
            done() {return player.points.gte("1e6")},
            unlocked() {return true},
            tooltip() {return "Have 1 million ME. +1 AP"},
            onComplete() {player.a.points = player.a.points.add(1)}
        },
        13: {
            name: "Creating is Always Fun",
            done() {return player.s.points.gte("1")},
            unlocked() {return true},
            tooltip() {return "Compose your first Song. +2 AP"},
            onComplete() {player.a.points = player.a.points.add(2)}
        },
        14: {
            name: "Rapid-Releasing an EP",
            done() {return getResetGain("s").gte(4)},
            unlocked() {return true},
            tooltip() {return "Compose 4 Songs at once. +2 AP"},
            onComplete() {player.a.points = player.a.points.add(2)}
        },
        15: {
            name: "2x2x2x2",
            done() {return hasUpgrade("n", 44)},
            unlocked() {return true},
            tooltip() {return "Have 16 (or 4x4) Note upgrades. +2 AP"},
            onComplete() {player.a.points = player.a.points.add(2)}
        },
        16: {
            name: "Professional Producer",
            done() {return hasMilestone("s", 6)},
            unlocked() {return true},
            tooltip() {return "Have 6 Song milestones. +2 AP / Row completion bonus: +100 and x100 Notes."},
            onComplete() {player.a.points = player.a.points.add(2)}
        },

        21: {
            name: "SHOW ME YOUR MOVES!",
            done() {return player.ddr.points.gte(1)},
            unlocked() {return true},
            tooltip() {return "DDR reset for the first time. +3 AP"},
            onComplete() {player.a.points = player.a.points.add(3)}
        },
    },
})