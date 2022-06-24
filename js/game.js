// create a new scene
let gameScene = new Phaser.Scene('Game');

// all asset will be pre-loaded so that all of the files will be loaded to memory and used without any delay
gameScene.preload = function(){
  // load images  
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
};

//  create the sprites and display them on the screen after the preload ends
gameScene.create = function() {
  // create bg sprite
  let bg = this.add.sprite(0, 0, 'background');

  // place sprite in the center
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  bg.setPosition(gameW/2, gameH/2)

  let player = this.add.sprite(gameW/10, gameH/2, 'player');
  // player.depth = 1;
  player.setScale(0.5); // reducting the width and height by 50%

  // create an enemy
  let dragon = this.add.sprite(250, 180, 'dragon');
  let dragon2 = this.add.sprite(450, 180, 'dragon');
  
  // flip and scale
  dragon.flipX = true;
  dragon2.flipX = true;
  dragon.setScale(0.5);
  dragon2.setScale(0.5);
  
};

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL. If WebGL is not available, It will use canvas
    width: 640,
    height: 360,
    scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
