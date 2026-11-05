addLayer("story", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),

        documents: {
            1: true,
            2: false,
            3: false,
            4: false,
            5: false,
        },
    }},
    color: "rgb(128,0,255)",
    row: "side",
    position: 3,
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Story")
    },
    symbol: "S",
    tabFormat: [
        ["display-text", "<h3>Justcubing97's Something Tree"],
        "blank",
        ["display-text", function(){if (true) return `<h3>Chapter 1: The Void`}],
        ["microtabs", "stuff"],
    ],
    microtabs: {
        stuff: {
            "Document 1": {
                style: {
                    "margin": "10px"
                },
                content: [
                    "blank",
                    ["display-text", "<h3>Justcubing97"],
                    ["display-text", "<i>Always unlocked.</i>"],
                    "blank",
                    ["display-text", `
                        I awoke in a bland room. Patterned wallpaper that doesn't seem like an attraction filled the walls.
                        <br><br>
                        A bookshelf sat in one corner, filled with Shakespearean writing and AP class textbooks.
                        <br><br>
                        The bed I slept on, a less-than-stellarly-made blanket with plain blue dots in a hexagonal grid and a mattress equivalent of someone with dementia.
                        <br><br>
                        <br><br>
                        One wall, with no wallpaper, no bricks, no mortar, no obscurity.
                        <br><br>
                        A floor-to-ceiling window, with a metal frame holding the wooden door in place—once pure, but hollow in the present.
                        <br><br>
                        A window to the eternal night; the darkness encompassing everything within.
                        <br><br>
                        <br><br>
                        <b>This is The Void.</b> A place where residents reside for no particular reason.
                        <br><br>
                        Some say it's a social experiment. Some say it's a punishment for the innocent. Some even say it's the afterlife.
                        <br><br>
                        <br><br>
                        I am Justcubing97. I do not reveal my personal name as I believe that can lead to catastrophic timelines.
                        <br><br>
                        Hello, player. You may have stumbled upon this game by either complete probability or you were looking through the TMT Discord server. Here, a story takes place.
                        <br><br>
                        I also may or may not tell you about important mechanics in the game. Until next time; I'm heading to my Sector's preparation area.
                        `],
                ]
            },
            "Document 2": {
                style: {
                    "margin": "10px"
                },
                content: [
                    "blank",
                    ["display-text", "<h3>The Modding Tree"],
                    ["display-text", "<i>Requires 1 Fundamentality.</i>"],
                    "blank",
                    ["display-text", function() {
                        player.story.documents[2] = player.f.points.gte(1)
                        if (player.story.documents[2]) return `
                        Now, the timeline may not line up perfectly in some eyes, in some perspectives, in some views.
                        <br><br>
                        This document, this exact one, Document 2: The Modding Tree of Chapter 1: The Void, is the only one I wrote after escaping The Void.
                        <br><br>
                        <br><br>
                        All distortion and metaness aside, I created this game, Justcubing97's Something Tree (JST), out of reflection. However, as you'll see later in lore, it references JST.
                        <br><br>
                        (Side note: yes, I am aware that Justcubing97's Something Tree and JST: Reloaded are different games. The lore here will refer to JST: Reloaded as JST, always.)
                        <br><br>
                        Paradoxical, am I right? I'm making something that contains a reference of itself. Oh, hey, recursion!
                        <br><br>
                        <br><br>
                        If you have played classic JST—the one where the endgame is apparently tetration territory—you know there is an Unlock and savebank layer.
                        <br><br>
                        So, in JST, where I actually know how to use The Modding Tree properly (you'll know once you reach the 3rd reset layer with actual gimmicks), I just deleted those layers due to them being too finicky.
                        <br><br>
                        <br><br>
                        Expect some other changes to other currencies as well.
                        <br><br>
                        For example, Core Boosters won't have a “Useful” counterpart and upgrades are unlocked from the start.
                        <br><br>
                        Dimensions are based on Points now.
                        <br><br>
                        <br><br>
                        I also added a Logarithmic Scale and Conway's Game of Life into JST.
                        <br><br>
                        The Log. Scale takes all of your important currencies, challenge completions, and buyable effects and turns them into a special number.
                        <br><br>
                        This is then fed through multiple logarithms of base 10, which is something I wanted to do for a while.
                        <br><br>
                        Enough about my development process, have fun with JST.

                        `}],
                ]
            },
            "Document 3": {
                style: {
                    "margin": "10px"
                },
                content: [
                    "blank",
                    ["display-text", "<h3>Outside Exploration"],
                    ["display-text", "<i>Requires \"NOT Identical to JST!\".</i>"],
                    "blank",
                    ["display-text", function() {
                        player.story.documents[3] = hasUpgrade("f", 21)
                        if (player.story.documents[3]) return `
                        Sector 19, the one I reside in, is positioned at one of the corners of the sector structure.
                        <br><br>
                        Its preparation area is located at the dead center of the complex—first and second floors.
                        <br><br>
                        The luxury rooms are positioned on said floors, and everyone else above. I didn't attain enough luck to get one of those favorable residencies.
                        <br><br>
                        <br><br>
                        The preparation area contains bathrooms, storage, and a social center. Nothing else.
                        <br><br>
                        Not even food.
                        <br><br>
                        Water is available in the form of cups from water dispensers, though.
                        <br><br>
                        An organized chaos of identical tan couches filled the social center.
                        <br><br>
                        The bathrooms were a conglomerate of white tile and concrete—toilets lined one wall, sinks the other, and showers were placed in their own subdivision. A midpoint between a prison and a home.
                        <br><br>
                        <br><br>
                        The clock constitutes breakfast. In the middle of The Void is The Centroid.
                        <br><br>
                        There, all of the main operations and secondary amenities of The Void, including Void Masters. They're an oligarchy.
                        <br><br>
                        Walk into The Centroid, and you're met with a cafeteria—a breed between a school and a prison, again. Food is mildly good, although nothing prestigious.
                        <br><br>
                        Below The Centroid is the medical sector, run by restless nurses and doctors that take on every possible health concern.
                        <br><br>
                        <br><br>
                        The food gathering process is no different from a free-for-all. 
                        <br><br>
                        I stand in line to transfer eggs, bacon, and a mini carton of juice from their natural habitat to a foam plate.
                        <br><br>
                        It's not the worst thing in the world, exponentially better than undead flesh.
                        <br><br>
                        But now, after my time in The Centroid, something—or rather, somewhere—beckons exploration and documentation. I take on the journey.
                        `}],
                ]
            },
            "Document 4": {
                style: {
                    "margin": "10px"
                },
                content: [
                    "blank",
                    ["display-text", "<h3>Triangulation"],
                    ["display-text", "<i>Requires 1 Number.</i>"],
                    "blank",
                    ["display-text", function() {
                        player.story.documents[4] = player.p.points.gte(1)
                        if (player.story.documents[4]) return `
                        As I had expected, the 36 total Sectors line the outside of a square 10 units wide. Directly in the middle of this square is The Centroid.
                        <br><br>
                        However, after traversing unknown invisible terrain—hidden within the nothingness of black—a patch of grass. 
                        <br><br>
                        <br><br>
                        If you could pack as much green into three bytes of computer data as possible, like #00FF00, that would be the shade of green you would perceive.
                        <br><br>
                        This “Reset Field” is the only installed infrastructure with vibrant colors. Artificial trees and a robotic bee nest tucked away within one of them dotted the region.
                        <br><br>
                        Circles, circles, circles. Don't think I've heard a bee say that before.
                        <br><br>
                        Finally, the classic black metal lawn chair assembly and a cobblestone fireplace.
                        <br><br>
                        A few individuals seem to be conversing over a random topic—possibly over scientific terms. I didn't bother to join; I was a Rookie compared to them, and only woke up once.
                        <br><br>
                        <br><br>
                        A very unnoticeable noticeable quirk of The Void is that it has a boundary. After tracing this perimeter for two hours, at least, I concluded that it was an isosceles golden triangle.
                        <br><br>
                        The Reset Field—molded into a trapezoid to cooperate with the oddity of The Void—was positioned near the 36° angle, while the Sector ring fit snug in the relative middle.
                        <br><br>
                        <br><br>
                        By logical conclusion, the other angles are 72°. Near one angle is The Labyrinth.
                        <br><br>
                        It is a constantly-shapeshifting 4-dimensional mess of a maze, and everyone that fell to the destiny of labyrinthine mesmerization had to be rescued via Void Master, with the exception of three who should absolutely try all lottery tickets.
                        <br><br>
                        Near the other 72° angle is The Transit.
                        <br><br>
                        It is the only way to exit The Void. You either spend a thousand days in it or you somehow get 25 grams of Dark Matter.
                        <br><br>
                        Some might provide triviality because it is The Void, but true Dark Matter is no different from unobtainium, element 0.
                        <br><br>
                        No matter how hard you try, Dark Matter is impossible. Nearly everyone spends nearly 3 years.
                        <br><br>
                        <br><br>
                        I should also mention the ranking system of The Void. Everyone wears a special badge on their shirt—and if you're caught without, you're on a three-strike system—which displays the ranking.
                        <br><br>
                        I received mine when I visited Interitri, the senior Void Master, who gives everyone their badges.
                        <br><br>
                        From entry to 5 days, you're a Rookie.
                        <br><br>
                        From 5 to 20 days, you're a Newcomer.
                        <br><br>
                        20 to 100, you're labeled an Acquaintance.
                        <br><br>
                        100 to 365, you're a Commoner.
                        <br><br>
                        365 to 730, you're a Veteran.
                        <br><br>
                        730 to 900, you're a Senior.
                        <br><br>
                        900 to 995, you're Elite.
                        <br><br>
                        The other 5 days I don't need to mention, Finalist.
                        `}],
                ]
            },
            "Document 5": {
                style: {
                    "margin": "10px"
                },
                content: [
                    "blank",
                    ["display-text", "<h3>Modulation: The Labyrinthine Expedition"],
                    ["display-text", "<i>Requires the 5th Primitive Milestone.</i>"],
                    "blank",
                    ["display-text", function() {
                        player.story.documents[5] = hasMilestone("p", 5)
                        if (player.story.documents[5]) return `
                        What the Der Schneid is that document title. I'll explain later. 
                        <br><br>
                        But if you have the necessary amount of brain cells required to comprehend the label of this document, you probably perceived this as starting my journey through The Labyrinth.
                        <br><br>
                        Yes, I know the dangers. The shapeshifting property. The possibility of imminent eternal isolation from The Void.
                        <br><br>
                        Do I care?
                        <br><br>
                        No.
                        <br><br>
                        <br><br>
                        I brought a flashlight. Was it useful?
                        <br><br>
                        No.
                        <br><br>
                        Shining light at a substance darker than Vantablack has no effect. Still, wandering aimlessly.
                        <br><br>
                        I can't emphasize how mysterious and ephemeral this experience was.
                        <br><br>
                        It feels like traversing an impossible minefield where one mishap can send you to the end of time.
                        <br><br>
                        I persist. I persevere. I prolong.
                        <br><br>
                        <br><br>
                        I paused. A noise. Was it behind me? Was it in front? Was it to the left? Was it to the right? Was it above? Was it below?
                        <br><br>
                        I cannot tell. I just know it existed and then—with equal entry proportion—absence.
                        <br><br>
                        From the outside, my concept of time is frozen. But that time was spent in stillness.
                        `}],
                ]
            },
        },
    },
})