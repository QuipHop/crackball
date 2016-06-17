

var timer;
var countDown = 3000;
var style = { font: "4em comeback", fill: "#FF0044", align: "center" };

var GameScene = function() {};

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
    this.p1 = this.game.add.sprite(300, 250, 'p1');
    this.p1.anchor.setTo(0.5);

    // this.p1.scale.setTo(3);
    this.p2 = this.game.add.sprite(450, 250, 'p2');
    this.p2.anchor.setTo(0.5);
    // this.p2.scale.setTo(3);
    this.turn = this.game.rnd.integerInRange(1, 2);
    this.turnText = this.game.add.text(this.game.world.width / 2, 70, " ", style);
    this.turnText.anchor.set(0.5);

    this.roundLabel = this.game.add.text(this.game.world.width / 2, 20, " ", style);
    this.roundLabel.anchor.set(0.5);

    this.p1ScoreLabel = this.game.add.text(0, 50, " ", style);
    this.p2ScoreLabel = this.game.add.text(this.game.world.width, 50, " ", style);
    this.p2ScoreLabel.anchor.set(1, 0);
    this.initAnimations();

    // this.game.time.events.add(2000, this.startGame , this);
    timer = this.game.time.create(false);

  },

  update: function(){
    //START ROUND SPACEBAR HANDLE
    if(!this.gameStarted){
      this.turnText._text = "PLAYER " + this.turn + " READY \n PRESS SPACE TO START "
      if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.startGame();
      }
    } else {
      this.roundLabel._text = "ROUND " + this.round;
      this.p1ScoreLabel._text - "SCORE " + this.pow1;
      // this.p1ScoreLabel.setText();
      // this.p2ScoreLabel.setText("SCORE " + this.pow2);
      this.p2ScoreLabel._text - "SCORE " + this.pow2;
      this.turnText._text = "PLAYER " + this.turn + " TURN"
      if(this.roundStatus == 'break'){
        // this.p1HitAnim.start();
        // this.turnText.setText();
        this.turnText._text = "PLAYER " + this.turn + " TURN \n PRESS SPACEBAR TO START";
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
          this.resumeRound();
        }
      }
      //CHECK RESULT OF THE ROUND
      if(this.roundStatus == 'ended'){
          if(this.turn == 1 && this.pow1 > this.pow2){
            // this.turnText.setText("PLAYER 1 WON");
            this.turnText._text = "PLAYER 1 WON";
          } else if (this.turn == 2 && this.pow1 < this.pow2){
            // this.turnText.setText("PLAYER 2 WON");
            this.turnText._text = "PLAYER 2 WON";
          } else {
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
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
  },

  renderLabels: function(){
    this.turnText.setText(this.turnText._text);
    this.roundLabel.setText(this.roundLabel._text);
    this.p1ScoreLabel.setText(this.p1ScoreLabel._text);
    this.p2ScoreLabel.setText(this.p2ScoreLabel._text);
    //TODO: replace with simple text
    if (timer.running) {
        this.game.debug.text(Math.round(timer.duration / 1000)  , 2, 14, "#FF0044");
    }
  },

  initAnimations: function(){
    this.p1HitAnim = this.game.add.tween(this.p1).to({ x: 200 }, 500, Phaser.Easing.Bounce.Out, false);
    this.p1HitAnim.onStart.addOnce(function(){

    }, this);
    this.p1HitAnim.onComplete.addOnce(function(){
      this.p1.frame = 1;
    }, this);

    this.p1AttackAnim = this.game.add.tween(this.p1).to({ x: 400 }, 500, Phaser.Easing.Bounce.Out, false, 0,0, true);
    this.p1AttackAnim.onStart.addOnce(function(){
      this.p1.frame = 2;
    }, this);

    this.p1AttackAnim.onComplete.addOnce(function(){
      console.log("COMPLETE");
      this.p1.frame = 0;
      this.p2.frame = 1;
    }, this);

    this.p2AttackAnim = this.game.add.tween(this.p2).to({ x: 300 }, 500, Phaser.Easing.Bounce.Out, false, 0,0, true);
    
    this.p2AttackAnim.onStart.addOnce(function(){
      this.p2.frame = 2;
    }, this);
    
    this.p2AttackAnim.onComplete.addOnce(function(){
      console.log("COMPLETE");
      this.p2.frame = 0;
      this.p1.frame = 1;
    }, this);

  }
};
