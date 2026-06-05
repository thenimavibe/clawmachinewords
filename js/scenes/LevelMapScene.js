// ============================================================
// scenes/LevelMapScene.js — World map with level nodes
// ============================================================

class LevelMapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelMapScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#060418');

    // Draw star background
    this._drawStarfield();

    // Title
    this.add.text(GAME_W / 2, 52, 'WORLD MAP', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '52px',
      color: '#FFD700',
      stroke: '#AA5500',
      strokeThickness: 4
    }).setOrigin(0.5, 0.5);

    // Current char display
    const charKey = window.CURRENT_CHAR || (window.SAVE && window.SAVE.character) || 'bun';
    const charSprite = this.add.sprite(80, 680, charKey + '-idle-0');
    charSprite.setScale(1.8);
    charSprite.play(charKey + '-idle');

    this.add.text(110, 680, CHARACTERS[charKey].name, {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '20px',
      color: '#FFCC88'
    }).setOrigin(0, 0.5);

    // Get unlocked levels from save
    const save = window.SAVE || { unlockedLevels: [1], levelStars: {}, highScores: {} };
    const unlockedLevels = save.unlockedLevels || [1];

    // Level node positions (winding path)
    const nodePositions = [
      { x: 160,  y: 580 },  // 1
      { x: 330,  y: 480 },  // 2
      { x: 500,  y: 560 },  // 3
      { x: 670,  y: 420 },  // 4
      { x: 840,  y: 520 },  // 5
      { x: 1010, y: 400 },  // 6
      { x: 1100, y: 540 },  // 7
      { x: 900,  y: 640 },  // 8
      { x: 700,  y: 660 },  // 9 (backtrack feels like scrolling path)
      { x: 1180, y: 330 }   // 10
    ];

    // Draw connecting path lines
    const pathGfx = this.add.graphics();
    pathGfx.lineStyle(4, 0x334466, 0.6);
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const a = nodePositions[i];
      const b = nodePositions[i + 1];
      // Draw dashed-like segment
      pathGfx.beginPath();
      pathGfx.moveTo(a.x, a.y);
      // Bezier curve through midpoint
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - 30;
      pathGfx.bezierCurveTo(mx, my, mx, my, b.x, b.y);
      pathGfx.strokePath();
    }

    // Draw level nodes
    nodePositions.forEach((pos, i) => {
      const levelId = i + 1;
      const levelCfg = LEVELS[i];
      const isUnlocked = unlockedLevels.includes(levelId);
      const stars = save.levelStars[levelId] || 0;

      this._createLevelNode(pos.x, pos.y, levelId, levelCfg, isUnlocked, stars);
    });

    // Back button
    const backBtn = this.add.text(60, 40, '◀ BACK', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#AABBCC',
      stroke: '#223344',
      strokeThickness: 2
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#FFFFFF'));
    backBtn.on('pointerout', () => backBtn.setColor('#AABBCC'));
    backBtn.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      this.cameras.main.fadeOut(400, 0, 0, 0, () => this.scene.start('CharSelectScene'));
    });

    // Tooltip container (shows level name on hover)
    this._tooltip = this.add.text(GAME_W / 2, GAME_H - 50, '', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#000044',
      strokeThickness: 3,
      backgroundColor: 'rgba(10,10,50,0.8)',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  _drawStarfield() {
    const gfx = this.add.graphics();
    const count = 120;
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, GAME_W);
      const y = Phaser.Math.Between(0, GAME_H);
      const bright = Phaser.Math.FloatBetween(0.2, 0.9);
      const size = Phaser.Math.FloatBetween(0.5, 2.5);
      gfx.fillStyle(0xFFFFFF, bright);
      gfx.fillCircle(x, y, size);
    }
    // Some colored nebula blobs
    gfx.fillStyle(0x330066, 0.15);
    gfx.fillCircle(300, 300, 200);
    gfx.fillStyle(0x002255, 0.15);
    gfx.fillCircle(900, 500, 180);
    gfx.fillStyle(0x440033, 0.1);
    gfx.fillCircle(600, 200, 150);
  }

  _createLevelNode(x, y, levelId, levelCfg, isUnlocked, stars) {
    const save = window.SAVE || {};
    const isCurrent = levelId === (window.CURRENT_LEVEL || 1);

    // Outer ring for current level
    if (isCurrent && isUnlocked) {
      const ring = this.add.graphics();
      ring.lineStyle(3, 0xFFDD00, 0.9);
      ring.strokeCircle(x, y, 30);
      this.tweens.add({
        targets: ring,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1200,
        ease: 'Quad.easeOut',
        repeat: -1
      });
    }

    // Node circle
    const nodeGfx = this.add.graphics();
    if (isUnlocked) {
      nodeGfx.fillStyle(isCurrent ? 0x4488FF : 0x335599, 1);
      nodeGfx.fillCircle(x, y, 22);
      nodeGfx.fillStyle(isCurrent ? 0x66AAFF : 0x4477CC, 1);
      nodeGfx.fillCircle(x, y - 3, 20);
    } else {
      nodeGfx.fillStyle(0x223344, 1);
      nodeGfx.fillCircle(x, y, 22);
      nodeGfx.fillStyle(0x334455, 1);
      nodeGfx.fillCircle(x, y - 2, 20);
    }

    // Level number
    if (isUnlocked) {
      this.add.text(x, y - 2, String(levelId), {
        fontFamily: "'Fredoka One', cursive",
        fontSize: '20px',
        color: '#FFFFFF',
        stroke: '#001133',
        strokeThickness: 2
      }).setOrigin(0.5, 0.5);
    } else {
      // Lock icon
      this.add.image(x, y, 'lock-icon').setOrigin(0.5, 0.5).setScale(0.9).setTint(0x667788);
    }

    // Emoji above node
    this.add.text(x, y - 34, levelCfg.emoji, {
      fontSize: '18px'
    }).setOrigin(0.5, 0.5).setAlpha(isUnlocked ? 1 : 0.3);

    // Stars below node
    if (isUnlocked && stars > 0) {
      for (let s = 0; s < 3; s++) {
        const starImg = this.add.image(x - 18 + s * 18, y + 32, s < stars ? 'ui-star-full' : 'ui-star-empty');
        starImg.setScale(0.55);
      }
    }

    // Make clickable if unlocked
    if (isUnlocked) {
      const hitArea = this.add.graphics();
      hitArea.fillStyle(0xFFFFFF, 0.01);
      hitArea.fillCircle(x, y, 28);
      hitArea.setInteractive(new Phaser.Geom.Circle(x, y, 28), Phaser.Geom.Circle.Contains);
      hitArea.setData('levelId', levelId);

      hitArea.on('pointerover', () => {
        nodeGfx.clear();
        nodeGfx.fillStyle(0x7799FF, 1);
        nodeGfx.fillCircle(x, y, 24);
        nodeGfx.fillStyle(0x99BBFF, 1);
        nodeGfx.fillCircle(x, y - 3, 22);

        if (this._tooltip) {
          this._tooltip.setText(levelCfg.emoji + ' ' + levelCfg.name);
          this._tooltip.setAlpha(1);
        }
        if (window.AUDIO) window.AUDIO.sfxClick();
      });

      hitArea.on('pointerout', () => {
        nodeGfx.clear();
        nodeGfx.fillStyle(isCurrent ? 0x4488FF : 0x335599, 1);
        nodeGfx.fillCircle(x, y, 22);
        nodeGfx.fillStyle(isCurrent ? 0x66AAFF : 0x4477CC, 1);
        nodeGfx.fillCircle(x, y - 3, 20);

        if (this._tooltip) this._tooltip.setAlpha(0);
      });

      hitArea.on('pointerdown', () => {
        if (window.AUDIO) window.AUDIO.sfxClick();
        window.CURRENT_LEVEL = levelId;

        this.cameras.main.fadeOut(400, 0, 0, 0, () => {
          this.scene.start('WordInputScene', { levelId: levelId });
        });
      });
    }
  }
}
