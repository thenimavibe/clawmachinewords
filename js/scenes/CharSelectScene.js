// ============================================================
// scenes/CharSelectScene.js — Character selection screen
// ============================================================

class CharSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharSelectScene' });
    this._selectedChar = null;
    this._transitioning = false;
  }

  create() {
    this._selectedChar = null;
    this._transitioning = false;

    // Background gradient
    const bgGfx = this.add.graphics();
    const BANDS = 20;
    const bh = Math.ceil(GAME_H / BANDS);
    for (let i = 0; i < BANDS; i++) {
      const t = i / BANDS;
      bgGfx.fillStyle(Phaser.Display.Color.GetColor(
        Math.round(10 + 20 * t),
        Math.round(8 + 15 * t),
        Math.round(32 + 40 * t)
      ));
      bgGfx.fillRect(0, i * bh, GAME_W, bh + 1);
    }

    // Floating star particles in background
    for (let i = 0; i < 30; i++) {
      const star = this.add.text(
        Phaser.Math.Between(0, GAME_W),
        Phaser.Math.Between(0, GAME_H),
        '★',
        { fontSize: Phaser.Math.Between(10, 22) + 'px', color: '#ffffff', alpha: 0 }
      ).setAlpha(Phaser.Math.FloatBetween(0.05, 0.3));
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.5),
        y: star.y - Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(2000, 5000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }

    // Title
    this.add.text(GAME_W / 2, 72, 'CHOOSE YOUR HERO', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '64px',
      color: '#FFD700',
      stroke: '#884400',
      strokeThickness: 5
    }).setOrigin(0.5, 0.5);

    this.add.text(GAME_W / 2, 128, 'Pick your adventurer and start running!', {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '22px',
      color: '#AACCFF'
    }).setOrigin(0.5, 0.5);

    // ── Cards side by side ─────────────────────────────────
    // Screen: 1280px wide. Left card centred at 330, right at 950.
    // Card width 280px → left spans 190–470, right 810–1090.
    // Gap between cards: 810 - 470 = 340px.
    const LEFT_CX  = 330;
    const RIGHT_CX = 950;
    const CARD_Y   = 390;

    this._buildCard('bun',  LEFT_CX,  CARD_Y);
    this._buildCard('fang', RIGHT_CX, CARD_Y);

    // "Click a character to begin!" hint
    this._hintText = this.add.text(GAME_W / 2, 646, 'Click a character to begin!', {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '22px',
      color: '#AAAACC'
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this._hintText,
      alpha: 0.3,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
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
    backBtn.on('pointerout',  () => backBtn.setColor('#AABBCC'));
    backBtn.on('pointerdown', () => {
      if (this._transitioning) return;
      if (window.AUDIO) window.AUDIO.sfxClick();
      this._transitioning = true;
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('TitleScene'));
    });

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  _buildCard(charKey, cx, cy) {
    const cfg   = CHARACTERS[charKey];
    const CW    = 280;
    const CH    = 430;
    const left  = cx - CW / 2;
    const top   = cy - CH / 2;

    // ── Card backing (drawn on a Graphics object at fixed position) ──
    const cardGfx = this.add.graphics();
    this['_cardGfx_' + charKey] = cardGfx;
    this._drawCard(cardGfx, left, top, CW, CH, false);

    // ── Transparent hit zone ──
    const hitZone = this.add.rectangle(cx, cy, CW, CH).setInteractive({ useHandCursor: true });
    hitZone.setAlpha(0.001); // invisible but interactive

    // ── Character sprite ──
    const sprite = this.add.sprite(cx, cy - 80, charKey + '-idle-0');
    sprite.setScale(2.6);
    try { sprite.play(charKey + '-idle'); } catch (_) {}

    // ── Name ──
    this.add.text(cx, cy + 95, cfg.name.toUpperCase(), {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '40px',
      color: charKey === 'bun' ? '#FFCCAA' : '#AACCFF',
      stroke: '#000033',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5);

    // ── Subtitle ──
    this.add.text(cx, cy + 138, cfg.subtitle, {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '17px',
      color: '#AAAACC'
    }).setOrigin(0.5, 0.5);

    // ── Ability badge ──
    const icon = charKey === 'bun' ? '⚡' : '💨';
    this.add.text(cx, cy + 175, icon + ' ' + cfg.ability, {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '21px',
      color: '#FFDD88',
      backgroundColor: '#332200',
      padding: { x: 14, y: 6 }
    }).setOrigin(0.5, 0.5);

    // ── Ability description ──
    this.add.text(cx, cy + 205, cfg.abilityDesc, {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '14px',
      color: '#CCCCDD'
    }).setOrigin(0.5, 0.5);

    // ── "SELECT" label at bottom ──
    const selectLabel = this.add.text(cx, top + CH - 28, 'CLICK TO SELECT', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '16px',
      color: '#667799'
    }).setOrigin(0.5, 0.5);
    this['_selectLabel_' + charKey] = selectLabel;

    // ── Hover ──
    hitZone.on('pointerover', () => {
      if (this._transitioning) return;
      this._drawCard(cardGfx, left, top, CW, CH, true);
      this.tweens.add({ targets: sprite, scaleX: 2.9, scaleY: 2.9, duration: 120 });
      selectLabel.setColor('#AACCFF');
    });

    hitZone.on('pointerout', () => {
      if (this._selectedChar !== charKey) {
        this._drawCard(cardGfx, left, top, CW, CH, false);
        this.tweens.add({ targets: sprite, scaleX: 2.6, scaleY: 2.6, duration: 120 });
        selectLabel.setColor('#667799');
      }
    });

    // ── Click → select + transition ──
    hitZone.on('pointerdown', () => {
      if (this._transitioning) return;
      if (window.AUDIO) window.AUDIO.sfxClick();
      this._selectAndProceed(charKey, sprite, cardGfx, left, top, CW, CH);
    });
  }

  _drawCard(gfx, x, y, w, h, hovered) {
    gfx.clear();
    // Shadow
    gfx.fillStyle(0x000000, 0.4);
    gfx.fillRoundedRect(x + 6, y + 8, w, h, 18);
    // Fill
    gfx.fillStyle(hovered ? 0x1a1a55 : 0x111135, 1);
    gfx.fillRoundedRect(x, y, w, h, 18);
    // Border
    gfx.lineStyle(3, hovered ? 0x6688FF : 0x334488, 1);
    gfx.strokeRoundedRect(x, y, w, h, 18);
  }

  _selectAndProceed(charKey, sprite, cardGfx, left, top, CW, CH) {
    this._transitioning = true;
    this._selectedChar  = charKey;

    // Persist choice
    if (window.SAVE) {
      window.SAVE.character = charKey;
      writeSave(window.SAVE);
    }
    window.CURRENT_CHAR = charKey;

    // Flash the selected card gold
    this._drawCardSelected(cardGfx, left, top, CW, CH);

    // Bounce the sprite
    this.tweens.add({
      targets: sprite,
      scaleX: 3.4,
      scaleY: 3.4,
      duration: 140,
      yoyo: true,
      ease: 'Sine.easeOut'
    });

    // Update hint
    if (this._hintText) {
      this._hintText.setText('✓ ' + CHARACTERS[charKey].name + ' selected!');
      this._hintText.setColor('#44FF88');
      this._hintText.setAlpha(1);
    }

    // Transition after short pause so the player sees the feedback
    this.time.delayedCall(700, () => {
      this.cameras.main.fadeOut(450, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('LevelMapScene');
      });
    });
  }

  _drawCardSelected(gfx, x, y, w, h) {
    gfx.clear();
    // Glow shadow
    gfx.fillStyle(0xFFCC00, 0.25);
    gfx.fillRoundedRect(x - 6, y - 6, w + 12, h + 12, 22);
    // Fill
    gfx.fillStyle(0x1f1a00, 1);
    gfx.fillRoundedRect(x, y, w, h, 18);
    // Gold border
    gfx.lineStyle(4, 0xFFD700, 1);
    gfx.strokeRoundedRect(x, y, w, h, 18);
    // ✓ checkmark top-right
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillCircle(x + w - 22, y + 22, 16);
    gfx.fillStyle(0x111100, 1);
    // (the ✓ text is added separately so it renders on top)
  }
}
