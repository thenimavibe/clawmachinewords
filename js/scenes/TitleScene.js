// ============================================================
// scenes/TitleScene.js — Animated title screen
// ============================================================

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
    this._started = false;
  }

  create() {
    this._started = false;

    // Background
    const bg = this.add.image(0, 0, 'title-bg').setOrigin(0, 0);

    // Floating stars particles effect
    this._createStarParticles();

    // Title glow effect (shadow layer)
    const titleShadow = this.add.text(GAME_W / 2 + 3, 155, 'WORDRUNNER', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '118px',
      color: '#6633AA',
      alpha: 0.5
    }).setOrigin(0.5, 0.5);

    // Main title
    const title = this.add.text(GAME_W / 2, 150, 'WORDRUNNER', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '118px',
      color: '#FFD700',
      stroke: '#AA5500',
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#AA5500',
        blur: 8,
        fill: true
      }
    }).setOrigin(0.5, 0.5);

    // Animate title with gentle bob
    this.tweens.add({
      targets: [title, titleShadow],
      y: '-=8',
      duration: 1800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Subtitle
    this.add.text(GAME_W / 2, 255, 'Learn to Spell While You Run!', {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '28px',
      color: '#CCDDFF',
      stroke: '#223366',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5);

    // Animated character
    const charKey = (window.SAVE && window.SAVE.character) || 'bun';
    this._bunSprite = this.add.sprite(200, 470, charKey + '-idle-0');
    this._bunSprite.setScale(2.2);
    this._bunSprite.play(charKey + '-run');

    // Character running tween
    this.tweens.add({
      targets: this._bunSprite,
      x: 1100,
      duration: 4000,
      ease: 'Linear',
      onComplete: () => {
        this._bunSprite.x = 200;
      },
      repeat: -1
    });

    // Press start text (blinking)
    this._pressStart = this.add.text(GAME_W / 2, 560, 'CLICK OR PRESS ANY KEY TO BEGIN', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#224488',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this._pressStart,
      alpha: 0,
      duration: 700,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Version label
    this.add.text(GAME_W - 16, GAME_H - 16, 'v1.0', {
      fontFamily: "'Nunito', sans-serif",
      fontSize: '16px',
      color: '#445566'
    }).setOrigin(1, 1);

    // Colorful word bubbles floating up
    this._createWordBubbles();

    // Input
    this.input.once('pointerdown', () => this._startGame());
    this.input.keyboard.once('keydown', () => this._startGame());

    // Fade in
    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  _createStarParticles() {
    // Create twinkling star dots
    const graphics = this.add.graphics();
    const starCount = 60;
    this._stars = [];

    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(0, GAME_W);
      const y = Phaser.Math.Between(0, GAME_H * 0.7);
      const size = Phaser.Math.FloatBetween(1, 3);
      const circle = this.add.graphics();
      circle.fillStyle(0xFFFFFF, Phaser.Math.FloatBetween(0.3, 1.0));
      circle.fillCircle(0, 0, size);
      circle.setPosition(x, y);

      this.tweens.add({
        targets: circle,
        alpha: 0.1,
        duration: Phaser.Math.Between(800, 2500),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });

      this._stars.push(circle);
    }

    graphics.destroy();
  }

  _createWordBubbles() {
    const words = ['CAT', 'DOG', 'SUN', 'FUN', 'RUN', 'STAR', 'JUMP', 'PLAY'];
    const colors = ['#FF5555', '#FF9944', '#FFDD33', '#44CC66', '#4499FF', '#AA55FF', '#FF55AA', '#55DDFF'];

    words.forEach((word, i) => {
      const x = 80 + i * 145;
      const y = 650;
      const color = colors[i % colors.length];

      const bubble = this.add.text(x, y, word, {
        fontFamily: "'Fredoka One', cursive",
        fontSize: '20px',
        color: color,
        stroke: '#000033',
        strokeThickness: 2,
        backgroundColor: 'rgba(0,0,10,0.4)',
        padding: { x: 8, y: 4 },
        borderRadius: 8
      }).setOrigin(0.5, 0.5);

      this.tweens.add({
        targets: bubble,
        y: y - 30,
        duration: 1500 + i * 200,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: i * 250
      });
    });
  }

  _startGame() {
    if (this._started) return;
    this._started = true;

    if (window.AUDIO) window.AUDIO.sfxClick();

    this.cameras.main.fadeOut(600, 0, 0, 0, () => {
      this.scene.start('CharSelectScene');
    });
  }
}
