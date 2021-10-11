
/* Notes on project status:
- I need to rework my if/else if/else statements, because the logic is getting jumbled;
- I think I need to create more distinction between how I use my rooms and how I use my items;
- Presently, my currentRoom variable is not getting updated when the player enters a new room and I'm not sure as to why;
- I have to rework the logic flow of the riddle 
*/

const readline = require("readline");
const rli = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((res, rej) => {
    rli.question(questionText, res);
  });
}

/*-------------------------------------Create a class for ROOM-----------------------------------------------------*/
class Room {
  constructor(
    name,
    description,
    action,
    actionOutcome,
    roomInventory,
    altRooms
  ) {
    this.name = name;
    this.description = description;
    this.action = action;
    this.actionOutcome = actionOutcome;
    this.roomInventory = roomInventory;
    this.altRooms = altRooms;
  }

  /*-------------------------------------Create a STATE MACHINE for ROOM-CHANGE-----------------------------------------------------*/
  changeRoom(nextRoom) {
    // console.log("TEST--going into changeRoom method");
    // console.log(playerObject.currentRoom); //currentRoom is not updating when player enters new room.
    // console.log(this.altRooms);
    if (this.altRooms.includes(playerObject.currentRoom)) {
      this.name = nextRoom;
      console.log(`You are now in ${nextRoom}.`);
      // want it to print action outcome...
      console.log(this.actionOutcome);
    } else {
      console.log(`Sorry! You can't move into ${nextRoom} `);
    }
  }

  /*-------------------------------------Create a METHOD for IDing CURRENT ROOM-----------------------------------------------------*/
  displayRoom() {
    currentRoom = this.name;
    return `You are currently in ${currentRoom}\n 
    learn more about where you are: ${this.description}`;
  }
}

/*------------------------------------Create a class for ITEMS ---------------------------------------------------*/
class Item {
  constructor(name, description, action, actionOutcome, takeable) {
    this.name = name;
    this.description = description;
    this.action = action;
    this.actionOutcome = actionOutcome;
    this.takeable = takeable || false;
  }

  /*------------------------------------Create METHOD for TAKE---------------------------------------------------*/
  //Logic: if item is takeable, put item in player inventory and remove from room's inventory
  take() {
    if (this.takeable) {
      playerInventory.push(this.name);
      roomInventory.pop(this.name);
      console.log(`you picked up ${this.name}`);
      return `you picked up ${this.name}`;
    } else {
      // console.log(`I'm sorry, but you can't take that. Try another action>_`);
      return `I'm sorry, but you can't take that. Try another action>_`;
    }
  }

  /*------------------------------------Create METHOD for ITEM ACTION VERBS ("use", "examine" etc.)---------------------------------------------------*/
  //Logic: IF user inputs an action that includes "examine" && the item is in the room's inventory. console.log response
  //Logic: ELSE IF user inputs an action that includes "use" && the item is in the room's invetory.console.log response
  //logic: ELSE: console.log `I'm sorry, but you can't take that. Try another action>_`;
  itemAction() {
    if (action === "examine" && roomInventory.includes([target])) {
      console.log(this.actionOutcome);
    } else if (action === "use" && roomInventory.includes([target])) {
      console.log(this.actionOutcome);
    } else {
      console.log(
        `I'm sorry, but you can't ${action + target}. Try another action>_`
      );
    }
  }
}

/*------------------------------------Create ROOMS (passing all properties down from ROOM CLASS) ---------------------------------------------------*/
// name of room,
// description of room,
// action (verbs that can be used in the room),
// actionOutcome (response prompt after action is complete),
// roomInventory (items in room)
// altRooms (rooms that player can move to from current room)

let forest = new Room(
  "forest",
  "A dense and tangled wood.",
  ["move", "climb"],
  [" "],
  [" "],
  "bird"
);

let bird = new Room(
  "bird",
  "this bird, like all beings, is both ordinary and extraordinary. Silky feathers and sharp beak. One eye reflecting the warmth of the sun, the other, the wisdom of the moon.",
  ["move", "use", "enter", "describe"],
  "You cling to the bird as they take flight and you notice that the pattern of their feathers forms a path…",
  [" "],
  ["forest", "path"]
);
let path = new Room(
  "path",
  "This is a feathered path. The feathered path leads you to a moss dome. You’ve heard of this place, a vast anti-kingdom, nestled within the crook of every Bird’s wing…",
  ["move", "use", "open", "describe"],
  "Sorry, this door doesn’t open like other doors--just by a turn of a handle or a press of a button--The moss will help you if you ask",
  "door",
  ["bird", "moss dome"]
);

