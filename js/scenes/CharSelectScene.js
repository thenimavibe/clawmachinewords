// ============================================================
// scenes/CharSelectScene.js — Character selection screen
// ============================================================

class CharSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharSelectScene' });
    this._selectedChar = null;
  }

  create() {
    this._selectedChar = (window.SAVE && window.SAVE.character) || null;

    // Background
    this.cameras.main.setBackgroundColor('#0a0820');

    // Gradient background overlay
    const bgGfx = this.add.graphics();
    const BGBANDS = 18;
    const bgh = Math.ceil(GAME_H / BGBANDS);
    for (let i = 0; i < BGBANDS; i++) {
      const t = i / BGBANDS;
      const r = Math.round(10 + 20 * t);
      const gr = Math.round(8 + 15 * t);
      const b = Math.round(32 + 40 * t);
      bgGfx.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      bgGfx.fillRect(0, i * bgh, GAME_W, bgh + 1);
    }

    // Title
    this.add.text(GAME_W / 2, 70, 'CHOOSE YOUR HERO', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '64px',
      color: '#FFD700',
      stroke: '#884400',
      strokeThickness: 5
    }).setOrigin(0.5, 0.5);

    this.add.text(GAME_W / 2, 125, 'Pick your adventurer!', {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '24px',
      color: '#AACCFF',
    }).setOrigin(0.5, 0.5);

    // Character cards
    this._createCharCard('bun', 260, 370);
    this._createCharCard('fang', 780 + 240, 370);

    // Start button (hidden until selection)
    this._startBtn = this.add.text(GAME_W / 2, 648, '⭐ START ADVENTURE! ⭐', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '36px',
      color: '#FFD700',
      stroke: '#883300',
      strokeThickness: 4,
      backgroundColor: '#333300',
      padding: { x: 30, y: 14 }
    }).setOrigin(0.5, 0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    this._startBtn.on('pointerover', () => {
      this._startBtn.setScale(1.05);
      if (window.AUDIO) window.AUDIO.sfxClick();
    });
    this._startBtn.on('pointerout', () => {
      this._startBtn.setScale(1);
    });
    this._startBtn.on('pointerdown', () => {
      if (this._selectedChar) this._proceed();
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
      this.cameras.main.fadeOut(400, 0, 0, 0, () => this.scene.start('TitleScene'));
    });

    // If already have a selection, show it
    if (this._selectedChar) {
      this._highlightCard(this._selectedChar);
      this._showStartButton();
    }

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  _createCharCard(charKey, x, y) {
    const cfg = CHARACTERS[charKey];
    const isRight = charKey === 'fang';
    const cardX = isRight ? GAME_W - x + 240 : x;

    // Card background panel
    const card = this.add.graphics();
    card.fillStyle(0x111130, 0.95);
    card.fillRoundedRect(cardX - 160, y - 220, 320, 440, 20);
    card.lineStyle(3, 0x3344AA, 0.8);
    card.strokeRoundedRect(cardX - 160, y - 220, 320, 440, 20);
    card.setInteractive(new Phaser.Geom.Rectangle(cardX - 160, y - 220, 320, 440), Phaser.Geom.Rectangle.Contains);

    // Glow border (hidden by default)
    const glowBorder = this.add.graphics();
    glowBorder.setAlpha(0);
    this['_glow_' + charKey] = glowBorder;

    // Character sprite
    const sprite = this.add.sprite(cardX, y - 60, charKey + '-idle-0');
    sprite.setScale(2.8);
    sprite.play(charKey + '-idle');

    // Name
    this.add.text(cardX, y + 120, cfg.name.toUpperCase(), {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '42px',
      color: charKey === 'bun' ? '#FFCCAA' : '#AACCFF',
      stroke: '#000033',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5);

    // Subtitle
    this.add.text(cardX, y + 162, cfg.subtitle, {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '18px',
      color: '#AAAACC',
    }).setOrigin(0.5, 0.5);

    // Ability
    const abilityIcon = charKey === 'bun' ? '⚡' : '💨';
    this.add.text(cardX, y + 200, abilityIcon + ' ' + cfg.ability, {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#FFDD88',
      backgroundColor: 'rgba(100,80,0,0.4)',
      padding: { x: 14, y: 6 }
    }).setOrigin(0.5, 0.5);

    // Description
    this.add.text(cardX, y + 185, cfg.abilityDesc, {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '15px',
      color: '#CCCCDD',
    }).setOrigin(0.5, 0.5);

    // Checkmark (hidden initially)
    const check = this.add.text(cardX + 120, y - 200, '✓', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '32px',
      color: '#44FF88',
      backgroundColor: '#224422',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5, 0.5).setAlpha(0);
    this['_check_' + charKey] = check;

    // Hover effects
    card.on('pointerover', () => {
      this.tweens.add({ targets: sprite, scaleX: 3.1, scaleY: 3.1, duration: 150 });
      card.clear();
      card.fillStyle(0x1a1a50, 0.95);
      card.fillRoundedRect(cardX - 160, y - 220, 320, 440, 20);
      card.lineStyle(3, 0x5566DD, 1);
      card.strokeRoundedRect(cardX - 160, y - 220, 320, 440, 20);
    });

    card.on('pointerout', () => {
      if (this._selectedChar !== charKey) {
        this.tweens.add({ targets: sprite, scaleX: 2.8, scaleY: 2.8, duration: 150 });
        card.clear();
        card.fillStyle(0x111130, 0.95);
        card.fillRoundedRect(cardX - 160, y - 220, 320, 440, 20);
        card.lineStyle(3, 0x3344AA, 0.8);
        card.strokeRoundedRect(cardX - 160, y - 220, 320, 440, 20);
      }
    });

    card.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      this._selectChar(charKey);
    });
  }

  _selectChar(charKey) {
    this._selectedChar = charKey;

    // Save immediately
    if (window.SAVE) {
      window.SAVE.character = charKey;
      writeSave(window.SAVE);
    }
    window.CURRENT_CHAR = charKey;

    this._highlightCard(charKey);
    this._showStartButton();
  }

  _highlightCard(charKey) {
    // Unhighlight all
    ['bun', 'fang'].forEach(k => {
      const check = this['_check_' + k];
      if (check) check.setAlpha(k === charKey ? 1 : 0);
    });
  }

  _showStartButton() {
    this.tweens.add({
      targets: this._startBtn,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });

    // Pulse the button
    this.tweens.add({
      targets: this._startBtn,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: 400
    });
  }

  _proceed() {
    if (window.AUDIO) window.AUDIO.sfxClick();
    window.CURRENT_CHAR = this._selectedChar;

    this.cameras.main.fadeOut(500, 0, 0, 0, () => {
      this.scene.start('LevelMapScene');
    });
  }
}
