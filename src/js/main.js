'use strict';

var BootScene = {
  init: function(){
    this.game.stage.smoothed = false;
  },
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};

var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('p1', 'images/p1.png');
    this.game.load.image('p2', 'images/p2.png');
  },

  create: function () {
    this.game.state.start('menu');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game');
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', MenuScene);
  game.state.add('play', GameScene);

  game.state.start('boot');
};
