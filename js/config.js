// ============================================================
// config.js — Global constants, save system, level definitions
// ============================================================

const GAME_W = 1280;
const GAME_H = 720;
const LEVEL_W = 5000;
const SAVE_KEY = 'wordrunner_save_v1';
window.GAME_SPEED = 1.0;
window.CURRENT_WORD = 'CAT';
window.CURRENT_LEVEL = 1;
window.CURRENT_CHAR = 'bun';

function getDefaultSave() {
  return {
    character: 'bun',
    unlockedLevels: [1],
    levelStars: {},
    highScores: {},
    wordHistory: [],
    totalScore: 0
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return Object.assign(getDefaultSave(), data);
    }
  } catch(e) {}
  return getDefaultSave();
}

function writeSave(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch(e) {}
}

window.SAVE = loadSave();

// ---- Character definitions ----
const CHARACTERS = {
  bun: {
    name: 'Bun',
    subtitle: 'The Rabbit',
    ability: 'DOUBLE JUMP',
    abilityDesc: 'Jump again mid-air!',
    speed: 240,
    jumpStrength: -580,
    doubleJump: true,
    dash: false,
    color: 0xFFF5E0,
    accentColor: 0xFF99BB
  },
  fang: {
    name: 'Fang',
    subtitle: 'The Wolf',
    ability: 'DASH',
    abilityDesc: 'Burst forward with speed!',
    speed: 220,
    jumpStrength: -560,
    doubleJump: false,
    dash: true,
    color: 0x8899BB,
    accentColor: 0x44AA55
  }
};

// ---- Level definitions ----
const LEVELS = [
  {
    id: 1,
    name: 'Enchanted Forest',
    emoji: '🌲',
    theme: 'forest',
    suggestions: ['CAT', 'DOG', 'TREE', 'JUMP', 'STAR'],
    skyTopColor: '#1a3a5c',
    skyBottomColor: '#4a8cbf',
    groundColor: '#3A7D44',
    platformColor: '#A0522D',
    accentColor: '#FFD700',
    enemyTypes: ['turtle'],
    enemySpeed: 60,
    music: 'forest'
  },
  {
    id: 2,
    name: 'Crystal Caves',
    emoji: '💎',
    theme: 'cave',
    suggestions: ['GEM', 'ROCK', 'CAVE', 'MINE', 'DARK'],
    skyTopColor: '#0a0a2e',
    skyBottomColor: '#1a1a4e',
    groundColor: '#4a3060',
    platformColor: '#6644AA',
    accentColor: '#88DDFF',
    enemyTypes: ['turtle'],
    enemySpeed: 70,
    music: 'cave'
  },
  {
    id: 3,
    name: 'Sky Kingdom',
    emoji: '☁️',
    theme: 'sky',
    suggestions: ['BIRD', 'WIND', 'CLOUD', 'FLY', 'BLUE'],
    skyTopColor: '#88CCFF',
    skyBottomColor: '#DDEEFF',
    groundColor: '#FFFFFF',
    platformColor: '#EEEEEE',
    accentColor: '#FFDD44',
    enemyTypes: ['turtle'],
    enemySpeed: 80,
    music: 'sky'
  },
  {
    id: 4,
    name: 'Lava Land',
    emoji: '🌋',
    theme: 'lava',
    suggestions: ['FIRE', 'LAVA', 'BURN', 'HOT', 'EMBER'],
    skyTopColor: '#3a0a00',
    skyBottomColor: '#8a2000',
    groundColor: '#CC3300',
    platformColor: '#882200',
    accentColor: '#FF8800',
    enemyTypes: ['turtle'],
    enemySpeed: 85,
    music: 'lava'
  },
  {
    id: 5,
    name: 'Ocean Depths',
    emoji: '🌊',
    theme: 'ocean',
    suggestions: ['FISH', 'WAVE', 'DEEP', 'BLUE', 'SWIM'],
    skyTopColor: '#001a33',
    skyBottomColor: '#003366',
    groundColor: '#004488',
    platformColor: '#0066AA',
    accentColor: '#00DDFF',
    enemyTypes: ['turtle'],
    enemySpeed: 65,
    music: 'ocean'
  },
  {
    id: 6,
    name: 'Candy World',
    emoji: '🍭',
    theme: 'candy',
    suggestions: ['CAKE', 'SWEET', 'PINK', 'SUGAR', 'YUMMY'],
    skyTopColor: '#ff88cc',
    skyBottomColor: '#ffbbee',
    groundColor: '#FF66AA',
    platformColor: '#FF99DD',
    accentColor: '#FFFF00',
    enemyTypes: ['turtle'],
    enemySpeed: 70,
    music: 'candy'
  },
  {
    id: 7,
    name: 'Robot City',
    emoji: '🤖',
    theme: 'city',
    suggestions: ['ROBOT', 'GEAR', 'METAL', 'CITY', 'CODE'],
    skyTopColor: '#111122',
    skyBottomColor: '#223344',
    groundColor: '#334455',
    platformColor: '#445566',
    accentColor: '#00FF88',
    enemyTypes: ['turtle'],
    enemySpeed: 90,
    music: 'city'
  },
  {
    id: 8,
    name: 'Ice Peak',
    emoji: '❄️',
    theme: 'ice',
    suggestions: ['SNOW', 'COLD', 'FROST', 'ICE', 'WINTER'],
    skyTopColor: '#aaccee',
    skyBottomColor: '#ddeeff',
    groundColor: '#AACCDD',
    platformColor: '#BBDDEE',
    accentColor: '#FFFFFF',
    enemyTypes: ['turtle'],
    enemySpeed: 75,
    music: 'ice'
  },
  {
    id: 9,
    name: 'Thunder Storm',
    emoji: '⚡',
    theme: 'storm',
    suggestions: ['STORM', 'RAIN', 'CLOUD', 'BOLT', 'DARK'],
    skyTopColor: '#1a1a2a',
    skyBottomColor: '#2a2a4a',
    groundColor: '#3a3a5a',
    platformColor: '#4a4a6a',
    accentColor: '#FFFF00',
    enemyTypes: ['turtle'],
    enemySpeed: 95,
    music: 'storm'
  },
  {
    id: 10,
    name: 'Space Station',
    emoji: '🚀',
    theme: 'space',
    suggestions: ['STAR', 'MOON', 'SPACE', 'PLANET', 'COMET'],
    skyTopColor: '#000011',
    skyBottomColor: '#000033',
    groundColor: '#111133',
    platformColor: '#222244',
    accentColor: '#FF88FF',
    enemyTypes: ['turtle'],
    enemySpeed: 100,
    music: 'space'
  }
];

