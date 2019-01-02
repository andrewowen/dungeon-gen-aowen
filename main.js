import { createMapWithKey } from './createMap.js'
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
  },
  resolution: window.devicePixelRatio
}
const DIMENSIONS = 32
const MAX_TUNNELS = 200
const MAX_LENGTH = 5

let eggsCollected = 0
let totalScore = 0
const game = new Phaser.Game(config)
let scoreText
let chicken
let eggs = []
let eggSprite
let cursors

function preload() {
  this.load.image('tiles', '/assets/tile-block.png')
  this.load.spritesheet('chicken', '/assets/chicken.png', {
    frameWidth: 16,
    frameHeight: 16
  })
  this.load.image('egg', '/assets/egg.png')
}

function create() {
  const level = createMapWithKey(DIMENSIONS, MAX_TUNNELS, MAX_LENGTH)
  const map = this.make.tilemap({
    data: level,
    tileWidth: 32,
    tileHeight: 32
  })
  const tiles = map.addTilesetImage('tiles')
  const worldLayer = map.createStaticLayer(0, tiles, 0, 0)
  worldLayer.setCollision([1])

  // spawn chicken
  chicken = this.physics.add.sprite(48, 48, 'chicken')
  chicken.isMovingLeft = false
  chicken.setBounce(0.1)
  chicken.setCollideWorldBounds(true)
  chicken.flightCounters = null
  this.physics.add.collider(chicken, worldLayer)

  let eggX
  let eggY
  map.layers[0].data.forEach(array => {
    array.forEach(tile => {
      if (tile.index === 2) {
        eggX = tile.pixelX
        eggY = tile.pixelY
        eggSprite = this.physics.add.sprite(eggX + 16, eggY, 'egg')
        eggs.push(eggSprite)
      }
    })
  })
  const scoreBackground = this.add.graphics()
  scoreBackground.fillStyle(0x6c6159, 1)
  scoreBackground.fillRect(256, 256, 1024, 20)
  scoreBackground.setScrollFactor(0)
  createChickenAnimations(game)

  // score text
  scoreText = this.add.text(260, 256, `SCORE: ${totalScore}`, {
    font: '40px Ariel',
    fill: '#fff'
  })
  scoreText.scaleX = 0.5
  scoreText.scaleY = 0.5
  scoreText.fixedToCamera = true
  scoreText.setScrollFactor(0)

  // find egg coords and spawn eggs
  console.log(eggs.length)

  this.physics.add.collider(eggs, worldLayer)
  this.physics.add.overlap(chicken, eggs, collectEgg, null, this)

  // camera
  const camera = this.cameras.main
  camera.setBounds(0, -50, 1100, 1100)
  camera.setZoom(2)
  camera.startFollow(chicken)

  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  handleMovement(chicken, cursors)
}

function collectEgg(chicken, egg) {
  egg.disableBody(true, true)
  totalScore += 1
  eggsCollected += 1
  if (eggsCollected === eggs.length) {
    console.log(eggsCollected)
    eggsCollected = 0
    eggs = []
    scoreText.setText('You did it!')

    // stop all animations and start a new level
    chicken.anims.stop(null, true)
    chicken.anims.pause()
    chicken.disableBody()
    const cam = this.cameras.main
    cam.fade(250, 0, 0, 0)
    cam.once('camerafadeoutcomplete', () => {
      this.scene.restart()
    })
  } else {
    scoreText.setText('SCORE: ' + totalScore)

    console.log(eggsCollected)
  }
}
