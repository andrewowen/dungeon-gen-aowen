export const createChickenAnimations = game => {
  game.anims.create({
    key: 'left',
    frames: game.anims.generateFrameNumbers('chicken', {
      start: 13,
      end: 15
    }),
    frameRate: 10,
    repeat: -1
  })

  game.anims.create({
    key: 'right',
    frames: game.anims.generateFrameNumbers('chicken', { start: 5, end: 7 }),
    frameRate: 10,
    repeat: -1
  })

  game.anims.create({
    key: 'stopped-left',
    frames: [{ key: 'chicken', frame: 12 }],
    frameRate: 20
  })

  game.anims.create({
    key: 'stopped-right',
    frames: [{ key: 'chicken', frame: 4 }],
    frameRate: 20
  })

  game.anims.create({
    key: 'in-air-left',
    frames: [{ key: 'chicken', frame: 1 }]
  })

  game.anims.create({
    key: 'in-air-right',
    frames: [{ key: 'chicken', frame: 5 }]
  })
}