let mossDome = new Room(
  "moss dome",
  "A moss dome. You’ve heard of this place, a vast anti-kingdom, nestled within the crook of every Bird’s wing. You want so badly to go inside. You notice a door...",
  ["move", "open", "use", "describe"],
  "Sorry, this door doesn’t open like other doors--just by a turn of a handle or a press of a button--The moss will help you if you ask",
  ["door", "moss", "teacup", "fountain", "mirror"],
  ["path", "crawlspace"]
);

let crawlspace = new Room(
  "crawlspace",
  "dingy and damp. Just big enough for you to crawl through.",
  ["move", "enter", "use", "describe"],
  "The crawlspace brings you into a Large Hall. You can’t help but shout “ECHO!” And a melodic “ECHO ECHO ECHO” returns your call. It’s dark in here and you trip over an unknown object.",
  [" "],
  ["moss dome", "great hall"]
);

let greatHall = new Room(
  "great hall",
  `A large Hall. You can’t help but shout "ECHO!” And a melodic “ECHO ECHO ECHO” returns your call.\n
  It’s dark in here and you trip over an unknown object.`,
  ["move", "use", "take", "describe"],
  ["flashlight", "painting"],
  ["crawlspace", "kitchen"]
);

let kitchen = new Room(
  "kitchen",
  `When you climb through the window, you find yourself in a cozy kitchen with four doors--one on each wall.\n
  Each door a plaque with its respective cardinal direction--north, south, east, west.\n
  The smells of your favorite foods fill the small room. The table is set for one.\n
  Your name is handwritten on a nametag in front of the plate and beckons you to sit.\n
  You are famished.`,
  ["move", "use", "eat", "describe"],
  [" "],
  ["plate", "nametag", "north door", "south door", "east door", "west door"],
  ["great hall", "north room", "south room", "east room", "west room"]

);

/*------------------------------------Create FOUR other ROOMS ---------------------------------------------------*/

let northRoom = new Room();

let southRoom = new Room();

let eastRoom = new Room();

let westRoom = new Room();

/*------------------------------------Create ITEMs (passing all properties down from ITEM CLASS ) ---------------------------------------------------*/
// name of item,
// description,
// action (verbs allowed to be used on the item)
// actionOutcome (response prompt after action is complete),
// takeable (can the item be taken into player inventory)

/*------------------------------------Create Player Object ---------------------------------------------------*/
// The object -- playerObject -- has two KEY-VALUE pairs: currentRoom is Key and "forest" is value. playerInventory is key and empty array is value.
let playerObject = {
  currentRoom: "forest",
  playerInventory: [],
  playerInstructions: `\nPlayer Instructions:\nAs you move along the path, you will have opportunities to engage with different items in different locations.\n
  To declare your next move, type an action (verb) followed by the item (noun).\n
  Index of game verbs:
  "move" - allows you to move from one location to the next
  "describe" - allows you to receive a description of the room you are in
  "use" - allows you to utilize an item
  "examine" - allows you to examine an item
  "take" - allows you to take an item. Once an item is taken it is stored in your inventory\n
  For example (and don’t worry, this is not a spoiler), If you were to come across a branch on the path,\n you have the following options: “take branch”, “use branch” or "examine branch".\n
  
  A few other notes to keep in mind while you’re on the path:
  "leave" enables you to leave the program;
  "i" allows you to check your inventory at any point during the game;
  "help" will return you to this instructional message.
  
  Ok, that seems to be all you need to know...for now…\n`
};

let door = new Item(
  "door",
  "a moss-encased door frame with a tiny window, also encased in moss",
  ["use", "examine"], //allowable actions on this item include both "use" and "examine",
  "Sorry, this door doesn’t open like other doors--just with a turn of a handle or a press of a button. The moss will help you if you ask"
  // not takeable so will just default to false
);

