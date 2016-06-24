'use strict';
var timer;
var style = {
    font: "56px comeback",
    fill: "#FF0044",
    align: "center"
};
var score_style = {
    font: "56px comeback",
    fill: "#FFF",
    align: "center"
};
var cd_style = {
    font: "100px comeback",
    fill: "#FF0044",
    align: "center"
};
var menu_btn_style = {
    font: "60px comeback",
    fill: "#ff002f",
    align: "center"
};
var textMargin = 160;
var GameScene = function() {};

GameScene.prototype = {

    init: function(isBot) {
        this.pow1 = 0;
        this.pow2 = 0;
        this.gameStatus = {
            cur: 'init',
            prev: ''
        };
        this.round = 1;
        this.roundStatus = '';
        this.tweenComplete = false;
        this.isBot = isBot;
    },

    create: function() {
        this.powKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.powKey.onDown.add(this.getPower, this);

        this.bg = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'bg_main');
        this.bg.anchor.setTo(0.5);
        this.playersSpriteGroup = this.game.add.group();
        this.p1 = this.game.add.sprite(330, 250, 'p1');
        this.p1.name = "PLAYER 1";
        this.p1.anchor.setTo(0.5);
        this.p1.scale.setTo(1.2);

        this.coin = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 90, 'coin');
        this.coin.anchor.setTo(0.5);
        this.coin.scale.setTo(.8);
        this.cointoss = this.coin.animations.add('toss');
        this.coin.animations.play('toss', 12, true);

        this.p2 = this.game.add.sprite(440, 250, 'p2');
        this.p2.anchor.setTo(0.5);
        this.p2.scale.setTo(1.2);
        this.p2.isBot = this.isBot;
        this.p2.name = this.p2.isBot ? 'BOT' : 'PLAYER 2';
        this.playersSpriteGroup.addMultiple([this.p1, this.p2]);

        this.turn = this.game.rnd.integerInRange(1, 2);
        this.turnText = this.game.add.text(this.game.world.centerX, 90, " ", style);
        this.turnText.anchor.setTo(0.5);
        this.turnText.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);
        this.turnText.lineSpacing = -10;

        this.menuBtn = this.game.add.text(this.game.world.width - 30, 0, 'I I', menu_btn_style);
        this.menuBtn.inputEnabled = true;
        this.menuBtn.input.useHandCursor = true;
        this.menuBtn.setShadow(0, 2, 'rgba(0,0,0,0.9)', 0);
        this.menuBtn.anchor.set(0.5, 0);
        this.menuBtn.fontWeight = 'bold';

        this.pushText = this.game.add.text(0, 0, "PUSH\nSPACEBAR!", score_style);
        this.pushText.anchor.setTo(0.5);
        this.pushText.alpha = 0;
        this.pushText.setShadow(0, 4, 'rgba(0,0,0,0.9)', 0);
        this.placePushText();

        this.countDownLabel = this.game.add.text(this.game.world.centerX, 70, " ", cd_style);
        this.countDownLabel.anchor.setTo(0.5);
        this.countDownLabel.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);

        this.roundLabel = this.game.add.text(this.game.world.width / 2, 20, " ", style);
        this.roundLabel.anchor.setTo(0.5);
        this.roundLabel.fontWeight = 'bold';
        this.roundLabel.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);

        this.p1ScoreLabel = this.game.add.text(0, 50, "", score_style);
        this.p2ScoreLabel = this.game.add.text(this.game.world.width, 50, "", score_style);
        this.p1ScoreLabel.setShadow(0, 3, '#FF0044', 0);
        this.p2ScoreLabel.setShadow(0, 3, '#FF0044', 0);
        this.p2ScoreLabel.anchor.setTo(1, 0);

        this.menuModalGroup = this.game.add.group();
        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill("#FFF", 0.5);
        graphics.drawRect(0, 0, this.game.world.width, this.game.world.height);

        this.inputMenuGroup = this.game.add.group();
        this.repeatBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 60, 'PLAY AGAIN', menu_btn_style);
        this.repeatBtn.action = 'repeat';

        this.exitBtn = this.game.add.text(this.game.world.centerX, this.repeatBtn.y + 60, 'Return to Menu', menu_btn_style);
        this.exitBtn.action = 'exit';

        this.resumeBtn = this.game.add.text(this.game.world.centerX, this.exitBtn.y + 60, 'Resume', menu_btn_style);
        this.resumeBtn.action = 'resume';

        this.inputMenuGroup.addMultiple([this.repeatBtn, this.exitBtn, this.resumeBtn]);
        this.inputMenuGroup.forEach(function(item) {
            item.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);
            item.anchor.set(0.5, 0);
            item.inputEnabled = true;
            item.input.useHandCursor = true;
        });
        this.inputMenuGroup.callAll('events.onInputDown.add', 'events.onInputDown', function(input) {
            switch (input.action) {
                case 'repeat':
                    this.game.state.restart(true, false, this.isBot);
                    break;
                case 'resume':
                    timer.resume();
                    this.tweenComplete = true;
                    this.menuModalGroup.visible = false;
                    this.menuModalGroup.alpha = 0;
                    this.pushText.alpha = 1;
                    this.gameStatus.cur = this.gameStatus.prev;
                    break;
                case 'exit':
                    music.restart('', 0, .5, true);
                    this.game.state.start('menu');
                    break;
            }
        }, this);
        this.inputMenuGroup.callAll('events.onInputOver.add', 'events.onInputOver', function(input) {
            input.fill = "#FFF";
        }, this);
        this.inputMenuGroup.callAll('events.onInputOut.add', 'events.onInputOut', function(input) {
            input.fill = "#ff002f";
        }, this);

        this.menuModalGroup.addMultiple([graphics, this.inputMenuGroup]);
        this.menuModalGroup.visible = false;
        this.menuModalGroup.alpha = 0;

        this.menuBtn.events.onInputDown.add(function(){
            timer.pause();
            this.world.bringToTop(this.menuModalGroup);
            this.gameStatus.prev = this.gameStatus.cur;
            this.gameStatus.cur = 'pause';
            this.menuModalGroup.visible = true;
            this.inputMenuGroupTween.start();
        }, this);
        this.initAnimations();
        this.initSounds();

        this.game.world.bringToTop(this.coin);

        this.coinTossTween.start();
        timer = this.game.time.create(false);
    },

    update: function() {
        //START ROUND SPACEBAR HANDLER
        if (this.gameStatus.cur == 'init') {
            if (this.tweenComplete) {
                this.turnText._text = this['p' + this.turn].name + " READY";
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.coin.destroy();
                    this.playSound('reply');
                    this.startGame();
                }
            }
        } else if(this.gameStatus.cur != 'pause'){
            //GAME STARTED
            this.roundLabel._text = "ROUND " + this.round;
            this.p1ScoreLabel._text = "POWER " + this.pow1;
            this.p2ScoreLabel._text = "POWER " + this.pow2;
            if (this['p' + this.turn].isBot && timer.running && !timer.paused) {
                this.pushText.alpha = 0;
                if (this.game.time.now - this.botTick > 100) {
                    if (this.game.rnd.integerInRange(1, 10) >= 5) {
                        this.pow2++;
                        this.playSound('heartbeat');
                    }
                    this.botTick = this.game.time.now;
                }
            }

            if (this.roundStatus == 'break') {
                this.turnText._text = this['p' + this.turn].name + " GET UP!";
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.tweenComplete || this['p' + this.turn].isBot){
                    this.resumeRound();
                }
            }
            //CHECK RESULT OF THE ROUND
            if (this.roundStatus == 'ended') {
                if (this.turn == 1 && this.pow1 > this.pow2) {
                    this.turnText._text = this.p1.name + " WINS";
                    this.p2DeathTween.start();
                } else if (this.turn == 2 && this.pow1 < this.pow2) {
                    this.turnText._text = this.p2.name + " WINS";
                    this.p1DeathTween.start();
                } else {
                    //THESE VALUES ARE 'PREDICTED'
                    this.roundLabel._text = "ROUND " + (this.round + 1);
                    this.turnText._text = (this.turn == 1 ? this.p2.name : this.p1.name) + " TURN";
                    this.p1ScoreLabel.setText('');
                    this.p2ScoreLabel.setText('');
                    this.pushText.alpha = this['p' + this.turn].isBot ? true : false;
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || !this['p' + this.turn].isBot) {
                        this.newRound();
                    }
                }
            }
        }
    },

    render: function() {
        this.renderLabels();
    },

    getPower: function(event) {
        if (timer.running && !timer.paused && !this['p' + this.turn].isBot) {
            this.playSound('heartbeat');
            switch (this.turn) {
                case 1:
                    this.pow1++;
                    this.p1ScoreLabel.setText("POWER " + this.pow1);
                    break;
                case 2:
                    this.pow2++;
                    this.p2ScoreLabel.setText("POWER " + this.pow2);
                    break;
            }
        }
    },

    endTimer: function() {
        timer.pause();
        this.playAttackAnimation();
        switch (this.roundStatus) {
            case 'started':
                this.roundStatus = 'break';
                break;
            case 'break':
                this.roundStatus = 'resume';
                break;
            case 'resume':
                this.roundStatus = 'ended';
                break;
            case 'ended':
                break;
        }
        this.switchTurn();
        if (this.roundStatus == 'started' || this.roundStatus == 'resume') timer.resume();
    },

    switchTurn: function() {
        this.turn == 1 ? this.turn = 2 : this.turn = 1;
        if(this.roundStatus != 'ended' && !this['p' + this.turn].isBot){
            this.pushText.alpha = 1 ;
            this.pushText.reset(this.turn == 1 ? textMargin : this.game.world.width-textMargin, this.world.centerY + 40);
        } else {
            this.pushText.alpha = 0;
        }
    },
    playAttackAnimation: function() {
        this.tweenComplete = false;
        if (this.roundStatus != 'resume') {
            this.turn == 1 ? this.p1AttackTween.start() : this.p2AttackTween.start();
        } else {
            this.turn == 1 ? this.p1.frame = 0 : this.p2.frame = 0;
        }
    },
    startGame: function() {
        this.roundStatus = 'started';
        timer.loop(Phaser.Timer.SECOND * 3, this.endTimer, this);
        timer.start();
        if(this.isBot)this.botTick = this.game.time.now;
        this.gameStatus.cur = 'started';
    },

    resumeRound: function() {
        this.roundStatus = 'resume';
        this.playSound('reply');
        timer.resume();
    },

    newRound: function() {
        this.roundStatus = 'started';
        this.pow1 = 0;
        this.pow2 = 0;
        this.round++;
        this.switchTurn();
        this.playSound('reply');
        this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
            timer.resume();
        }, this);
    },

    renderLabels: function() {
        this.p1ScoreLabel.setText(this.p1ScoreLabel._text);
        this.p2ScoreLabel.setText(this.p2ScoreLabel._text);
        this.turnText.alpha = 0;
        this.roundLabel.alpha = 0;
        this.countDownLabel.alpha = 0;
        if (timer.running && !timer.paused) {
            this.countDownLabel.alpha = 1;
            this.countDownLabel.setText(Math.round(timer.duration / 1000));
        } else {
            this.turnText.alpha = 1;
            this.roundLabel.alpha = 1;
            this.turnText.setText(this.turnText._text);
            this.roundLabel.setText(this.roundLabel._text);
        }
    },

    initAnimations: function() {
        this.coinTossTween = this.game.add.tween(this.coin).to({
            y: 70
        }, 500, Phaser.Easing.Quadratic.InOut, false, 0, 0, true);
        this.coinTossTween.onStart.addOnce(function() {
            this.playSound('toss');
        }, this);
        this.coinTossTween.onComplete.addOnce(function(){
            this.cointoss.stop();
            this.turn == 1 ? this.coin.frame = 2 : this.coin.frame = 0;
            this.pushText.alpha = 1;
            this.tweenComplete = true;
        }, this);
        this.pushText.tween = this.game.add.tween(this.pushText).to({fontSize : 60}, 400, Phaser.Easing.Quadratic.In, true);
        this.pushText.tween.loop(true);
        this.p1HitTween = this.game.add.tween(this.p1).to({
            y: this.p1.y - 60
        }, 100, Phaser.Easing.Quadratic.InOut, false, 0, 0, true);
        this.p1HitTween.onStart.add(function() {
            this.p1.frame = 1;
            this.playSound('hurt');
        }, this);
        this.p1AttackTween = this.game.add.tween(this.p1).to({
            x: this.p2.x - this.p2._frame.width / 2
        }, 250, Phaser.Easing.Quadratic.In, false, 0, 0, true);
        this.p1AttackTween.onStart.add(function() {
            this.playSound('reply');
            this.playersSpriteGroup.bringToTop(this.p1);
            this.p1.frame = 2;
        }, this);

        this.p1AttackTween.onRepeat.add(function() {
            this.playSound('punch');
            this.p2HitTween.start();
            this.p1.frame = 0;
        }, this);
        this.p1AttackTween.onComplete.add(function() {
            // this.tweenComplete = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                this.tweenComplete = true;
            }, this);
        }, this);

        this.p2HitTween = this.game.add.tween(this.p2).to({
            y: this.p2.y - 60
        }, 100, Phaser.Easing.Quadratic.InOut, false, 0, 0, true);
        this.p2HitTween.onStart.add(function() {
            this.p2.frame = 1;
            this.playSound('hurt');
        }, this);

        this.p2AttackTween = this.game.add.tween(this.p2).to({
            x: this.p1.x + this.p1._frame.width / 2
        }, 250, Phaser.Easing.Quadratic.In, false, 0, 0, true);

        this.p2AttackTween.onStart.add(function() {
            this.playSound('reply');
            this.playersSpriteGroup.bringToTop(this.p2);
            this.p2.frame = 2;
        }, this);

        this.p2AttackTween.onRepeat.add(function() {
            this.playSound('punch');
            this.p2.frame = 0;
            this.p1HitTween.start();
        }, this);

        this.p2AttackTween.onComplete.add(function() {
            // this.tweenComplete = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                this.tweenComplete = true;
            }, this)
        }, this);

        this.p1DeathTween = this.game.add.tween(this.p1).to({
            x: this.p1.x - 90,
            angle: '-90',
            y: this.p1.y + this.p1._frame.width / 2 + 20
        }, 450, Phaser.Easing.Bounce.Out);
        this.p1DeathTween.onStart.addOnce(function() {
            this.gameStatus.prev = this.gameStatus.cur;
            this.gameStatus.cur = 'pause';
            this.resumeBtn.visible = false;
            this.playSound('hurt');
        }, this);
        this.p1DeathTween.onComplete.addOnce(function() {
            this.p1.frame = 3;
            this.menuModalGroup.visible = true;
            this.world.bringToTop(this.turnText);
            this.inputMenuGroupTween.start();
        }, this);

        this.p2DeathTween = this.game.add.tween(this.p2).to({
            x: this.p2.x + 90,
            angle: '+90',
            y: this.p2.y + this.p2._frame.width / 2 + 20
        }, 450, Phaser.Easing.Bounce.Out);
        this.p2DeathTween.onStart.addOnce(function() {
            this.gameStatus.prev = this.gameStatus.cur;
            this.gameStatus.cur = 'pause';
            this.resumeBtn.visible = false;
            this.playSound('hurt');
        }, this);
        this.p2DeathTween.onComplete.add(function() {
            this.p2.frame = 3;
            this.menuModalGroup.visible = true;
            this.world.bringToTop(this.turnText);
            this.inputMenuGroupTween.start();
        }, this);

        this.inputMenuGroupTween = this.game.add.tween(this.menuModalGroup).to({
            alpha: 1
        }, 300, 'Linear');
        this.inputMenuGroupTween.onStart.add(function() {
            this.pushText.alpha = 0;
            this.playSound('reply');
        }, this);
    },

    initSounds: function(){
        this.puchSounds = [
            this.game.add.audio('punch1'),
            this.game.add.audio('punch3'),
            this.game.add.audio('punch4')
        ];
        this.hurtSounds = [
            this.game.add.audio('hurt1'),
            this.game.add.audio('hurt2'),
            this.game.add.audio('hurt3'),
            this.game.add.audio('hurt4'),
            this.game.add.audio('hurt5')
        ];
        this.replySounds = [
            this.game.add.audio('rep1'),
            this.game.add.audio('rep2'),
            this.game.add.audio('rep3'),
            this.game.add.audio('rep4'),
            this.game.add.audio('rep5')
        ];
        this.heartSound = this.game.add.audio('heartbeat');
        this.tossSound = this.game.add.audio('toss');
        this.heartSound.override = true;
    },
    playSound: function(which) {
        switch (which) {
            case 'punch':
                this.puchSounds[this.game.rnd.integerInRange(0, this.puchSounds.length - 1)].play();
                break;
            case 'hurt':
                this.hurtSounds[this.game.rnd.integerInRange(0, this.hurtSounds.length - 1)].play();
                break;
            case 'heartbeat':
                this.heartSound.play();
                break;
            case 'reply':
                this.replySounds[this.game.rnd.integerInRange(0, this.replySounds.length - 1)].play();
                break;
            case 'toss':
                this.tossSound.play();
                break;
        }
    },

    placePushText: function(){
        if(this.isBot){
            this.pushText.reset(textMargin, this.world.centerY + 40);
        } else {
            this.pushText.reset(this.turn == 1 ? textMargin : this.game.world.width - textMargin, this.world.centerY + 40 );
        }
    }
};
