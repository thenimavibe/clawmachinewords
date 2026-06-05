// ============================================================
// scenes/WordInputScene.js — HTML overlay word input screen
// ============================================================

class WordInputScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WordInputScene' });
  }

  init(data) {
    this._levelId = (data && data.levelId) ? data.levelId : (window.CURRENT_LEVEL || 1);
  }

  create() {
    window.CURRENT_LEVEL = this._levelId;

    // Grab the HTML overlay elements
    this._overlay = document.getElementById('word-input-overlay');
    this._levelLabel = document.getElementById('level-theme-label');
    this._wordField = document.getElementById('word-field');
    this._wordError = document.getElementById('word-error');
    this._suggButtons = document.getElementById('suggestion-buttons');
    this._startBtn = document.getElementById('start-level-btn');

    if (!this._overlay) {
      console.error('word-input-overlay not found!');
      return;
    }

    // Get level config
    const lvlIdx = Math.max(0, this._levelId - 1);
    const levelCfg = LEVELS[lvlIdx] || LEVELS[0];

    // Update label
    if (this._levelLabel) {
      this._levelLabel.textContent = levelCfg.emoji + ' Level ' + this._levelId + ' — ' + levelCfg.name;
    }

    // Clear word field
    if (this._wordField) {
      this._wordField.value = '';
      this._wordField.addEventListener('input', () => this._onWordInput());
      this._wordField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._tryStart();
      });
    }

    // Clear error
    if (this._wordError) {
      this._wordError.textContent = '';
    }

    // Populate suggestions
    if (this._suggButtons) {
      this._suggButtons.innerHTML = '';
      const suggestions = levelCfg.suggestions || ['CAT', 'DOG', 'SUN', 'FUN', 'RUN'];
      suggestions.forEach(word => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = word;
        btn.addEventListener('click', () => {
          if (this._wordField) {
            this._wordField.value = word.toUpperCase();
            this._onWordInput();
          }
          if (window.AUDIO) window.AUDIO.sfxClick();
        });
        this._suggButtons.appendChild(btn);
      });
    }

    // Start button
    if (this._startBtn) {
      // Remove old listeners by replacing
      const newBtn = this._startBtn.cloneNode(true);
      this._startBtn.parentNode.replaceChild(newBtn, this._startBtn);
      this._startBtn = newBtn;
      this._startBtn.addEventListener('click', () => this._tryStart());
    }

    // Show overlay
    this._overlay.classList.add('visible');

    // Focus input
    setTimeout(() => {
      if (this._wordField) this._wordField.focus();
    }, 100);

    // Also listen for Escape to go back
    this._escListener = (e) => {
      if (e.key === 'Escape') this._goBack();
    };
    document.addEventListener('keydown', this._escListener);
  }

  _onWordInput() {
    if (!this._wordField) return;
    // Strip non-alpha, uppercase, limit to 10
    let val = this._wordField.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 10);
    this._wordField.value = val;
    if (this._wordError) this._wordError.textContent = '';
  }

  _validate(word) {
    if (!word || word.length < 2) return 'Please enter at least 2 letters!';
    if (word.length > 10) return 'Maximum 10 letters!';
    if (!/^[A-Z]+$/.test(word)) return 'Only letters are allowed!';
    return null;
  }

  _tryStart() {
    if (!this._wordField) return;
    const word = this._wordField.value.trim().toUpperCase();
    const error = this._validate(word);

    if (error) {
      if (this._wordError) {
        this._wordError.textContent = error;
        this._wordError.style.animation = 'none';
        setTimeout(() => { this._wordError.style.animation = ''; }, 10);
      }
      if (window.AUDIO) window.AUDIO.sfxNotYet();
      return;
    }

    if (window.AUDIO) window.AUDIO.sfxClick();

    window.CURRENT_WORD = word;
    window.CURRENT_LEVEL = this._levelId;
    window.CURRENT_CHAR = (window.SAVE && window.SAVE.character) || window.CURRENT_CHAR || 'bun';

    this._hideOverlay();

    this.cameras.main.fadeOut(300, 0, 0, 0, () => {
      this.scene.start('GameScene', {
        levelId: this._levelId,
        word: word,
        charKey: window.CURRENT_CHAR
      });
    });
  }

  _goBack() {
    this._hideOverlay();
    document.removeEventListener('keydown', this._escListener);
    this.cameras.main.fadeOut(300, 0, 0, 0, () => {
      this.scene.start('LevelMapScene');
    });
  }

  _hideOverlay() {
    if (this._overlay) {
      this._overlay.classList.remove('visible');
    }
    if (this._wordField) {
      this._wordField.removeEventListener('input', this._onWordInput);
    }
    document.removeEventListener('keydown', this._escListener);
  }

  shutdown() {
    this._hideOverlay();
  }
}
