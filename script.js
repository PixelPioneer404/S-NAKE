const highScoreEl = document.querySelector('#high-score')
const currentScoreEl = document.querySelector('#current-score')
const timeEl = document.querySelector('#time')
const board = document.querySelector('#board')
const modalBG = document.querySelector('#modal-bg')
const alertModal = document.querySelector('#alert-modal')
const restartBtn = document.querySelectorAll('.restart-btn')
const pausedModal = document.querySelector('#paused-modal')
const pauseBtn = document.querySelector('#paused-btn')
const resumeBtn = document.querySelector('#resume-btn')
const infoModal = document.querySelector('#info-modal')
const closeInfoBtn = document.querySelector('#close-info-btn')

let score = 0
let highScore = parseInt(localStorage.getItem('highScore')) || 0

localStorage.setItem('highScore', `${highScore}`)
highScoreEl.textContent = `High Score: ${highScore}`

let sec = 0
let min = 0

function runTimer() {
    if (isStarted) {
        sec += 1
        if (sec > 60) {
            sec = 0
            min += 1
        }
        timeEl.textContent = `Time: ${String(min).padStart(2, '0')}-${String(sec).padStart(2, '0')}`
    }
}

let timerInterval = setInterval(() => {
    runTimer()
}, 1000)

let cellWidth = 50
let cellHeight = 50

const boardGrid = []

const rows = Math.floor(board.clientHeight / cellHeight)
const cols = Math.floor(board.clientWidth / cellWidth)

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        board.appendChild(cell)
        boardGrid[`${row}-${col}`] = cell
    }
}

let snake = null
const handleSnake = (function () {
    return {
        setSnake: () => {
            snake = [
                {//head
                    x: Math.floor(rows / 2),
                    y: Math.floor(cols / 2)
                },
                {
                    x: Math.floor(rows / 2),
                    y: Math.floor(cols / 2) + 1
                },
                {
                    x: Math.floor(rows / 2),
                    y: Math.floor(cols / 2) + 2
                }
            ]
        }
    }
})()
handleSnake.setSnake()

let renderInterval = null
let direction = 'left'
let fruit = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

let isAlertOpen = false
let isStarted = false //auto stop start at the beginning
let isPaused = false //done by user (only)
let isInfoOpen = sessionStorage.getItem('isInfoOpen')
if (isInfoOpen === null) {
    isInfoOpen = true
    openInfoBox()
    sessionStorage.setItem('isInfoOpen', true)
} else {
    isInfoOpen = JSON.parse(isInfoOpen)
}
console.log(isInfoOpen)
function openAlert() {
    if (isAlertOpen) {
        clearInterval(renderInterval)
        modalBG.classList.remove('opacity-0', 'pointer-events-none')
        modalBG.classList.add('opacity-100', 'pointer-events-auto')
        alertModal.classList.remove('opacity-0', 'pointer-events-none', 'scale-60')
        alertModal.classList.add('opacity-100', 'pointer-events-auto', 'scale-100')
    }
}

function closeAlert() {
    if (!isAlertOpen) {
        modalBG.classList.remove('opacity-100', 'pointer-events-auto')
        modalBG.classList.add('opacity-0', 'pointer-events-none')
        alertModal.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100')
        alertModal.classList.add('opacity-0', 'pointer-events-none', 'scale-60')
    }
}

function openPausedModal() {
    if (isPaused) {
        pausedModal.classList.remove('opacity-0', 'translate-x-[150%]')
        pausedModal.classList.add('opacity-100', 'translate-0')
    }
}

function closePausedModal() {
    if (!isPaused) {
        pauseBtn.classList.remove('opacity-50', 'pointer-events-none')
        pauseBtn.classList.add('opacity-100', 'pointer-events-auto')
        pausedModal.classList.remove('opacity-100', 'translate-0')
        pausedModal.classList.add('opacity-0', 'translate-x-[150%]')
    }
}

function openInfoBox() {
    if (isInfoOpen) {
        isInfoOpen = true
        sessionStorage.setItem('isInfoOpen', isInfoOpen)
        modalBG.classList.remove('opacity-0', 'pointer-events-none')
        modalBG.classList.add('opacity-100', 'pointer-events-auto')
        setTimeout(() => {
            infoModal.classList.remove('opacity-0', 'pointer-events-none', 'scale-70')
            infoModal.classList.add('opacity-100', 'pointer-events-auto', 'scale-100')
        }, 300)
    }
}

function closeInfoBox() {
    isInfoOpen = false
    sessionStorage.setItem('isInfoOpen', isInfoOpen)
    modalBG.classList.remove('opacity-100', 'pointer-events-auto')
    modalBG.classList.add('opacity-0', 'pointer-events-none')
    infoModal.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100')
    infoModal.classList.add('opacity-0', 'pointer-events-none', 'scale-70')
}

