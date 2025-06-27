export const CHARACTER_CLASSES = {
  BARBAAR: {
    id: 'barbaar',
    name: 'Barbaar',
    description: 'Sterk en kan veel drinken',
    baseStats: {
      alcoholTolerance: 15,
      stomachCapacity: 12,
      energy: 8
    },
    color: 'bg-red-600',
    sprite: '🧔‍♂️', // Viking warrior
    pixelArt: '🛡️'
  },
  MAGIËR: {
    id: 'magier',
    name: 'Magiër',
    description: 'Slimme drinker met trucs',
    baseStats: {
      alcoholTolerance: 8,
      stomachCapacity: 6,
      energy: 12
    },
    color: 'bg-purple-600',
    sprite: '🧙‍♂️', // Wizard
    pixelArt: '🔮'
  },
  SCHUTTER: {
    id: 'schutter',
    name: 'Schutter',
    description: 'Precies en snel',
    baseStats: {
      alcoholTolerance: 10,
      stomachCapacity: 8,
      energy: 15
    },
    color: 'bg-green-600',
    sprite: '🏹', // Archer
    pixelArt: '🎯'
  },
  PALADIJN: {
    id: 'paladijn',
    name: 'Paladijn',
    description: 'Eerlijk en standvastig',
    baseStats: {
      alcoholTolerance: 12,
      stomachCapacity: 10,
      energy: 10
    },
    color: 'bg-yellow-600',
    sprite: '⚔️', // Paladin
    pixelArt: '🛡️'
  }
};

export const HATS = {
  VIKING: {
    id: 'viking',
    name: 'Viking Helm',
    price: 0,
    sprite: '🎩',
    colors: ['🎩', '🪖', '⛑️'] // Normaal, Metal, Safety
  },
  WIZARD: {
    id: 'wizard',
    name: 'Tovenaarshoed',
    price: 100,
    sprite: '🧙',
    colors: ['🧙', '🎭', '🎪'] // Normaal, Theater, Circus
  },
  CROWN: {
    id: 'crown',
    name: 'Gouden Kroon',
    price: 500,
    sprite: '👑',
    colors: ['👑', '💎', '🌟'] // Goud, Diamant, Sterren
  },
  PIRATE: {
    id: 'pirate',
    name: 'Piratenhoed',
    price: 200,
    sprite: '🏴‍☠️',
    colors: ['🏴‍☠️', '🎩', '🎪'] // Pirate, Gentleman, Joker
  },
  PARTY: {
    id: 'party',
    name: 'Feesthoed',
    price: 50,
    sprite: '🎉',
    colors: ['🎉', '🎊', '🎈'] // Party, Confetti, Balloon
  }
};

export const SHOP_ITEMS = {
  // Kleding
  ARMOR_BASIC: {
    id: 'armor_basic',
    name: 'Leren Harnas',
    type: 'armor',
    price: 150,
    description: '+2 Alcoholtolerantie',
    stats: { alcoholTolerance: 2 }
  },
  ARMOR_CHAIN: {
    id: 'armor_chain',
    name: 'Maliënkolder',
    type: 'armor',
    price: 300,
    description: '+5 Alcoholtolerantie',
    stats: { alcoholTolerance: 5 }
  },
  BOOTS_SPEED: {
    id: 'boots_speed',
    name: 'Snelheidslaarzen',
    type: 'boots',
    price: 200,
    description: '+3 Energie',
    stats: { energy: 3 }
  },
  GLOVES_POWER: {
    id: 'gloves_power',
    name: 'Krachthandschoenen',
    type: 'gloves',
    price: 180,
    description: '+3 Maaginhoud',
    stats: { stomachCapacity: 3 }
  },
  // Speciale items
  LUCKY_CHARM: {
    id: 'lucky_charm',
    name: 'Geluksbrenger',
    type: 'accessory',
    price: 400,
    description: 'Dubbele XP voor 5 spellen',
    effect: 'double_xp'
  },
  BEER_SHIELD: {
    id: 'beer_shield',
    name: 'Bierschild',
    type: 'accessory',
    price: 350,
    description: 'Bescherming tegen 1 adtje',
    effect: 'protection'
  },
  // Echte items (munten)
  STRAW: {
    id: 'straw',
    name: 'Riet',
    type: 'real_item',
    price: 50,
    description: 'Drink sneller met een rietje',
    effect: 'faster_drinking',
    realItem: true
  },
  CIGARETTE: {
    id: 'cigarette',
    name: 'Peukie',
    type: 'real_item',
    price: 30,
    description: 'Een sigaret voor de pauze',
    effect: 'smoke_break',
    realItem: true
  },
  SNORKEL: {
    id: 'snorkel',
    name: 'Snorkel',
    type: 'real_item',
    price: 100,
    description: 'Drink onderwater',
    effect: 'underwater_drinking',
    realItem: true
  },
  NAPKIN: {
    id: 'napkin',
    name: 'Nakkie',
    type: 'real_item',
    price: 20,
    description: 'Veeg je mond af',
    effect: 'clean_mouth',
    realItem: true
  },
  // Penalty items (munten)
  ICE_CUBE: {
    id: 'ice_cube',
    name: 'IJsklontje',
    type: 'penalty',
    price: 25,
    description: 'Gooi in iemands drank',
    effect: 'cold_drink',
    penalty: true
  },
  SALT: {
    id: 'salt',
    name: 'Zout',
    type: 'penalty',
    price: 40,
    description: 'Maak drank zout',
    effect: 'salty_drink',
    penalty: true
  },
  HOT_SAUCE: {
    id: 'hot_sauce',
    name: 'Hete Saus',
    type: 'penalty',
    price: 60,
    description: 'Maak drank pittig',
    effect: 'spicy_drink',
    penalty: true
  },
  BUBBLE_WRAP: {
    id: 'bubble_wrap',
    name: 'Bubble Wrap',
    type: 'penalty',
    price: 35,
    description: 'Pop tijdens drinken',
    effect: 'distraction',
    penalty: true
  }
};

