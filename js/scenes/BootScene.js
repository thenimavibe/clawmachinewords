// ============================================================
// scenes/BootScene.js — Generates ALL textures procedurally
// ============================================================

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this._generateTextures();
    this._createAnimations();
    this.scene.start('TitleScene');
  }

  _generateTextures() {
    const g = this.add.graphics();

    // ----------------------------------------------------------------
    // BUN CHARACTER FRAMES
    // ----------------------------------------------------------------
    this._genBunFrames(g);

    // ----------------------------------------------------------------
    // FANG CHARACTER FRAMES
    // ----------------------------------------------------------------
    this._genFangFrames(g);

    // ----------------------------------------------------------------
    // ENEMIES
    // ----------------------------------------------------------------
    this._genEnemyFrames(g);

    // ----------------------------------------------------------------
    // PLATFORMS
    // ----------------------------------------------------------------
    this._genPlatforms(g);

    // ----------------------------------------------------------------
    // BACKGROUNDS
    // ----------------------------------------------------------------
    this._genBackgrounds(g);

    // ----------------------------------------------------------------
    // UI
    // ----------------------------------------------------------------
    this._genUI(g);

    // ----------------------------------------------------------------
    // MISC
    // ----------------------------------------------------------------
    this._genMisc(g);

    g.destroy();
  }

  // ---- BUN (Rabbit) ----
  _genBunFrames(g) {
    const CREAM = 0xFFF5E0;
    const CREAMDK = 0xFFEDD8;
    const PINK = 0xFF99BB;
    const EARINNER = 0xFFBBCC;
    const RED = 0xDD3333;
    const BLACK = 0x221100;
    const WHITE = 0xFFFFFF;
    const ROSYCHEEK = 0xFFCCCC;

    // Helper: draw bun body
    const drawBun = (opts = {}) => {
      const {
        earTiltL = 0, earTiltR = 0,
        legL = 0, legR = 0,
        armL = 0, armR = 0,
        eyeOff = 0,
        legsTucked = false,
        smile = false,
        hurt = false
      } = opts;

      // bg
      g.clear();

      // Body
      g.fillStyle(CREAMDK, 1);
      g.fillEllipse(32, 54, 36, 40);
      g.fillStyle(CREAM, 1);
      g.fillEllipse(32, 50, 32, 36);

      // Left ear
      g.fillStyle(CREAMDK, 1);
      g.fillRoundedRect(18 + earTiltL - 2, 0, 11, 32, 5);
      g.fillStyle(EARINNER, 0.8);
      g.fillRoundedRect(20 + earTiltL, 3, 7, 26, 4);

      // Right ear
      g.fillStyle(CREAMDK, 1);
      g.fillRoundedRect(35 + earTiltR, 0, 11, 32, 5);
      g.fillStyle(EARINNER, 0.8);
      g.fillRoundedRect(37 + earTiltR, 3, 7, 26, 4);

      // Tail
      g.fillStyle(WHITE, 0.9);
      g.fillCircle(50, 52, 7);

      // Eyes
      g.fillStyle(BLACK, 1);
      g.fillCircle(26 + eyeOff, 39, 4);
      g.fillCircle(38 + eyeOff, 39, 4);
      g.fillStyle(WHITE, 1);
      g.fillCircle(28 + eyeOff, 37, 1.5);
      g.fillCircle(40 + eyeOff, 37, 1.5);

      // Nose
      g.fillStyle(PINK, 1);
      g.fillEllipse(32, 44, 7, 5);

      // Rosy cheeks
      g.fillStyle(ROSYCHEEK, 0.4);
      g.fillCircle(22, 43, 6);
      g.fillCircle(42, 43, 6);

      // Smile
      if (smile) {
        g.lineStyle(2, BLACK, 0.8);
        g.beginPath();
        g.arc(32, 46, 6, 0, Math.PI, false);
        g.strokePath();
      }

      // Red sneakers
      if (legsTucked) {
        g.fillStyle(RED, 1);
        g.fillRoundedRect(18, 60, 14, 9, 4);
        g.fillRoundedRect(32, 58, 14, 9, 4);
        g.fillStyle(WHITE, 0.4);
        g.fillRoundedRect(19, 61, 8, 3, 2);
        g.fillRoundedRect(33, 59, 8, 3, 2);
      } else {
        // Left leg
        g.fillStyle(CREAM, 1);
        g.fillRect(20, 64 + legL, 10, 8);
        g.fillStyle(RED, 1);
        g.fillRoundedRect(16 + legL * 0.3, 70 + legL, 15, 9, 4);
        g.fillStyle(WHITE, 0.4);
        g.fillRoundedRect(17 + legL * 0.3, 71 + legL, 8, 3, 2);

        // Right leg
        g.fillStyle(CREAM, 1);
        g.fillRect(34, 64 + legR, 10, 8);
        g.fillStyle(RED, 1);
        g.fillRoundedRect(32 + legR * 0.3, 70 + legR, 15, 9, 4);
        g.fillStyle(WHITE, 0.4);
        g.fillRoundedRect(33 + legR * 0.3, 71 + legR, 8, 3, 2);
      }

      // Arms
      g.fillStyle(CREAMDK, 1);
      g.fillRoundedRect(10, 47 + armL, 10, 14, 4);
      g.fillRoundedRect(44, 47 + armR, 10, 14, 4);

      // Hurt overlay
      if (hurt) {
        g.fillStyle(0xFF0000, 0.35);
        g.fillEllipse(32, 45, 50, 60);
      }

      // Victory arms raised
      if (opts.victory) {
        g.clear();
        // Redraw with arms up
        g.fillStyle(CREAMDK, 1);
        g.fillEllipse(32, 54, 36, 40);
        g.fillStyle(CREAM, 1);
        g.fillEllipse(32, 50, 32, 36);

        g.fillStyle(CREAMDK, 1);
        g.fillRoundedRect(18, 0, 11, 32, 5);
        g.fillStyle(EARINNER, 0.8);
        g.fillRoundedRect(20, 3, 7, 26, 4);
        g.fillStyle(CREAMDK, 1);
        g.fillRoundedRect(35, 0, 11, 32, 5);
        g.fillStyle(EARINNER, 0.8);
        g.fillRoundedRect(37, 3, 7, 26, 4);

        g.fillStyle(WHITE, 0.9);
        g.fillCircle(50, 52, 7);

        g.fillStyle(BLACK, 1);
        g.fillCircle(26, 39, 4);
        g.fillCircle(38, 39, 4);
        g.fillStyle(WHITE, 1);
        g.fillCircle(28, 37, 1.5);
        g.fillCircle(40, 37, 1.5);
        g.fillStyle(PINK, 1);
        g.fillEllipse(32, 44, 7, 5);
        g.fillStyle(ROSYCHEEK, 0.5);
        g.fillCircle(22, 43, 6);
        g.fillCircle(42, 43, 6);

        // Big smile
        g.lineStyle(2.5, BLACK, 0.8);
        g.beginPath();
        g.arc(32, 44, 7, 0.1, Math.PI - 0.1, false);
        g.strokePath();

        // Legs standing
        g.fillStyle(CREAM, 1);
        g.fillRect(22, 64, 10, 8);
        g.fillRect(32, 64, 10, 8);
        g.fillStyle(RED, 1);
        g.fillRoundedRect(18, 70, 15, 9, 4);
        g.fillRoundedRect(31, 70, 15, 9, 4);
        g.fillStyle(WHITE, 0.4);
        g.fillRoundedRect(19, 71, 8, 3, 2);
        g.fillRoundedRect(32, 71, 8, 3, 2);

        // Arms raised
        g.fillStyle(CREAMDK, 1);
        g.fillRoundedRect(8, 32, 10, 14, 4);
        g.fillRoundedRect(46, 32, 10, 14, 4);
      }
    };

    // idle-0: neutral
    drawBun({ earTiltL: 0, earTiltR: 0, legL: 0, legR: 0 });
    g.generateTexture('bun-idle-0', 64, 80);

    // idle-1: ears slightly tilted
    drawBun({ earTiltL: -2, earTiltR: 2, legL: 0, legR: 0 });
    g.generateTexture('bun-idle-1', 64, 80);

    // run-0: left leg forward
    drawBun({ legL: -5, legR: 5 });
    g.generateTexture('bun-run-0', 64, 80);

    // run-1: center
    drawBun({ legL: 0, legR: 0 });
    g.generateTexture('bun-run-1', 64, 80);

    // run-2: right leg forward
    drawBun({ legL: 5, legR: -5 });
    g.generateTexture('bun-run-2', 64, 80);

    // run-3: center
    drawBun({ legL: 0, legR: 0 });
    g.generateTexture('bun-run-3', 64, 80);

    // jump-0: legs tucked, ears back
    drawBun({ earTiltL: -5, earTiltR: 5, legsTucked: true });
    g.generateTexture('bun-jump-0', 64, 80);

    // hurt-0: red tint
    drawBun({ hurt: true });
    g.generateTexture('bun-hurt-0', 64, 80);

    // victory-0: arms raised, smile
    drawBun({ victory: true });
    g.generateTexture('bun-victory-0', 64, 80);

    // victory-1: same with ear wiggle
    drawBun({ victory: true, earTiltL: -3, earTiltR: 3 });
    g.generateTexture('bun-victory-1', 64, 80);
  }

  // ---- FANG (Wolf) ----
  _genFangFrames(g) {
    const GREY = 0x8899BB;
    const GREYDK = 0x667799;
    const GREYDKK = 0x445577;
    const YELLOW = 0xFFDD44;
    const GREEN = 0x44AA55;
    const WHITE = 0xFFFFFF;
    const BLACK = 0x221100;
    const SNOUTCOLOR = 0xCCDDEE;

    const drawFang = (opts = {}) => {
      const {
        legL = 0, legR = 0,
        legsTucked = false,
        hurt = false,
        victory = false
      } = opts;

      g.clear();

      // Body
      g.fillStyle(GREYDKK, 1);
      g.fillRoundedRect(16, 38, 32, 34, 6);
      g.fillStyle(GREY, 1);
      g.fillRoundedRect(18, 36, 28, 30, 6);

      // Green jacket stripe
      g.fillStyle(GREEN, 1);
      g.fillRect(20, 44, 24, 4);
      g.fillRect(20, 50, 24, 4);

      // Ears (sharp triangles)
      g.fillStyle(GREYDKK, 1);
      g.fillTriangle(16, 28, 23, 0, 30, 28);
      g.fillTriangle(34, 28, 41, 0, 48, 28);
      // Inner ear
      g.fillStyle(0xBBCCDD, 0.6);
      g.fillTriangle(19, 26, 24, 6, 28, 26);
      g.fillTriangle(36, 26, 42, 6, 45, 26);

      // Head
      g.fillStyle(GREY, 1);
      g.fillEllipse(32, 34, 36, 32);
      g.fillStyle(SNOUTCOLOR, 1);
      g.fillEllipse(32, 42, 20, 12);

      // Eyes (angular, yellow)
      g.fillStyle(YELLOW, 1);
      g.fillEllipse(25, 31, 8, 7);
      g.fillEllipse(39, 31, 8, 7);
      g.fillStyle(BLACK, 1);
      g.fillEllipse(26, 31, 4, 5);
      g.fillEllipse(40, 31, 4, 5);
      g.fillStyle(WHITE, 1);
      g.fillCircle(27, 30, 1.5);
      g.fillCircle(41, 30, 1.5);

      // Nose
      g.fillStyle(BLACK, 1);
      g.fillEllipse(32, 42, 6, 4);

      // Tail
      g.fillStyle(GREYDKK, 1);
      g.fillEllipse(52, 52, 12, 8);

      if (legsTucked) {
        // Legs tucked for jump
        g.fillStyle(GREY, 1);
        g.fillRoundedRect(18, 60, 12, 8, 3);
        g.fillRoundedRect(34, 58, 12, 8, 3);
        g.fillStyle(WHITE, 1);
        g.fillRoundedRect(16, 64, 15, 8, 4);
        g.fillRoundedRect(32, 62, 15, 8, 4);
        g.fillStyle(0x444444, 0.3);
        g.fillRect(17, 65, 8, 3);
        g.fillRect(33, 63, 8, 3);
      } else {
        // Legs
        g.fillStyle(GREY, 1);
        g.fillRect(20, 64 + legL, 10, 8);
        g.fillRect(34, 64 + legR, 10, 8);
        // White sneakers
        g.fillStyle(WHITE, 1);
        g.fillRoundedRect(16 + legL * 0.3, 70 + legL, 16, 9, 4);
        g.fillRoundedRect(32 + legR * 0.3, 70 + legR, 16, 9, 4);
        g.fillStyle(0x444444, 0.3);
        g.fillRect(17 + legL * 0.3, 71 + legL, 8, 3);
        g.fillRect(33 + legR * 0.3, 71 + legR, 8, 3);
      }

      // Arms
      g.fillStyle(GREYDKK, 1);
      if (victory) {
        g.fillRoundedRect(8, 30, 9, 14, 3);
        g.fillRoundedRect(47, 30, 9, 14, 3);
      } else {
        g.fillRoundedRect(9, 47, 9, 14, 3);
        g.fillRoundedRect(46, 47, 9, 14, 3);
      }

      if (hurt) {
        g.fillStyle(0xFF0000, 0.35);
        g.fillEllipse(32, 45, 52, 62);
      }
    };

    drawFang({});
    g.generateTexture('fang-idle-0', 64, 80);

    // idle-1: slight tilt (same pose, animation variety comes from timing)
    drawFang({});
    g.generateTexture('fang-idle-1', 64, 80);

    drawFang({ legL: -5, legR: 5 });
    g.generateTexture('fang-run-0', 64, 80);

    drawFang({ legL: 0, legR: 0 });
    g.generateTexture('fang-run-1', 64, 80);

    drawFang({ legL: 5, legR: -5 });
    g.generateTexture('fang-run-2', 64, 80);

    drawFang({ legL: 0, legR: 0 });
    g.generateTexture('fang-run-3', 64, 80);

    drawFang({ legsTucked: true });
    g.generateTexture('fang-jump-0', 64, 80);

    drawFang({ hurt: true });
    g.generateTexture('fang-hurt-0', 64, 80);

    drawFang({ victory: true, legL: 0, legR: 0 });
    g.generateTexture('fang-victory-0', 64, 80);

    drawFang({ victory: true, legL: -3, legR: 3 });
    g.generateTexture('fang-victory-1', 64, 80);
  }

  // ---- ENEMIES ----
  _genEnemyFrames(g) {
    const TGREEN = 0x3D9B3D;
    const TSHELL = 0x2E7A2E;
    const TSHELLDK = 0x205420;
    const YELLOW = 0xFFEE88;
    const BLACK = 0x111111;

    const drawTurtle = (legSwap = false, squished = false) => {
      g.clear();

      const h = squished ? 28 : 48;
      const shellY = squished ? 6 : 16;
      const bodyY = squished ? 4 : 14;
      const legOffL = legSwap ? 6 : 0;
      const legOffR = legSwap ? 0 : 6;

      // Shell
      g.fillStyle(TSHELLDK, 1);
      g.fillEllipse(28, shellY + 4, 40, squished ? 22 : 32);
      g.fillStyle(TSHELL, 1);
      g.fillEllipse(28, shellY, 38, squished ? 20 : 30);

      // Shell pattern (hexagons approximated)
      g.fillStyle(TSHELLDK, 0.5);
      if (!squished) {
        g.fillEllipse(28, shellY - 2, 12, 10);
        g.fillEllipse(18, shellY + 4, 10, 8);
        g.fillEllipse(38, shellY + 4, 10, 8);
        g.fillEllipse(24, shellY + 10, 10, 8);
        g.fillEllipse(34, shellY + 10, 10, 8);
      }

      // Body / head
      if (!squished) {
        g.fillStyle(TGREEN, 1);
        g.fillEllipse(28, bodyY, 28, 26);

        // Head
        g.fillStyle(TGREEN, 1);
        g.fillCircle(40, bodyY - 2, 12);

        // Eyes
        g.fillStyle(YELLOW, 1);
        g.fillCircle(44, bodyY - 6, 4);
        g.fillStyle(BLACK, 1);
        g.fillCircle(45, bodyY - 6, 2);
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(45.5, bodyY - 7, 0.8);

        // Mouth smile
        g.lineStyle(1.5, BLACK, 0.7);
        g.beginPath();
        g.arc(40, bodyY + 1, 5, 0, Math.PI * 0.7, false);
        g.strokePath();

        // Feet
        g.fillStyle(TGREEN, 1);
        g.fillEllipse(14, bodyY + 20 + legOffL, 10, 8);
        g.fillEllipse(28, bodyY + 22 + legOffR, 10, 8);
        g.fillEllipse(40, bodyY + 20 + legOffL, 10, 8);
      }
    };

    drawTurtle(false, false);
    g.generateTexture('enemy-turtle-0', 56, 48);

    drawTurtle(true, false);
    g.generateTexture('enemy-turtle-1', 56, 48);

    drawTurtle(false, true);
    g.generateTexture('enemy-turtle-stomp', 56, 28);
  }

  // ---- PLATFORMS ----
  _genPlatforms(g) {
    // Ground forest tile: 64×32
    g.clear();
    g.fillStyle(0x5C3A1E, 1);
    g.fillRect(0, 8, 64, 24);
    g.fillStyle(0x3A7D44, 1);
    g.fillRect(0, 0, 64, 12);
    // Grass detail
    g.fillStyle(0x4A9455, 0.7);
    for (let x = 4; x < 64; x += 10) {
      g.fillTriangle(x, 0, x + 4, 0, x + 2, -4);
      g.fillTriangle(x + 5, 2, x + 9, 2, x + 7, -3);
    }
    // Dirt texture
    g.fillStyle(0x4A2E18, 0.4);
    g.fillCircle(15, 20, 3);
    g.fillCircle(35, 24, 2.5);
    g.fillCircle(52, 18, 3);
    g.generateTexture('platform-ground-forest', 64, 32);

    // Floating plank: 120×24
    g.clear();
    g.fillStyle(0x7A4020, 1);
    g.fillRoundedRect(0, 4, 120, 20, 6);
    g.fillStyle(0xA0602D, 1);
    g.fillRoundedRect(0, 2, 120, 16, 5);
    // Wood grain
    g.fillStyle(0xBB7040, 0.5);
    g.fillRoundedRect(4, 4, 30, 10, 3);
    g.fillRoundedRect(38, 4, 30, 10, 3);
    g.fillRoundedRect(74, 4, 30, 10, 3);
    // Top edge highlight
    g.fillStyle(0xCCCC88, 0.3);
    g.fillRect(2, 2, 116, 3);
    // Small mushroom on top
    g.fillStyle(0xCC4444, 1);
    g.fillEllipse(110, -2, 16, 10);
    g.fillStyle(0x884422, 1);
    g.fillRect(108, 2, 4, 8);
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillCircle(106, -3, 2);
    g.fillCircle(112, -4, 2);
    g.generateTexture('platform-float-forest', 120, 24);
  }

  // ---- BACKGROUNDS ----
  _genBackgrounds(g) {
    // Sky gradient: 1280×400 (20 bands for performance)
    g.clear();
    const STEPS = 20;
    const bandH = Math.ceil(400 / STEPS);
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const r = Math.round(26 + (100 - 26) * t);
      const gr = Math.round(58 + (160 - 58) * t);
      const b = Math.round(92 + (200 - 92) * t);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      g.fillRect(0, i * bandH, 1280, bandH + 1);
    }
    g.generateTexture('bg-sky-forest', 1280, 400);

    // Far trees: 1280×250 silhouette
    g.clear();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 1280, 250);
    g.fillStyle(0x1A4D2E, 0.8);
    // Draw tree silhouettes
    for (let x = 0; x < 1280; x += 80) {
      const h = 120 + (x % 160 === 0 ? 30 : 0);
      // Tree trunk
      g.fillRect(x + 36, 250 - h / 3, 8, h / 3);
      // Tree canopy triangle
      g.fillTriangle(x + 10, 250 - h / 3 + 10, x + 40, 250 - h, x + 70, 250 - h / 3 + 10);
      g.fillTriangle(x + 16, 250 - h / 2 - 10, x + 40, 250 - h - 20, x + 64, 250 - h / 2 - 10);
    }
    g.generateTexture('bg-far-trees', 1280, 250);

    // Mid trees: 1280×180
    g.clear();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 1280, 180);
    g.fillStyle(0x2D6E3E, 0.85);
    for (let x = 0; x < 1280; x += 60) {
      const h = 100 + (x % 120 === 0 ? 20 : -10);
      g.fillRect(x + 26, 180 - h / 3, 8, h / 3);
      g.fillTriangle(x + 5, 180 - h / 3 + 5, x + 30, 180 - h, x + 55, 180 - h / 3 + 5);
      g.fillTriangle(x + 10, 180 - h / 2 - 5, x + 30, 180 - h - 15, x + 50, 180 - h / 2 - 5);
    }
    g.generateTexture('bg-mid-trees', 1280, 180);

    // Ground strip: 1280×100
    g.clear();
    g.fillStyle(0x3A7D44, 1);
    g.fillRect(0, 0, 1280, 40);
    // Rolling hills
    g.fillStyle(0x4A8D55, 0.5);
    for (let x = 0; x < 1280; x += 200) {
      g.fillEllipse(x + 100, 20, 220, 50);
    }
    g.fillStyle(0x2A6030, 1);
    g.fillRect(0, 36, 1280, 64);
    g.generateTexture('bg-ground-forest', 1280, 100);

    // Mushroom decoration
    g.clear();
    // Cap
    g.fillStyle(0xCC3333, 1);
    g.fillEllipse(24, 14, 48, 28);
    g.fillStyle(0xFF5555, 0.5);
    g.fillEllipse(16, 10, 14, 10);
    // White spots
    g.fillStyle(0xFFFFFF, 0.85);
    g.fillCircle(16, 12, 4);
    g.fillCircle(28, 8, 3);
    g.fillCircle(36, 13, 4);
    // Stem
    g.fillStyle(0xFFEEDD, 1);
    g.fillRoundedRect(14, 24, 20, 24, 4);
    // Stem detail
    g.fillStyle(0xEEDDCC, 0.5);
    g.fillRect(16, 26, 4, 20);
    g.generateTexture('bg-mushroom-1', 48, 48);

    // Single tree
    g.clear();
    // Trunk
    g.fillStyle(0x5C3A1E, 1);
    g.fillRoundedRect(28, 60, 24, 60, 4);
    // Canopy layers
    g.fillStyle(0x2D6E3E, 1);
    g.fillTriangle(0, 80, 40, 10, 80, 80);
    g.fillStyle(0x3A8D50, 0.8);
    g.fillTriangle(8, 65, 40, 0, 72, 65);
    g.fillStyle(0x4AA060, 0.5);
    g.fillTriangle(14, 55, 40, 5, 66, 55);
    g.generateTexture('bg-tree-1', 80, 120);

    // Title background: 1280×720 (banded gradient)
    g.clear();
    const TBANDS = 24;
    const tbandH = Math.ceil(720 / TBANDS);
    for (let i = 0; i < TBANDS; i++) {
      const t = i / TBANDS;
      const r = Math.round(8 + (25 - 8) * t);
      const gr = Math.round(5 + (10 - 5) * t);
      const b = Math.round(30 + (60 - 30) * t);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      g.fillRect(0, i * tbandH, 1280, tbandH + 1);
    }
    // Star field
    g.fillStyle(0xFFFFFF, 0.8);
    const starPositions = [
      [100,50],[300,120],[500,80],[700,40],[900,100],[1100,60],[1200,150],
      [200,200],[400,160],[600,200],[800,180],[1000,160],[150,300],[350,250],
      [550,280],[750,320],[950,240],[1150,300],[80,400],[280,380],[480,420],
      [680,360],[880,400],[1080,380],[1250,450],[50,500],[250,480],[450,520],
      [650,460],[850,500],[1050,480],[1180,540],[120,600],[320,560],[520,580],
      [720,620],[920,560],[1120,600],[200,680],[400,660],[600,700],[800,650],
      [1000,680],[1220,670]
    ];
    starPositions.forEach(([x, y]) => {
      const size = Math.random() < 0.3 ? 2 : 1;
      g.fillRect(x, y, size, size);
    });
    g.generateTexture('title-bg', 1280, 720);
  }

  // ---- UI ----
  _genUI(g) {
    // Heart full: 32×32
    g.clear();
    g.fillStyle(0xFF3344, 1);
    g.fillCircle(11, 11, 9);
    g.fillCircle(21, 11, 9);
    g.fillTriangle(2, 12, 16, 30, 30, 12);
    g.fillStyle(0xFF8899, 0.5);
    g.fillCircle(8, 8, 4);
    g.generateTexture('ui-heart-full', 32, 32);

    // Heart empty: 32×32
    g.clear();
    g.fillStyle(0x444455, 1);
    g.fillCircle(11, 11, 9);
    g.fillCircle(21, 11, 9);
    g.fillTriangle(2, 12, 16, 30, 30, 12);
    g.fillStyle(0x222233, 0.7);
    g.fillCircle(11, 11, 7);
    g.fillCircle(21, 11, 7);
    g.fillTriangle(4, 12, 16, 27, 28, 12);
    g.generateTexture('ui-heart-empty', 32, 32);

    // Star full: 32×32
    g.clear();
    g.fillStyle(0xFFCC00, 1);
    // Star shape
    const starPts = this._starPoints(16, 16, 14, 6, 5);
    g.fillPoints(starPts, true);
    g.fillStyle(0xFFFF88, 0.5);
    const innerStar = this._starPoints(16, 16, 9, 4, 5);
    g.fillPoints(innerStar, true);
    g.generateTexture('ui-star-full', 32, 32);

    // Star empty: 32×32
    g.clear();
    g.fillStyle(0x555566, 1);
    const starPtsE = this._starPoints(16, 16, 14, 6, 5);
    g.fillPoints(starPtsE, true);
    g.fillStyle(0x222233, 1);
    const starPtsI = this._starPoints(16, 16, 10, 5, 5);
    g.fillPoints(starPtsI, true);
    g.generateTexture('ui-star-empty', 32, 32);

    // Letter slot empty: 52×58
    g.clear();
    g.fillStyle(0x1a1a3a, 0.9);
    g.fillRoundedRect(2, 2, 48, 54, 10);
    g.lineStyle(2, 0x5544AA, 0.8);
    g.strokeRoundedRect(2, 2, 48, 54, 10);
    // Dotted inner border
    g.lineStyle(1, 0x7766CC, 0.4);
    g.strokeRoundedRect(6, 6, 40, 46, 7);
    g.generateTexture('ui-letter-slot-empty', 52, 58);

    // Letter slot filled: 52×58
    g.clear();
    g.fillStyle(0x3344AA, 0.9);
    g.fillRoundedRect(2, 2, 48, 54, 10);
    g.lineStyle(2, 0x88AAFF, 1);
    g.strokeRoundedRect(2, 2, 48, 54, 10);
    // Inner glow
    g.fillStyle(0x5566DD, 0.4);
    g.fillRoundedRect(6, 6, 40, 46, 7);
    g.generateTexture('ui-letter-slot-filled', 52, 58);

    // Particle yellow: 8×8
    g.clear();
    g.fillStyle(0xFFFF44, 1);
    g.fillCircle(4, 4, 4);
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillCircle(3, 3, 2);
    g.generateTexture('particle-yellow', 8, 8);

    // Letter bubble textures (letter-bg-0 through letter-bg-5)
    const LETTER_COLORS = [0xFF5555, 0xFF9944, 0xFFDD33, 0x44CC66, 0x4499FF, 0xAA55FF];
    LETTER_COLORS.forEach((color, i) => {
      g.clear();
      g.fillStyle(color, 1);
      g.fillCircle(26, 26, 26);
      // Shadow underneath
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(26, 36, 36, 16);
      // Re-draw circle on top of shadow
      g.fillStyle(color, 1);
      g.fillCircle(26, 26, 26);
      // Glossy highlight
      g.fillStyle(0xFFFFFF, 0.35);
      g.fillEllipse(20, 16, 14, 8);
      g.generateTexture('letter-bg-' + i, 52, 52);
    });
  }

  // ---- MISC ----
  _genMisc(g) {
    // Goal flag: 32×64
    g.clear();
    // Pole
    g.fillStyle(0xCCCCCC, 1);
    g.fillRect(14, 0, 4, 64);
    // Checkered flag (4×4 grid pattern)
    for (let fy = 0; fy < 4; fy++) {
      for (let fx = 0; fx < 4; fx++) {
        const isBlack = (fx + fy) % 2 === 0;
        g.fillStyle(isBlack ? 0x111111 : 0xFFFFFF, 1);
        g.fillRect(16 + fx * 4, fy * 4, 4, 4);
      }
    }
    g.generateTexture('goal-flag', 32, 64);

    // Level node circle: 40×40
    g.clear();
    g.fillStyle(0x335599, 1);
    g.fillCircle(20, 20, 18);
    g.fillStyle(0x4477CC, 1);
    g.fillCircle(20, 18, 16);
    g.generateTexture('level-node', 40, 40);

    // Level node locked: 40×40
    g.clear();
    g.fillStyle(0x334455, 1);
    g.fillCircle(20, 20, 18);
    g.fillStyle(0x445566, 1);
    g.fillCircle(20, 18, 16);
    g.generateTexture('level-node-locked', 40, 40);

    // Lock icon: 24×28
    g.clear();
    g.fillStyle(0x888899, 1);
    g.fillRoundedRect(2, 12, 20, 16, 4);
    g.lineStyle(3, 0x888899, 1);
    g.beginPath();
    g.arc(12, 12, 8, Math.PI, 0, false);
    g.strokePath();
    g.fillStyle(0xBBBBCC, 1);
    g.fillCircle(12, 19, 3);
    g.fillRect(11, 19, 2, 5);
    g.generateTexture('lock-icon', 24, 28);

    // Checkmark: 24×24
    g.clear();
    g.lineStyle(3, 0x44FF88, 1);
    g.beginPath();
    g.moveTo(3, 12);
    g.lineTo(9, 18);
    g.lineTo(21, 5);
    g.strokePath();
    g.generateTexture('checkmark', 24, 24);

    // Panel bg: 400×500
    g.clear();
    g.fillStyle(0x111130, 0.95);
    g.fillRoundedRect(0, 0, 400, 500, 20);
    g.lineStyle(2, 0x4444AA, 0.7);
    g.strokeRoundedRect(0, 0, 400, 500, 20);
    g.generateTexture('char-panel', 400, 500);

    // Button texture
    g.clear();
    g.fillStyle(0x2244AA, 1);
    g.fillRoundedRect(0, 0, 200, 60, 16);
    g.fillStyle(0x3355CC, 1);
    g.fillRoundedRect(0, 0, 200, 52, 16);
    g.generateTexture('button-blue', 200, 60);
  }

  _starPoints(cx, cy, outerR, innerR, points) {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  }

  _createAnimations() {
    // BUN
    this.anims.create({
      key: 'bun-idle',
      frames: [
        { key: 'bun-idle-0' },
        { key: 'bun-idle-1' }
      ],
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'bun-run',
      frames: [
        { key: 'bun-run-0' },
        { key: 'bun-run-1' },
        { key: 'bun-run-2' },
        { key: 'bun-run-3' }
      ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'bun-jump',
      frames: [{ key: 'bun-jump-0' }],
      frameRate: 1,
      repeat: 0
    });
    this.anims.create({
      key: 'bun-hurt',
      frames: [{ key: 'bun-hurt-0' }],
      frameRate: 1,
      repeat: 0
    });
    this.anims.create({
      key: 'bun-victory',
      frames: [
        { key: 'bun-victory-0' },
        { key: 'bun-victory-1' },
        { key: 'bun-victory-0' },
        { key: 'bun-victory-1' },
        { key: 'bun-victory-0' }
      ],
      frameRate: 6,
      repeat: -1
    });

    // FANG
    this.anims.create({
      key: 'fang-idle',
      frames: [
        { key: 'fang-idle-0' },
        { key: 'fang-idle-1' }
      ],
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'fang-run',
      frames: [
        { key: 'fang-run-0' },
        { key: 'fang-run-1' },
        { key: 'fang-run-2' },
        { key: 'fang-run-3' }
      ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'fang-jump',
      frames: [{ key: 'fang-jump-0' }],
      frameRate: 1,
      repeat: 0
    });
    this.anims.create({
      key: 'fang-hurt',
      frames: [{ key: 'fang-hurt-0' }],
      frameRate: 1,
      repeat: 0
    });
    this.anims.create({
      key: 'fang-victory',
      frames: [
        { key: 'fang-victory-0' },
        { key: 'fang-victory-1' },
        { key: 'fang-victory-0' },
        { key: 'fang-victory-1' },
        { key: 'fang-victory-0' }
      ],
      frameRate: 6,
      repeat: -1
    });

    // TURTLE
    this.anims.create({
      key: 'turtle-walk',
      frames: [
        { key: 'enemy-turtle-0' },
        { key: 'enemy-turtle-1' }
      ],
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'turtle-stomp',
      frames: [{ key: 'enemy-turtle-stomp' }],
      frameRate: 1,
      repeat: 0
    });
  }
}
