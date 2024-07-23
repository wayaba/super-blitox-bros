import { createAnimations } from './animations.js'

const config = {
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

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight * 1.1
const worldWidth = screenWidth * 11
var isLevelOverworld

new Phaser.Game(config)

function preload() {
  isLevelOverworld = Phaser.Math.Between(0, 100) <= 84

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

  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

function create() {
  this.add.image(100, 50, 'cloud1').setOrigin(0, 0).setScale(0.15)

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

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  this.keys = this.input.keyboard.createCursorKeys()
}

function drawWorld() {
  //Drawing scenery props

  //> Drawing the Sky
  this.add
    .rectangle(
      screenWidth,
      0,
      worldWidth,
      screenHeight,
      isLevelOverworld ? 0x8585ff : 0x000000
    )
    .setOrigin(0).depth = -1
}

function update() {
  if (this.mario.isDead) return
  if (this.keys.left.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x -= 2
    this.mario.flipX = true
  } else if (this.keys.right.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x += 2
    this.mario.flipX = false
  } else {
    this.mario.anims.play('mario-idle', true)
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300)
    this.mario.anims.play('mario-jump', true)
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true
    this.mario.anims.play('mario-dead')
    this.mario.setCollideWorldBounds(false)
    this.sound.add('gameover', { volume: 0.2 }).play()

    setTimeout(() => {
      this.mario.setVelocityY(-350)
    }, 100)
    setTimeout(() => {
      this.scene.restart()
    }, 2000)
  }
}
