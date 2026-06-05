// ============================================================
// entities/Letter.js — Collectible letter object
// ============================================================

class Letter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, char, index, visible = true) {
    // Textures 'letter-bg-0' through 'letter-bg-5' are generated in BootScene
    const texKey = 'letter-bg-' + (index % 6);
    super(scene, x, y, texKey);

    this.char = char;
    this.index = index;
    this.collected = false;
    this._tweens = [];

    // Add to scene display list and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVisible(visible);

    if (this.body) {
      this.body.allowGravity = false;
      this.body.immovable = true;
      this.body.setCircle(24, 2, 2);
    }

    // Overlay text for the character
    this._charText = scene.add.text(x, y - 2, char, {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#00000066',
      strokeThickness: 2
    }).setOrigin(0.5, 0.5).setDepth(this.depth + 1);

    // Index number (small badge)
    this._idxText = scene.add.text(x + 18, y - 18, String(index + 1), {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 2, y: 1 }
    }).setOrigin(0.5, 0.5).setDepth(this.depth + 1);

    this._baseY = y;

    // Start animations
    this._startAnimations();
  }

  _startAnimations() {
    const scene = this.scene;

    // Pulsing scale tween
    const scaleTween = scene.tweens.add({
      targets: this,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 700,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    this._tweens.push(scaleTween);

    // Floating bob tween (moves the sprite and syncs text)
    const bobTween = scene.tweens.add({
      targets: this,
      y: this._baseY - 10,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    this._tweens.push(bobTween);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // Keep overlay texts in sync
    if (this._charText) {
      this._charText.setPosition(this.x, this.y - 2);
      this._charText.setVisible(this.visible);
      this._charText.setAlpha(this.alpha);
    }
    if (this._idxText) {
      this._idxText.setPosition(this.x + 18, this.y - 18);
      this._idxText.setVisible(this.visible);
      this._idxText.setAlpha(this.alpha);
    }
  }

  setCollected(hudX, hudY) {
    if (this.collected) return;
    this.collected = true;

    // Stop ongoing tweens
    this._tweens.forEach(t => t.stop());
    this._tweens = [];

    // Remove physics body
    if (this.body) {
      this.body.enable = false;
    }

    const scene = this.scene;

    // Scale-up burst effect
    scene.tweens.add({
      targets: this,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0.9,
      duration: 120,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Fly to HUD position
        const tx = hudX !== undefined ? hudX : 640;
        const ty = hudY !== undefined ? hudY : 30;
        scene.tweens.add({
          targets: [this, this._charText, this._idxText],
          x: tx,
          y: ty,
          scaleX: 0.3,
          scaleY: 0.3,
          alpha: 0,
          duration: 400,
          ease: 'Quad.easeIn',
          onComplete: () => {
            this.destroy();
          }
        });
      }
    });
  }

  setWrongAttempt() {
    if (window.AUDIO) window.AUDIO.sfxNotYet();

    const scene = this.scene;
    // Bounce-back shake effect
    scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 0.6,
      duration: 80,
      ease: 'Back.easeOut',
      yoyo: true,
      onComplete: () => {
        scene.tweens.add({
          targets: this,
          angle: -12,
          duration: 60,
          yoyo: true,
          repeat: 3,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  destroy() {
    if (this._charText) { this._charText.destroy(); this._charText = null; }
    if (this._idxText) { this._idxText.destroy(); this._idxText = null; }
    super.destroy();
  }
}