// ---- Level 1 Layout ----
const LEVEL_LAYOUTS = {
  1: {
    startX: 120,
    startY: 600,
    goalX: 4750,
    platforms: [
      // Ground chunks (gaps between them create pits)
      { type: 'ground', x: 0,    y: 670, w: 900,  h: 60 },
      { type: 'ground', x: 1000, y: 670, w: 700,  h: 60 },
      { type: 'ground', x: 1800, y: 670, w: 600,  h: 60 },
      { type: 'ground', x: 2500, y: 670, w: 800,  h: 60 },
      { type: 'ground', x: 3400, y: 670, w: 700,  h: 60 },
      { type: 'ground', x: 4200, y: 670, w: 800,  h: 60 },

      // Floating platforms
      { type: 'float', x: 200,  y: 530, w: 120, h: 24 },
      { type: 'float', x: 420,  y: 460, w: 120, h: 24 },
      { type: 'float', x: 640,  y: 510, w: 120, h: 24 },
      { type: 'float', x: 860,  y: 450, w: 150, h: 24 },
      { type: 'float', x: 980,  y: 540, w: 120, h: 24 },
      { type: 'float', x: 1150, y: 490, w: 130, h: 24 },
      { type: 'float', x: 1350, y: 430, w: 140, h: 24 },
      { type: 'float', x: 1550, y: 500, w: 120, h: 24 },
      { type: 'float', x: 1720, y: 540, w: 120, h: 24 },
      { type: 'float', x: 1900, y: 480, w: 130, h: 24 },
      { type: 'float', x: 2100, y: 430, w: 150, h: 24 },
      { type: 'float', x: 2300, y: 510, w: 120, h: 24 },
      { type: 'float', x: 2600, y: 460, w: 130, h: 24 },
      { type: 'float', x: 2800, y: 520, w: 120, h: 24 },
      { type: 'float', x: 3000, y: 470, w: 140, h: 24 },
      { type: 'float', x: 3200, y: 430, w: 120, h: 24 },
      { type: 'float', x: 3500, y: 490, w: 130, h: 24 },
      { type: 'float', x: 3700, y: 450, w: 120, h: 24 },
      { type: 'float', x: 3900, y: 510, w: 120, h: 24 },
      { type: 'float', x: 4100, y: 480, w: 140, h: 24 },
      { type: 'float', x: 4350, y: 440, w: 130, h: 24 },
      { type: 'float', x: 4580, y: 500, w: 120, h: 24 }
    ],
    enemies: [
      { x: 350,  y: 640, type: 'turtle' },
      { x: 700,  y: 640, type: 'turtle' },
      { x: 1100, y: 640, type: 'turtle' },
      { x: 1400, y: 640, type: 'turtle' },
      { x: 1950, y: 640, type: 'turtle' },
      { x: 2200, y: 640, type: 'turtle' },
      { x: 2700, y: 640, type: 'turtle' },
      { x: 3000, y: 640, type: 'turtle' },
      { x: 3600, y: 640, type: 'turtle' },
      { x: 4300, y: 640, type: 'turtle' }
    ],
    letterSlots: [
      { x: 200,  y: 490 },
      { x: 480,  y: 420 },
      { x: 860,  y: 410 },
      { x: 1200, y: 450 },
      { x: 1550, y: 460 },
      { x: 1900, y: 440 },
      { x: 2300, y: 470 },
      { x: 2800, y: 480 },
      { x: 3350, y: 450 },
      { x: 3900, y: 470 }
    ]
  }
};

// ---- Scoring ----
function calcScore(numLetters, seconds, heartsLeft, combo) {
  const base = numLetters * 100;
  const timeBonus = Math.max(0, 5000 - Math.floor(seconds) * 10);
  const heartBonus = heartsLeft * 500;
  const comboBonus = combo * 50;
  return base + timeBonus + heartBonus + comboBonus;
}

function calcStars(numLetters, collected, seconds, heartsLeft, failed) {
  if (failed || collected < numLetters) return 0;
  if (heartsLeft === 3 && seconds < 60) return 3;
  if (heartsLeft >= 2 || seconds < 90) return 2;
  return 1;
}

function starLabel(stars) {
  const filled = '⭐'.repeat(stars);
  const empty = '☆'.repeat(3 - stars);
  return filled + empty;
}
