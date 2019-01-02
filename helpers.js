export const handleMovement = (chicken, cursors) => {
  if (cursors.left.isDown) {
    chicken.isMovingLeft = true
    chicken.body.setVelocityX(-175)
    chicken.anims.play('left', true)
  } else if (cursors.right.isDown) {
    chicken.isMovingLeft = false
    chicken.body.setVelocityX(175)
    chicken.anims.play('right', true)
  } else {
    chicken.body.setVelocityX(0)
    if (chicken.isMovingLeft) {
      chicken.anims.play('stopped-left', true)
    } else {
      chicken.anims.play('stopped-right', true)
    }
  }
  if (
    Phaser.Input.Keyboard.JustDown(cursors.up) &&
    chicken.flightCounters > 1
  ) {
    chicken.flightCounters--
    chicken.body.setVelocityY(-200)
  }
  if (!chicken.body.onFloor()) {
    if (chicken.isMovingLeft) {
      chicken.anims.play('in-air-left')
    } else {
      chicken.anims.play('in-air-right')
    }
  }
  if (chicken.body.onFloor()) {
    chicken.flightCounters = 3
  }
}
