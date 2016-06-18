'use strict';

var header_style = { font: "120px comeback", fill: "#ff002f", align: "center" };

var MenuScene = {
  create: function () {
    this.game.stage.backgroundColor = '#fbd000';

    this.bg = this.game.add.tileSprite(0,0,this.game.world.width, this.game.world.height, 'bg');
    // this.bg.anchor.set(0.5);
    this.bg.autoScroll(0, -50);

    this.headerText = this.game.add.text(this.game.world.centerX, 30, 'CRACKBALL' , header_style);
    this.headerText.anchor.set(0.5, 0);
    this.headerText.fontWeight = 'bold';
    this.headerText.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);

    this.playBotBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 40, 'player vs bot', { font: "60px comeback", fill: "#ff002f", align: "center"});
    this.playBotBtn.anchor.set(0.5, 0);
    this.playBotBtn.fontWeight = 'bold';
    this.playBotBtn.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);
    this.playBotBtn.alpha = 0.7;

    this.playBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY-20, 'player vs player', { font: "60px comeback", fill: "#ff002f", align: "center"});
    this.playBtn.anchor.set(0.5, 0);
    this.playBtn.fontWeight = 'bold';
    this.playBtn.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);

    this.playBtn.inputEnabled = true;
    this.playBtn.input.useHandCursor = true;
    this.playBtn.events.onInputOver.add(function (item) {
      item.fill = "#FFF";
    }, this);

    this.playBtn.events.onInputOut.add(function (item) {
      item.fill = "#ff002f";
    }, this);

    this.playBtn.events.onInputDown.add(function (item) {
      this.music.stop();
      this.game.state.start('play');
	}, this);

    this.music = this.game.add.audio('main_theme');
    this.music.play();
  }
};