export const DRINKING_GAMES = [
  {
    id: 'mexican',
    name: 'Mexicaantje',
    description: 'Dobbelspel met bier',
    xpReward: 50,
    coinReward: 25
  },
  {
    id: 'kingsen',
    name: 'Kingsen',
    description: 'Kaartspel voor koningen',
    xpReward: 75,
    coinReward: 35
  },
  {
    id: 'flip_cup',
    name: 'Flip Cup',
    description: 'Team bekerflip wedstrijd',
    xpReward: 60,
    coinReward: 30
  },
  {
    id: 'beer_pong',
    name: 'Beer Pong',
    description: 'Klassieke beker gooien',
    xpReward: 80,
    coinReward: 40
  },
  {
    id: 'never_have_i',
    name: 'Ik Heb Nog Nooit',
    description: 'Onthul je geheimen',
    xpReward: 40,
    coinReward: 20
  }
];

export function calculateLevel(xp) {
  // Elke 100 XP is een level
  return Math.floor(xp / 100) + 1;
}

export function getXpForNextLevel(currentXp) {
  const currentLevel = calculateLevel(currentXp);
  return (currentLevel * 100) - currentXp;
}

export const GAME_RULES = {
  title: "🍺 Drinking RPG Regels",
  rules: [
    "🎯 Je verdient XP door pinten te verslinden",
    "⚔️ The Battle of the Pints - wie drinkt het snelst?",
    "🤮 Kotsen is 1 leven weg - je hebt er 3",
    "👸 Vrouwen zijn de eindbaas - we zijn bang voor vrouwen",
    "💰 Verdien zowel XP als munten door spellen te winnen",
    "🛒 Koop items met munten, behoud je XP voor levels",
    "🎁 Geef penalty items aan andere spelers",
    "🍺 Drink verantwoordelijk en heb plezier!"
  ]
};

export const WORLD_LEVELS = {
  1: {
    id: 1,
    name: 'Beer Pong Arena',
    description: 'Ga bierpongen!',
    task: 'Speel een potje beer pong. Win = 100 XP, Verlies = 50 XP',
    icon: '🏓',
    xpWin: 100,
    xpLose: 50
  },
  2: {
    id: 2,
    name: 'Push-up Challenge',
    description: 'Tijd voor beweging!',
    task: 'Doe 5 push-ups. Lukt het? 75 XP!',
    icon: '💪',
    xpReward: 75
  },
  3: {
    id: 3,
    name: 'Mexicaantje',
    description: 'Dobbelen maar!',
    task: 'Speel een rondje Mexicaantje. Elk biertje = 25 XP',
    icon: '🎲',
    xpPerBeer: 25
  },
  4: {
    id: 4,
    name: 'Shotje Tijd',
    description: 'Klein maar krachtig!',
    task: 'Neem een shotje naar keuze. 50 XP direct!',
    icon: '🥃',
    xpReward: 50
  },
  5: {
    id: 5,
    name: 'Flip Cup Team',
    description: 'Teamwork makes the dream work',
    task: 'Speel flip cup met je team. Win = 120 XP per persoon!',
    icon: '🍺',
    xpReward: 120
  },
  6: {
    id: 6,
    name: 'Karaoke Boss',
    description: 'Tijd om te zingen!',
    task: 'Zing een nummer naar keuze. Applaus = 80 XP!',
    icon: '🎤',
    xpReward: 80
  },
  7: {
    id: 7,
    name: 'Chug Contest',
    description: 'De klassieke adtje wedstrijd',
    task: 'Ad een biertje. Snelste tijd = 150 XP, rest = 75 XP',
    icon: '🍻',
    xpWin: 150,
    xpLose: 75
  },
  8: {
    id: 8,
    name: 'Truth or Dare',
    description: 'Waarheid of Durven',
    task: 'Kies waarheid of durven. Voltooi = 60 XP',
    icon: '😈',
    xpReward: 60
  },
  9: {
    id: 9,
    name: 'Kingsen',
    description: 'Kaarten en drank',
    task: 'Speel een rondje Kingsen. Per regel = 20 XP',
    icon: '👑',
    xpPerRule: 20
  },
  10: {
    id: 10,
    name: 'Final Boss',
    description: 'De ultieme uitdaging',
    task: 'Daag de admin uit voor een duel naar keuze. Win = 300 XP!',
    icon: '🏆',
    xpReward: 300
  }
};