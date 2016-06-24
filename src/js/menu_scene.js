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
var margin = 70;
var MenuScene = {
    create: function() {
        this.game.stage.backgroundColor = '#fbd000';

        this.bg = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg');
        this.bg.autoScroll(0, -50);

        this.headerText = this.game.add.text(this.game.world.centerX, 20, ' CRACKBALL ', header_style);
        this.headerText.anchor.set(0.5, 0);
        // this.headerText.fontWeight = 'bold';
        this.headerText.setShadow(0, 5, 'rgba(255,255,255,.9)', 0);
        this.headerText.type = 'label';
        this.playBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY - margin / 2, ' player vs player ', btn_style);
        this.btnGroup = this.game.add.group();
        this.playBotBtn = this.game.add.text(this.game.world.centerX, this.playBtn.y + margin , ' player vs bot ', btn_style);
        this.playBotBtn.isBot = true;
        this.aboutBtn = this.game.add.text(this.game.world.centerX, this.playBotBtn.y + margin, ' about ', btn_style);
        this.aboutBtn.action = 'about';
        this.backBtn = this.game.add.text(20, 0, '< back', btn_style);
        this.backBtn.action = 'back';
        this.btnGroup.addMultiple([this.playBtn, this.playBotBtn, this.aboutBtn, this.headerText, this.backBtn]);
        this.btnGroup.forEach(function (item) {
            if(item.type != 'label'){
            item.anchor.set(0.5, 0);
            item.setShadow(0, 5, 'rgba(255,255,255, .9)', 0);
            item.inputEnabled = true;
            item.input.useHandCursor = true;
            }
        });

        this.btnGroup.callAll('events.onInputDown.add', 'events.onInputDown', function(input) {
            if(input.action == 'about'){
                this.btnGroup.visible = false;
                this.aboutGroup.visible = true;
            } else if (input.action == 'back'){
                this.btnGroup.visible = true;
                this.aboutGroup.visible = false;
            } else {
                music.restart('', 0, .1, true);
                this.game.state.start('play', true, false, input.isBot);
            }
        }, this);
        this.btnGroup.callAll('events.onInputOver.add', 'events.onInputOver', function(input) {
            input.fill = "#FFF";
            input.setShadow(0, 5, 'rgba(0,0,0, .9)', 0);
        }, this);
        this.btnGroup.callAll('events.onInputOut.add', 'events.onInputOut', function(input) {
            input.fill = "#ff002f";
            input.setShadow(0, 5, 'rgba(255,255,255, .9)', 0);
        }, this);

        this.aboutGroup = this.game.add.group();
        this.aboutText = this.playBtn = this.game.add.text(this.game.world.centerX, 20 , ' ABOUT: \n ART: FASON & QUIPHOP \n CODE: QUIPHOP \n MUSIC: Pleasure Toys – Px \n\n  quiphop prod. 2016', btn_style);
        this.aboutGroup.addMultiple([this.aboutText, this.backBtn]);
        this.aboutGroup.forEach(function (item) {
            item.anchor.set(0.5, 0);
            item.setShadow(0, 5, 'rgba(255,255,255, .9)', 0);
        });
        this.aboutGroup.visible = false;
        music.play();
    }
};
