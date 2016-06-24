'use strict';
var music;

var BootScene = {
    init: function() {
        this.game.stage.smoothed = false;
    },
    preload: function() {
        // load here assets required for the loading screen
        this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    },

    create: function() {
        this.game.state.start('preloader');
    }
};

var PreloaderScene = {
    preload: function() {
        this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
        this.loadingBar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.loadingBar);

        this.game.load.audio('main_theme', ['audio/main_theme1.mp3']);
        this.game.load.spritesheet('p1', 'images/sprite_p1.png', 150, 240);
        this.game.load.spritesheet('p2', 'images/sprite_p2.png', 150, 240);
        this.game.load.image('bg', 'images/pat.png');
        this.game.load.image('bg_main', 'images/bg_main.png');
        this.game.load.spritesheet('coin', 'images/coin.png', 192, 192);

        this.game.load.audio('punch1', 'audio/punch1.mp3');
        this.game.load.audio('punch3', 'audio/punch3.mp3');
        this.game.load.audio('punch4', 'audio/punch4.mp3');

        this.game.load.audio('hurt1', 'audio/hurt1.mp3');
        this.game.load.audio('hurt2', 'audio/hurt2.mp3');
        this.game.load.audio('hurt3', 'audio/hurt3.mp3');
        this.game.load.audio('hurt4', 'audio/hurt4.mp3');
        this.game.load.audio('hurt5', 'audio/hurt5.mp3');

        this.game.load.audio('rep1', 'audio/rep1.mp3');
        this.game.load.audio('rep2', 'audio/rep2.mp3');
        this.game.load.audio('rep3', 'audio/rep3.mp3');
        this.game.load.audio('rep4', 'audio/rep4.mp3');
        this.game.load.audio('rep5', 'audio/rep5.mp3');

        this.game.load.audio('heartbeat', 'audio/heartbeat.mp3');
        this.game.load.audio('toss', 'audio/toss.mp3');
    },

    create: function() {
        music = this.game.add.audio('main_theme');
        music.loop = true;
        music.volume = .5;
        this.game.state.start('menu');
    }
};

window.onload = function() {
    var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game');
    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('menu', MenuScene);
    game.state.add('play', GameScene);
    game.state.start('boot');
};
