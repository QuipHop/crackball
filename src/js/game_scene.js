'use strict';

var style = { font: "24px Arial", fill: "#FF0044", align: "center" };

var timer;
var countDown = 5000;
var GameScene = function(){};

GameScene.prototype = {
  init: function(){

    this.pow1 = 0;
    this.pow2 = 0;
    this.powKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.powKey.onDown.add(this.getPower, this);
    // this.powKey.enabled = false;
    this.gameStarted = false;
    this.round = 1;
    this.roundStatus = '';

  },
  create: function () {
    this.p1 = this.game.add.sprite(300, 200, 'p1');
    this.p1.anchor.setTo(0.5);
    this.p1.scale.setTo(3);
    this.p2 = this.game.add.sprite(450, 200, 'p2');
    this.p2.anchor.setTo(0.5);
    this.p2.scale.setTo(3);

    this.turn = this.game.rnd.integerInRange(1, 2);
    this.turnText = this.game.add.text(this.game.world.width / 2, 50, "", style);
    this.turnText.anchor.set(0.5);

    this.p1ScoreLabel = this.game.add.text(0, 50, "", style);
    this.p2ScoreLabel = this.game.add.text(this.game.world.width, 50, "", style);
    this.p2ScoreLabel.anchor.set(1, 0);

    this.animP1Hit = this.game.add.tween(this.p1).to({ x: 200 }, 100, Phaser.Easing.Quadratic.InOut, false);
    // this.game.time.events.add(2000, this.startGame , this);
    timer = this.game.time.create(false);
  },

  update: function(){
    //START ROUND SPACEBAR HANDLE
    this.turnText.setText("PLAYER " + this.turn + " TURN \n PRESS SPACE TO START ");
    if(!this.gameStarted){
      if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.startGame();
      }
    } else {
      this.p1ScoreLabel.setText("SCORE " + this.pow1);
      this.p2ScoreLabel.setText("SCORE " + this.pow2);
      this.turnText.setText("PLAYER " + this.turn + " TURN");
      if(this.roundStatus == 'break'){
        // this.animP1Hit.start();
        this.turnText.setText("PLAYER " + this.turn + " TURN \n PRESS SPACEBAR TO START");
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
          this.resumeRound();
        }
      }
      //CHECK RESULT OF THE ROUND
      if(this.roundStatus == 'ended'){
          if(this.turn == 1 && this.pow1 > this.pow2){
            this.turnText.setText("PLAYER 1 WON");
          } else if (this.turn == 2 && this.pow1 < this.pow2){
            this.turnText.setText("PLAYER 2 WON");
          } else {
            this.turnText.setText("ROUND " + (this.round+1));
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
              this.newRound();
            }
          }
      }
    }
  },

  render: function () {
      if (timer.running) {
          this.game.debug.text(Math.round(timer.duration / 1000)  , 2, 14, "#FF0044");
      } else {
          this.game.debug.text("Done!", 2, 14, "#0f0");
      }
  },

  getPower: function(){
    if(this.gameStarted && this.roundStatus != 'ended'){
      switch (this.turn) {
        case 1:
          this.pow1++;
          this.p1ScoreLabel.setText("SCORE " + this.pow1);
          break;
        case 2:
          this.pow2++;
          this.p2ScoreLabel.setText("SCORE " + this.pow2);
          break;
        default: console.log("WTF Are you doing here?");
      }
    }
  },

  endTimer: function() {
      timer.pause();
      this.switchTurn();
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
      // this.roundStatus == 'started' ? this.roundStatus == 'break' ? this.roundStatus = 'resume' : this.roundStatus = 'ended';
      console.log(this.roundStatus, this.turn);
      if(this.roundStatus == 'started' || this.roundStatus == 'resume')timer.resume();
  },

  switchTurn: function(){
    this.turn == 1 ? this.turn = 2 : this.turn = 1;
  },

  startGame: function(){
    this.roundStatus = 'started';
    timer.loop(countDown, this.endTimer, this);
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
    // this.endTimer();
  }
};
