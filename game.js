/* THE FLOOD ARCHIVIST
 * You are Vale, the last archivist of Vellanthor. The water comes in 72 hours.
 * Decide what persists.
 */

(() => {
  "use strict";

  const SAVE_KEY = "flood-archivist-save-v1";
  const TOTAL_HOURS = 72;
  const CAPACITY = 12;

  // -----------------------------------------------------------------------
  // Items
  // -----------------------------------------------------------------------

  const items = {
    ledger: {
      name: "the catalogue ledger",
      weight: 3,
      category: "useful",
      takeable: true,
      examine:
        "Every object the Archive ever held, in three generations of " +
        "handwriting. The most recent entries are in your own hand. It is " +
        "not beautiful. It is the only reason anyone will know what used " +
        "to be here.",
    },
    tablet: {
      name: "the clay tablet",
      weight: 2,
      category: "aged",
      takeable: true,
      examine:
        "Pre-dynastic, cracked along an old fault line, four thousand " +
        "years old. Tagged in someone else's careful hand: DUPLICATE -- " +
        "DO NOT PRIORITIZE. There is, as far as anyone has ever found, no " +
        "duplicate.",
    },
    fishDrawing: {
      name: "the child's drawing of a fish",
      weight: 0,
      category: "beautiful",
      takeable: true,
      examine:
        "A fish, labeled FISH in wobbling capitals, in case the fish was " +
        "unclear. No accession number. No name. Someone left it here on " +
        "purpose, or forgot it, and there is no way now to ask which.",
    },
    petraNote: {
      name: "Petra's note",
      weight: 0,
      category: null,
      takeable: false,
      examine:
        "'I took the Rennick Manuscripts. I know what you'll think. I'm " +
        "sorry. -- P.' The handwriting is steadier than the apology.",
    },
    charts: {
      name: "Maret's navigation charts",
      weight: 2,
      category: "askedFor",
      takeable: true,
      examine:
        "Hand-drawn river charts, the only copies, showing the delta as " +
        "it ran before the two dams. Her husband drew them by lamplight " +
        "over forty winters. The river they describe does not exist " +
        "anymore, except here.",
    },
    notebooks: {
      name: "Professor Idriss's notebooks",
      weight: 3,
      category: "aged",
      takeable: true,
      examine:
        "Thirty years of Vellanthorian dialect words with no equivalent " +
        "anywhere else -- words for a particular slant of river light, " +
        "for the silence after a dam closes, for a grief that is mostly " +
        "relief. Once he is gone, these words go with him, in this " +
        "notebook or nowhere.",
    },
    bird: {
      name: "the taxidermied bird",
      weight: 2,
      category: "beautiful",
      takeable: true,
      examine:
        "A species that does not exist anymore outside this case. One " +
        "glass eye missing, replaced at some point with a button that " +
        "almost matches. Tagged: AESTHETIC VALUE ONLY. The tag is wrong " +
        "about almost everything except the value.",
    },
    thesis: {
      name: "the student's thesis",
      weight: 2,
      category: "takenWithoutAsking",
      takeable: true,
      examine:
        "Four hundred pages, six years, one copy, no author present to " +
        "ask. The title page says it is about flood patterns in pre-dam " +
        "river systems. It would have made someone's career, or already " +
        "did, somewhere you can't see.",
    },
    letter: {
      name: "Senne's letter",
      weight: 0,
      category: "askedFor",
      takeable: true,
      examine:
        "Addressed to a daughter in the capital. Senne did not let you " +
        "read it, and you did not ask to. You can feel that it is folded " +
        "the way letters are folded by someone who has written and " +
        "unfolded it more than once.",
    },
    seedCrate: {
      name: "the crate of seed stock",
      weight: 5,
      category: "useful",
      takeable: true,
      examine:
        "Heirloom varieties, forty years of a collective's work, packed " +
        "in straw. Heavy enough that taking it means leaving something " +
        "else behind. That is, more or less, the whole problem of this " +
        "city in one wooden box.",
    },
    pamphlet: {
      name: "the Bureau pamphlet",
      weight: 0,
      category: "useful",
      takeable: true,
      examine:
        "'YOUR RELOCATION: A POSITIVE TRANSITION.' There is a cartoon of " +
        "a smiling family carrying exactly two suitcases. It is the " +
        "single funniest document you have ever catalogued, and you have " +
        "catalogued some very funny documents.",
    },
    photoAlbum: {
      name: "the photo album",
      weight: 1,
      category: "beautiful",
      takeable: true,
      examine:
        "Face-down on a kitchen table, like someone meant to come back " +
        "for it in a minute. A family you will never meet, in chronological " +
        "order, getting steadily less formal and more sunburned.",
    },
    houseplant: {
      name: "the houseplant",
      weight: 1,
      category: "beautiful",
      takeable: true,
      examine:
        "It will die either way, probably, wherever it ends up. You could " +
        "still take it. Not everything you save has to make sense.",
    },
    lockedBox: {
      name: "the locked box",
      weight: 2,
      category: "mystery",
      takeable: true,
      examine:
        "Under a bed, locked, no key anywhere in the apartment. You will " +
        "never know what's inside. You are allowed to decide that not " +
        "knowing is part of what you're carrying.",
    },
    camera: {
      name: "the camera",
      weight: 1,
      category: "useful",
      takeable: true,
      examine:
        "Left on the bridge railing, film already partway used. You don't " +
        "know whose pictures are already on it. You will be adding to a " +
        "roll someone else started.",
    },
  };

  // -----------------------------------------------------------------------
  // People
  // -----------------------------------------------------------------------

  const peopleText = {
    maret: {
      name: "Maret",
      talk:
        "'I'm not going,' she says, before you've asked. 'I've been " +
        "leaving this river my whole life and it kept finding me again. " +
        "Might as well let it finish the job here.' She has a box on the " +
        "table. She does not offer it to you yet.",
      sit:
        "You sit. She talks about her husband, who is dead now, and the " +
        "river, which will be dead soon in the only shape he ever knew it. " +
        "She talks for a long time. When she's done, she pushes the box " +
        "of charts toward you without being asked again. 'He'd rather " +
        "someone used them than nobody saw them at all.'",
      takeBlocked:
        "She puts her hand flat on the box. 'Sit with me first,' she says. " +
        "'Then we'll see.' She is not going to be rushed by a schedule " +
        "she didn't agree to.",
    },
    idriss: {
      name: "Professor Idriss",
      talk:
        "He's surrounded by notebooks, organizing them in an order only " +
        "he understands. 'Thirty years,' he says, not looking up. 'You " +
        "can take the notebooks. Or I can read you the words that don't " +
        "translate, and you can write down what I say. It's slower. It's " +
        "also the only way some of them will sound right one more time.'",
      sit:
        "You sit. He reads you words for things that have stopped " +
        "existing in any language but this dialect: a word for the " +
        "specific quiet after a dam gate closes, a word for missing a " +
        "place while still standing in it. You write as fast as you can. " +
        "It is not fast enough to catch all of it, and he tells you so, " +
        "gently, and keeps going anyway.",
      takeWithoutAsking:
        "He watches you take the notebooks off the desk. 'You could have " +
        "asked,' he says. Not angry. He knows the difference between a " +
        "thing taken and a thing given, and he is filing this away too, " +
        "the way he files everything.",
    },
    senne: {
      name: "Senne",
      talk:
        "She's still arranging vegetables nobody is buying. 'You're at " +
        "the Archive,' she says, like that settles something. 'I have a " +
        "letter. For my daughter, in the capital. I know you're not going " +
        "anywhere -- I'm not asking you to deliver it. I'm asking you to " +
        "carry it as far as you go, and hope it's farther than here.' " +
        "She holds it out.",
    },
    tomas: {
      name: "Old Tomas",
      talk:
        "He's sitting on the front step like he's waiting for a bus that " +
        "stopped running years ago. 'Former city historian,' he says, " +
        "before you can ask. 'Current and final city witness. I don't " +
        "want you to take anything of mine. I want you to sit down.'",
      sit:
        "You sit. He tells you the city's history -- not the version in " +
        "the Bureau's pamphlets, the other one: who dug the first canal " +
        "and why it flooded the wrong field on purpose, who the bridge is " +
        "actually named after versus who it's officially named after, " +
        "where the river used to bend before the first dam straightened " +
        "it out of spite more than engineering. He talks for what feels " +
        "like the whole remaining length of the world. When he finishes, " +
        "he looks, for the first time since you sat down, like a man with " +
        "nothing left undone. 'Good,' he says. 'Now it's somewhere.'",
      takeBlocked:
        "'No,' he says, not unkindly, before you've even finished asking. " +
        "'I told you. Nothing of mine. Sit down if you want to take " +
        "something.'",
    },
  };

  // -----------------------------------------------------------------------
  // Locations
  // -----------------------------------------------------------------------

  const locations = {
    archive: {
      name: "The Archive",
      aliases: ["archive"],
      firstDesc:
        "Your building. Mostly emptied now -- filing cabinets pulled open " +
        "and left that way, water damage spreading up the lower shelves " +
        "from a burst pipe nobody is going to fix at this point. A box " +
        "marked LOW PRIORITY sits on the reading table, full of things " +
        "someone else decided didn't matter enough. There's a note from " +
        "Petra.",
      laterDesc:
        "The Archive. Emptier each time you come back to it.",
      objects: ["ledger", "tablet", "fishDrawing", "petraNote"],
      people: [],
      witness:
        "You write: the building still smells like damp paper and other " +
        "people's decisions. It has smelled that way since the pipe " +
        "burst. It will smell that way until the water makes it stop " +
        "mattering.",
    },
    river: {
      name: "The River Quarter",
      aliases: ["river", "river quarter", "riverquarter"],
      firstDesc:
        "The oldest part of the city, and the first the water will take. " +
        "A painted doorframe -- blue and ochre, repainted every generation " +
        "for two hundred years -- marks a house that's otherwise empty. " +
        "Maret is on her step, not packing anything. A community " +
        "noticeboard nearby is still covered in notices for a city that " +
        "is still, technically, going about its business.",
      laterDesc:
        "The River Quarter. The water hasn't arrived yet, but the street " +
        "already feels like it's listening for it.",
      objects: ["doorframe", "noticeboard", "charts"],
      people: ["maret"],
      witness:
        "You write: the doorframe has been repainted by hand for two " +
        "hundred years and will be repainted by no one again. Someone " +
        "should have written that down before you did. Maybe no one did.",
    },
    university: {
      name: "The University Annex",
      aliases: ["university", "university annex", "annex"],
      firstDesc:
        "Half the faculty left weeks ago. The other half is still here, " +
        "in offices that look like a decision got interrupted partway " +
        "through. Professor Idriss is surrounded by notebooks. A " +
        "taxidermied bird watches from a glass case with one button eye. " +
        "A thesis, four hundred pages, sits on an empty desk.",
      laterDesc:
        "The University Annex. Quieter every time, in the specific way " +
        "of a place running out of people before it runs out of time.",
      objects: ["bird", "thesis", "notebooks"],
      people: ["idriss"],
      witness:
        "You write: a man is giving away thirty years of words no one " +
        "else speaks, to whoever will sit still long enough to take them " +
        "down correctly. Most people did not sit still long enough. You " +
        "are trying to.",
    },
    market: {
      name: "The Market",
      aliases: ["market"],
      firstDesc:
        "Still operating, in the way a thing keeps running on momentum " +
        "after the engine's been switched off. Senne is arranging " +
        "vegetables nobody is buying. A heavy crate of heirloom seed " +
        "stock sits roped shut near her stall. The Bureau of Water " +
        "Management's information kiosk stands unmanned, still stocked " +
        "with pamphlets.",
      laterDesc:
        "The Market. Fewer stalls open each time, but Senne is always " +
        "there.",
      objects: ["seedCrate", "pamphlet"],
      people: ["senne"],
      witness:
        "You write: people are still buying veal and onions three days " +
        "before the river takes the street they're standing on. You are " +
        "not sure if that's denial or dignity. You suspect it doesn't " +
        "need to be only one of those.",
    },
    residential: {
      name: "The Residential Blocks",
      aliases: ["residential", "residential blocks", "blocks", "apartment", "apartments"],
      firstDesc:
        "Standard housing, mostly emptied in a hurry. One apartment door " +
        "hangs unlocked -- children's drawings still taped to the fridge, " +
        "a photo album face-down on the table, a houseplant that no one " +
        "remembered. Old Tomas sits outside on his front step, in no " +
        "hurry at all.",
      laterDesc:
        "The Residential Blocks. The unlocked apartment is exactly as you " +
        "left it. Old Tomas is exactly where you left him too.",
      objects: ["photoAlbum", "houseplant", "lockedBox"],
      people: ["tomas"],
      witness:
        "You write: someone left in enough of a hurry to leave a drawing " +
        "on the fridge but not in enough of a hurry to forget the things " +
        "that actually mattered. You hope that means they're somewhere " +
        "safe and just didn't think about magnets.",
    },
    bridge: {
      name: "The Bridge",
      aliases: ["bridge"],
      firstDesc:
        "The last crossing point before the river takes the rest of its " +
        "argument with the city. Someone has tagged the railing: LUCA WAS " +
        "HERE, 1987-2026, the second date added recently, in a different " +
        "pen. A camera sits abandoned on the railing, film still inside.",
      laterDesc:
        "The Bridge. Whatever hour you arrive, it finds a way to look " +
        "like the right one to be standing here.",
      objects: ["graffiti", "camera"],
      people: [],
      witness:
        "You write: a boy named Luca came back, years later, just to " +
        "finish a sentence he started as a teenager. You don't know " +
        "anything else about him. You don't think you need to.",
    },
  };

  const nonTakeableExamine = {
    doorframe:
      "Blue and ochre geometric pattern, repainted every generation by " +
      "the family who lived behind it, for two hundred years. It cannot " +
      "be moved. It was never going to fit on a handcart, and everyone " +
      "who painted it knew that and did it anyway.",
    noticeboard:
      "Lost pet posters. A notice for a birthday party that has already " +
      "happened. A child's drawing of a whale, taped up crooked. None of " +
      "it is going anywhere with you. All of it was true, once, and " +
      "still is, for a few more days.",
    graffiti:
      "LUCA WAS HERE. 1987-2026. He tagged this bridge at sixteen and " +
      "came back decades later to add the date himself, in person, " +
      "before he left for good. You don't know if that's brave or just " +
      "thorough. Possibly both.",
  };

  // -----------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------

  let state = null;

  function freshState() {
    return {
      hoursRemaining: TOTAL_HOURS,
      currentLocation: "archive",
      handcart: [],
      visited: { archive: false },
      locationItems: Object.fromEntries(
        Object.entries(locations).map(([k, v]) => [k, [...v.objects]])
      ),
      flags: {
        satWithMaret: false,
        gotCharts: false,
        satWithIdriss: false,
        gotNotebooks: false,
        tookNotebooksWithoutAsking: false,
        gotLetter: false,
        satWithTomas: false,
        tomasBlocked: false,
        filmRemaining: 3,
        photographs: [],
      },
      leftBehind: [],
      witnessLog: [],
      witnessedLocations: [],
      commandHistory: [],
      gameOver: false,
    };
  }

  // -----------------------------------------------------------------------
  // DOM / output
  // -----------------------------------------------------------------------

  const outputEl = document.getElementById("output");
  const inputEl = document.getElementById("cmd-input");
  const hoursValueEl = document.getElementById("hours-value");
  const handcartListEl = document.getElementById("handcart-list");
  const handcartWeightEl = document.getElementById("handcart-weight");
  const handcartPanelEl = document.getElementById("handcart-panel");
  const handcartToggleEl = document.getElementById("handcart-toggle");
  const terminalEl = document.getElementById("terminal");

  function print(text, cls) {
    const div = document.createElement("div");
    div.className = "line-block" + (cls ? " " + cls : "");
    div.textContent = text;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function renderHandcart() {
    hoursValueEl.textContent = state.hoursRemaining;
    const weight = currentWeight();
    handcartWeightEl.textContent = weight + " / " + CAPACITY + " weight";
    handcartListEl.innerHTML = "";
    if (!state.handcart.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "(empty)";
      handcartListEl.appendChild(li);
      return;
    }
    for (const key of state.handcart) {
      const li = document.createElement("li");
      li.textContent = items[key].name;
      handcartListEl.appendChild(li);
    }
  }

  handcartToggleEl.addEventListener("click", () => {
    const open = handcartPanelEl.classList.toggle("open");
    handcartToggleEl.setAttribute("aria-expanded", String(open));
  });

  terminalEl.addEventListener("click", () => inputEl.focus());

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  function loc() {
    return locations[state.currentLocation];
  }

  function currentWeight() {
    return state.handcart.reduce((sum, k) => sum + items[k].weight, 0);
  }

  function spendHours(n) {
    state.hoursRemaining = Math.max(0, state.hoursRemaining - n);
    renderHandcart();
    if (state.hoursRemaining <= 0 && !state.gameOver) {
      endGame();
    }
  }

  function findLocationKey(text) {
    const lower = text.toLowerCase().trim();
    for (const [key, l] of Object.entries(locations)) {
      if (l.aliases.some((a) => a === lower || lower.includes(a))) return key;
    }
    return null;
  }

  function itemsHere() {
    return state.locationItems[state.currentLocation] || [];
  }

  function wordsMatch(haystack, query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const target = haystack.toLowerCase();
    return words.every((w) => target.includes(w));
  }

  function findItemHere(text) {
    return itemsHere().find((k) => {
      const item = items[k] || { name: k };
      return wordsMatch(item.name, text) || wordsMatch(k, text);
    });
  }

  function findItemInCart(text) {
    return state.handcart.find((k) => wordsMatch(items[k].name, text) || wordsMatch(k, text));
  }

  function findPersonHere(text) {
    return loc().people.find(
      (p) => wordsMatch(peopleText[p].name, text) || wordsMatch(p, text)
    );
  }

  function removeFromHere(key) {
    state.locationItems[state.currentLocation] = itemsHere().filter((k) => k !== key);
  }

  // -----------------------------------------------------------------------
  // Commands
  // -----------------------------------------------------------------------

  function cmdHelp() {
    print("Verbs Vale knows:", "line-system");
    print("  LOOK / L              -- describe where you are");
    print("  GO [place]            -- archive, river, university, market, residential, bridge");
    print("  TAKE [thing]          -- add something to the handcart");
    print("  LEAVE [thing]         -- set something down again");
    print("  EXAMINE / X [thing]   -- look closely");
    print("  TALK TO [person]      -- start a conversation");
    print("  SIT WITH [person]     -- slower, costs more time, opens more");
    print("  PHOTOGRAPH [thing]    -- if you're carrying the camera");
    print("  READ [thing]          -- for things meant to be read");
    print("  HANDCART / INVENTORY  -- what you're carrying");
    print("  TIME                  -- hours remaining");
    print("  WAIT                  -- let an hour pass");
    print("  WITNESS               -- write down an observation about this place");
    print("  HELP                  -- this list", "line-system");
  }

  function describeLocation(first) {
    const l = loc();
    print(l.name.toUpperCase(), "line-location");
    print(first ? l.firstDesc : l.laterDesc);

    const visible = itemsHere();
    if (visible.length) {
      const names = visible.map((k) => (items[k] ? items[k].name : k));
      print("Here: " + names.join("; ") + ".");
    }
    if (l.people.length) {
      for (const p of l.people) {
        print(peopleText[p].name + " is here.", "line-person");
      }
    }
  }

  function cmdLook() {
    print("");
    const first = !state.visited[state.currentLocation];
    state.visited[state.currentLocation] = true;
    describeLocation(first);
  }

  function cmdGo(rest) {
    if (!rest) {
      print("Go where? Try: archive, river quarter, university annex, market, residential blocks, bridge.");
      return;
    }
    const key = findLocationKey(rest);
    if (!key) {
      print("There's nowhere by that name to go.");
      return;
    }
    if (key === state.currentLocation) {
      print("You're already there.");
      return;
    }
    const firstTime = !state.visited[key];
    state.currentLocation = key;
    spendHours(firstTime ? 6 : 4);
    if (state.gameOver) return;
    print("");
    state.visited[key] = true;
    describeLocation(firstTime);
  }

  function describeItem(key) {
    if (items[key] && items[key].examine) return items[key].examine;
    if (nonTakeableExamine[key]) return nonTakeableExamine[key];
    return null;
  }

  function cmdExamine(rest) {
    if (!rest) {
      print("Examine what?");
      return;
    }
    const inCart = findItemInCart(rest);
    if (inCart) {
      print(items[inCart].examine);
      return;
    }
    const here = findItemHere(rest);
    if (here) {
      const text = describeItem(here);
      print(text || "There's nothing more to say about it.");
      return;
    }
    const person = findPersonHere(rest);
    if (person) {
      print("Talk to " + peopleText[person].name + ", or sit with them, if you want more than a look.");
      return;
    }
    print("You don't see that here.");
  }

  function cmdRead(rest) {
    if (!rest) {
      print("Read what?");
      return;
    }
    const inCart = findItemInCart(rest);
    const here = findItemHere(rest);
    const key = inCart || here;
    if (!key) {
      print("There's nothing like that to read.");
      return;
    }
    const text = describeItem(key);
    print(text || "There's nothing written on it.");
  }

  function cmdTake(rest) {
    if (!rest) {
      print("Take what?");
      return;
    }
    const here = findItemHere(rest);
    if (!here) {
      print("There's nothing like that here to take.");
      return;
    }

    const item = items[here];
    if (!item || item.takeable === false) {
      print("That one isn't coming with you. " + (describeItem(here) ? describeItem(here) : ""));
      return;
    }

    if (here === "charts" && !state.flags.satWithMaret) {
      print(peopleText.maret.takeBlocked);
      return;
    }

    if (state.handcart.includes(here)) {
      print("Already in the handcart.");
      return;
    }

    const projected = currentWeight() + item.weight;
    if (projected > CAPACITY) {
      print(
        "There's no room. The handcart can't take " + item.name +
        " on top of everything else -- not without leaving something behind first.",
        "line-system"
      );
      return;
    }

    if (here === "notebooks" && !state.flags.satWithIdriss && !state.flags.gotNotebooks) {
      state.flags.tookNotebooksWithoutAsking = true;
      print(peopleText.idriss.takeWithoutAsking);
    }
    if (here === "notebooks") state.flags.gotNotebooks = true;

    state.handcart.push(here);
    removeFromHere(here);
    renderHandcart();
    spendHours(1);
    if (state.gameOver) return;
    print("You take " + item.name + ".");
  }

  function cmdLeave(rest) {
    if (!rest) {
      print("Leave what?");
      return;
    }
    const key = findItemInCart(rest);
    if (!key) {
      print("You aren't carrying that.");
      return;
    }
    state.handcart = state.handcart.filter((k) => k !== key);
    state.locationItems[state.currentLocation].push(key);
    state.leftBehind.push(key);
    renderHandcart();
    print("You set " + items[key].name + " down.");
  }

  function cmdTalk(rest) {
    if (!rest) {
      print("Talk to whom?");
      return;
    }
    const person = findPersonHere(rest);
    if (!person) {
      print("There's no one like that here.");
      return;
    }
    print(peopleText[person].name + ":", "line-person");
    print(peopleText[person].talk);
    if (person === "senne" && !state.flags.gotLetter && !itemsHere().includes("letter")) {
      state.flags.gotLetter = true;
      state.locationItems.market.push("letter");
    }
    spendHours(2);
  }

  function cmdSit(rest) {
    if (!rest) {
      print("Sit with whom?");
      return;
    }
    const person = findPersonHere(rest);
    if (!person) {
      print("There's no one like that here to sit with.");
      return;
    }

    if (person === "maret") {
      if (state.flags.satWithMaret) {
        print("You already sat with her. She's told you what she has to tell.");
        return;
      }
      print(peopleText.maret.sit);
      state.flags.satWithMaret = true;
      spendHours(8);
      if (state.gameOver) return;
      print("She pushes the box of charts toward you.", "line-person");
      return;
    }

    if (person === "idriss") {
      if (state.flags.satWithIdriss) {
        print("You've already taken down everything he dictated.");
        return;
      }
      print(peopleText.idriss.sit);
      state.flags.satWithIdriss = true;
      spendHours(10);
      if (state.gameOver) return;
      print("He closes the last notebook. 'That's the ones that mattered most,' he says.", "line-person");
      return;
    }

    if (person === "tomas") {
      if (state.flags.satWithTomas) {
        print("You've already heard the whole history. He has nothing left undone now.");
        return;
      }
      print(peopleText.tomas.sit);
      state.flags.satWithTomas = true;
      spendHours(20);
      return;
    }

    print(peopleText[person].talk);
    spendHours(2);
  }

  function cmdPhotograph(rest) {
    if (!state.handcart.includes("camera")) {
      print("You don't have anything to photograph with.");
      return;
    }
    if (!rest) {
      print("Photograph what?");
      return;
    }
    if (state.flags.filmRemaining <= 0) {
      print("The film is finished. Whatever's left, you'll have to remember instead.");
      return;
    }
    const targetKey = findItemHere(rest) || findItemInCart(rest);
    let subject = rest;
    if (targetKey) {
      subject = (items[targetKey] && items[targetKey].name) || targetKey;
    } else if (/bridge/i.test(rest) && state.currentLocation === "bridge") {
      subject = "the bridge itself";
    } else if (/doorframe/i.test(rest)) {
      subject = "the painted doorframe";
    }
    state.flags.filmRemaining -= 1;
    state.flags.photographs.push(subject);
    spendHours(1);
    if (state.gameOver) return;
    print(
      "You photograph " + subject + ". " + state.flags.filmRemaining +
      " exposure" + (state.flags.filmRemaining === 1 ? "" : "s") + " left on the roll."
    );
  }

  function cmdHandcart() {
    if (!state.handcart.length) {
      print("Empty. Nothing decided yet.");
      return;
    }
    print("In the handcart (" + currentWeight() + "/" + CAPACITY + " weight):");
    for (const key of state.handcart) {
      print("  - " + items[key].name);
    }
  }

  function cmdTime() {
    print(state.hoursRemaining + " hours remaining.");
    if (state.hoursRemaining <= 12) {
      print("That is not very many.", "line-quiet");
    }
  }

  function cmdWait() {
    print("An hour passes. Nothing changes that you can see. Something, somewhere, probably did.");
    spendHours(1);
  }

  function cmdWitness() {
    const key = state.currentLocation;
    if (state.witnessedLocations.includes(key)) {
      print("You've already written this place down. It will have to stand.", "line-witness");
      return;
    }
    state.witnessedLocations.push(key);
    state.witnessLog.push(loc().witness);
    print(loc().witness, "line-witness");
    spendHours(1);
  }

  // -----------------------------------------------------------------------
  // Ending
  // -----------------------------------------------------------------------

  function categoryItems(cat) {
    return state.handcart.filter((k) => items[k].category === cat);
  }

  function listNames(keys) {
    return keys.map((k) => items[k].name);
  }

  function joinProse(list) {
    if (!list.length) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + " and " + list[1];
    return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
  }

  function buildWhatYouCarried() {
    const lines = [];

    if (!state.handcart.length) {
      lines.push(
        "The handcart is empty. You decided, in the end, that carrying " +
        "nothing was different from saving nothing -- or you ran out of " +
        "time to decide otherwise. Either way, your hands are free, and " +
        "that is its own kind of answer."
      );
    } else {
      lines.push(
        "You left the city with " + joinProse(listNames(state.handcart)) + "."
      );

      const aged = categoryItems("aged");
      if (aged.length) {
        lines.push(
          "Some of it because it was old, and old is its own argument: " +
          joinProse(listNames(aged)) + "."
        );
      }

      const askedNames = [];
      if (state.handcart.includes("charts")) askedNames.push("Maret's charts");
      if (state.handcart.includes("letter")) askedNames.push("Senne's letter");
      if (askedNames.length) {
        lines.push(
          "Some of it because someone asked you to, directly, with their " +
          "own hands held out: " + joinProse(askedNames) + "."
        );
      }

      const beautiful = categoryItems("beautiful");
      if (beautiful.length) {
        lines.push(
          "Some of it for no better reason than that it was beautiful, " +
          "and you decided that was reason enough: " +
          joinProse(listNames(beautiful)) + "."
        );
      }

      const useful = categoryItems("useful");
      if (useful.length) {
        lines.push(
          "Some of it because it was useful, which is the least " +
          "interesting reason and still a real one: " +
          joinProse(listNames(useful)) + "."
        );
      }

      if (state.handcart.includes("lockedBox")) {
        lines.push(
          "You also carried a locked box you will never open. You decided " +
          "not knowing was worth the weight."
        );
      }

      if (state.flags.tookNotebooksWithoutAsking) {
        lines.push(
          "You took Professor Idriss's notebooks off his desk before he " +
          "offered them. He noticed. He didn't stop you."
        );
      }

      if (state.handcart.includes("thesis")) {
        lines.push(
          "You took a student's thesis without their knowledge, because " +
          "there was no one left to ask. You don't know yet if that was " +
          "theft or rescue. You may never know."
        );
      }
    }

    if (state.flags.filmRemaining < 3 && state.flags.photographs.length) {
      lines.push(
        "What you couldn't carry, you photographed instead: " +
        joinProse(state.flags.photographs) + ". A photograph is not the " +
        "thing. It is what's left when the thing can't come with you."
      );
    }

    const witnessedNotTaken = [];
    if (state.witnessedLocations.includes("river") && !state.handcart.includes("charts") && state.flags.satWithMaret) {
      witnessedNotTaken.push("Maret's account of the river");
    }
    if (state.witnessedLocations.includes("bridge")) {
      witnessedNotTaken.push("the bridge itself");
    }
    if (state.witnessedLocations.includes("archive")) {
      witnessedNotTaken.push("the Archive, as it was at the end");
    }
    if (witnessedNotTaken.length) {
      lines.push(
        "Some things never had a chance of fitting on a handcart, so you " +
        "wrote them down instead: " + joinProse(witnessedNotTaken) + "."
      );
    }

    if (state.leftBehind.length) {
      const leftNames = [...new Set(state.leftBehind)].filter(
        (k) => !state.handcart.includes(k)
      ).map((k) => items[k].name);
      if (leftNames.length) {
        lines.push(
          "And some things you picked up and then set back down, because " +
          "the cart only holds so much: " + joinProse(leftNames) + "."
        );
      }
    }

    return lines.join("\n\n");
  }

  function endGame() {
    state.gameOver = true;
    print("");
    print(
      "The water is coming now. You are at the edge of the city with " +
      "your handcart.",
      "line-ending"
    );
    print("");
    print("WHAT YOU CARRIED", "line-ending");
    print(buildWhatYouCarried());
    print("");
    print(
      "The Archive is gone. The River Quarter is gone. Maret's charts, " +
      "if you left them, are gone. Luca's name on the bridge is gone.",
      "line-ending"
    );
    if (state.flags.satWithTomas) {
      print("");
      print(
        "But you know the city's history now. That's inside you. The " +
        "water can't get there.",
        "line-ending"
      );
    }
    print("");
    print("What you carried was enough. It had to be.", "line-ending");
    print("");
    print("-- THE END --", "line-system");
    print("Type NEW GAME to begin again.", "line-system");
    saveState();
  }

  // -----------------------------------------------------------------------
  // Save / load
  // -----------------------------------------------------------------------

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      // storage unavailable; play continues without persistence
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      // ignore
    }
  }

  // -----------------------------------------------------------------------
  // Parser
  // -----------------------------------------------------------------------

  function handleCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    state.commandHistory.push(trimmed);
    print("> " + trimmed, "line-cmd");

    if (/^new game$/i.test(trimmed)) {
      clearSave();
      bootFreshGame();
      return;
    }

    if (state.gameOver) {
      print("The story has ended. Type NEW GAME to begin again.");
      return;
    }

    const lower = trimmed.toLowerCase();
    let verb, rest;

    if (/^talk to /.test(lower)) {
      verb = "talk";
      rest = trimmed.slice(8).trim();
    } else if (/^sit with /.test(lower)) {
      verb = "sit";
      rest = trimmed.slice(9).trim();
    } else if (/^go to /.test(lower)) {
      verb = "go";
      rest = trimmed.slice(6).trim();
    } else {
      const parts = trimmed.split(/\s+/);
      verb = parts[0].toLowerCase();
      rest = parts.slice(1).join(" ");
    }

    switch (verb) {
      case "look":
      case "l":
        cmdLook();
        break;
      case "go":
        cmdGo(rest);
        break;
      case "take":
      case "get":
        cmdTake(rest);
        break;
      case "leave":
      case "drop":
        cmdLeave(rest);
        break;
      case "examine":
      case "x":
      case "inspect":
        cmdExamine(rest);
        break;
      case "read":
        cmdRead(rest);
        break;
      case "talk":
        cmdTalk(rest);
        break;
      case "sit":
        cmdSit(rest);
        break;
      case "listen":
        print("You listen. Sometimes that's a separate thing from talking, and sometimes it's the same thing done better.");
        break;
      case "photograph":
        cmdPhotograph(rest);
        break;
      case "inventory":
      case "i":
      case "handcart":
        cmdHandcart();
        break;
      case "time":
        cmdTime();
        break;
      case "wait":
        cmdWait();
        break;
      case "witness":
        cmdWitness();
        break;
      case "help":
      case "?":
        cmdHelp();
        break;
      default:
        print("Vale doesn't know how to do that. Type HELP for a list of things she does know.");
    }

    if (!state.gameOver) saveState();
  }

  // -----------------------------------------------------------------------
  // Boot
  // -----------------------------------------------------------------------

  function printTitleCard() {
    print("THE FLOOD ARCHIVIST", "line-ending");
    print("");
    print(
      "You are Vale. It is Sunday. The water comes Thursday. The Archive " +
      "smells like damp paper and someone else's decisions. You are the " +
      "last one here."
    );
    print("");
    print("What do you do?");
  }

  function bootFreshGame() {
    state = freshState();
    outputEl.innerHTML = "";
    printTitleCard();
    print("");
    print("Type HELP for a list of commands.", "line-system");
    cmdLook();
    renderHandcart();
  }

  function bootFromSave(saved) {
    state = saved;
    outputEl.innerHTML = "";
    print("A previous journey resumes.", "line-system");
    print("");
    describeLocation(false);
    renderHandcart();
    if (state.gameOver) {
      print("");
      print("This story already ended. Type NEW GAME to begin again.", "line-system");
    }
  }

  function boot() {
    const saved = loadState();
    if (saved && typeof saved.hoursRemaining === "number") {
      bootFromSave(saved);
    } else {
      bootFreshGame();
    }
  }

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = inputEl.value;
      inputEl.value = "";
      handleCommand(value);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory(1);
    }
  });

  let historyIndex = -1;
  function navigateHistory(direction) {
    if (!state || !state.commandHistory.length) return;
    if (historyIndex === -1) historyIndex = state.commandHistory.length;
    historyIndex = Math.max(0, Math.min(state.commandHistory.length, historyIndex + direction));
    inputEl.value = state.commandHistory[historyIndex] || "";
  }

  boot();
  inputEl.focus();
})();
