import { createMapWithAssets } from './createMap.js'
import { handleMovement } from './helpers.js'
import { createChickenAnimations } from './animations.js'

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 1024,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}
const game = new Phaser.Game(config)
// dimensions for game board creation
const DIMENSIONS = 32
const MAX_TUNNELS = 200
const MAX_LENGTH = 5

// number of default eggs and orbs to start with
let maxEggs = 10
let maxOrbs = 3

// map and layer of map
let map
let worldLayer

// default eggs collected and total score
let eggsCollected = 0
let totalScore = 0

// init score text, restart button, chicken
let scoreText
let restartButton
let chicken

// init door and door coords
let door = {}
let doorX
let doorY

// init egg sprite and eggs array
let eggSprite
let eggs = []

// init orb sprite and orbs array
let orbSprite
let orbs = []

// init cursors for movement
let cursors

function preload() {
  this.load.image('tiles', '/assets/tile-block.png')
  this.load.spritesheet('chicken', '/assets/chicken.png', {
    frameWidth: 16,
    frameHeight: 16
  })
  this.load.image('egg', '/assets/egg.png')
  this.load.image('door', '/assets/door.png')
  this.load.image('death-orb', '/assets/death-orb.png')
}

function create() {
  const level = createMapWithAssets(
    DIMENSIONS,
    MAX_TUNNELS,
    MAX_LENGTH,
    maxEggs,
    maxOrbs
  )
  map = this.make.tilemap({
    data: level,
    tileWidth: 32,
    tileHeight: 32
  })
  const tiles = map.addTilesetImage('tiles')
  worldLayer = map.createStaticLayer(0, tiles, 0, 0)
  worldLayer.setCollision([1])

  // spawn chicken
  chicken = this.physics.add.sprite(48, 48, 'chicken')
  chicken.isMovingLeft = false
  chicken.setBounce(0.1)
  chicken.setCollideWorldBounds(true)
  chicken.flightCounters = null
  this.physics.add.collider(chicken, worldLayer)

  // spawn door -- hidden
  map.layers[0].data.forEach(array => {
    array.forEach(tile => {
      if (tile.index === 3) {
        doorX = tile.pixelX
        doorY = tile.pixelY
        door = this.physics.add.sprite(doorX + 16, doorY + 16, 'door')
        door.setTint(0xffffff)
      }
    })
  })
  // make door collide with world
  this.physics.add.collider(door, worldLayer)
  // make door interactable with chicken
  this.physics.add.overlap(chicken, door, exitDungeon, null, this)
  // door hidden by default
  door.disableBody(true, true)

  // spawn eggs
  let eggX
  let eggY
  map.layers[0].data.forEach(array => {
    array.forEach(tile => {
      if (tile.index === 2) {
        eggX = tile.pixelX
        eggY = tile.pixelY
        eggSprite = this.physics.add.sprite(eggX + 16, eggY + 32, 'egg')
        eggSprite.setTint(Math.random() * 0xffffff)
        eggs.push(eggSprite)
      }
    })
  })
  // make eggs collide with world
  this.physics.add.collider(eggs, worldLayer)
  // make eggs collectable when touched
  this.physics.add.overlap(chicken, eggs, collectEgg, null, this)

  // spawn death orb
  var death_orb = this.physics.add.sprite(400, 400, 'death-orb')
  death_orb.setGravity(0, -300)
  death_orb.setVelocity(100, 100)
  death_orb.setDrag(0, 0)
  death_orb.setBounce(1, 1)
  death_orb.setTint(0xff0000)
  death_orb.setAlpha(0.7)
  this.physics.add.collider(death_orb, worldLayer)
  this.physics.add.overlap(chicken, death_orb, hitOrb, null, this)
  console.log(death_orb)

  // spawn ui bar
  const scoreBackground = this.add.graphics()
  scoreBackground.fillStyle(0x6c6159, 1)
  scoreBackground.fillRect(255, 670, 1024, 25)
  scoreBackground.setScrollFactor(0)
  scoreBackground.z = 2
  createChickenAnimations(game)

  // score text
  scoreText = this.add.text(260, 670, `SCORE: ${totalScore}`, {
    font: '40px Space Mono',
    fill: '#fff'
  })
  scoreText.scaleX = 0.5
  scoreText.scaleY = 0.5
  scoreText.fixedToCamera = true
  scoreText.setScrollFactor(0)

  // camera
  const camera = this.cameras.main
  camera.setBounds(0, -50, 1024, 1150)
  camera.setZoom(2)
  camera.startFollow(chicken)

  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  handleMovement(chicken, cursors)
}

function collectEgg(chicken, egg, doorY) {
  egg.disableBody(true, true)
  totalScore += 1
  eggsCollected += 1
  // check if all eggs have been collected
  if (eggsCollected === eggs.length) {
    // spawn door
    door.enableBody(null, doorX, doorY, true, true)
    scoreText.setText('A way forward has appeared, Bawk!')
  } else {
    scoreText.setText('SCORE: ' + totalScore)

    console.log(eggsCollected)
  }
}

function hitOrb(chicken, camera) {
  this.physics.pause()
  console.log(camera)
  console.log(chicken)

  // restart game
  restartButton = this.add.text(512, 500, 'Restart →', {
    font: '40px Space Mono',
    fill: '#f00f00',
    backgroundColor: '#ffffff'
  })
  restartButton.scaleX = 0.5
  restartButton.scaleY = 0.5
  restartButton.setOrigin(0.5, 0.5)
  restartButton.setPadding(20, 20, 20, 20)
  restartButton.fixedToCamera = true
  restartButton.setScrollFactor(0)
  restartButton.setInteractive()

  // restart button action states
  restartButton.on('pointerdown', () => {
    console.log('restarting!')
    // reset all stats
    eggsCollected = 0
    eggs = []
    totalScore = 0
    // reset Scene
    resetScene.apply(this)
  })
  restartButton.on('pointerover', () => {
    restartButton.setScale(0.6, 0.6)
  })
  restartButton.on('pointerout', () => {
    restartButton.setScale(0.5, 0.5)
  })

  chicken.setTint(0xff0000)
  chicken.anims.play('stopped-left')
  scoreText.setText('GAME OVER')
}

function exitDungeon() {
  console.log(eggsCollected)
  eggsCollected = 0
  eggs = []
  // stop all animations and start a new level
  chicken.anims.stop(null, true)
  chicken.anims.pause()
  chicken.disableBody()
  resetScene.apply(this)
}

function resetScene() {
  const cam = this.cameras.main
  cam.fade(250, 0, 0, 0)
  cam.once('camerafadeoutcomplete', () => {
    this.scene.restart()
  })
}