let moss = new Item(
  "moss",
  "green, velvety, and vast with an affinity for riddles.",
  ["use", "examine"], //allowable actions on this item include both "use" and "examine"
  "The moss whisper, “solve this riddle and you may enter. “ What is always in front of you but can’t be seen?"
  // not takeable so will just default to false
);

let teacup = new Item(
  "teacup",
  "White china with a floral pattern. The handle is slightly chipped. The remnants of a lipstick kiss rests on the rim.",
  "examine",
  "Silly, there is no tea here to steep, nor water to boil, nor means to boil it. Go find something more useful..."
  // Not Takeable -- How do I include message for this particular untakeable item? E.g. "So sorry, but this teacup belongs to this room. You’ll have to find your own."
);

let fountain = new Item(
  "fountain",
  "The fountain is old and empty. You notice that it could really use a good dusting.",
  ["examine", "dust"],
  `As you brush the dust away, the following message emerges at the bottom of the bowl: 'Do not be shy. Look in the mirror.`
  // not takeable so will just default to false
);

let mirror = new Item(
  "mirror",
  "the mirror is long and thin with cracks sprouting at each corner.",
  "examine",
  `you have to step closer to see your reflection. You smile at yourself for encouragement. But quickly, your attention is drawn elsewhere—-to the bottom right section of the mirror... You notice a crawl space being reflected in the glass.`
  // not takeable so will just default to false
);

let flashlight = new Item(
  "flashlight",
  "small, but in good working condition. There is a battery operated switch on the end of it.",
  ["examine", "use"],
  `You turn the flashlight on, the light reveals an intricate painting on the far wall of the great hall. You are a master painter and just can’t resist a closer look.`,
  true //takeable
);

let painting = new Item(
  "painting",
  "an intricate painting of a window through which you can see another room. Next to the painting is a sign that reads, “Don’t be a fool. This is not a painting.",
  ["examine", "use"],
  `When you climb through the window, you find yourself in a cozy kitchen with four doors (one on each wall). 
  Each door has a plaque with its respective cardinal direction (north, south, east, west). 
  The smells of your favorite foods fill the room. The table is set for one. Your name is handwritten on a nametag in front of the plate. You are famished.`
  // not takeable so will just default to false
);

let plate = new Item(
  "plate",
  "a plate full of your favorite foods rests atop a table set for one. Your name has been hand-written onto a nametag that's been place right in front of it.",
  ["examine", "use"],
  `You eat and eat and eat  until you can eat no more. Your eyelids drop to your plate and a lullabye drifts into the air. An irresistible urge to lie down crawls into your bones.`
  // not takeable so will just default to false
);

let nametag = new Item(
  "nametag",
  "handwritten in an expressive cursive.",
  "examine",
  [" "]
  // not takeable so will just default to false
);
let sleep = new Item(
  "sleep",
  "For weary travelers wanting to rest their legs, and let their unconscious move them instead.",
  ["use", "examine"],
  `The destination for this game is REST and You've arrived! Play again next time you're in the need of repose`
  // not takeable so will just default to false
);

let northDoor = new Item(
  "north door",
  "This door never opens. But if it did, northward it'd be facing",
  ["examine"],
  [" "]
  // not takeable so will just default to false
);
let southDoor = new Item(
  "south door",
  "This door never opens. But if it did, southward it'd be facing",
  ["examine"],
  [" "]
  // not takeable so will just default to false
);
let eastDoor = new Item(
  "east door",
  "opens to the east of course. But only unlocks at sunrise. Return then.",
  ["examine"],
  [" "]
  // not takeable so will just default to false
);
let westDoor = new Item(
  "west door",
  "opens to the west of course. Only unlocks at sunset. Return then.",
  ["examine"],
  [" "]
  // not takeable so will just default to false
);

/*------------------------------------Create LOOKUP TABLES ---------------------------------------------------*/
// Room LookUpTable
let roomLookUp = {
  forest: forest,
  bird: bird,
  path: path,
  "moss dome": mossDome,
  mossdome: mossDome,
  crawlspace: crawlspace,
  "crawl space": crawlspace,
  "great hall": greatHall,
  greathall: greatHall,
  kitchen: kitchen,
  "north room": northRoom,
  "south room": southRoom,
  "east room": eastRoom,
  "west room": westRoom,
};

