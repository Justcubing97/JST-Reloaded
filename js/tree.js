var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})

addLayer("musicfocus", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "Achievement Power", 
    row: 0,
    position: 1,
    layerShown: false,
    achievementPopups: true,
    achievements: {
        11: {
            name: "Body F10ating in the Zero Gravity Space - Camellia",
            done() {return false},
        },
        21: {
            name: "1nput This 2 Y0ur Spine - Camellia",
            done() {return false},
        },
        31: {
            name: "Dance With Silence - Camellia",
            done() {return false},
        },
        41: {
            name: "Compute It With Some Devilish Alcoholic Steampunk Engines  - Camellia",
            done() {return false},
        },
        61: {
            name: "Fly Wit Me - Camellia",
            done() {return false},
        },
        71: {
            name: "+ERABY+E C0NNEC+10N - Camellia",
            done() {return false},
        },
        81: {
            name: "Tera I/O - Camellia",
            done() {return false},
        },
        91: {
            name: "M1LLI0N PP - Camellia",
            done() {return false},
        },
        101: {
            name: "Flamewall - Camellia",
            done() {return false},
        },
        51: {
            name: "BAD ACCESS (FROM A MOE MAID) - Camellia",
            done() {return false},
        },
        111: {
            name: "5YN+AX.3R40R(): - Justcubing97 vs. 3435Phi",
            done() {return false},
        },
        121: {
            name: "ARPG = FLOW - Justcubing97 vs. 3435Phi",
            done() {return false},
        },
        131: {
            name: "Chasing Starlight - Justcubing97",
            done() {return false},
        },
        141: {
            name: "NuMeric4l EmUl4tor - SUPiFiNiTY vs. 3435Phi",
            done() {return false},
        },
        151: {
            name: "GHOST - Camellia",
            done() {return false},
        },
        161: {
            name: "BRACE FOR FRICKING IMPACT - Camellia",
            done() {return false},
        },
        171: {
            name: "Exit This Earth's Atomosphere - Camellia",
            done() {return false},
        },
        181: {
            name: "Together forever, my lovely lovely video game cartridges - Camellia",
            done() {return false},
        },
        191: {
            name: "We Could Get More Machinegun Psystyle! (And More Genre Switches) - Camellia",
            done() {return false},
        },
        201: {
            name: "Newspapers for Magicians - Camellia",
            done() {return false},
        },
        211: {
            name: "Circles of Death - Camellia",
            done() {return false},
        },
        221: {
            name: "S.A.T.E.L.L.I.T.E. - Camellia",
            done() {return false},
        },
    },
})