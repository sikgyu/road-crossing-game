// create a new scene
let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() {
  // player speed
  this.playerSpeed = 1;
  // dragon speed
  this.dragonMinSpeed = 1;
  this.dragonMaxSpeed = 3;
  // boundaries
  this.dragonMinY = 80;
  this.dragonMaxY = 280;
};

// all asset will be pre-loaded so that all of the files will be loaded to memory and used without any delay
gameScene.preload = function(){
  // load images  
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

//  create the sprites and display them on the screen after the preload ends
gameScene.create = function() {
  // create bg sprite
  let bg = this.add.sprite(0, 0, 'background');

  // place sprite in the center
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  bg.setPosition(gameW/2, gameH/2)

  this.player = this.add.sprite(gameW/10, gameH/2, 'player').setScale(0.5);
  this.dragon = this.add.sprite(250, gameH/2, 'dragon').setScale(0.5);
  this.dragon2 = this.add.sprite(450, gameH/2, 'dragon').setScale(0.5);
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, gameH/2, 'treasure').setScale(0.5);
  // flip
  this.dragon.flipX = true;
  this.dragon2.flipX = true;
  // set dragon speed
  let dir = Math.random() < 0.5 ? 1 : -1;
  let speed = this.dragonMinSpeed + Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed)
  this.dragon.speed = dir * speed;
};

// set 60 fps
gameScene.update = function () {
  // player walks
  if(this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }

  // treasure overlap check
  let playerRect = this.player.getBounds();
  let treasureRect = this.treasure.getBounds();
  
  if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
    this.scene.restart();
  };

  // dragon movement
  this.dragon.y += this.dragon.speed;

  let conditionUp = this.dragon.speed < 0 && this.dragon.y <= this.dragonMinY
  let conditionDown = this.dragon.speed > 0 && this.dragon.y >= this.dragonMaxY

  if(conditionUp || conditionDown) {
    this.dragon.speed *= -1;
  }


}

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL. If WebGL is not available, It will use canvas
    width: 640,
    height: 360,
    scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
