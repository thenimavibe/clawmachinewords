// ============================================================
// scenes/GameScene.js — Main gameplay scene
// ============================================================

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this._levelId = (data && data.levelId) ? data.levelId : (window.CURRENT_LEVEL || 1);
    this._word = (data && data.word) ? data.word.toUpperCase() : (window.CURRENT_WORD || 'CAT');
    this._charKey = (data && data.charKey) ? data.charKey : (window.CURRENT_CHAR || 'bun');

    // Update globals
    window.CURRENT_LEVEL = this._levelId;
    window.CURRENT_WORD = this._word;
    window.CURRENT_CHAR = this._charKey;

    // Game state
    this._timer = 0;
    this._timerActive = false;
    this._secondsCounter = 0;
    this._score = 0;
    this._nextLetterIndex = 0;
    this._combo = 0;
    this._gameOver = false;
    this._won = false;

    // Touch input flags
    this._touchLeft = false;
    this._touchRight = false;
    this._touchJump = false;
    this._touchAbility = false;
    this._touchJumpWasDown = false;
    this._respawning = false;
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, LEVEL_W, GAME_H + 200);

    // Get level config
    const lvlIdx = Math.max(0, this._levelId - 1);
    const levelCfg = LEVELS[lvlIdx] || LEVELS[0];
    const layout = LEVEL_LAYOUTS['1'] || LEVEL_LAYOUTS[1];

    // ---- BACKGROUND ----
    this._createBackground(levelCfg);

    // ---- PLATFORMS ----
    this._platforms = this.physics.add.staticGroup();
    this._createPlatforms(layout);

    // ---- ENEMIES ----
    this._enemies = [];
    this._createEnemies(layout);

    // ---- LETTERS ----
    this._letters = [];
    this._createLetters(layout);

    // ---- GOAL FLAG ----
    this._createGoalFlag(layout.goalX || 4750);

    // ---- PLAYER ----
    this._player = new Player(this, layout.startX || 120, layout.startY || 600, this._charKey);
    this._player.setDepth(10);

    // ---- CAMERA ----
    this.cameras.main.setBounds(0, 0, LEVEL_W, GAME_H);
    this.cameras.main.startFollow(this._player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(600, 0, 0, 0);

    // ---- COLLISIONS ----
    this.physics.add.collider(this._player, this._platforms);
    this._enemies.forEach(enemy => {
      this.physics.add.collider(enemy, this._platforms);
    });

    // Player vs enemies
    this.physics.add.overlap(
      this._player,
      this._enemies,
      this._handlePlayerEnemyCollision,
      (player, enemy) => enemy && enemy.isAlive && !enemy.isStomped,
      this
    );

    // Player vs letters (use arcade overlap)
    this._letters.forEach(letter => {
      this.physics.add.overlap(this._player, letter, () => {
        this._handleLetterPickup(letter);
      }, null, this);
    });

    // ---- UI SCENE ----
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    } else {
      // Rebuild word tracker
      const uiScene = this.scene.get('UIScene');
      if (uiScene && uiScene.rebuildForWord) {
        uiScene.rebuildForWord(this._word);
      }
    }

    // ---- TIMER ----
    this._timerActive = true;
    this._timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this._onTick,
      callbackScope: this,
      loop: true
    });

    // ---- TOUCH CONTROLS ----
    this._setupTouchControls();

    // ---- MOBILE CHECK ----
    this._isMobile = this.sys.game.device.input.touch;

    // Emit initial score
    this.events.emit('scoreUpdate', this._score);

    // Display word reminder
    this._createWordReminder();
  }

  _createBackground(levelCfg) {
    // Sky
    const sky = this.add.image(0, 0, 'bg-sky-forest').setOrigin(0, 0).setScrollFactor(0);
    sky.setDisplaySize(GAME_W, 720);

    // Far trees (parallax)
    this._farTrees = this.add.tileSprite(0, 300, GAME_W, 250, 'bg-far-trees').setOrigin(0, 0.5).setScrollFactor(0);

    // Mid trees
    this._midTrees = this.add.tileSprite(0, 440, GAME_W, 180, 'bg-mid-trees').setOrigin(0, 0.5).setScrollFactor(0);

    // Ground strip
    this._groundBg = this.add.tileSprite(0, 620, GAME_W, 100, 'bg-ground-forest').setOrigin(0, 0).setScrollFactor(0);

    // Decorative elements scattered across level
    const mushroomPositions = [300, 900, 1600, 2400, 3100, 3800, 4400];
    mushroomPositions.forEach(x => {
      const m = this.add.image(x + Phaser.Math.Between(-20, 20), 640, 'bg-mushroom-1');
      m.setScale(Phaser.Math.FloatBetween(0.7, 1.2));
      m.setDepth(1);
    });

    const treePositions = [500, 1200, 1800, 2600, 3300, 4000, 4600];
    treePositions.forEach(x => {
      const t = this.add.image(x, 560, 'bg-tree-1');
      t.setScale(Phaser.Math.FloatBetween(0.8, 1.4));
      t.setDepth(1);
      t.setAlpha(0.7);
    });
  }

  _createPlatforms(layout) {
    const platforms = layout.platforms || [];

    platforms.forEach(plat => {
      if (plat.type === 'ground') {
        // Tile the ground texture
        const numTiles = Math.ceil(plat.w / 64);
        for (let i = 0; i < numTiles; i++) {
          const px = plat.x + i * 64;
          const tile = this._platforms.create(px + 32, plat.y + 16, 'platform-ground-forest');
          tile.setImmovable(true);
          tile.refreshBody();
        }
      } else if (plat.type === 'float') {
        // Floating platform
        const fp = this._platforms.create(plat.x + plat.w / 2, plat.y + 12, 'platform-float-forest');
        fp.setImmovable(true);
        fp.refreshBody();

        // Scale to match width if needed
        const scale = plat.w / 120;
        fp.setScale(scale, 1);
        fp.refreshBody();
      }
    });
  }

  _createEnemies(layout) {
    const enemyData = layout.enemies || [];

    enemyData.forEach(eData => {
      const enemy = new Enemy(this, eData.x, eData.y - 24, eData.type || 'turtle');
      enemy.setDepth(8);
      // Set patrol speed from level config
      const lvlIdx = Math.max(0, this._levelId - 1);
      const levelCfg = LEVELS[lvlIdx] || LEVELS[0];
      enemy.speed = levelCfg.enemySpeed || 60;
      this._enemies.push(enemy);
    });
  }

  _createLetters(layout) {
    const slots = layout.letterSlots || [];
    const word = this._word;

    for (let i = 0; i < word.length; i++) {
      if (i >= slots.length) break;
      const slot = slots[i];
      const letter = new Letter(this, slot.x, slot.y, word[i], i);
      letter.setDepth(9);
      this._letters.push(letter);
    }

    // If word is longer than slots, add extra letters at generated positions
    if (word.length > slots.length) {
      for (let i = slots.length; i < word.length; i++) {
        const x = 300 + i * 450;
        const y = 500;
        const letter = new Letter(this, x, y, word[i], i);
        letter.setDepth(9);
        this._letters.push(letter);
      }
    }
  }

  _createGoalFlag(goalX) {
    this._goalFlag = this.add.image(goalX, 638, 'goal-flag').setDepth(5);

    // Animated waving (scale x oscillate slightly)
    this.tweens.add({
      targets: this._goalFlag,
      scaleX: 1.1,
      duration: 400,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Goal area text
    this.add.text(goalX, 580, 'FINISH!', {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#FFDD00',
      stroke: '#440000',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setDepth(6);
  }

  _createWordReminder() {
    // Show word at bottom of screen briefly
    const wordDisplay = this.add.text(GAME_W / 2, GAME_H - 40, 'Collect: ' + this._word, {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '24px',
      color: '#FFFFFF',
      stroke: '#000033',
      strokeThickness: 3,
      backgroundColor: 'rgba(0,0,40,0.7)',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(20);

    this.tweens.add({
      targets: wordDisplay,
      alpha: 0,
      y: GAME_H - 60,
      duration: 800,
      ease: 'Quad.easeIn',
      delay: 2000,
      onComplete: () => wordDisplay.destroy()
    });
  }

  _handlePlayerEnemyCollision(player, enemy) {
    if (!enemy.isAlive || enemy.isStomped) return;
    if (player.isHurt) return;

    // Check if player is stomping (falling from above)
    if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
      // Stomp!
      enemy.stomp();
      // Bounce player up
      player.body.setVelocityY(-400);
      this._addScore(150, player.x, player.y - 50, 'STOMP!');
    } else {
      // Player takes damage
      player.loseHeart();
    }
  }

  _handleLetterPickup(letter) {
    if (!letter || letter.collected) return;

    if (letter.index === this._nextLetterIndex) {
      // Correct letter!
      letter.setCollected(GAME_W / 2 - (this._word.length * 25) + letter.index * 50, 30);
      this._nextLetterIndex++;
      this._combo++;
      this._player.comboCount = this._combo;

      if (window.AUDIO) window.AUDIO.sfxLetter(letter.index);

      // Score for letter
      this._addScore(100 + this._combo * 50, letter.x, letter.y - 30, '+' + (100 + this._combo * 50));

      // Emit events
      this.events.emit('letterCollected', letter.index);
      this.events.emit('comboUpdate', this._combo);
      this.events.emit('scoreUpdate', this._score);

      // Check win condition
      if (this._nextLetterIndex >= this._word.length) {
        this.time.delayedCall(300, () => this.triggerWin());
      }
    } else {
      // Wrong letter
      letter.setWrongAttempt();
      this._combo = 0;
      this.events.emit('comboUpdate', 0);
    }
  }

  _addScore(amount, x, y, label) {
    this._score += amount;

    // Floating score text
    const scorePopup = this.add.text(x, y, label || ('+' + amount), {
      fontFamily: "'Fredoka One', cursive",
      fontSize: '22px',
      color: '#FFDD44',
      stroke: '#443300',
      strokeThickness: 2
    }).setOrigin(0.5, 0.5).setDepth(20);

    this.tweens.add({
      targets: scorePopup,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => scorePopup.destroy()
    });
  }

  _onTick() {
    if (!this._timerActive || this._gameOver) return;
    this._secondsCounter++;
    this.events.emit('timerUpdate', this._secondsCounter);
  }

  triggerWin() {
    if (this._won || this._gameOver) return;
    this._won = true;
    this._gameOver = true;
    this._timerActive = false;

    if (window.AUDIO) window.AUDIO.sfxWordComplete();

    // Camera flash
    this.cameras.main.flash(500, 255, 255, 100);

    // Victory animation
    this._player.playVictory();

    // Calculate final score
    const finalScore = calcScore(
      this._word.length,
      this._secondsCounter,
      this._player.hearts,
      this._combo
    );
    const stars = calcStars(
      this._word.length,
      this._nextLetterIndex,
      this._secondsCounter,
      this._player.hearts,
      false
    );

    this.time.delayedCall(1800, () => {
      if (this.scene.isActive('UIScene')) {
        this.scene.stop('UIScene');
      }
      this.scene.start('LevelEndScene', {
        levelId: this._levelId,
        word: this._word,
        score: finalScore,
        stars: stars,
        time: this._secondsCounter,
        heartsLeft: this._player.hearts,
        combo: this._combo,
        collected: this._nextLetterIndex,
        failed: false
      });
    });
  }

  triggerFail() {
    if (this._gameOver) return;
    this._gameOver = true;
    this._timerActive = false;

    if (window.AUDIO) window.AUDIO.sfxFail();

    // Camera shake
    this.cameras.main.shake(500, 0.02);

    this.time.delayedCall(1800, () => {
      if (this.scene.isActive('UIScene')) {
        this.scene.stop('UIScene');
      }
      this.scene.start('LevelEndScene', {
        levelId: this._levelId,
        word: this._word,
        score: this._score,
        stars: 0,
        time: this._secondsCounter,
        heartsLeft: 0,
        combo: this._combo,
        collected: this._nextLetterIndex,
        failed: true
      });
    });
  }

  playerFellInPit() {
    if (this._gameOver || this._respawning) return;
    if (this._player.isHurt) return; // already hurt, don't double-trigger

    this._respawning = true;
    this._player.loseHeart();

    if (this._player.hearts > 0) {
      // Respawn at safe position
      this._player.setPosition(
        Math.max(150, this._player.x - 50),
        350
      );
      if (this._player.body) {
        this._player.body.setVelocity(0, 0);
      }
    }

    // Allow pit-fall damage again after invincibility wears off
    this.time.delayedCall(2100, () => { this._respawning = false; });
  }

  playerDied() {
    this.triggerFail();
  }

  _setupTouchControls() {
    const touchDiv = document.getElementById('touch-controls');
    if (!touchDiv) return;

    if (this.sys.game.device.input.touch) {
      touchDiv.style.display = 'block';
    }

    const bindBtn = (id, flag) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this[flag] = true; }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this[flag] = false; }, { passive: false });
      el.addEventListener('touchcancel', (e) => { e.preventDefault(); this[flag] = false; }, { passive: false });
    };

    bindBtn('touch-left', '_touchLeft');
    bindBtn('touch-right', '_touchRight');
    bindBtn('touch-jump', '_touchJump');
    bindBtn('touch-ability', '_touchAbility');
  }

  update(time, delta) {
    if (this._gameOver) return;

    // Update player
    if (this._player && this._player.isAlive) {
      this._player.update(delta);
    }

    // Update enemies
    this._enemies.forEach(enemy => {
      if (enemy && enemy.isAlive && !enemy.isStomped) {
        enemy.update(delta);
      }
    });

    // Parallax background update
    if (this._player) {
      const camX = this.cameras.main.scrollX;
      if (this._farTrees) this._farTrees.tilePositionX = camX * 0.15;
      if (this._midTrees) this._midTrees.tilePositionX = camX * 0.35;
      if (this._groundBg) this._groundBg.tilePositionX = camX * 0.6;
    }
  }

  shutdown() {
    // Clean up touch controls
    const touchDiv = document.getElementById('touch-controls');
    if (touchDiv) touchDiv.style.display = 'none';

    // Clear timer
    if (this._timerEvent) {
      this._timerEvent.destroy();
    }
  }
}
