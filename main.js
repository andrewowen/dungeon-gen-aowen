import { createMapWithKey } from './createMap.js'
import { handleMovement } from './helpers.js'

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 1024,
  zoom: 2,
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

const DIMENSIONS = 32
const MAX_TUNNELS = 200
const MAX_LENGTH = 5

const game = new Phaser.Game(config)
let chicken
let egg
let cursors

function preload() {
  this.load.image('bg', '/assets/solid-background.png')
  this.load.image('tiles', '/assets/map-assets.png')
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
  console.log(map)
  const tiles = map.addTilesetImage('tiles')
  const worldLayer = map.createStaticLayer(0, tiles, 0, 0)
  worldLayer.setCollision([1])

  // spawn chicken
  chicken = this.physics.add.sprite(48, 48, 'chicken')
  chicken.isMovingLeft = false
  console.log(chicken.isMovingLeft)
  chicken.setBounce(0.1)
  chicken.setCollideWorldBounds(true)
  chicken.flightCounters = null
  this.physics.add.collider(chicken, worldLayer)

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('chicken', {
      start: 13,
      end: 15
    }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('chicken', { start: 5, end: 7 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'stopped-left',
    frames: [{ key: 'chicken', frame: 12 }],
    frameRate: 20
  })

  this.anims.create({
    key: 'stopped-right',
    frames: [{ key: 'chicken', frame: 4 }],
    frameRate: 20
  })

  this.anims.create({
    key: 'in-air-left',
    frames: [{ key: 'chicken', frame: 1 }]
  })

  this.anims.create({
    key: 'in-air-right',
    frames: [{ key: 'chicken', frame: 5 }]
  })

  // find egg coords and spawn eggs
  let eggX
  let eggY
  let eggs = []
  map.layers[0].data.forEach(array => {
    array.forEach(tile => {
      if (tile.index === 2) {
        console.log(level[tile.y + 1][tile.x])
        eggX = tile.pixelX
        eggY = tile.pixelY
        egg = this.physics.add.sprite(eggX + 16, eggY, 'egg')
        eggs.push(egg)
      }
    })
  })

  this.physics.add.collider(eggs, worldLayer)
  this.physics.add.overlap(chicken, eggs, startOver, null, this)

  // camera
  const camera = this.cameras.main
  camera.startFollow(chicken)
  camera.setZoom(1)

  cursors = this.input.keyboard.createCursorKeys()
  console.log(cursors.left)
}

function update() {
  handleMovement(chicken, cursors)
}

function startOver() {
  chicken.anims.stop(null, true)
  chicken.anims.pause()
  chicken.disableBody()
  const cam = this.cameras.main
  cam.fade(250, 0, 0, 0)
  cam.once('camerafadeoutcomplete', () => {
    this.scene.restart()
  })
}