function restartGame() {
    score = 0
    currentScoreEl.textContent = `Score: ${score}`
    isPaused = false
    isStarted = false
    closePausedModal()
    snake.forEach((snakeCell) => {
        boardGrid[`${snakeCell.x}-${snakeCell.y}`]?.classList.remove('fill')
    })
    handleSnake.setSnake()
    snake.forEach((snakeCell) => {
        boardGrid[`${snakeCell.x}-${snakeCell.y}`]?.classList.add('fill')
    })
    timerInterval = setInterval(() => {
        runTimer()
    }, 1000)
    direction = 'left' //reset the direction
    document.addEventListener('keydown', (e) => {
        // runTimer()
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (!isStarted) {
                isStarted = true
                renderInterval = setInterval(() => {
                    render()
                }, 200)
            }
        }
    })
    render()
    if (isAlertOpen) {
        isAlertOpen = false
        closeAlert()
    }
}


function pauseGame() {
    isPaused = true
    clearInterval(renderInterval)
    clearInterval(timerInterval)
    pauseBtn.classList.remove('opacity-100', 'pointer-events-auto')
    pauseBtn.classList.add('opacity-50', 'pointer-events-none')
    openPausedModal()
}

function resumeGame() {
    isPaused = false
    closePausedModal()
    pausedModal.classList.remove('opacity-100', 'translate-x-0')
    pausedModal.classList.add('opacity-0', 'translate-x-[150%]')
    setTimeout(() => {
        renderInterval = setInterval(() => {
            render()
        }, 200)
        timerInterval = setInterval(() => {
            runTimer()
        }, 1000)
    }, 300)

}

function resetTimer() {
    clearInterval(timerInterval)
    timeEl.textContent = `Time: 00-00`
    sec = 0
    min = 0
}

restartBtn.forEach((btn) => {
    btn.addEventListener('click', restartGame)
})
pauseBtn.addEventListener('click', pauseGame)
resumeBtn.addEventListener('click', resumeGame)
closeInfoBtn.addEventListener('click', closeInfoBox)

function render() {
    //snake
    let head = null
    let isCollide = false
    let isSnakeOneLine = true
    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }

    if (isStarted) {
        pauseBtn.classList.remove('opacity-50', 'pointer-events-none')
        pauseBtn.classList.add('opacity-100', 'pointer-events-auto')
    }

    isSnakeOneLine = snake.every((snakeCell) => { return snakeCell.x === head.x }) || snake.every((snakeCell) => { return snakeCell.y === head.y })

    if (boardGrid[`${head.x}-${head.y}`]?.classList?.contains('fill') && !isSnakeOneLine) isCollide = true

    snake.forEach((snakeCell) => {
        boardGrid[`${snakeCell.x}-${snakeCell.y}`].classList.remove('fill')
    })

    boardGrid[`${fruit.x}-${fruit.y}`].classList.add('fruit')

    if (head.x === fruit.x && head.y === fruit.y) {
        score += 10
        currentScoreEl.textContent = `Score: ${score}`
        boardGrid[`${fruit.x}-${fruit.y}`].classList.remove('fruit')
        fruit = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        boardGrid[`${fruit.x}-${fruit.y}`].classList.add('fruit')
        snake.unshift({ x: fruit.x, y: fruit.y })
    }

    if (highScore < score) {
        highScore = score
        localStorage.setItem('highScore', `${highScore}`)
        highScoreEl.textContent = `High Score: ${highScore}`
    }

    snake.unshift(head)
    snake.pop()


    if (head.x < 0 || head.x > rows - 1 || head.y < 0 || head.y > cols - 1 || isCollide) {
        console.log('Collision detected!', 'Head:', head, 'Bounds:', rows, 'x', cols, 'isCollide:', isCollide)
        isAlertOpen = true
        openAlert()
        resetTimer()
    }

    //render the snake
    snake.forEach((snakeCell) => {
        boardGrid[`${snakeCell.x}-${snakeCell.y}`]?.classList.add('fill')
    })
}

document.addEventListener('keydown', (e) => {
    if (!isPaused) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (!isStarted) {
                isStarted = true
                renderInterval = setInterval(() => {
                    render()
                }, 200)
            }
        }

        if (e.key === 'ArrowUp') direction = 'up'
        else if (e.key === 'ArrowDown') direction = 'down'
        else if (e.key === 'ArrowLeft') direction = 'left'
        else if (e.key === 'ArrowRight') direction = 'right'
    }
    if (e.key === 'Escape' && isStarted) {
        if (!isPaused) {
            pauseGame()
            isPaused = true
        } else {
            resumeGame()
            isPaused = false
        }
    }
    if (e.key === 'Enter' && (isAlertOpen || isPaused)) {
        if (isPaused) resumeGame()
        else if (isAlertOpen) restartGame()
    }
})

// Initial render to show the snake
render()