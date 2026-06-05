// ============================================================
// scenes/UIScene.js — HUD overlay running parallel to GameScene
// ============================================================

class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // Semi-transparent HUD background panels
    this._createHUDPanels();

    // Hearts (top-left)
    this._hearts = [];
    this._maxHearts = 3;
    for (let i = 0; i < this._maxHearts; i++) {
      const h = this.add.image(30 + i * 38, 30, 'ui-heart-full');
      h.setScrollFactor(0);
      h.setScale(0.9);
      this._hearts.push(h);
    }

    // Word progress tracker (top-center)
    this._letterSlots = [];
    this._letterTexts = [];
    this._wordText = null;
    this._buildWordTracker();

    // Timer (top-right)
    this._timerBg = this.add.graphics();
    this._timerBg.fillStyle(0x000000, 0.55);
    this._timerBg.fillRoundedRect(GAME_W - 195, 8, 185, 44, 10);
    this._timerBg.setScrollFactor(0);

    this._timerText = this.add.text(GAME_W - 105, 30, '00:00', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#003366',
      strokeThickness: 2
    }).setOrigin(0.5, 0.5).setScrollFactor(0);

    this._timerIcon = this.add.text(GAME_W - 180, 30, '⏱', {
      fontSize: '22px'
    }).setOrigin(0, 0.5).setScrollFactor(0);

    // Score (top-right, below timer)
    this._scoreBg = this.add.graphics();
    this._scoreBg.fillStyle(0x000000, 0.55);
    this._scoreBg.fillRoundedRect(GAME_W - 195, 56, 185, 40, 10);
    this._scoreBg.setScrollFactor(0);

    this._scoreText = this.add.text(GAME_W - 108, 76, 'SCORE: 0', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#FFDD66',
      stroke: '#444400',
      strokeThickness: 2
    }).setOrigin(0.5, 0.5).setScrollFactor(0);

    // Combo display
    this._comboText = this.add.text(GAME_W / 2, 100, '', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '36px',
      color: '#FF8833',
      stroke: '#440000',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setAlpha(0);

    // Connect to GameScene events
    this._connectToGameScene();
  }

  _createHUDPanels() {
    // Top-left panel (hearts)
    const leftBg = this.add.graphics();
    leftBg.fillStyle(0x000000, 0.55);
    leftBg.fillRoundedRect(8, 8, 140, 44, 10);
    leftBg.setScrollFactor(0);
  }

  _buildWordTracker() {
    const word = window.CURRENT_WORD || '';
    const len = word.length;

    if (len === 0) return;

    // Center the tracker
    const slotW = 44;
    const slotGap = 6;
    const totalW = len * (slotW + slotGap) - slotGap;
    const startX = GAME_W / 2 - totalW / 2;
    const slotY = 30;

    // Background
    this._wordTrackerBg = this.add.graphics();
    this._wordTrackerBg.fillStyle(0x000000, 0.55);
    this._wordTrackerBg.fillRoundedRect(startX - 12, 8, totalW + 24, 44, 10);
    this._wordTrackerBg.setScrollFactor(0);

    this._letterSlots = [];
    this._letterTexts = [];

    for (let i = 0; i < len; i++) {
      const x = startX + i * (slotW + slotGap) + slotW / 2;

      // Slot background
      const slot = this.add.image(x, slotY, 'ui-letter-slot-empty');
      slot.setScale(0.7);
      slot.setScrollFactor(0);
      this._letterSlots.push(slot);

      // Letter text
      const lt = this.add.text(x, slotY, word[i], {
        fontFamily: "'Fredoka One', cursive",
        fontSize: '20px',
        color: '#666688',
        stroke: '#000022',
        strokeThickness: 1
      }).setOrigin(0.5, 0.5).setScrollFactor(0);
      this._letterTexts.push(lt);
    }
  }

  _connectToGameScene() {
    const gameScene = this.scene.get('GameScene');
    if (!gameScene) {
      // Retry after a short delay
      this.time.delayedCall(100, () => this._connectToGameScene());
      return;
    }

    gameScene.events.on('heartLost', (hearts) => {
      this._updateHearts(hearts);
    }, this);

    gameScene.events.on('letterCollected', (index) => {
      this._updateLetterSlot(index);
    }, this);

    gameScene.events.on('scoreUpdate', (score) => {
      this._updateScore(score);
    }, this);

    gameScene.events.on('timerUpdate', (seconds) => {
      this._updateTimer(seconds);
    }, this);

    gameScene.events.on('comboUpdate', (combo) => {
      this._showCombo(combo);
    }, this);

    gameScene.events.on('shutdown', () => {
      // Clean up listeners
      gameScene.events.off('heartLost', null, this);
      gameScene.events.off('letterCollected', null, this);
      gameScene.events.off('scoreUpdate', null, this);
      gameScene.events.off('timerUpdate', null, this);
      gameScene.events.off('comboUpdate', null, this);
    });
  }

  _updateHearts(hearts) {
    for (let i = 0; i < this._maxHearts; i++) {
      if (this._hearts[i]) {
        this._hearts[i].setTexture(i < hearts ? 'ui-heart-full' : 'ui-heart-empty');
        if (i === hearts) {
          // Shake the heart that was just lost
          this.tweens.add({
            targets: this._hearts[i],
            x: this._hearts[i].x - 4,
            duration: 50,
            yoyo: true,
            repeat: 4
          });
        }
      }
    }
  }

  _updateLetterSlot(index) {
    const word = window.CURRENT_WORD || '';
    if (index < 0 || index >= this._letterSlots.length) return;

    const slot = this._letterSlots[index];
    const lt = this._letterTexts[index];

    if (slot) {
      slot.setTexture('ui-letter-slot-filled');
      // Bounce animation
      this.tweens.add({
        targets: slot,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 80,
        ease: 'Back.easeOut',
        onStart: () => slot.setScale(0.5),
        onComplete: () => slot.setScale(0.7)
      });
    }

    if (lt) {
      lt.setColor('#FFFFFF');
      lt.setStroke('#004400', 2);
      // Pop animation
      this.tweens.add({
        targets: lt,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 100,
        ease: 'Back.easeOut',
        yoyo: true
      });
    }
  }

  _updateScore(score) {
    if (this._scoreText) {
      this._scoreText.setText('SCORE: ' + score.toLocaleString());
    }
  }

  _updateTimer(seconds) {
    if (this._timerText) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const str = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      this._timerText.setText(str);

      // Timer turns red when over 90 seconds
      if (seconds > 90) {
        this._timerText.setColor('#FF4444');
      } else if (seconds > 60) {
        this._timerText.setColor('#FFAA44');
      }
    }
  }

  _showCombo(combo) {
    if (combo < 2) {
      if (this._comboText) this._comboText.setAlpha(0);
      return;
    }

    if (this._comboText) {
      this._comboText.setText('COMBO x' + combo + '! 🔥');
      this._comboText.setAlpha(1);

      this.tweens.add({
        targets: this._comboText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 150,
        ease: 'Back.easeOut',
        yoyo: true,
        onComplete: () => {
          this.time.delayedCall(1000, () => {
            this.tweens.add({
              targets: this._comboText,
              alpha: 0,
              duration: 400
            });
          });
        }
      });
    }
  }

  // Rebuild word tracker when game scene sends a new word
  rebuildForWord(word) {
    // Remove old slots
    this._letterSlots.forEach(s => s.destroy());
    this._letterTexts.forEach(t => t.destroy());
    if (this._wordTrackerBg) this._wordTrackerBg.destroy();
    this._letterSlots = [];
    this._letterTexts = [];
    this._buildWordTracker();
  }
}
