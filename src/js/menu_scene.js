'use strict';

var header_style = {
    font: "120px comeback",
    fill: "#ff002f",
    align: "center"
};

var btn_style = {
    font: "60px comeback",
    fill: "#ff002f",
    align: "center"
};
var MenuScene = {
    create: function() {
        this.game.stage.backgroundColor = '#fbd000';

        this.bg = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg');
        // this.bg.anchor.set(0.5);
        this.bg.autoScroll(0, -50);

        this.headerText = this.game.add.text(this.game.world.centerX, 30, 'CRACKBALL', header_style);
        this.headerText.anchor.set(0.5, 0);
        // this.headerText.fontWeight = 'bold';
        this.headerText.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);

        this.btnGroup = this.game.add.group();
        this.playBotBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 40, 'player vs bot', btn_style);
        this.playBotBtn.isBot = true;
        this.playBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 20, 'player vs player', btn_style);
        // this.playBtn.fontWeight = 'bold';
        this.btnGroup.addMultiple([this.playBtn, this.playBotBtn]);
        this.btnGroup.forEach(function (item) {
            item.anchor.set(0.5, 0);
            item.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);
            item.inputEnabled = true;
            item.input.useHandCursor = true;
        });

        this.btnGroup.callAll('events.onInputDown.add', 'events.onInputDown', function(input) {
            this.music.stop();
            this.game.state.start('play', true, false, input.isBot);
        }, this);
        this.btnGroup.callAll('events.onInputOver.add', 'events.onInputOver', function(input) {
            input.fill = "#FFF";
        }, this);
        this.btnGroup.callAll('events.onInputOut.add', 'events.onInputOut', function(input) {
            input.fill = "#ff002f";
        }, this);


        this.music = this.game.add.audio('main_theme');
        this.music.play();
    }
};
