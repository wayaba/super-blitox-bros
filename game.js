import { createAnimations } from './animations.js'
import { checkControls } from './controls.js'

const config = {
  autoFocus: false,
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

// const screenWidth = window.innerWidth
// const screenHeight = window.innerHeight * 1.1
// const worldWidth = screenWidth * 11
// const platformHeight = screenHeight / 5
// var isLevelOverworld

new Phaser.Game(config)

function preload() {
  // isLevelOverworld = Phaser.Math.Between(0, 100) <= 84

  // Load props
  this.load.image('cloud1', 'assets/scenery/overworld/cloud1.png')
  this.load.image('cloud2', 'assets/scenery/overworld/cloud2.png')
  this.load.image('mountain1', 'assets/scenery/overworld/mountain1.png')
  this.load.image('mountain2', 'assets/scenery/overworld/mountain2.png')
  this.load.image('fence', 'assets/scenery/overworld/fence.png')
  this.load.image('bush1', 'assets/scenery/overworld/bush1.png')
  this.load.image('bush2', 'assets/scenery/overworld/bush2.png')
  this.load.image('castle', 'assets/scenery/castle.png')
  this.load.image('flag-mast', 'assets/scenery/flag-mast.png')
  this.load.image('final-flag', 'assets/scenery/final-flag.png')
  this.load.image('sign', 'assets/scenery/sign.png')

  this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png')
  this.load.spritesheet('mario', 'assets/entities/mario.png', {
    frameWidth: 18,
    frameHeight: 16
  })

  this.load.spritesheet('goomba', 'assets/entities/overworld/goomba.png', {
    frameWidth: 16,
    frameHeight: 16
  })

  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

function create() {
  this.add.image(100, 50, 'cloud1').setOrigin(0, 0).setScale(0.15)
  // drawWorld.call(this)
  this.floor = this.physics.add.staticGroup()
  this.floor
    .create(0, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()

  this.floor
    .create(150, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()

  this.mario = this.physics.add
    .sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(500)

  this.enemy = this.physics.add
    .sprite(120, config.height - 30, 'goomba')
    .setOrigin(0, 1)
    .setVelocityX(-50)
    .setGravityY(500)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  this.physics.add.collider(this.enemy, this.floor)
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  this.enemy.anims.play('goomba-walk', true)
  this.keys = this.input.keyboard.createCursorKeys()
}

function onHitEnemy(mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.anims.play('goomba-hurt', true)
    enemy.setVelocityX(0)
    mario.setVelocityY(-200)
    setTimeout(() => {
      enemy.destroy()
    }, 500)
  } else {
  }
}
// function drawWorld() {
//   //Drawing scenery props

//   //> Drawing the Sky
//   this.add
//     .rectangle(
//       screenWidth,
//       0,
//       worldWidth,
//       screenHeight,
//       isLevelOverworld ? 0x8585ff : 0x000000
//     )
//     .setOrigin(0).depth = -1

//   let propsY = screenHeight - platformHeight

//   if (isLevelOverworld) {
//     //> Clouds
//     for (
//       var i = 0;
//       i <
//       Phaser.Math.Between(
//         Math.trunc(worldWidth / 760),
//         Math.trunc(worldWidth / 380)
//       );
//       i++
//     ) {
//       let x = generateRandomCoordinate(false, false)
//       let y = Phaser.Math.Between(screenHeight / 80, screenHeight / 2.2)
//       if (Phaser.Math.Between(0, 10) < 5) {
//         this.add
//           .image(x, y, 'cloud1')
//           .setOrigin(0)
//           .setScale(screenHeight / 1725)
//       } else {
//         this.add
//           .image(x, y, 'cloud2')
//           .setOrigin(0)
//           .setScale(screenHeight / 1725)
//       }
//     }

//     //> Mountains
//     for (
//       var i = 0;
//       i < Phaser.Math.Between(worldWidth / 6400, worldWidth / 3800);
//       i++
//     ) {
//       let x = generateRandomCoordinate()

//       if (Phaser.Math.Between(0, 10) < 5) {
//         this.add
//           .image(x, propsY, 'mountain1')
//           .setOrigin(0, 1)
//           .setScale(screenHeight / 517)
//       } else {
//         this.add
//           .image(x, propsY, 'mountain2')
//           .setOrigin(0, 1)
//           .setScale(screenHeight / 517)
//       }
//     }

//     //> Bushes
//     for (
//       var i = 0;
//       i <
//       Phaser.Math.Between(
//         Math.trunc(worldWidth / 960),
//         Math.trunc(worldWidth / 760)
//       );
//       i++
//     ) {
//       let x = generateRandomCoordinate()

//       if (Phaser.Math.Between(0, 10) < 5) {
//         this.add
//           .image(x, propsY, 'bush1')
//           .setOrigin(0, 1)
//           .setScale(screenHeight / 609)
//       } else {
//         this.add
//           .image(x, propsY, 'bush2')
//           .setOrigin(0, 1)
//           .setScale(screenHeight / 609)
//       }
//     }

//     //> Fences
//     for (
//       var i = 0;
//       i <
//       Phaser.Math.Between(
//         Math.trunc(worldWidth / 4000),
//         Math.trunc(worldWidth / 2000)
//       );
//       i++
//     ) {
//       let x = generateRandomCoordinate()

//       this.add
//         .tileSprite(x, propsY, Phaser.Math.Between(100, 250), 35, 'fence')
//         .setOrigin(0, 1)
//         .setScale(screenHeight / 863)
//     }
//   }
// }

// function generateRandomCoordinate(entitie = false, ground = true) {
//   const startPos = entitie ? screenWidth * 1.5 : screenWidth
//   const endPos = entitie ? worldWidth - screenWidth * 3 : worldWidth

//   let coordinate = Phaser.Math.Between(startPos, endPos)

//   if (!ground) return coordinate

//   for (let hole of worldHolesCoords) {
//     if (
//       coordinate >= hole.start - platformPiecesWidth * 1.5 &&
//       coordinate <= hole.end
//     ) {
//       return generateRandomCoordinate.call(this, entitie, ground)
//     }
//   }

//   return coordinate
// }

function update() {
  checkControls(this)

  const { scene, mario, sound } = this

  if (mario.y >= config.height) {
    mario.isDead = true
    mario.anims.play('mario-dead')
    mario.setCollideWorldBounds(false)
    sound.add('gameover', { volume: 0.2 }).play()

    setTimeout(() => {
      mario.setVelocityY(-350)
    }, 100)
    setTimeout(() => {
      scene.restart()
    }, 2000)
  }
}
