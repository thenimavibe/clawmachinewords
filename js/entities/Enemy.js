// ============================================================
// entities/Enemy.js — Enemy patrol logic
// ============================================================

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const texKey = type === 'turtle' ? 'enemy-turtle-0' : 'enemy-turtle-0';
    super(scene, x, y, texKey);

    this.type = type;
    this.startX = x;
    this.patrolRange = 120;
    this.speed = (LEVELS[0] && LEVELS[0].enemySpeed) ? LEVELS[0].enemySpeed : 60;
    this.direction = 1; // 1 = right, -1 = left
    this.isStomped = false;
    this.isAlive = true;
    this._walkTimer = 0;
    this._frameToggle = 0;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.body) {
      this.body.setCollideWorldBounds(false);
      this.body.setGravityY(0); // gravity handled by physics world
    }

    this.play('turtle-walk');
  }

  update(delta) {
    if (!this.isAlive || this.isStomped) return;
    if (!this.body) return;

    // Patrol movement
    this.body.setVelocityX(this.direction * this.speed);

    // Reverse at patrol bounds
    if (this.x > this.startX + this.patrolRange) {
      this.direction = -1;
    } else if (this.x < this.startX - this.patrolRange) {
      this.direction = 1;
    }

    // Face movement direction
    this.setFlipX(this.direction < 0);
  }

  stomp() {
    if (this.isStomped) return;
    this.isStomped = true;
    this.isAlive = false;

    if (window.AUDIO) window.AUDIO.sfxStomp();

    // Switch to stomp texture
    this.setTexture('enemy-turtle-stomp');

    if (this.body) {
      this.body.setVelocity(0, 0);
      this.body.enable = false;
    }

    // Squish scale animation then fade out
    const scene = this.scene;
    scene.tweens.add({
      targets: this,
      scaleX: 1.8,
      scaleY: 0.3,
      duration: 120,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: this,
          alpha: 0,
          y: this.y + 10,
          duration: 400,
          ease: 'Quad.easeIn',
          onComplete: () => {
            this.destroy();
          }
        });
      }
    });
  }

  defeat() {
    this.stomp();
  }
}