//Item LookUpTable
let itemLookUp = {
  door: door,
  moss: moss,
  teacup: teacup,
  "tea cup": teacup,
  fountain: fountain,
  mirror: mirror,
  flashlight: flashlight,
  painting: painting,
  plate: plate,
  nametag: nametag,
  sleep: sleep,
  "north door": northDoor,
  "south door": southDoor,
  "east door": eastDoor,
  "west door": westDoor,
};

async function start() {
  let userAction = await ask(`\nWhat would you like to do?>_`);

  let inputArray = userAction.toLowerCase().split(" "); //splitting into each word into an array

  let action = inputArray[0]; //index of [0]e.g. "examine" would identify whatever first word was ...either "take" or "use"

  let target = inputArray.slice(-1).join(" "); // (per Roxanne) e.g. "bird" Allows us to use this as the target of whatever action user inputs....... This is being used for "small key" if player types small key as two separate words instead of "smallkey" This will take the array at index[1] and join it by removing the space(" ").

  if (action === "move") {
    // if action is "use" AND target is in the ROOM CLASS, then allow user to move to next room
    if (roomLookUp[target] instanceof Room)
      console.log(roomLookUp[target].changeRoom(target));
  } else if (action === "climb") {
    // if action is "climb" AND target is in the ROOM CLASS, then allow user to move to next room
    if (roomLookUp[target] instanceof Room)
      console.log(roomLookUp[target].changeRoom(target));
  } else if (action === "take") {
    // if action is "take" AND target is in the ITEM CLASS, apply take() function on target
    if (itemLookUp[target] instanceof Item) {
      console.log(itemLookUp[target].take());
    } else {
      // if action doesn't fit previous criteria for "use"/"enter"/"climb"/"jump" and isn't a "take + takable item"
      console.log(itemLookUp[target] instanceof Item);
      console.log("That's not an item. Try again");
    }
  } else if (action === "use") {
    // if action is "use" AND target is in the ITEM CLASS, apply itemAction() function to target data
    if (itemLookUp[target] instanceof Item)
      console.log(itemLookUp[target].itemAction());
    // } else if (action === "examine") {   // if action is "examine", AND if target is in ITEM CLASS, access "describe" data at the target
    //  if (itemLookUp[target] instanceof Item)
    //   console.log(itemLookUp[target].description);
  } else if (action === "examine") {
    console.log(roomLookUp[target].description);
  } else if (action === "leave") {
    // if action is "leave". Offer goodbye message and exit the program
    console.log(
      `You typed "leave" and so the game will come to an end. See ya next time!`
    );
    process.exit();
    // Create if statement for riddle. BUT this statement is still missing current room criteria: if currentRoom === "path".
    // Logic for Riddle should be more like: If player is on path and they try to "use" the "door"
  } else if (action === "help") {
    console.log(playerObject.playerInstructions);
  }else if (action === "use" && target === "door") {
    console.log(door.actionOutcome);
  } else if (action === "use" && target === "moss") {
    console.log(moss.actionOutcome);
  } else if (action === "i" && playerObject.playerInventory > 0) {
    console.log(
      `You have` +
        playerObject.playerInventory.join() +
        `in your player inventory.`
    );
  } else console.log`You don't have any items in your inventory yet.`; // currently prints an array. Still need to turn it into st

  return start();
}

//ZORKINGTON
// Welcome Message with instructions for user
console.log(`\nWelcome to Patterned Path. You’re just in time.\n
You’ve just awoken in a dense and tangled wood. You don’t remember how you got here. Your feet are sore and blistered leading ya to figure you must've arrived by foot. A large bird swoops down towards you through the tangled life of the forest and lands beside you.\n
Note: Type "help" for more thorough instructions.`);

start();

/*--------------------------------SANITIZING FUNCTION -------------------------------------------*/
// // Create a function to scrub user input data
// function scrubUserInput(word) {
//   let scrubbedInput = word.toLowerCase().trim().split(" ");
//   return scrubbedInput;
// }

// // // If player inputs an ALLOWABLE ACTION on an ALLOWABLE ITEM, the game will provide next prompt
// console.log(scrubUserInput(userAction));
// let scrubResult = scrubUserInput(userAction); //This is the variable name for the function. This is what I need to pass
