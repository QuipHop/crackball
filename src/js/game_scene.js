'use strict';

var timer;
var style = { font: "56px comeback", fill: "#FF0044", align: "center" };
var score_style = { font: "56px comeback", fill: "#FFF", align: "center" };
var cd_style = { font: "100px comeback", fill: "#FF0044", align: "center" };

var GameScene = function () {};

GameScene.prototype = {

  init: function(){
    this.pow1 = 0;
    this.pow2 = 0;
    this.gameStarted = false;
    this.round = 1;
    this.roundStatus = '';
    this.tweenComplete = false;
  },

  create: function () {
    this.powKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.powKey.onDown.add(this.getPower, this);

    this.bg = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'bg_main');
    this.bg.anchor.setTo(0.5);

    this.playersSpriteGroup = this.game.add.group();
    this.p1 = this.game.add.sprite(340, 250, 'p1');
    this.p1.anchor.setTo(0.5);
    this.coin = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 90, 'coin');
    this.coin.anchor.setTo(0.5);
    this.coin.scale.setTo(.8);
    this.cointoss =  this.coin.animations.add('toss');
    this.coin.animations.play('toss', 12, true);

    this.p1.scale.setTo(1.2);
    this.p2 = this.game.add.sprite(430, 250, 'p2');
    this.p2.anchor.setTo(0.5);
    this.p2.scale.setTo(1.2);
    this.playersSpriteGroup.addMultiple([this.p1, this.p2]);
    this.turn = this.game.rnd.integerInRange(1, 2);
    this.turnText = this.game.add.text(this.game.world.centerX, 90, " ", style);
    this.turnText.anchor.setTo(0.5);
    this.turnText.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);
    this.turnText.lineSpacing = -10;

    this.countDownLabel = this.game.add.text(this.game.world.centerX, 70, " ", cd_style);
    this.countDownLabel.anchor.setTo(0.5);
    this.countDownLabel.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);


    this.roundLabel = this.game.add.text(this.game.world.width / 2, 20, " ", style);
    this.roundLabel.anchor.setTo(0.5);
    this.roundLabel.fontWeight = 'bold';
    this.roundLabel.setShadow(0, 3, 'rgba(0,0,0,0.9)', 0);

    this.p1ScoreLabel = this.game.add.text(0, 50, "", score_style);
    this.p2ScoreLabel = this.game.add.text(this.game.world.width, 50, "", score_style);
    this.p2ScoreLabel.setShadow(0, 3, '#FF0044', 0);
    this.p1ScoreLabel.setShadow(0, 3, '#FF0044', 0);
    this.p2ScoreLabel.anchor.setTo(1, 0);

    this.menuModalGroup = this.game.add.group();
    var graphics = this.game.add.graphics(0, 0);
    graphics.beginFill("#FFF", 0.5);
    graphics.drawRect(0, 0, this.game.world.width,  this.game.world.height);

    this.inputMenuGroup = this.game.add.group();
    this.repeatBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 60, 'PLAY AGAIN', { font: "60px comeback", fill: "#ff002f", align: "center"});
    this.repeatBtn.action = 'repeat';

    this.exitBtn = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 20, 'Return to Menu', { font: "60px comeback", fill: "#ff002f", align: "center"});
    this.exitBtn.action = 'exit';

    this.inputMenuGroup.addMultiple([this.repeatBtn, this.exitBtn]);
    this.inputMenuGroup.forEach(function(item){
      // item.fontWeight = 'bold';
      item.setShadow(-1, 1, 'rgba(0,0,0,0.9)', 0);
      item.anchor.set(0.5, 0);
    });
    this.inputMenuGroup.setAll('inputEnabled', true);
    this.inputMenuGroup.setAll('input.useHandCursor', true);

    this.inputMenuGroup.callAll('events.onInputDown.add', 'events.onInputDown', function(input){
      switch (input.action) {
        case 'repeat':
          this.game.state.start('play');
          break;
          case 'exit':
            this.game.state.start('menu');
          break;
      }
    }, this);
    this.inputMenuGroup.callAll('events.onInputOver.add', 'events.onInputOver', function(input){
      input.fill = "#FFF";
    }, this);
    this.inputMenuGroup.callAll('events.onInputOut.add', 'events.onInputOut', function(input){
      input.fill = "#ff002f";
    }, this);

    this.menuModalGroup.addMultiple([graphics, this.inputMenuGroup]);
    this.menuModalGroup.visible = false;
    this.menuModalGroup.alpha = 0;

    this.initAnimations();
    this.puchSounds = [
      this.game.add.audio('punch1'),
      this.game.add.audio('punch3'),
      this.game.add.audio('punch4')
    ];
    this.hurtSounds = [
      this.game.add.audio('hurt1'),
      this.game.add.audio('hurt5'),
      this.game.add.audio('hurt3'),
      this.game.add.audio('hurt4')
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

    this.game.world.bringToTop(this.coin);
    this.coinTossTween = this.game.add.tween(this.coin).to({ y: 70}, 500, Phaser.Easing.Quadratic.InOut, false, 0,0, true);
    this.coinTossTween.onStart.add(function(){
      this.playSound('toss');
    }, this);
    this.coinTossTween.onComplete.addOnce(function(){
      this.cointoss.stop();
      this.turn == 1 ? this.coin.frame = 2 : this.coin.frame = 0;
      this.tweenComplete = true;
    }, this);
    this.coinTossTween.start();
    timer = this.game.time.create(false);
  },

  update: function(){
    //START ROUND SPACEBAR HANDLE
    if(!this.gameStarted){
      if(this.tweenComplete){
        this.turnText._text = "PLAYER " + this.turn + " READY \n PUSH SPACEBAR!"
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
          this.coin.destroy();
          this.playSound('reply');
          this.startGame();
        }
      }
    } else {
      this.roundLabel._text = "ROUND " + this.round;
      this.p1ScoreLabel._text - "POWER " + this.pow1;
      this.p2ScoreLabel._text - "POWER " + this.pow2;
      this.turnText._text = "PLAYER " + this.turn + " TURN \n PUSH SPACEBAR!";
      if(this.roundStatus == 'break'){
        this.turnText._text = "PLAYER " + this.turn + " GET UP! \n PUSH SPACEBAR!";
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.tweenComplete){
          this.playSound('reply');
          this.resumeRound();
        }
      }
      //CHECK RESULT OF THE ROUND
      if(this.roundStatus == 'ended'){
          if(this.turn == 1 && this.pow1 > this.pow2){
            this.turnText._text = "PLAYER 1 WIN";
            this.p2DeathTween.start();
          } else if (this.turn == 2 && this.pow1 < this.pow2){
            this.turnText._text = "PLAYER 2 WIN";
            this.p1DeathTween.start();
          } else {
            this.roundLabel._text = "ROUND " + (this.round+1);
            this.p1ScoreLabel.setText('');
            this.p2ScoreLabel.setText('');
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.tweenComplete){
              this.playSound('reply');
              this.newRound();
            }
          }
      }
    }
  },

  render: function () {
    this.renderLabels();
  },

  getPower: function(){
    if(this.gameStarted && this.roundStatus != 'ended'){
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
        default: console.log("WTF Are you doing here?");
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
        case 'ended': break;
      }
      this.switchTurn();
      if(this.roundStatus == 'started' || this.roundStatus == 'resume')timer.resume();
  },

  switchTurn: function(){
    this.turn == 1 ? this.turn = 2 : this.turn = 1;
  },
  playAttackAnimation: function(){
    if(this.roundStatus != 'resume') {
      this.turn == 1 ? this.p1AttackAnim.start() : this.p2AttackAnim.start();
    } else {
      this.turn == 1 ? this.p1.frame = 0 : this.p2.frame = 0;
    }
  },
  startGame: function(){
    this.roundStatus = 'started';
    timer.loop(Phaser.Timer.SECOND * 3, this.endTimer, this);
    timer.start();
    this.gameStarted = true;
  },

  resumeRound: function(){
    this.roundStatus = 'resume';
    timer.resume();
  },

  newRound: function(){
    this.pow1 = 0;
    this.pow2 = 0;
    this.round++;
    this.roundStatus = 'started';
    this.switchTurn();
    timer.resume();
  },

  renderLabels: function(){
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

  initAnimations: function(){
    this.p1AttackAnim = this.game.add.tween(this.p1).to({ x: this.p2.x - 30}, 250, Phaser.Easing.Quadratic.Out, false, 0,0, true);
    this.p1AttackAnim.onStart.add(function(){
      this.playersSpriteGroup.bringToTop(this.p1);
      this.p1.frame = 2;
      this.tweenComplete = false;
    }, this);

    this.p1AttackAnim.onRepeat.add(function(){
      this.playSound('punch');
      this.playSound('hurt');
      this.p1.frame = 0;
      this.p2.frame = 1;
    }, this);
    this.p1AttackAnim.onComplete.add(function(){
      this.tweenComplete = true;
    }, this);

    this.p2AttackAnim = this.game.add.tween(this.p2).to({ x: this.p1.x + 30 }, 250, Phaser.Easing.Quadratic.Out, false, 0,0, true);

    this.p2AttackAnim.onStart.add(function(){
      this.playersSpriteGroup.bringToTop(this.p2);
      this.tweenComplete = false;
      this.p2.frame = 2;
    }, this);

    this.p2AttackAnim.onRepeat.add(function(){
      this.playSound('punch');
      this.playSound('hurt');
      this.p2.frame = 0;
      this.p1.frame = 1;
    }, this);

    this.p2AttackAnim.onComplete.add(function(){
      this.tweenComplete = true;
    }, this);

    this.p1DeathTween = this.game.add.tween(this.p1).to({x: this.p1.x - 90, angle: '-90', y: this.p1.y + this.p1._frame.width / 2}, 450, Phaser.Easing.Bounce.Out);
    this.p1DeathTween.onStart.addOnce(function(){
      this.playSound('hurt');
    }, this);
    this.p1DeathTween.onComplete.addOnce(function(){
      this.p1.frame = 3;
      this.menuModalGroup.visible = true;
      this.inputMenuGroupTween.start();
    }, this);

    this.p2DeathTween = this.game.add.tween(this.p2).to({x: this.p2.x + 90, angle: '+90', y: this.p2.y + this.p2._frame.width / 2}, 450, Phaser.Easing.Bounce.Out);
    this.p2DeathTween.onStart.addOnce(function(){
      this.playSound('hurt');
    }, this);
    this.p2DeathTween.onComplete.add(function(){
      this.p2.frame = 3;
      this.menuModalGroup.visible = true;
      this.inputMenuGroupTween.start();
    },this);

    this.inputMenuGroupTween = this.game.add.tween(this.menuModalGroup).to({alpha: 1}, 300, 'Linear');
    this.inputMenuGroupTween.onStart.addOnce(function(){
      this.playSound('reply');
    }, this);
  },

  playSound: function(which){
    switch (which) {
      case 'punch':
        this.puchSounds[this.game.rnd.integerInRange(0, this.puchSounds.length-1)].play();
        break;
      case 'hurt':
        this.hurtSounds[this.game.rnd.integerInRange(0, this.hurtSounds.length-1)].play();
        break;
      case 'heartbeat':
        this.heartSound.play();
        break;
      case 'reply':
        this.replySounds[this.game.rnd.integerInRange(0, this.replySounds.length-1)].play();
        break;
      case 'toss':
        this.tossSound.play();
        break;
    }
  }
};
