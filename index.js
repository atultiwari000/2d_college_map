const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const boundaries = []
const offset = {
    x: -1950,
    y: -2250
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol > 0)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})


const image = new Image()
image.src = './img/col_map.png'

const foregroundimage = new Image()
foregroundimage.src = './img/foreground.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up:  playerUpImage,
        left:  playerLeftImage,
        right:  playerRightImage,
        down:  playerDownImage
    }
})


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundimage
})


const keys = {
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}



const movables = [background, ...boundaries, foreground]
let speed = 4

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    
    background.draw()
    boundaries.forEach(boundary =>{
        boundary.draw()
    })
    player.draw()
    foreground.draw()


   let moving  = true
   player.moving = false
    if (keys.w.pressed && lastKey == 'w') {
        player.moving = true
        player.image = player.sprites.up
        for(let i =0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x:boundary.position.x,
                    y:boundary.position.y + speed 
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => { movable.position.y += speed })
    }
    else if (keys.a.pressed && lastKey == 'a') {
        player.moving = true
        player.image = player.sprites.left
        for(let i =0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x:boundary.position.x + speed,
                    y:boundary.position.y
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => { movable.position.x += speed })
    }
    else if (keys.s.pressed && lastKey == 's') {
        player.moving = true
        player.image = player.sprites.down
        for(let i =0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x:boundary.position.x,
                    y:boundary.position.y - speed
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => { movable.position.y -= speed })
    }
    else if (keys.d.pressed && lastKey == 'd') {
        player.moving = true
        player.image = player.sprites.right
        for(let i =0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x:boundary.position.x - speed,
                    y:boundary.position.y 
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => { movable.position.x -= speed })
    }
}

animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    console.log(e)
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    console.log(e)
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})