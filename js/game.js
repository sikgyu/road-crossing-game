// create a new scene
let gameScene = new Phaser.Scene('Game');

// all asset will be pre-loaded so that all of the files will be loaded to memory and used without any delay
gameScene.preload = function(){
  // load images  
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
};

//  create the sprites and display them on the screen after the preload ends
gameScene.create = function() {
    // create bg sprite
    let bg = this.add.sprite(0, 0, 'background');

    // place sprite in the center
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    bg.setPosition(gameW/2, gameH/2)



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
