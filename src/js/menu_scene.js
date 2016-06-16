'use strict';

var header_style = { font: "90px brutal", fill: "#ff0000", align: "center" };

var MenuScene = {
  create: function () {
    this.game.stage.backgroundColor = '#fbd000'; 
    this.headerText = this.game.add.text(this.game.world.centerX, 20, 'CRACKBALL' , header_style);
    this.headerText.anchor.set(0.5, 0);
    this.headerText.fontWeight = 'bold';
    this.headerText.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);

    this.playBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'PLAY', { font: "60px brutal", fill: "#ff0000", align: "center"});
	this.playBtn.anchor.set(0.5, 0);
    this.playBtn.fontWeight = 'bold';
    this.playBtn.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);
    this.playBtn.inputEnabled = true;
    this.playBtn.input.useHandCursor = true;
    this.playBtn.events.onInputOver.add(function (item) {
	    item.fill = "#FFF";
	}, this);

    this.playBtn.events.onInputOut.add(function (item) {
	    item.fill = "#ff0000";
	}, this);

    this.playBtn.events.onInputDown.add(function (item) {
		this.game.state.start('play');
	}, this);



  }
};
