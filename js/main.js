// ============================================================
// main.js — Phaser game initialization
// ============================================================

window.onload = () => {
  // Initialize audio manager
  if (window.AUDIO) {
    AUDIO.init();
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_W,
    height: GAME_H,
    parent: 'game-container',
    backgroundColor: '#0d0d1a',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 800 },
        debug: false
      }
    },
    scene: [
      BootScene,
      TitleScene,
      CharSelectScene,
      LevelMapScene,
      WordInputScene,
      GameScene,
      UIScene,
      LevelEndScene
    ],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  });
};
