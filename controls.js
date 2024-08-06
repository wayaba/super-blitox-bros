export function checkControls({ mario, keys }) {
  if (mario.isDead) return

  const isMarioTouchingFloor = mario.body.touching.down
  const idKeyLeftDown = keys.left.isDown
  const idKeyRightDown = keys.right.isDown
  const idKeyUpDown = keys.up.isDown

  if (idKeyLeftDown) {
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.x -= 2
    mario.flipX = true
  } else if (idKeyRightDown) {
    isMarioTouchingFloor && mario.anims.play('mario-walk', true)
    mario.x += 2
    mario.flipX = false
  } else if (isMarioTouchingFloor) {
    mario.anims.play('mario-idle', true)
  }

  if (idKeyUpDown && isMarioTouchingFloor) {
    mario.setVelocityY(-300)
    mario.anims.play('mario-jump', true)
  }
}
