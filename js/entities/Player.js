// ============================================================
// entities/Player.js — Player character controller
// ============================================================

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, charKey) {
    const texKey = charKey + '-idle-0';
    super(scene, x, y, texKey);

    this.charKey = charKey;
    this.charConfig = CHARACTERS[charKey] || CHARACTERS.bun;

    // State
    this.hearts = 3;
    this.isAlive = true;
    this.isHurt = false;
    this._hurtTimer = 0;
    this._hurtDuration = 2000; // ms of invincibility after hurt
    this.comboCount = 0;

    // Abilities
    this.canDoubleJump = this.charConfig.doubleJump || false;
    this._hasUsedDoubleJump = false;
    this.dashCooldown = 0;
    this.dashActive = false;
    this._dashTimer = 0;

    // Animation state tracking
    this._animState = 'idle';

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.body) {
      this.body.setCollideWorldBounds(true);
      this.body.setGravityY(0);
      this.body.setSize(36, 56);
      this.body.setOffset(14, 14);
    }

    // Input
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    // Jump pressed tracking (for double-jump detection)
    this._jumpWasDown = false;
    this._dashWasDown = false;

    this.play(charKey + '-idle');
  }

  isOnGround() {
    return this.body && this.body.blocked.down;
  }

  canJump() {
    return this.isOnGround();
  }

  update(delta) {
    if (!this.isAlive) return;

    const body = this.body;
    if (!body) return;

    const speed = this.charConfig.speed * (window.GAME_SPEED || 1);
    const onGround = this.isOnGround();

    // Handle hurt invincibility timer
    if (this.isHurt) {
      this._hurtTimer -= delta;
      if (this._hurtTimer <= 0) {
        this.isHurt = false;
        this.setAlpha(1);
      }
    }

    // Horizontal movement
    const leftDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const jumpDown = this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown;
    const dashDown = this.shiftKey.isDown || this.zKey.isDown;

    if (leftDown && !this.dashActive) {
      body.setVelocityX(-speed);
      this.setFlipX(true);
    } else if (rightDown && !this.dashActive) {
      body.setVelocityX(speed);
      this.setFlipX(false);
    } else if (!this.dashActive) {
      body.setVelocityX(0);
    }

    // Touch control support
    const scene = this.scene;
    if (!this.dashActive) {
      if (scene._touchLeft) {
        body.setVelocityX(-speed);
        this.setFlipX(true);
      } else if (scene._touchRight) {
        body.setVelocityX(speed);
        this.setFlipX(false);
      }
    }

    // Jump logic
    const jumpJustPressed = jumpDown && !this._jumpWasDown;

    if (jumpJustPressed) {
      if (onGround) {
        // Normal jump
        body.setVelocityY(this.charConfig.jumpStrength);
        this._hasUsedDoubleJump = false;
        if (window.AUDIO) window.AUDIO.sfxJump(false);
      } else if (this.canDoubleJump && !this._hasUsedDoubleJump) {
        // Double jump (Bun only)
        body.setVelocityY(this.charConfig.jumpStrength * 0.88);
        this._hasUsedDoubleJump = true;
        if (window.AUDIO) window.AUDIO.sfxJump(true);
      }
    }

    // Touch jump
    if (scene._touchJump && !scene._touchJumpWasDown) {
      if (onGround) {
        body.setVelocityY(this.charConfig.jumpStrength);
        this._hasUsedDoubleJump = false;
        if (window.AUDIO) window.AUDIO.sfxJump(false);
      } else if (this.canDoubleJump && !this._hasUsedDoubleJump) {
        body.setVelocityY(this.charConfig.jumpStrength * 0.88);
        this._hasUsedDoubleJump = true;
        if (window.AUDIO) window.AUDIO.sfxJump(true);
      }
    }
    scene._touchJumpWasDown = scene._touchJump;

    // Reset double jump when landing
    if (onGround) {
      this._hasUsedDoubleJump = false;
    }

    // Dash (Fang only)
    if (this.charConfig.dash) {
      if (this.dashCooldown > 0) {
        this.dashCooldown -= delta;
      }

      const dashJustPressed = (dashDown || scene._touchAbility) && !this._dashWasDown;

      if (dashJustPressed && this.dashCooldown <= 0 && !this.dashActive) {
        this.dashActive = true;
        this._dashTimer = 200; // ms of dash
        this.dashCooldown = 600;
        const dashDir = this.flipX ? -1 : 1;
        body.setVelocityX(dashDir * 600);
        if (window.AUDIO) window.AUDIO.sfxDash();

        // Dash trail effect
        if (scene.add && scene.tweens) {
          const trail = scene.add.sprite(this.x, this.y, this.charKey + '-jump-0');
          trail.setFlipX(this.flipX);
          trail.setAlpha(0.4);
          trail.setTint(0x88BBFF);
          scene.tweens.add({
            targets: trail,
            alpha: 0,
            scaleX: 0.5,
            duration: 200,
            onComplete: () => trail.destroy()
          });
        }
      }

      if (this.dashActive) {
        this._dashTimer -= delta;
        if (this._dashTimer <= 0) {
          this.dashActive = false;
        }
      }

      this._dashWasDown = dashDown || (scene._touchAbility || false);
    }

    this._jumpWasDown = jumpDown;

    // Check fall into pit
    if (this.y > GAME_H + 100) {
      if (scene.playerFellInPit) {
        scene.playerFellInPit();
      }
    }

    // Determine animation state
    this._updateAnimation(onGround, leftDown || rightDown || (scene._touchLeft || scene._touchRight));
  }

  _updateAnimation(onGround, moving) {
    const key = this.charKey;
    let newState;

    if (!onGround) {
      newState = 'jump';
    } else if (moving) {
      newState = 'run';
    } else {
      newState = 'idle';
    }

    if (newState !== this._animState) {
      this._animState = newState;
      const animKey = key + '-' + newState;
      if (this.scene.anims.exists(animKey)) {
        this.play(animKey, true);
      }
    }
  }

  loseHeart() {
    if (this.isHurt || !this.isAlive) return;

    this.hearts = Math.max(0, this.hearts - 1);
    this.comboCount = 0;
    this.isHurt = true;
    this._hurtTimer = this._hurtDuration;

    if (window.AUDIO) window.AUDIO.sfxHurt();

    // Flash red effect
    const scene = this.scene;
    let flashCount = 0;
    const maxFlashes = 8;
    const flashInterval = this._hurtDuration / maxFlashes;

    const flash = () => {
      if (flashCount >= maxFlashes || !this.isAlive) {
        this.setAlpha(1);
        return;
      }
      this.setAlpha(flashCount % 2 === 0 ? 0.2 : 1);
      flashCount++;
      scene.time.delayedCall(flashInterval, flash);
    };
    flash();

    // Play hurt animation briefly
    const animKey = this.charKey + '-hurt';
    if (scene.anims.exists(animKey)) {
      this.play(animKey, true);
      scene.time.delayedCall(300, () => {
        if (this.isAlive) {
          this._animState = '';
        }
      });
    }

    // Emit heartLost event
    scene.events.emit('heartLost', this.hearts);

    if (this.hearts <= 0) {
      this.isAlive = false;
      scene.time.delayedCall(400, () => {
        if (scene.playerDied) scene.playerDied();
      });
    }
  }

  playVictory() {
    const key = this.charKey + '-victory';
    if (this.scene.anims.exists(key)) {
      this.play(key, true);
    }
    // Bounce in place
    this.scene.tweens.add({
      targets: this,
      y: this.y - 20,
      duration: 250,
      ease: 'Back.easeOut',
      yoyo: true,
      repeat: 3
    });
  }
}
