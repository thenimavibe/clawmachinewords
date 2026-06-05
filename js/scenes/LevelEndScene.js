// ============================================================
// scenes/LevelEndScene.js — Level results screen
// ============================================================

class LevelEndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelEndScene' });
  }

  init(data) {
    this._levelId = (data && data.levelId) ? data.levelId : 1;
    this._word = (data && data.word) ? data.word : '';
    this._score = (data && data.score) ? data.score : 0;
    this._stars = (data && data.stars !== undefined) ? data.stars : 0;
    this._time = (data && data.time) ? data.time : 0;
    this._heartsLeft = (data && data.heartsLeft !== undefined) ? data.heartsLeft : 0;
    this._combo = (data && data.combo) ? data.combo : 0;
    this._collected = (data && data.collected) ? data.collected : 0;
    this._failed = (data && data.failed) ? data.failed : false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#080618');

    // Gradient background
    const bgGfx = this.add.graphics();
    const LBANDS = 18;
    const lbh = Math.ceil(GAME_H / LBANDS);
    for (let i = 0; i < LBANDS; i++) {
      const t = i / LBANDS;
      const r = Math.round(8 + 20 * t);
      const gr = Math.round(6 + 12 * t);
      const b = Math.round(24 + 44 * t);
      bgGfx.fillStyle(Phaser.Display.Color.GetColor(r, gr, b), 1);
      bgGfx.fillRect(0, i * lbh, GAME_W, lbh + 1);
    }

    // Save progress
    this._saveProgress();

    if (this._failed) {
      this._showFailScreen();
    } else {
      this._showSuccessScreen();
    }

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  _saveProgress() {
    if (!window.SAVE) return;

    const levelId = this._levelId;

    // Update stars
    const prevStars = window.SAVE.levelStars[levelId] || 0;
    if (this._stars > prevStars) {
      window.SAVE.levelStars[levelId] = this._stars;
    }

    // Update high score
    const prevScore = window.SAVE.highScores[levelId] || 0;
    if (this._score > prevScore) {
      window.SAVE.highScores[levelId] = this._score;
    }

    // Update word history (keep last 50)
    if (this._word && !this._failed) {
      if (!window.SAVE.wordHistory) window.SAVE.wordHistory = [];
      window.SAVE.wordHistory.unshift(this._word);
      window.SAVE.wordHistory = window.SAVE.wordHistory.slice(0, 50);
    }

    // Unlock next level if succeeded with at least 1 star
    if (!this._failed && this._stars >= 1) {
      const nextLevel = levelId + 1;
      if (nextLevel <= 10 && !window.SAVE.unlockedLevels.includes(nextLevel)) {
        window.SAVE.unlockedLevels.push(nextLevel);
      }
    }

    // Update total score
    window.SAVE.totalScore = (window.SAVE.totalScore || 0) + this._score;

    writeSave(window.SAVE);
  }

  _showSuccessScreen() {
    let delay = 0;

    // WORD COMPLETE title
    const titleEl = this.add.text(GAME_W / 2, 90, 'WORD COMPLETE!', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '72px',
      color: '#FFD700',
      stroke: '#AA5500',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#884400', blur: 10, fill: true }
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.tweens.add({
      targets: titleEl,
      alpha: 1,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
      delay: 200
    });
    delay += 400;

    // Stars row
    this._showStars(360, delay);
    delay += 600;

    // Word letters pop-in
    this._showWordLetters(220, delay);
    delay += this._word.length * 120 + 200;

    // Score breakdown
    this._showScoreBreakdown(430, delay);
    delay += 400;

    // Buttons
    this._showSuccessButtons(delay + 200);

    // Particle burst
    this._createConfetti();

    // Character victory
    const charKey = window.CURRENT_CHAR || 'bun';
    const charSprite = this.add.sprite(GAME_W / 2 - 500, 340, charKey + '-idle-0');
    charSprite.setScale(3);
    charSprite.play(charKey + '-victory');
    this.tweens.add({
      targets: charSprite,
      x: GAME_W / 2 - 460,
      y: 320,
      duration: 600,
      ease: 'Bounce.easeOut',
      delay: 300
    });
  }

  _showStars(y, delay) {
    const panelW = 280;
    const panelX = GAME_W / 2 - panelW / 2;
    const panelGfx = this.add.graphics().setAlpha(0);
    panelGfx.fillStyle(0x000000, 0.4);
    panelGfx.fillRoundedRect(panelX, y - 30, panelW, 80, 12);

    this.tweens.add({
      targets: panelGfx,
      alpha: 1,
      duration: 300,
      delay: delay
    });

    for (let i = 0; i < 3; i++) {
      const starX = GAME_W / 2 - 60 + i * 60;
      const isFull = i < this._stars;
      const star = this.add.image(starX, y + 10, isFull ? 'ui-star-full' : 'ui-star-empty');
      star.setScale(0).setAlpha(0);

      this.tweens.add({
        targets: star,
        scaleX: 2,
        scaleY: 2,
        alpha: 1,
        duration: 300,
        ease: 'Back.easeOut',
        delay: delay + i * 200
      });

      if (isFull && window.AUDIO) {
        this.time.delayedCall(delay + i * 200, () => {
          window.AUDIO.sfxLetter(i + 5);
        });
      }
    }
  }

  _showWordLetters(y, delay) {
    const word = this._word;
    const letterW = 56;
    const totalW = word.length * letterW;
    const startX = GAME_W / 2 - totalW / 2 + letterW / 2;

    const COLORS = ['#FF5555', '#FF9944', '#FFDD33', '#44CC66', '#4499FF', '#AA55FF'];

    word.split('').forEach((char, i) => {
      const x = startX + i * letterW;
      const color = COLORS[i % COLORS.length];

      const letterBg = this.add.graphics().setAlpha(0);
      letterBg.fillStyle(parseInt(color.slice(1), 16), 1);
      letterBg.fillCircle(x, y, 24);

      const letterText = this.add.text(x, y, char, {
        fontFamily: "'Fredoka One', cursive",
        fontSize: '28px',
        color: '#FFFFFF',
        stroke: '#00000055',
        strokeThickness: 2
      }).setOrigin(0.5, 0.5).setAlpha(0);

      const delayMs = delay + i * 120;
      this.tweens.add({
        targets: [letterBg, letterText],
        alpha: 1,
        scaleX: { from: 0, to: 1 },
        scaleY: { from: 0, to: 1 },
        duration: 250,
        ease: 'Back.easeOut',
        delay: delayMs
      });
    });
  }

  _showScoreBreakdown(y, delay) {
    const numLetters = this._word.length;
    const baseScore = numLetters * 100;
    const timeBonus = Math.max(0, 5000 - Math.floor(this._time) * 10);
    const heartBonus = this._heartsLeft * 500;
    const comboBonus = this._combo * 50;
    const total = baseScore + timeBonus + heartBonus + comboBonus;

    // Panel
    const panelGfx = this.add.graphics().setAlpha(0);
    panelGfx.fillStyle(0x000000, 0.6);
    panelGfx.fillRoundedRect(GAME_W / 2 - 260, y - 10, 520, 200, 14);
    panelGfx.lineStyle(2, 0x3344AA, 0.6);
    panelGfx.strokeRoundedRect(GAME_W / 2 - 260, y - 10, 520, 200, 14);

    this.tweens.add({
      targets: panelGfx,
      alpha: 1,
      duration: 300,
      delay: delay
    });

    const rowStyle = {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#CCDDFF',
      stroke: '#001133',
      strokeThickness: 2
    };

    const rows = [
      { label: 'Letters ×' + numLetters, value: '+' + baseScore },
      { label: 'Time Bonus (' + this._time + 's)', value: '+' + timeBonus },
      { label: 'Heart Bonus ×' + this._heartsLeft, value: '+' + heartBonus },
      { label: 'Combo Bonus', value: '+' + comboBonus }
    ];

    rows.forEach((row, i) => {
      const rowY = y + 20 + i * 38;
      const rowDelay = delay + i * 100;

      const labelText = this.add.text(GAME_W / 2 - 230, rowY, row.label, rowStyle).setAlpha(0);
      const valueText = this.add.text(GAME_W / 2 + 230, rowY, row.value, {
        ...rowStyle,
        color: '#FFDD66'
      }).setOrigin(1, 0).setAlpha(0);

      this.tweens.add({
        targets: [labelText, valueText],
        alpha: 1,
        x: '+=0',
        duration: 250,
        ease: 'Quad.easeOut',
        delay: rowDelay
      });
    });

    // Divider line
    const line = this.add.graphics().setAlpha(0);
    line.lineStyle(1, 0x5566AA, 0.7);
    line.lineBetween(GAME_W / 2 - 230, y + 170, GAME_W / 2 + 230, y + 170);
    this.tweens.add({ targets: line, alpha: 1, duration: 200, delay: delay + 400 });

    // Total
    const totalText = this.add.text(GAME_W / 2, y + 185, 'TOTAL: ' + total.toLocaleString(), {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '36px',
      color: '#FFD700',
      stroke: '#AA5500',
      strokeThickness: 3
    }).setOrigin(0.5, 0).setAlpha(0);

    this.tweens.add({
      targets: totalText,
      alpha: 1,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 400,
      ease: 'Back.easeOut',
      delay: delay + 500
    });
  }

  _showSuccessButtons(delay) {
    const btnY = GAME_H - 90;

    // Play again button
    const retryBtn = this.add.text(GAME_W / 2 - 180, btnY, '🔄 PLAY AGAIN', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '26px',
      color: '#FFFFFF',
      stroke: '#223344',
      strokeThickness: 3,
      backgroundColor: '#224488',
      padding: { x: 24, y: 14 }
    }).setOrigin(0.5, 0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    // Next level button
    const nextBtn = this.add.text(GAME_W / 2 + 180, btnY, 'NEXT LEVEL ▶', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '26px',
      color: '#000',
      stroke: '#444400',
      strokeThickness: 2,
      backgroundColor: '#FFCC00',
      padding: { x: 24, y: 14 }
    }).setOrigin(0.5, 0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    // Level map button
    const mapBtn = this.add.text(GAME_W / 2, btnY + 60, '🗺 LEVEL MAP', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#AACCFF',
      stroke: '#001133',
      strokeThickness: 2,
      backgroundColor: 'rgba(0,20,80,0.7)',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5, 0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: [retryBtn, nextBtn, mapBtn], alpha: 1, duration: 300, delay: delay });

    // Hover effects
    [retryBtn, nextBtn, mapBtn].forEach(btn => {
      btn.on('pointerover', () => { btn.setScale(1.06); if (window.AUDIO) window.AUDIO.sfxClick(); });
      btn.on('pointerout', () => btn.setScale(1));
    });

    retryBtn.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      this.cameras.main.fadeOut(400, 0, 0, 0, () => {
        this.scene.start('WordInputScene', { levelId: this._levelId });
      });
    });

    nextBtn.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      const nextId = Math.min(10, this._levelId + 1);
      window.CURRENT_LEVEL = nextId;
      this.cameras.main.fadeOut(400, 0, 0, 0, () => {
        this.scene.start('WordInputScene', { levelId: nextId });
      });
    });

    mapBtn.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      this.cameras.main.fadeOut(400, 0, 0, 0, () => {
        this.scene.start('LevelMapScene');
      });
    });
  }

  _showFailScreen() {
    // Title
    const titleEl = this.add.text(GAME_W / 2, 100, "TRY AGAIN!", {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '72px',
      color: '#FF5566',
      stroke: '#550011',
      strokeThickness: 5
    }).setOrigin(0.5, 0.5).setAlpha(0);

    const subTitle = this.add.text(GAME_W / 2, 165, "YOU'VE GOT THIS! 🌟", {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '34px',
      color: '#FFCC44',
      stroke: '#443300',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.tweens.add({
      targets: [titleEl, subTitle],
      alpha: 1,
      scaleX: { from: 0.6, to: 1 },
      scaleY: { from: 0.6, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
      delay: 200
    });

    // Progress info
    const progressText = this.add.text(GAME_W / 2, 270, `Letters collected: ${this._collected} / ${this._word.length}`, {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '28px',
      color: '#CCDDFF',
      stroke: '#001133',
      strokeThickness: 2
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.tweens.add({ targets: progressText, alpha: 1, duration: 300, delay: 500 });

    // Word progress display
    const word = this._word;
    const letterW = 52;
    const totalW = word.length * letterW;
    const startX = GAME_W / 2 - totalW / 2 + letterW / 2;
    const COLORS = ['#FF5555', '#FF9944', '#FFDD33', '#44CC66', '#4499FF', '#AA55FF'];

    word.split('').forEach((char, i) => {
      const x = startX + i * letterW;
      const y = 340;
      const isCollected = i < this._collected;
      const color = isCollected ? COLORS[i % COLORS.length] : '#333355';

      const bg = this.add.graphics().setAlpha(0);
      bg.fillStyle(parseInt(color.replace('#', ''), 16), 1);
      bg.fillCircle(x, y, 22);

      const lt = this.add.text(x, y, char, {
        fontFamily: "'Fredoka One', cursive",
        fontSize: '24px',
        color: isCollected ? '#FFFFFF' : '#666688',
      }).setOrigin(0.5, 0.5).setAlpha(0);

      const d = 500 + i * 80;
      this.tweens.add({ targets: [bg, lt], alpha: 1, duration: 200, delay: d });
    });

    // Encouraging message
    const msgs = [
      "Keep trying, you can do it! 💪",
      "Almost there! Practice makes perfect! ⭐",
      "You're getting better! Try again! 🚀",
      "Don't give up! Every try makes you smarter! 🧠"
    ];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];

    const msgText = this.add.text(GAME_W / 2, 420, msg, {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '22px',
      color: '#AACCFF',
      fontStyle: 'italic'
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.tweens.add({ targets: msgText, alpha: 1, duration: 300, delay: 800 });

    // Buttons
    const btnY = GAME_H - 110;

    const retryBtn = this.add.text(GAME_W / 2 - 160, btnY, '🔄 RETRY', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '30px',
      color: '#FFFFFF',
      stroke: '#223344',
      strokeThickness: 3,
      backgroundColor: '#226644',
      padding: { x: 28, y: 14 }
    }).setOrigin(0.5, 0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    const mapBtn = this.add.text(GAME_W / 2 + 160, btnY, '🗺 LEVEL SELECT', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '26px',
      color: '#000',
      stroke: '#443300',
      strokeThickness: 2,
      backgroundColor: '#FFCC00',
      padding: { x: 24, y: 14 }
    }).setOrigin(0.5, 0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: [retryBtn, mapBtn], alpha: 1, duration: 300, delay: 1000 });

    [retryBtn, mapBtn].forEach(btn => {
      btn.on('pointerover', () => { btn.setScale(1.06); if (window.AUDIO) window.AUDIO.sfxClick(); });
      btn.on('pointerout', () => btn.setScale(1));
    });

    retryBtn.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      this.cameras.main.fadeOut(400, 0, 0, 0, () => {
        this.scene.start('WordInputScene', { levelId: this._levelId });
      });
    });

    mapBtn.on('pointerdown', () => {
      if (window.AUDIO) window.AUDIO.sfxClick();
      this.cameras.main.fadeOut(400, 0, 0, 0, () => {
        this.scene.start('LevelMapScene');
      });
    });

    // Sad character
    const charKey = window.CURRENT_CHAR || 'bun';
    const charSprite = this.add.sprite(180, 450, charKey + '-hurt-0');
    charSprite.setScale(2.5);
    // Drooping tween
    this.tweens.add({
      targets: charSprite,
      y: 460,
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: 500
    });
  }

  _createConfetti() {
    const colors = [0xFF5555, 0xFF9944, 0xFFDD33, 0x44CC66, 0x4499FF, 0xAA55FF, 0xFF55AA];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, GAME_W - 100);
      const g = this.add.graphics();
      const color = colors[i % colors.length];
      g.fillStyle(color, 1);
      const shape = Phaser.Math.Between(0, 2);
      if (shape === 0) {
        g.fillRect(0, 0, 8, 8);
      } else if (shape === 1) {
        g.fillCircle(0, 0, 5);
      } else {
        g.fillTriangle(-5, 5, 5, 5, 0, -5);
      }
      g.setPosition(x, -20);

      const targetY = Phaser.Math.Between(300, GAME_H);
      const rotation = Phaser.Math.FloatBetween(-Math.PI, Math.PI);

      this.tweens.add({
        targets: g,
        y: targetY,
        x: x + Phaser.Math.Between(-100, 100),
        angle: rotation * 180 / Math.PI,
        alpha: 0,
        duration: Phaser.Math.Between(1500, 3000),
        ease: 'Quad.easeIn',
        delay: Phaser.Math.Between(0, 800),
        onComplete: () => g.destroy()
      });
    }
  }
}
