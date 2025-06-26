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