// create a new scene
let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() {
  // player speed
  this.playerSpeed = 1;
  // dragon speed
  this.dragonMinSpeed = 1;
  this.dragonMaxSpeed = 2.5;
  // boundaries
  this.dragonMinY = 80;
  this.dragonMaxY = 280;

  this.isTerminating = false;
};

// all asset will be pre-loaded so that all of the files will be loaded to memory and used without any delay
gameScene.preload = function(){
  // load images  
  this.load.image('background', 'assets/background.png');
  // this.load.image('player', 'assets/player.png');
  this.load.spritesheet('brawler', 'assets/brawler48x48.png', {frameWidth: 48, frameHeight: 48});
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

  this.treasure = this.add.sprite(this.sys.game.config.width - 80, gameH/2, 'treasure').setScale(0.5);

  // Player animations
  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('brawler', { frames: [ 0, 1, 2, 3 ] }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('brawler', { frames: [ 5, 6, 7, 8 ] }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'win',
    frames: this.anims.generateFrameNumbers('brawler', { frames: [ 30, 31 ] }),
    frameRate: 8,
    repeat: -1,
    repeatDelay: 2000
  });

  const keys = [ 'walk', 'idle', 'win' ];

  this.player = this.add.sprite(gameW/10, gameH/2).setScale(1);
  this.player.flipX = true;
  this.player.play('idle');

  // dragon group
  this.dragons = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x: 120,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });
  // setting scale to all group elements
  Phaser.Actions.ScaleXY(this.dragons.getChildren(), -0.5, -0.5)
  Phaser.Actions.Call(this.dragons.getChildren(), function(dragon){
    // flip dragon
    dragon.flipX = true;
    // set dragon speed
    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = this.dragonMinSpeed + Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed)
    dragon.speed = dir * speed;
  }, this)
};

gameScene.update = function () {
  //  don't execute if we are terminating 
  if(this.isTerminating) return;

  // player walks
  if(this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }
  // check treasure overlap
  let playerRect = this.player.getBounds();
  let treasureRect = this.treasure.getBounds();
  
  if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
    this.scene.restart();
  };

  // get dragon
  let dragons = this.dragons.getChildren();
  let numdragons = dragons.length;
  // dragon movement
  for(let i = 0; i< numdragons; i++) {
    dragons[i].y += dragons[i].speed;

    let conditionUp = dragons[i].speed < 0 && dragons[i].y <= this.dragonMinY
    let conditionDown = dragons[i].speed > 0 && dragons[i].y >= this.dragonMaxY

    if(conditionUp || conditionDown) {
      dragons[i].speed *= -1;
    }
    // check dragon overlap
    let dragonRect = dragons[i].getBounds();
  
    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, dragonRect)) {
      console.log('Game over');
      return this.gameOver();
    }
  }
};

gameScene.gameOver = function() {
  //  initiated game over sequence
  this.isTerminating = true;

  // shake camera
  this.cameras.main.shake(300);
  // listen for event completion
  this.cameras.main.on('camerashakecomplete',function(camera, effect) {
    this.cameras.main.fade(300);
  }, this);
  this.cameras.main.on('camerafadeoutcomplete',function(camera, effect) {
    this.scene.restart();
  }, this)
};

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL. If WebGL is not available, It will use canvas
    width: 640,
    height: 360,
    pixelArt: true,
    scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
