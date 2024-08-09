import { createAnimations } from './animations.js'
import { initAudio, playAudio } from './audio.js'
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

  // ---- audios -------
  initAudio(this)
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
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this)

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
    playAudio('goomba-stomp', this)
    setTimeout(() => {
      enemy.destroy()
    }, 500)
  } else {
    killMario(this)
  }
}

function update() {
  checkControls(this)

  const { mario } = this

  if (mario.y >= config.height) {
    killMario(this)
  }
}

function killMario(game) {
  const { mario, scene } = game
  if (mario.isDead) return
  mario.isDead = true
  mario.anims.play('mario-dead')
  mario.setCollideWorldBounds(false)

  playAudio('gameover', game, { volume: 0.2 })

  mario.body.checkCollision.none = true
  mario.setVelocityX(0)
  setTimeout(() => {
    mario.setVelocityY(-300)
  }, 100)
  setTimeout(() => {
    scene.restart()
  }, 2000)
}
