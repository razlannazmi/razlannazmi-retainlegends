const gameState = {};

let globalScore = 0;

class HomeScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScreen' });
  }

  preload() {
    this.load.image('background', 'assets/background/title.png')
    this.load.image('playButton', 'assets/ui/Start1.png')
  }

  create() {
    this.add.image(480, 270, 'background').setOrigin(0.5, 0.5).setScale(0.5);

    //this.add.text(480, 200, 'RETAIN LEGENDS', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    const playButton = this.add.image(480, 300, 'playButton').setInteractive().setScale(1);

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.score = data.score;
  }

  preload() {
    this.load.image('replayButton', 'assets/ui/Restart1.png');
    this.load.image('homeButton', 'assets/ui/MainMenu1.png');
    this.load.audio('gameOver', 'assets/sound/gameOver.mp3');
  }

  create() {
    this.gameOverSound = this.sound.add('gameOver');
    this.gameOverSound.play({
      loop: false,
      volume: 1
    });

    this.add.text(480, 100, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(480, 200, 'Score: ' + globalScore, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    const replayButton = this.add.image(480, 300, 'replayButton').setInteractive();
    replayButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    const homeButton = this.add.image(480, 400, 'homeButton').setInteractive();
    homeButton.on('pointerdown', () => {
      this.scene.start('HomeScreen');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Retain Legends - Assets

    // -- Environment -- //
    this.load.image('background1', 'assets/background/ocean_8.png')
    this.load.image('background2', 'assets/background/ocean_5.png')
    this.load.image('platform', 'assets/map/platform-brick-unit.png')
    this.load.image('dock', 'assets/map/platform-dock.png')
    this.load.image('dock-base', 'assets/map/platform-dock-base.png')
    this.load.image('powerUp', 'assets/powerups/book.png');

    // -- Audio -- //
    this.load.audio('backgroundMusic', 'assets/sound/backgroundMusic.mp3');
    this.load.audio('getPoints', 'assets/sound/getPoints.mp3');
    this.load.audio('arrowShoot', 'assets/sound/arrowShoot.mp3');
    this.load.audio('arrowHit', 'assets/sound/arrowHit.mp3');
    this.load.audio('enemySpawn', 'assets/sound/enemySpawn.mp3');
    this.load.audio('jump', 'assets/sound/jump.mp3');
    this.load.audio('damageTaken', 'assets/sound/damageTaken.mp3');
    this.load.audio('powerups', 'assets/sound/powerups.mp3');

    // -- Character -- //
    this.load.spritesheet('player', 'assets/character/red-hood-sp-2.png', { frameWidth: 71, frameHeight: 48 })
    this.load.spritesheet('enemyFire', 'assets/enemy1/enemyFire.png', { frameWidth: 288, frameHeight: 128 })
    this.load.spritesheet('enemyLeaf', 'assets/enemy2/enemyLeaf.png', { frameWidth: 288, frameHeight: 128 })
    this.load.spritesheet('enemyWind', 'assets/enemy3/enemyWind.png', { frameWidth: 288, frameHeight: 128 })
    this.load.spritesheet('arrow', 'assets/character/projectiles.png', { frameWidth: 256, frameHeight: 128 })




  }

  create() {
    gameState.active = true;
    gameState.cursors = this.input.keyboard.createCursorKeys();

    this.backgroundMusic = this.sound.add('backgroundMusic');
    this.backgroundMusic.play({
      loop: true,
      volume: 1
    });

    this.getPointsSound = this.sound.add('getPoints');
    this.arrowShootSound = this.sound.add('arrowShoot');
    this.arrowHitSound = this.sound.add('arrowHit');
    this.enemySpawnSound = this.sound.add('enemySpawn');
    this.jumpSound = this.sound.add('jump');
    this.damageTakenSound = this.sound.add('damageTaken');
    this.powerupsSound = this.sound.add('powerups');


    // -- Background -- //
    this.bg = this.add.image(0, 0, 'background1').setOrigin(0, 0).setScale(0.5);

    // -- Global data -- //
    this.totalPoints = 0;
    this.health = 5;

    this.timerTreshold = 2;
    this.timerCounter = 2;
    this.shootIsPlaying = false;

    // -- Global enemy properties -- //
    this.numOfEnemyInScene = 0;

    // -- enemyLeaf properties -- //
    this.enemyLeafSpawnPos = [
      { x: 200, y: 10 },
      { x: 200, y: 200 },
      { x: 480, y: 200 },
      { x: 760, y: 10 },
      { x: 760, y: 200 },
    ]

    this.leafInSceneFlag = [
      { atLoc: false },
      { atLoc: false },
      { atLoc: false },
      { atLoc: false },
      { atLoc: false },
    ]

    this.numOfLeafInScene = 0;
    this.maxNumOfLeafInScene = 3;
    this.leafTimerTreshold = 4;
    this.leafTimerCounter = 4;

    // -- enemyFire properties -- //
    this.enemyFireSpawnPos = [
      { x: 100, y: 300 },
      { x: 860, y: 300 },
      { x: 100, y: 10 },
      { x: 860, y: 10 },
    ]

    this.fireInSceneFlag = [
      { atLoc: false },
      { atLoc: false },
      { atLoc: false },
      { atLoc: false },
    ]

    this.numOfFireInScene = 0;
    this.maxNumOfFireInScene = 2;
    this.fireTimerTreshold = 6;
    this.fireTimerCounter = 6;

    // -- enemyWind properties -- //
    this.enemyWindSpawnPos = [
      { x: 480, y: 250 },
      { x: 480, y: 300 },
    ]

    this.windInSceneFlag = [
      { atLoc: false },
      { atLoc: false },
    ]

    this.numOfWindInScene = 0;
    this.maxNumOfWindInScene = 1;
    this.windTimerTreshold = 8;
    this.windTimerCounter = 8;


    // -- -- //
    this.varPlayerGotHitFromRight === false;
    this.varPlayerGotHitFromLeft === false;



    // -- UI -- //
    this.textScore = this.add.text(480, 50, "Score: 0", {
      fontFamily: "Arial",
      fontSize: "25px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5)

    this.textLife = this.add.text(480, 100, "Life: 5", {
      fontFamily: "Arial",
      fontSize: "25px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5)


    // -- Platforms -- //
    const docks = this.physics.add.staticGroup();
    const docksPositions = [
      { x: 50, y: 500 },
      { x: 203, y: 500 },
      { x: 356, y: 500 },
      { x: 509, y: 500 },
      { x: 662, y: 500 },
      { x: 815, y: 500 },
      { x: 968, y: 500 },
      /** 
      { x: 480, y: 442 },
      { x: 480, y: 340 },
      **/

    ];
    // Beza x = 153

    docksPositions.forEach(plat => {
      docks.create(plat.x, plat.y, 'dock').setScale(0.1)
    }
    );

    const dockBases = this.physics.add.staticGroup();
    const xDockBaseDiff = 112;
    const yDockBase = 460;
    const dockBasesPositions = [

      // Base docks
      { x: 0, y: yDockBase },
      { x: 0 + xDockBaseDiff * 1, y: yDockBase },
      { x: 0 + xDockBaseDiff * 2, y: yDockBase },
      { x: 0 + xDockBaseDiff * 3, y: yDockBase },
      { x: 0 + xDockBaseDiff * 4, y: yDockBase },
      { x: 0 + xDockBaseDiff * 5, y: yDockBase },
      { x: 0 + xDockBaseDiff * 6, y: yDockBase },
      { x: 0 + xDockBaseDiff * 7, y: yDockBase },
      { x: 0 + xDockBaseDiff * 8, y: yDockBase },
      { x: 0 + xDockBaseDiff * 9, y: yDockBase },
      { x: 0 + xDockBaseDiff * 10, y: yDockBase },

      // Floating dock
      { x: 420, y: 340 },
      { x: 540, y: 340 },
      { x: 480, y: 220 },
      { x: 180, y: 340 },
      { x: 780, y: 340 },

      { x: 160, y: 140 },
      { x: 240, y: 140 },
      { x: 720, y: 140 },
      { x: 800, y: 140 },

      { x: 0, y: 250 },
      { x: 960, y: 250 },

    ];
    // Beza x = 112

    dockBasesPositions.forEach(plat => {
      dockBases.create(plat.x, plat.y, 'dock-base').setScale(0.15).setOrigin(0.5, 0.5)
    }
    );

    dockBases.children.iterate(function (child) {
      child.body.setSize(child.body.width * 0.15, child.body.height / (20 / 3))
        .setOffset((child.body.width * 0.15 * 18.4) + (child.body.width * 0.15 / 2), child.body.height / (20 / 3) * 19);
    });



    // group for arrow
    this.arrows = this.physics.add.group();
    gameState.enemyLeaf = this.physics.add.group();
    gameState.enemyFire = this.physics.add.group();
    gameState.enemyWind = this.physics.add.group();

    this.projectiles = this.physics.add.group();








    // Character spawn test
    gameState.player = this.physics.add.sprite(480, 100, 'player').setScale(1)
    gameState.player.setSize(gameState.player.width / 4, gameState.player.height / 1.5)
      .setOffset(gameState.player.width / 8 * 3, gameState.player.height / 6);

    gameState.player.playerControl = true;
    gameState.player.isInvisible = false;

    this.powerUp = this.physics.add.sprite(1000, 1000, 'powerUp').setVisible(false).setActive(false).setMaxVelocity(0, 250);

    // Schedule power-up appearance
    this.time.addEvent({
      delay: Phaser.Math.Between(25000, 35000),
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true
    });


    // Player animation -- red hood
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0, end: 0
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', {
        start: 1, end: 24
      }),
      frameRate: 16,
      repeat: 0
    })

    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers('player', {
        start: 25, end: 33
      }),
      frameRate: 16,
      repeat: 0
    })

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', {
        start: 34, end: 50
      }),
      frameRate: 16,
      repeat: -1
    })

    // Enemy fire animation 
    this.anims.create({
      key: 'enemyFireIdle',
      frames: this.anims.generateFrameNumbers('enemyFire', {
        start: 0, end: 7
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'enemyFireRun',
      frames: this.anims.generateFrameNumbers('enemyFire', {
        start: 28, end: 35
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'enemyFireSlash',
      frames: this.anims.generateFrameNumbers('enemyFire', {
        start: 280, end: 297
      }),
      frameRate: 16,
      repeat: -1
    })

    // Enemy leaf animation 
    this.anims.create({
      key: 'enemyLeafIdle',
      frames: this.anims.generateFrameNumbers('enemyLeaf', {
        start: 0, end: 11
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'enemyLeafRun',
      frames: this.anims.generateFrameNumbers('enemyLeaf', {
        start: 22, end: 31
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'enemyLeafShoot',
      frames: this.anims.generateFrameNumbers('enemyLeaf', {
        start: 242, end: 256
      }),
      frameRate: 16,
      repeat: 0
    })

    // Enemy wind animation 
    this.anims.create({
      key: 'enemyWindIdle',
      frames: this.anims.generateFrameNumbers('enemyWind', {
        start: 0, end: 7
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'enemyWindRun',
      frames: this.anims.generateFrameNumbers('enemyWind', {
        start: 30, end: 37
      }),
      frameRate: 16,
      repeat: -1
    })

    this.anims.create({
      key: 'arrowStatic',
      frames: this.anims.generateFrameNumbers('arrow', {
        start: 0, end: 0
      }),
      frameRate: 16,
      repeat: -1
    })

    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(dockBases, [gameState.player, gameState.enemyFire, gameState.enemyLeaf, gameState.enemyWind, this.powerUp]);


    // ----- Collision ----- //

    this.physics.add.overlap(gameState.player, this.powerUp, () => {

      if (gameState.player.isInvisible === false) {

        this.powerUp.setVisible(false);
        this.powerUp.setActive(false);
        this.powerUpActive = true;

        if (this.powerUpTimer) {
          this.powerUpTimer.remove(false);
          this.powerUpTimer = null;
        }

        this.powerUp.setPosition(1000, 1500)

        this.powerupsSound.play({
          loop: false,
          volume: 1
        });

        this.cameras.main.shake(400, 0.02);

        // Shrink all enemy
        gameState.enemyFire.children.each(enemyFireChild => {

          enemyFireChild.setScale(0.5);
          enemyFireChild.isShrink = true;
        })

        gameState.enemyLeaf.children.each(enemyLeafChild => {

          enemyLeafChild.setScale(0.5);
          enemyLeafChild.isShrink = true
          enemyLeafChild.cooldownTimer.paused = true;
        })

        gameState.enemyWind.children.each(enemyWindChild => {

          enemyWindChild.setScale(0.5);
          enemyWindChild.isShrink = true;
          enemyWindChild.setVelocityX(0).setVelocityY(0)
          enemyWindChild.anims.play("enemyWindIdle")
        })

        this.time.delayedCall(10000, () => {
          this.powerUpActive = false;
        }, [], this);
      }
    }, null, this);

    gameState.enemyFire.children.each(enemyFireChild => {

      // Tweening
      gameState.enemyFire.move = this.tweens.add({
        targets: enemyFireChild,
        x: 480,
        ease: 'Linear',
        duration: 1800,
        repeat: -1,
        yoyo: true,
        flipX: true
      })
    })

    this.invisibleTimer = 2;
    this.invisibleTimerCounter = this.invisibleTimer;

  } // create()

  update(time, delta) {

    if (gameState.active) {

      this.textScore.setText("Score : " + this.totalPoints)
      this.textLife.setText("Life : " + this.health)

      if (this.totalPoints % 10 < 5) {
        this.bg.setTexture('background1')
      }
      else {
        this.bg.setTexture('background2')
      }

      if (this.totalPoints > 10) {
        this.leafTimerTreshold = 3
        this.maxNumOfLeafInScene = 5;
      }

      this.enemyLeafBehavior()
      this.leafProjectileBehavior()
      this.enemyFireBehavior()
      this.enemyWindBehavior()

      // -- Damage taken calculation -- //
      if (this.invisibleTimerCounter < 0) {
        gameState.player.isInvisible === false
        gameState.player.setPosition(480, 100)
        if (this.health == 0) {
          globalScore = this.totalPoints
          this.backgroundMusic.pause()
          this.scene.start('EndScene')
        }
      }

      if (gameState.player.isInvisible === false) {
        gameState.player.setTint(0xffffff);
        this.invisibleTimerCounter = this.invisibleTimer;

      }
      else if (gameState.player.isInvisible === true) {
        gameState.player.setTint(0xff0000);

        if (this.varPlayerGotHitFromRight == true) {
          this.playerGotHit(0, delta)
          this.varPlayerGotHitFromLeft = false
        }
        else if (this.varPlayerGotHitFromLeft == true) {
          this.playerGotHit(1, delta)
          this.varPlayerGotHitFromRight = false
        }
        else {
          this.invisibleTimerCounter = this.invisibleTimer;
          this.varPlayerGotHitFromLeft = false
          this.varPlayerGotHitFromRight = false
          gameState.player.destroy()
          this.createPlayer()
        }
      }


      // arrows child hit enemy, arrow destroyed
      this.arrows.children.each(arrowChild => {
        if (this.physics.overlap(arrowChild, [gameState.enemyLeaf, gameState.enemyFire, gameState.enemyWind])) {
          arrowChild.destroy(false)
        }
      })

      // -- Character controls
      if (gameState.player.playerControl === true) {

        // Character jump
        if ((gameState.cursors.up.isDown) && gameState.player.body.touching.down) {
          gameState.player.setVelocityY(-750);
          gameState.player.anims.play('jump', true);

          this.jumpSound.play({
            loop: false,
            volume: 0.5
          });
        }

        // Character move right
        else if (gameState.cursors.right.isDown) {
          gameState.player.setVelocityX(250);
          gameState.player.anims.play('run', true);
          gameState.player.flipX = true;
        }

        // Character move left
        else if (gameState.cursors.left.isDown) {
          gameState.player.setVelocityX(-250);
          gameState.player.anims.play('run', true);
          gameState.player.flipX = false;
        }

        // Maintain jump animation while in the air
        else if (!gameState.player.body.touching.down) {
          gameState.player.anims.play('jump', true);
        }

        // Character shoot
        else if (gameState.player.anims.getCurrentKey() === 'shoot') {
          // Do nothing
        }

        // Character idle
        else {
          gameState.player.setVelocityX(0);
          gameState.player.anims.play('idle', true);
        }

        // Shoot mechanism
        if (this.timerCounter >= this.timerTreshold) {

          // If SPACE key is pressed
          if (gameState.cursors.space.isDown) {

            // Create arrow
            const varArrow = this.arrows.create(gameState.player.x, gameState.player.y, 'arrow').setScale(1.5).setOrigin(0.5, 0.5);

            // arrow adjustment
            varArrow.setSize(varArrow.width / 9, varArrow.height / 14)
              .setOffset(varArrow.width / 9 * 4, varArrow.height / 2.15)
            varArrow.body.setAllowGravity(false);

            // Play character's shooting animation
            gameState.player.anims.play('shoot', true);

            this.arrowShootSound.play({
              loop: false,
              volume: 2
            });

            // Flip arrow based on character direction
            if (gameState.player.flipX == true) {
              varArrow.setVelocityX(400)
            }
            else if (gameState.player.flipX == false) {
              varArrow.flipX = true
              varArrow.setVelocityX(-400)
            }

            // Reset cooldown timer
            this.timerCounter = 0;
          }
        }

        // Shooting timer counting
        if (this.timerCounter < this.timerTreshold) {
          let deltaTimeInSecondsLeaf = delta / 1000
          this.timerCounter += deltaTimeInSecondsLeaf
        }
      }

      // enemyLeaf spawning setting
      if (this.numOfLeafInScene < this.maxNumOfLeafInScene) {
        this.enemyLeafSpawnFn(delta)
      }

      if (this.numOfFireInScene < this.maxNumOfFireInScene) {
        this.enemyFireSpawnFn(delta)

      }

      if (this.numOfWindInScene < this.maxNumOfWindInScene) {
        this.enemyWindSpawnFn(delta)
      }
    }
  }

  enemyFireBehavior() {
    gameState.enemyFire.children.each(enemyFireChild => {

      if (this.physics.overlap(this.arrows, enemyFireChild)) {
        enemyFireChild.setScale(0.5);
        enemyFireChild.isShrink = true;

        this.arrowHitSound.play({
          loop: false,
          volume: 1
        });
      }

      let initialFlipX = enemyFireChild.move.flipX

      if (Math.abs(gameState.player.x - enemyFireChild.x) < 120
        && Math.abs(gameState.player.y - enemyFireChild.body.y) < 50
        && enemyFireChild.isShrink === false
        && gameState.player.isInvisible === false) {

        //initialFlipX = enemyFireChild.flipX

        if (gameState.player.x > enemyFireChild.x) {
          enemyFireChild.flipX = false
        }
        else if (gameState.player.x < enemyFireChild.x) {
          enemyFireChild.flipX = true
        }

        // Pause the tween
        enemyFireChild.move.pause();

        // Play the attack animation
        if (!enemyFireChild.anims.isPlaying || enemyFireChild.anims.currentAnim.key !== 'enemyFireSlash') {
          enemyFireChild.anims.play('enemyFireSlash');
        }

        // Enlarge the collision box at a specific frame
        enemyFireChild.on('animationupdate-enemyFireSlash', function (animation, frame, gameObject) {

          // Check if the specific frame has been reached
          if (frame.index > 13) {

            // Enlarge the collision box
            let newWidth = enemyFireChild.width * 0.6;
            enemyFireChild.setSize(newWidth, enemyFireChild.height / 3);
            enemyFireChild.setOffset((enemyFireChild.width - newWidth) / 2, enemyFireChild.height / 1.5);
          }
          else {
            enemyFireChild.setSize(enemyFireChild.width / 9, enemyFireChild.height / 3)
              .setOffset(enemyFireChild.width / 9 * 4, enemyFireChild.height / 1.5)
          }
        });

        // Listen for the attack animation complete event to resume idle animation and tween
        enemyFireChild.on('animationcomplete', function (animation, frame) {
          if (animation.key === 'enemyFireSlash') {

            // Play idle animation
            enemyFireChild.play('enemyFireRun');
            enemyFireChild.flipX = initialFlipX;

            // Reset collision box size
            enemyFireChild.setSize(enemyFireChild.width / 9, enemyFireChild.height / 3)
              .setOffset(enemyFireChild.width / 9 * 4, enemyFireChild.height / 1.5)

            // Resume the tween
            enemyFireChild.move.resume();
          }
        }, this);
      }

      else {
        if (enemyFireChild.move.isPaused()) {
          enemyFireChild.move.resume();
          enemyFireChild.play('enemyFireRun');
        }

        if (enemyFireChild.flipX != initialFlipX && enemyFireChild.anims.currentAnim.key !== 'enemyFireRun') {
          enemyFireChild.flipX = initialFlipX;
        }

      }

      if (this.physics.overlap(gameState.player, enemyFireChild)) {

        if (gameState.player.isInvisible === false) {
          if (enemyFireChild.isShrink === true) {

            // Play sound
            this.getPointsSound.play({
              loop: false,
              volume: 1
            });

            // Add points
            this.totalPoints += 1

            // Update scene data
            this.numOfFireInScene -= 1
            this.numOfEnemyInScene -= 1
            this.fireInSceneFlag[enemyFireChild.spawnLocIndex]["atLoc"] = false;

            // Destroy enemy
            enemyFireChild.destroy(false)
          }

          else if (enemyFireChild.isShrink === false) {

            // enemy is at the right
            if (enemyFireChild.x >= gameState.player.x) {
              this.varPlayerGotHitFromRight = false
              this.varPlayerGotHitFromLeft = true
            }

            // enemy is at the left
            else if (enemyFireChild.x < gameState.player.x) {
              this.varPlayerGotHitFromLeft = false
              this.varPlayerGotHitFromRight = true
            }

            gameState.player.isInvisible = true
            this.playerDamageTakenFn()
          }
        }
      }
    })
  }

  enemyLeafBehavior() {

    gameState.enemyLeaf.children.each(enemyChild => {

      // enemyLeaf child overlap with arrow
      // Arrow hit big enemyLeaf child, enemyLeaf child shrink
      if (this.physics.overlap(this.arrows, enemyChild)) {
        enemyChild.setScale(0.5);
        enemyChild.isShrink = true
        enemyChild.cooldownTimer.paused = true;

        this.arrowHitSound.play({
          loop: false,
          volume: 1
        });
      }

      // Rotate enemy to face player
      if (gameState.player.x < enemyChild.x) {
        enemyChild.flipX = true;
      }
      else {
        enemyChild.flipX = false;
      }

      if (this.physics.overlap(gameState.player, enemyChild)) {

        if (gameState.player.isInvisible === false) {
          if (enemyChild.isShrink === true) {

            // Play sound
            this.getPointsSound.play({
              loop: false,
              volume: 1
            });

            // Add points
            this.totalPoints += 1

            // Update scene data
            this.numOfLeafInScene -= 1
            this.numOfEnemyInScene -= 1
            this.leafInSceneFlag[enemyChild.spawnLocIndex]["atLoc"] = false;

            // Destroy enemy
            enemyChild.destroy(false)
            enemyChild.cooldownTimer.paused = true;

          }

          else if (enemyChild.isShrink === false) {

            // enemy is at the right
            if (enemyChild.x >= gameState.player.x) {
              this.varPlayerGotHitFromRight = false
              this.varPlayerGotHitFromLeft = true
            }

            // enemy is at the left
            else if (enemyChild.x < gameState.player.x) {
              this.varPlayerGotHitFromLeft = false
              this.varPlayerGotHitFromRight = true
            }

            gameState.player.isInvisible = true
            this.playerDamageTakenFn()
          }
        }
      }
    })
  }

  leafShootProjectile(enemy) {

    // Play the shoot animation
    if (!enemy.anims.isPlaying || enemy.anims.currentAnim.key !== 'enemyLeafShoot') {
      enemy.anims.play('enemyLeafShoot');
    }

    enemy.on('animationupdate-enemyLeafShoot', function (animation, frame, gameObject) {

      // Check if the specific frame has been reached
      if (frame.index === 13) { 
      }

    });

    enemy.on('animationcomplete', function (animation, frame) {
      if (animation.key === 'enemyLeafShoot') {

        // Play idle animation
        enemy.play('enemyLeafIdle');
      }
    }, this);

    // Create a new projectile
    const projectile = this.projectiles.create(enemy.x, enemy.y + 50, 'arrow');
    projectile.body.allowGravity = false;
    projectile.setTint("0x00ff00")
    projectile.setSize(projectile.width / 9, projectile.height / 14)
      .setOffset(projectile.width / 9 * 4, projectile.height / 2.15)
      .setScale(1.5)

    // Set the projectile's velocity towards the player
    this.physics.moveToObject(projectile, gameState.player, 200);

    // Set the projectile's angle towards the player
    let angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, gameState.player.x, gameState.player.y);
    projectile.setRotation(angle);

  }

  leafProjectileBehavior() {
    this.projectiles.children.each(projectileChild => {

      projectileChild.body.allowGravity = false;

      // enemyLeaf child overlap with arrow
      // Arrow hit big enemyLeaf child, enemyLeaf child shrink
      if (this.physics.overlap(this.arrows, projectileChild)) {
        projectileChild.setScale(0.5);
      }

      // Rotate enemy to face player
      if (gameState.player.x < projectileChild.x) {
        projectileChild.flipX = true;
      }
      else {
        projectileChild.flipX = false;
      }

      if (this.physics.overlap(gameState.player, projectileChild)) {

        if (gameState.player.isInvisible === false) {

          // enemy is at the right
          if (projectileChild.x >= gameState.player.x) {
            this.varPlayerGotHitFromRight = false
            this.varPlayerGotHitFromLeft = true
          }

          // enemy is at the left
          else if (projectileChild.x < gameState.player.x) {
            this.varPlayerGotHitFromLeft = false
            this.varPlayerGotHitFromRight = true
          }

          gameState.player.isInvisible = true
          this.playerDamageTakenFn()
          projectileChild.destroy(false)

        }
      }
    })
  }



  enemyFireSpawnFn(delta) {
    if (this.fireTimerCounter > this.fireTimerTreshold) {

      this.tempArrFire = []
      this.fireInSceneFlag.forEach((arrChild, index = 0) => {
        if (arrChild["atLoc"] === false) {
          this.tempArrFire.push(index)
        }
        index += 1
      })

      let randomIndexFire = Phaser.Math.Between(0, this.tempArrFire.length - 1);
      let randomLocSelected = this.tempArrFire[randomIndexFire];

      const varFire = gameState.enemyFire
        .create(this.enemyFireSpawnPos[randomLocSelected].x, this.enemyFireSpawnPos[randomLocSelected].y, 'enemyFire')
        .setScale(1.5).setOrigin(0.5, 0.5);

      varFire.setSize(varFire.width / 9, varFire.height / 3)
        .setOffset(varFire.width / 9 * 4, varFire.height / 1.5)

      // Play sound
      this.enemySpawnSound.play({
        loop: false,
        volume: 1
      });

      if (randomLocSelected === 1) {
        varFire.flipX = true
      }

      // Additional properties
      varFire.isShrink = false;
      varFire.spawnLocIndex = randomIndexFire;
      varFire.playerAhead = false;

      // Play animation
      varFire.anims.play("enemyFireRun");

      // Add tweens to enemy
      varFire.move = this.tweens.add({
        targets: varFire,
        x: 480,
        ease: 'Linear',
        duration: 2400,
        repeat: -1,
        yoyo: true,
        flipX: true
      })

      this.numOfFireInScene += 1;
      this.fireInSceneFlag[randomIndexFire]["atLoc"] = true;
      this.fireTimerCounter = 0;
      this.numOfEnemyInScene += 1;
    }

    else {
      let deltaTimeInSecondsFire = delta / 1000
      this.fireTimerCounter += deltaTimeInSecondsFire
    }
  }

  enemyLeafSpawnFn(delta) {
    if (this.leafTimerCounter > this.leafTimerTreshold) {

      this.tempArrLeaf = []
      this.leafInSceneFlag.forEach((arrChild, index = 0) => {
        if (arrChild["atLoc"] === false) {
          this.tempArrLeaf.push(index)
        }
        index += 1
      })

      let randomIndexLeaf = Phaser.Math.Between(0, this.tempArrLeaf.length - 1);
      let randomLocSelected = this.tempArrLeaf[randomIndexLeaf];

      const varLeaf = gameState.enemyLeaf
        .create(this.enemyLeafSpawnPos[randomLocSelected].x, this.enemyLeafSpawnPos[randomLocSelected].y, 'enemyLeaf')
        .setScale(1.5).setOrigin(0.5, 0.5);

      varLeaf.setSize(varLeaf.width / 9, varLeaf.height / 3)
        .setOffset(varLeaf.width / 9 * 4, varLeaf.height / 1.5)

      // enemyLeaf projectiles
      varLeaf.cooldownTimer = this.time.addEvent({
        delay: Phaser.Math.Between(3000, 7000),
        callback: () => this.leafShootProjectile(varLeaf),
        callbackScope: this,
        loop: true,
      });

      // Additional properties
      varLeaf.isShrink = false;
      varLeaf.spawnLocIndex = randomIndexLeaf;
      varLeaf.playerAhead = false;

      varLeaf.anims.play("enemyLeafIdle");

      // Play sound
      this.enemySpawnSound.play({
        loop: false,
        volume: 1
      });


      this.numOfLeafInScene += 1;
      this.leafInSceneFlag[randomIndexLeaf]["atLoc"] = true;
      this.leafTimerCounter = 0;
      this.numOfEnemyInScene += 1;
    }

    else {
      let deltaTimeInSecondsLeaf = delta / 1000
      this.leafTimerCounter += deltaTimeInSecondsLeaf
    }
  }

  enemyWindSpawnFn(delta) {
    if (this.windTimerCounter > this.windTimerTreshold) {

      this.tempArrWind = []
      this.windInSceneFlag.forEach((arrChild, index) => {
        if (arrChild["atLoc"] === false) {
          this.tempArrWind.push(index)
        }
      })

      let randomIndexWind = Phaser.Math.Between(0, this.tempArrWind.length - 1);


      let randomLocSelected = this.tempArrWind[randomIndexWind];

      const varWind = gameState.enemyWind
        .create(this.enemyWindSpawnPos[randomLocSelected].x, this.enemyWindSpawnPos[randomLocSelected].y, 'enemyWind')
        .setScale(1.5).setOrigin(0.5, 0.5);

      varWind.setSize(varWind.width / 9, varWind.height / 3)
        .setOffset(varWind.width / 9 * 4, varWind.height / 1.5)

      // Play sound
      this.enemySpawnSound.play({
        loop: false,
        volume: 1
      });

      if (randomLocSelected === 1) {
        varWind.flipX = true
      }

      // Additional properties
      varWind.isShrink = false;
      varWind.spawnLocIndex = randomIndexWind;
      varWind.playerAhead = false;

      // Play animation
      varWind.anims.play("enemyWindRun");

      this.numOfWindInScene += 1;
      this.windInSceneFlag[randomIndexWind]["atLoc"] = true;
      this.windTimerCounter = 0;
      this.numOfEnemyInScene += 1;
    }

    else {
      let deltaTimeInSecondsWind = delta / 1000
      this.windTimerCounter += deltaTimeInSecondsWind
    }

  }

  enemyWindBehavior() {
    gameState.enemyWind.children.each(enemyWindChild => {

      if (enemyWindChild.isShrink === false) {
        this.physics.moveToObject(enemyWindChild, gameState.player, 100);
      }

      if (this.physics.overlap(this.arrows, enemyWindChild)) {
        enemyWindChild.setScale(0.5);
        enemyWindChild.isShrink = true;
        enemyWindChild.setVelocityX(0).setVelocityY(0)
        enemyWindChild.anims.play("enemyWindIdle")

        this.arrowHitSound.play({
          loop: false,
          volume: 1
        });
      }

      // Rotate enemy to face player
      if (gameState.player.x < enemyWindChild.x) {
        enemyWindChild.flipX = true;
      }
      else {
        enemyWindChild.flipX = false;
      }

      if (this.physics.overlap(gameState.player, enemyWindChild)) {

        if (gameState.player.isInvisible === false) {
          if (enemyWindChild.isShrink === true) {

            // Play sound
            this.getPointsSound.play({
              loop: false,
              volume: 1
            });

            // Add points
            this.totalPoints += 1

            // Update scene data
            this.numOfWindInScene -= 1
            this.numOfEnemyInScene -= 1
            this.windInSceneFlag[enemyWindChild.spawnLocIndex]["atLoc"] = false;

            // Destroy enemy
            enemyWindChild.destroy(false)
          }

          else if (enemyWindChild.isShrink === false) {

            // enemy is at the right
            if (enemyWindChild.x >= gameState.player.x) {
              this.varPlayerGotHitFromRight = false
              this.varPlayerGotHitFromLeft = true
            }

            // enemy is at the left
            else if (enemyWindChild.x < gameState.player.x) {
              this.varPlayerGotHitFromLeft = false
              this.varPlayerGotHitFromRight = true
            }

            gameState.player.isInvisible = true
            this.playerDamageTakenFn()
          }
        }
      }
    })
  }

  playerGotHit(leftOrRight, delta) {

    if (this.invisibleTimerCounter > 0) {

      gameState.player.playerControl = false
      gameState.player.isInvisible = true

      gameState.player.anims.play("idle")

      // enemy is at the right
      if (leftOrRight === 0) {
        gameState.player.setVelocityX(100)
      }

      // enemy is at the left
      else if (leftOrRight === 1) {
        gameState.player.setVelocityX(-100)
      }

      this.deltaTimeInSeconds = delta / 1000
      this.invisibleTimerCounter -= this.deltaTimeInSeconds
    }

    else {
      gameState.player.playerControl = true;
      gameState.player.isInvisible = false;
      this.varPlayerGotHitFromRight = false;
      this.varPlayerGotHitFromRight = false;
    }


  }

  playerDamageTakenFn() {
    // Play sound
    this.damageTakenSound.play({
      loop: false,
      volume: 3
    });
    this.health -= 1
  }

  createPlayer() {
    gameState.player = this.physics.add.sprite(480, 100, 'player').setScale(1)
    gameState.player.setSize(gameState.player.width / 4, gameState.player.height / 1.5)
      .setOffset(gameState.player.width / 8 * 3, gameState.player.height / 6);
  }

  spawnPowerUp() {
    const random = Phaser.Math.Between(0, 3);
    let x = 480;

    if (random === 0) {
      x = 630;
    }
    else if (random === 1) {
      x = 330;
    }
    else if (random === 2) {
      x = 80;
    }
    else if (random === 3) {
      x = 880;
    }
    const y = 10;

    this.powerUp.setPosition(x, y);
    this.powerUp.setVisible(true);
    this.powerUp.setActive(true);

    // Set a timer to make the power-up disappear after seconds if not collected
    this.powerUpTimer = this.time.delayedCall(10000, this.removePowerUp, [], this);
  }

  removePowerUp() {
    this.powerUp.setVisible(false);
    this.powerUp.setActive(false);
    this.powerUp.setPosition(1000, 1000)
  }
}

// ---- config ---- //

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'gameCanvas',
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2000 },
      enableBody: true,
      debug: false
    }
  },
  scene: [HomeScreen, GameScene, EndScene]
};

const game = new Phaser.Game(config);
