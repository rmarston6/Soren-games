/* THE FLOOD ARCHIVIST
 * A text-based browser game. You are the last archivist in the city of
 * Veshara, hours before the levees fail. Choose what survives.
 */

(() => {
  "use strict";

  // ---------------------------------------------------------------------
  // World data
  // ---------------------------------------------------------------------

  const MAX_WATER = 16;
  const CARRY_CAPACITY = 5;
  const BASEMENT_DANGER_LEVEL = 7; // water level at which the basement becomes lethal
  const BASEMENT_WARN_LEVEL = 5;

  const rooms = {
    hub: {
      name: "Reading Room",
      desc:
        "Rain hammers the skylights of the old Reading Room. Water has " +
        "already crept under the front doors and pools around the legs " +
        "of the long oak tables. A hand-bell sits on the desk -- the " +
        "evacuation signal, not yet rung. Corridors lead north, south, " +
        "east, and west into the archive. A stairwell goes down to the " +
        "stacks, and a ladder against the far wall climbs up to the roof " +
        "hatch.",
      exits: { north: "mapVault", south: "manuscriptVault", east: "photoArchive", west: "office", down: "basement", up: "rooftop" },
      items: [],
    },
    mapVault: {
      name: "Map Vault",
      desc:
        "Flat files of survey maps line the walls, their brass handles " +
        "tarnished green. A single bare bulb flickers overhead.",
      exits: { south: "hub" },
      items: ["survey map", "hydrological charts"],
    },
    manuscriptVault: {
      name: "Manuscript Vault",
      desc:
        "Glass cases hold the oldest documents in Veshara. A heavy iron " +
        "drawer beneath the central case is sealed with a brass lock.",
      exits: { north: "hub" },
      items: ["founding charter"],
      locked: {
        item: "founder's diary",
        keyName: "master key",
        lockedDesc:
          "a heavy iron drawer, sealed with a brass lock",
      },
    },
    photoArchive: {
      name: "Photograph Archive",
      desc:
        "Rows of gray boxes hold a century of Veshara in silver and " +
        "gelatin. The smell of old chemicals lingers in the damp air.",
      exits: { west: "hub" },
      items: ["flood of 1913 photographs", "family portrait collection"],
    },
    office: {
      name: "Director's Office",
      desc:
        "Papers are scattered across a desk that was abandoned mid-task. " +
        "A brass key glints in an open drawer. A dusty insurance ledger " +
        "sits untouched on a shelf.",
      exits: { east: "hub" },
      items: ["master key", "insurance ledger"],
    },
    basement: {
      name: "Basement Stacks",
      desc:
        "The lowest level of the archive, and the first to drown. Water " +
        "is already ankle-deep and rising. Shelving disappears into the " +
        "dark in every direction.",
      exits: { up: "hub" },
      items: ["first settlers' census"],
      isBasement: true,
    },
    rooftop: {
      name: "Roof Hatch",
      desc:
        "The hatch opens onto a flat roof. A rescue skiff waits below, " +
        "tied to the gutter, rocking in the rising water.",
      exits: { down: "hub" },
      items: [],
      isExit: true,
    },
  };

  const itemInfo = {
    "survey map": {
      weight: 1,
      examine:
        "A hand-drawn 1850 survey of Veshara, before the levees existed. " +
        "It shows the original shoreline -- a ghost of the city's shape.",
    },
    "hydrological charts": {
      weight: 2,
      examine:
        "Decades of river-level readings, bound in waterlogged leather. " +
        "Heavy, and only useful to someone who already believes in floods.",
    },
    "founding charter": {
      weight: 1,
      examine:
        "The parchment that founded Veshara four hundred years ago. The " +
        "ink has faded to the color of weak tea, but the seal still holds.",
    },
    "founder's diary": {
      weight: 1,
      examine:
        "A small, water-stained diary. The founder's last entry reads: " +
        "'We built on a floodplain because the soil was rich. I hope " +
        "someone forgives us for that.'",
    },
    "flood of 1913 photographs": {
      weight: 1,
      examine:
        "Photographs of the last great flood. Rowboats in the street. " +
        "People smiling anyway. Proof that the city has drowned before " +
        "and was rebuilt.",
    },
    "family portrait collection": {
      weight: 2,
      examine:
        "Hundreds of donated portraits of Veshara families, going back " +
        "five generations. No museum wants them. No family will forget " +
        "them.",
    },
    "master key": {
      weight: 0,
      examine: "A small brass key, warm from someone's pocket.",
    },
    "insurance ledger": {
      weight: 2,
      examine:
        "A ledger of building valuations from 1962. Thorough, dull, and " +
        "almost certainly not worth your last five minutes.",
    },
    "first settlers' census": {
      weight: 3,
      examine:
        "The only surviving census of Veshara's first settlers -- names " +
        "that exist nowhere else on paper. It is heavy, and it is in the " +
        "basement, and the basement is flooding fastest.",
    },
  };

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------

  let state = null;

  function freshState() {
    const roomItems = {};
    for (const key of Object.keys(rooms)) {
      roomItems[key] = [...rooms[key].items];
    }
    return {
      currentRoom: "hub",
      water: 0,
      turn: 0,
      inventory: [],
      roomItems,
      unlocked: {},
      bellRung: false,
      gameOver: false,
      visitedBasementWarning: false,
    };
  }

  // ---------------------------------------------------------------------
  // Output helpers
  // ---------------------------------------------------------------------

  const outputEl = document.getElementById("output");
  const inputEl = document.getElementById("cmd-input");

  function print(text, cls) {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.textContent = text;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printBlank() {
    print("");
  }

  function printWrapped(text, cls) {
    print(text, cls);
  }

  // ---------------------------------------------------------------------
  // Game mechanics
  // ---------------------------------------------------------------------

  function room() {
    return rooms[state.currentRoom];
  }

  function advanceTurn(cost) {
    if (cost <= 0) return;
    state.turn += cost;
    state.water = Math.min(MAX_WATER, state.water + cost);
    checkWaterEvents();
  }

  function waterStageLabel() {
    if (state.water >= 14) return "The water is at the windowsills. This building has minutes left.";
    if (state.water >= 11) return "Water is pouring in through the doors now. The lower floor is nearly gone.";
    if (state.water >= 8) return "Water is knee-deep in the Reading Room. Time is short.";
    if (state.water >= 4) return "Water is seeping under every door in the building.";
    return "The building is still mostly dry, but the rain has not let up.";
  }

  function checkWaterEvents() {
    if (state.gameOver) return;

    if (state.water >= MAX_WATER) {
      forceEnding();
      return;
    }

    if (state.water === 12) {
      printBlank();
      print("The hand-bell on the desk rings on its own, jolted by a tremor in the building. " +
            "Whatever you decide, decide soon.", "line-warn");
    }

    if (room().isBasement && state.water >= BASEMENT_DANGER_LEVEL) {
      printBlank();
      print("Water surges into the basement all at once, hip-deep and rising. The stairwell " +
            "is the only way out and it will not stay clear for long.", "line-danger");
      print("GO UP. NOW.", "line-danger");
    } else if (room().isBasement && state.water >= BASEMENT_WARN_LEVEL && !state.visitedBasementWarning) {
      state.visitedBasementWarning = true;
      printBlank();
      print("The water here is rising faster than anywhere else in the building. The basement " +
            "will not be safe much longer.", "line-warn");
    }
  }

  function forceEnding() {
    state.gameOver = true;
    printBlank();
    if (room().isBasement) {
      print(
        "The stairwell floods before you reach it. The lights fail. " +
        "The water takes the basement, and you with it.",
        "line-danger"
      );
      renderEnding("THE ARCHIVIST'S GRAVE", endingGrave());
    } else {
      print(
        "The building gives way around you all at once -- a groan of old timber, " +
        "then the roar of water filling every hall at once. There is no more time to choose. " +
        "You are swept toward the roof hatch with whatever you happen to be holding.",
        "line-danger"
      );
      finishGame(true);
    }
  }

  function inventoryWeight() {
    return state.inventory.reduce((sum, name) => sum + (itemInfo[name].weight > 0 ? 1 : 0), 0);
  }

  // ---------------------------------------------------------------------
  // Command handlers
  // ---------------------------------------------------------------------

  function cmdHelp() {
    print("Commands:", "line-system");
    print("  look                 -- describe where you are");
    print("  go <direction>       -- move north/south/east/west/up/down");
    print("  examine <item>       -- read or inspect something closely");
    print("  take <item>          -- pick something up");
    print("  drop <item>          -- leave something behind");
    print("  unlock <item> with <key> -- open something that is locked");
    print("  inventory / i        -- see what you are carrying");
    print("  status               -- check the water level and time spent");
    print("  evacuate             -- go to the roof and end the game with what you're carrying");
    print("  help                 -- show this list");
    print("Every action but examine, inventory, status, and help costs time -- and the water never stops rising.");
  }

  function cmdLook() {
    const r = room();
    printBlank();
    print(r.name.toUpperCase(), "line-room");
    print(r.desc);

    const itemsHere = state.roomItems[state.currentRoom];
    if (itemsHere && itemsHere.length) {
      print("You can see: " + itemsHere.join(", ") + ".");
    }

    if (r.locked && !state.unlocked[state.currentRoom]) {
      print("There is " + r.locked.lockedDesc + " here.");
    }

    const exits = Object.keys(r.exits);
    print("Exits: " + exits.join(", ") + ".");

    if (r.isExit) {
      print("The skiff is waiting. Typing 'evacuate' here will end your time as the archivist.", "line-warn");
    }
  }

  const directionAliases = {
    n: "north", s: "south", e: "east", w: "west", u: "up", d: "down",
    north: "north", south: "south", east: "east", west: "west", up: "up", down: "down",
  };

  function cmdGo(dirRaw) {
    if (!dirRaw) {
      print("Go where? Try a direction: north, south, east, west, up, down.");
      return;
    }
    const dir = directionAliases[dirRaw.toLowerCase()];
    if (!dir) {
      print("That isn't a direction the building offers.");
      return;
    }
    const r = room();
    const dest = r.exits[dir];
    if (!dest) {
      print("There is no way to go " + dir + " from here.");
      return;
    }

    if (dest === "basement" && state.water >= BASEMENT_DANGER_LEVEL) {
      print("The stairwell down is already underwater. You would not make it back up.", "line-danger");
      return;
    }

    state.currentRoom = dest;
    advanceTurn(1);
    if (state.gameOver) return;
    cmdLook();
  }

  function findItem(name, list) {
    const lower = name.toLowerCase();
    return list.find((i) => i.toLowerCase() === lower || i.toLowerCase().includes(lower));
  }

  function cmdExamine(name) {
    if (!name) {
      print("Examine what?");
      return;
    }
    const r = room();

    if (/^(drawer|lock|case)$/i.test(name) && r.locked && !state.unlocked[state.currentRoom]) {
      print("It is sealed shut. It looks like it needs a key.");
      return;
    }

    const inHand = findItem(name, state.inventory);
    if (inHand) {
      print(itemInfo[inHand].examine);
      return;
    }
    const itemsHere = state.roomItems[state.currentRoom];
    const here = findItem(name, itemsHere);
    if (here) {
      print(itemInfo[here].examine);
      return;
    }
    if (r.locked && state.unlocked[state.currentRoom] && findItem(name, [r.locked.item])) {
      print(itemInfo[r.locked.item].examine);
      return;
    }
    print("You don't see that here.");
  }

  function cmdTake(name) {
    if (!name) {
      print("Take what?");
      return;
    }
    const r = room();
    const itemsHere = state.roomItems[state.currentRoom];
    const found = findItem(name, itemsHere);

    if (!found) {
      if (r.locked && !state.unlocked[state.currentRoom] && findItem(name, [r.locked.item])) {
        print("It's locked away. You'll need to unlock the drawer first.");
        return;
      }
      print("There's nothing like that here to take.");
      return;
    }

    if (state.inventory.length >= CARRY_CAPACITY) {
      print(
        "Your arms are full. You're carrying " + CARRY_CAPACITY +
        " items already -- drop something first, or leave this behind.",
        "line-warn"
      );
      return;
    }

    state.inventory.push(found);
    state.roomItems[state.currentRoom] = itemsHere.filter((i) => i !== found);
    advanceTurn(1);
    if (state.gameOver) return;
    print("You take the " + found + ".");
  }

  function cmdDrop(name) {
    if (!name) {
      print("Drop what?");
      return;
    }
    const found = findItem(name, state.inventory);
    if (!found) {
      print("You aren't carrying that.");
      return;
    }
    state.inventory = state.inventory.filter((i) => i !== found);
    state.roomItems[state.currentRoom].push(found);
    print("You set the " + found + " down.");
  }

  function cmdUnlock(rest) {
    const match = /^(.+?)\s+with\s+(.+)$/i.exec(rest || "");
    if (!match) {
      print("Try: unlock <item> with <key>");
      return;
    }
    const [, targetRaw, keyRaw] = match;
    const r = room();
    if (!r.locked) {
      print("There's nothing here to unlock.");
      return;
    }
    if (state.unlocked[state.currentRoom]) {
      print("It's already unlocked.");
      return;
    }
    const keyFound = findItem(keyRaw, state.inventory);
    if (!keyFound || keyFound !== r.locked.keyName) {
      print("That doesn't fit the lock.");
      return;
    }
    state.unlocked[state.currentRoom] = true;
    state.roomItems[state.currentRoom].push(r.locked.item);
    advanceTurn(1);
    if (state.gameOver) return;
    print("The lock gives way. Inside: the " + r.locked.item + ".");
  }

  function cmdInventory() {
    if (!state.inventory.length) {
      print("You're carrying nothing.");
      return;
    }
    print("You are carrying (" + state.inventory.length + "/" + CARRY_CAPACITY + "):");
    for (const item of state.inventory) {
      print("  - " + item);
    }
  }

  function cmdStatus() {
    print("Time elapsed: " + state.turn + " turns.");
    print("Water level: " + state.water + " / " + MAX_WATER);
    print(waterStageLabel(), state.water >= 8 ? "line-danger" : state.water >= 4 ? "line-warn" : undefined);
    print("Carrying: " + state.inventory.length + "/" + CARRY_CAPACITY + " items.");
  }

  function cmdEvacuate() {
    if (state.currentRoom !== "rooftop") {
      print("You need to reach the roof hatch first. Go up from the Reading Room.");
      return;
    }
    finishGame(false);
  }

  // ---------------------------------------------------------------------
  // Endings
  // ---------------------------------------------------------------------

  function hasItem(name) {
    return state.inventory.includes(name);
  }

  function endingGrave() {
    return (
      "No one finds the basement for three days. When the water recedes, the census you " +
      "reached for is still there, ruined, in the dark. Veshara remembers you as the archivist " +
      "who never came back up the stairs.\n\n" +
      "Items lost with you: " + (state.inventory.length ? state.inventory.join(", ") : "none") + "."
    );
  }

  function buildEndingFlooded() {
    const saved = state.inventory;
    return {
      title: "SWEPT OUT",
      body:
        "You did not choose to evacuate -- the building chose for you. You surface on the roof, " +
        "soaked and shaking, the skiff bobbing below.\n\n" +
        (saved.length
          ? "Somehow, still in your arms: " + saved.join(", ") + "."
          : "Your arms are empty. Whatever you meant to save, the water decided otherwise.") +
        "\n\nVeshara will be rebuilt, the way it always has been. What survives of its memory " +
        "is only what you happened to be holding when the walls gave way.",
    };
  }

  function buildEndingNormal() {
    const saved = state.inventory;
    const savedSet = new Set(saved);
    const hasCharter = savedSet.has("founding charter");
    const hasDiary = savedSet.has("founder's diary");
    const hasCensus = savedSet.has("first settlers' census");
    const hasPhotos = savedSet.has("flood of 1913 photographs");
    const hasPortraits = savedSet.has("family portrait collection");
    const hasLedger = savedSet.has("insurance ledger");
    const meaningfulCount = saved.filter((i) => i !== "insurance ledger" && i !== "master key" && itemInfo[i].weight >= 0 && i !== "hydrological charts" && i !== "survey map").length;

    if (saved.length === 0) {
      return {
        title: "EMPTY-HANDED",
        body:
          "You reach the skiff with nothing in your hands. The rower asks if you got anything out. " +
          "You don't answer. Behind you, the Reading Room takes its first foot of water, and the " +
          "archive of Veshara begins to dissolve into the river it was always built beside.",
      };
    }

    if (hasCharter && hasDiary && hasCensus) {
      return {
        title: "KEEPER OF MEMORY",
        body:
          "You step into the skiff with the city's beginning in your arms: the charter that " +
          "founded it, the diary that confessed to it, and the census of the people who first " +
          "lived it. Years from now, a rebuilt Veshara will have a past to stand on, because one " +
          "archivist refused to let the river take all of it.\n\n" +
          "Saved: " + saved.join(", ") + ".",
      };
    }

    if (hasCharter && hasDiary) {
      return {
        title: "THE FOUNDER'S RECORD",
        body:
          "The charter and the diary survive together -- the public founding and the private " +
          "doubt behind it. It is not everything, but it is the truth of how Veshara began, in " +
          "the founder's own contradictory words.\n\n" +
          "Saved: " + saved.join(", ") + ".",
      };
    }

    if (hasPortraits && hasPhotos && meaningfulCount >= 3) {
      return {
        title: "THE PEOPLE'S ARCHIVE",
        body:
          "You left the founding documents behind and saved the faces instead: a century of " +
          "family portraits, and photographs of the flood Veshara survived once before. No " +
          "museum will thank you for it. The families will.\n\n" +
          "Saved: " + saved.join(", ") + ".",
      };
    }

    if (hasLedger && meaningfulCount <= 1) {
      return {
        title: "THE WRONG THINGS",
        body:
          "You make it out with an insurance ledger from 1962 and little else. It will be useful " +
          "to no one. Somewhere behind you, the founding charter dissolves in a drawer nobody " +
          "opened in time.\n\n" +
          "Saved: " + saved.join(", ") + ".",
      };
    }

    if (state.water >= 12) {
      return {
        title: "JUST IN TIME",
        body:
          "You reach the skiff as the last dry step on the stairwell disappears behind you. " +
          "Whatever you carry out is what Veshara keeps. It will have to be enough.\n\n" +
          "Saved: " + saved.join(", ") + ".",
      };
    }

    return {
      title: "WHAT YOU COULD CARRY",
      body:
        "You make it to the roof with time to spare and an armful of the city's memory, " +
        "imperfect and incomplete, the way every archive is.\n\n" +
        "Saved: " + saved.join(", ") + ".",
    };
  }

  function finishGame(wasForced) {
    state.gameOver = true;
    const ending = wasForced ? buildEndingFlooded() : buildEndingNormal();
    renderEnding(ending.title, ending.body);
  }

  function renderEnding(title, body) {
    printBlank();
    print("=".repeat(40), "line-success");
    print(title, "line-success");
    print("=".repeat(40), "line-success");
    print(body);
    printBlank();
    print("Turns survived: " + state.turn + "   Final water level: " + state.water + "/" + MAX_WATER, "line-system");
    printBlank();
    print("-- THE END --", "line-system");
    print("Type 'restart' to begin again.", "line-system");
  }

  // ---------------------------------------------------------------------
  // Parser
  // ---------------------------------------------------------------------

  function handleCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    print("> " + trimmed);

    if (state.gameOver) {
      if (/^restart$/i.test(trimmed)) {
        startGame();
      } else {
        print("The story has ended. Type 'restart' to begin again.");
      }
      return;
    }

    const [verbRaw, ...restParts] = trimmed.split(/\s+/);
    const verb = verbRaw.toLowerCase();
    const rest = restParts.join(" ");

    switch (verb) {
      case "look":
      case "l":
        cmdLook();
        break;
      case "go":
        cmdGo(rest);
        break;
      case "north": case "south": case "east": case "west": case "up": case "down":
      case "n": case "s": case "e": case "w": case "u": case "d":
        cmdGo(verb);
        break;
      case "examine":
      case "x":
      case "read":
      case "inspect":
        cmdExamine(rest);
        break;
      case "take":
      case "get":
      case "archive":
        cmdTake(rest);
        break;
      case "drop":
      case "leave":
        cmdDrop(rest);
        break;
      case "unlock":
      case "open":
        cmdUnlock(rest);
        break;
      case "inventory":
      case "i":
      case "inv":
        cmdInventory();
        break;
      case "status":
      case "time":
        cmdStatus();
        break;
      case "evacuate":
      case "leave!":
        cmdEvacuate();
        break;
      case "help":
      case "?":
        cmdHelp();
        break;
      case "restart":
        startGame();
        break;
      case "wait":
        advanceTurn(1);
        if (!state.gameOver) print("You wait. The water does not.");
        break;
      default:
        print("I don't understand '" + verb + "'. Type 'help' for a list of commands.");
    }
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------

  function startGame() {
    state = freshState();
    outputEl.innerHTML = "";
    print("THE FLOOD ARCHIVIST", "line-success");
    printBlank();
    print(
      "You are the last archivist of Veshara. The levees will fail within the hour. " +
      "You have a few minutes, a pair of arms, and a skiff waiting on the roof. " +
      "Choose what the city remembers.",
    );
    print("Type 'help' for a list of commands.", "line-system");
    cmdLook();
  }

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = inputEl.value;
      inputEl.value = "";
      handleCommand(value);
    }
  });

  window.addEventListener("DOMContentLoaded", () => {});
  startGame();
  inputEl.focus();
})();
