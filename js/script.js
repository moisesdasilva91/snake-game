// Seleciona o canvas e o contexto para desenhar
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Elementos da interface do usuário
const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

// Som quando a comida é comida
const audio = new Audio("./assets/audio.mp3")

// Tamanho dos blocos do jogo
const size = 30

// Posição inicial da cobra
const initialPosition = {x: 270, y:240}

// Cobra começa com um bloco
let  snake = [ {x: 270, y: 240},

]

// Função para aumentar a pontuação
const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

// Gera um número aleatório dentro do grid
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

// Gera uma posição aleatória para a comida dentro do grid
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round (number / 30) * 30
}

// Gera uma cor aleatória para a comida
const randomColor = () => { 
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

// Objeto da comida com posição e cor inicial
const food = {
    x: randomPosition(0, 570),
    y: randomPosition(0, 570),
    color: randomColor()
}

// Direção do movimento da cobra
let direction, loopId

const drawFood = () => {
    const {x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    snake.forEach((position, index) => {
        if (index == snake.length - 1){
            ctx.fillStyle = "#191919"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return 

    const head = snake[snake.length - 1]

    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }

    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }
    snake.shift()
}



const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"
    
    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }


}

const chackEat  = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y)){
             x = randomPosition()
             y = randomPosition()
        }

        food.x = x
        food.y = y 
        food.color = randomColor()
    }
}

const checkCollison = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit


    const selfCollssion = snake.find((position, index) => {
        return  index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollssion) {
        gameOver()
    }

}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"

}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackEat()
    checkCollison()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener("keydown", ({key }) => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }
    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }
    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})