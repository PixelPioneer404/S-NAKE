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
const settingBtn = document.querySelector('#settings-btn')
const closeSettingsBtn = document.querySelector('#close-setting-btn')
const settingsModal = document.querySelector('#settings-modal')
const speedIncBtn = document.querySelector('#speed-inc-btn')
const speedMeter = document.querySelector('#speed-o-meter')
const speedDecBtn = document.querySelector('#speed-dec-btn')
const gridSwitch = document.querySelector('#grid-switch')
const hsResetBtn = document.querySelector('#hs-reset-btn')
const historyList = document.querySelector('#history-list')
const clearHistoryBtn = document.querySelector('#clear-history-btn')

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

let currentSpeed = 200
let snakeSpeeds = [300, 200, 100, 50]
let speedLevel = 3

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
let fruit = generateRandomFood()

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
let isSettingsOpen = false

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
    resetTimer()
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
    pauseBtn.classList.remove('opacity-100', 'pointer-events-auto')
    pauseBtn.classList.add('opacity-50', 'pointer-events-none')
    direction = 'left' //reset the direction
    document.addEventListener('keydown', (e) => {
        // runTimer()
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (!isStarted) {
                isStarted = true
                renderInterval = setInterval(() => {
                    render()
                }, currentSpeed)
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
        }, currentSpeed)
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

function openSettings() {
    clearInterval(renderInterval)
    clearInterval(timerInterval)
    isSettingsOpen = true
    settingBtn.classList.remove('opacity-100', 'pointer-events-auto')
    settingBtn.classList.add('opacity-50', 'pointer-events-none')
    settingsModal.classList.remove('opacity-0', 'translate-x-[150%]')
    settingsModal.classList.add('opacity-100', 'translate-0')
}

function closeSettings() {
    isSettingsOpen = false
    settingBtn.classList.remove('opacity-50', 'pointer-events-none')
    settingBtn.classList.add('opacity-100', 'pointer-events-auto')
    settingsModal.classList.remove('opacity-100', 'translate-0')
    settingsModal.classList.add('opacity-0', 'translate-x-[150%]')
    if (isStarted) {
        setTimeout(() => {
            renderInterval = setInterval(() => {
                render()
            }, currentSpeed)
            timerInterval = setInterval(() => {
                runTimer()
            }, 1000)
        }, 300)
    }
}

restartBtn.forEach((btn) => {
    btn.addEventListener('click', restartGame)
})
pauseBtn.addEventListener('click', pauseGame)
resumeBtn.addEventListener('click', resumeGame)
closeInfoBtn.addEventListener('click', closeInfoBox)
settingBtn.addEventListener('click', openSettings)
closeSettingsBtn.addEventListener('click', closeSettings)

function generateRandomFood() {
    let newFruit
    do {
        newFruit = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    } while (snake && snake.some(segment => segment.x === newFruit.x && segment.y === newFruit.y))

    return newFruit
}

hsResetBtn.addEventListener('click', () => {
    highScore = 0
    localStorage.setItem('highScore', highScore)
    highScoreEl.textContent = `High Score: ${highScore}`
    hsResetBtn.style.opacity = 0.5
    hsResetBtn.style.pointerEvents = 'none'
})

let historyArray = (() => {
    const stored = localStorage.getItem('historyArray')
    return (stored && stored !== '') ? JSON.parse(stored) : []
})()
let historyRowCount = historyArray.length ? historyArray[historyArray.length - 1].id + 1 : 1

document.addEventListener('DOMContentLoaded', () => {
    if (historyRowCount > 1) historyList.innerHTML = ''
    let currentHistoryArray = (() => {
        const stored = localStorage.getItem('historyArray')
        return (stored && stored !== '') ? JSON.parse(stored) : []
    })()
    currentHistoryArray.forEach(({ id, highScore, time }) => {
        let li = document.createElement('li')
        li.classList.add(...'w-full h-20 grid grid-cols-[20%_1fr] rounded-2xl overflow-hidden'.split(' '))
        li.innerHTML =
            `
        <div class="bg-white w-full flex justify-center items-center text-black text-xl font-sans font-medium">${id}</div>
        <div class="w-full bg-white/10 px-6 flex flex-row justify-between items-center">
        <div class="text-white text-[18px] font-mono font-medium">${highScore}</div>
        <div class="w-10 h-0.5 rounded-full bg-white"></div>
        <div class="text-white text-[18px] font-mono font-medium">${time}</div>
        </div>
        `
        historyList.appendChild(li)
    })
    console.log(historyArray)
    
    // Check and set button states on page load
    // High Score Reset Button
    if (highScore === 0) {
        hsResetBtn.style.opacity = 0.5
        hsResetBtn.style.pointerEvents = 'none'
    } else {
        hsResetBtn.style.opacity = 1
        hsResetBtn.style.pointerEvents = 'auto'
    }
    
    // Clear History Button
    if (currentHistoryArray.length === 0) {
        clearHistoryBtn.style.opacity = 0.5
        clearHistoryBtn.style.pointerEvents = 'none'
    } else {
        clearHistoryBtn.style.opacity = 1
        clearHistoryBtn.style.pointerEvents = 'auto'
    }
})

function appendHistory() {
    if (historyRowCount === 1) historyList.innerHTML = ''
    let li = document.createElement('li')
    li.classList.add(...'w-full h-20 grid grid-cols-[20%_1fr] rounded-2xl overflow-hidden'.split(' '))
    historyArray = (() => {
        const stored = localStorage.getItem('historyArray')
        return (stored && stored !== '') ? JSON.parse(stored) : []
    })()
    const historyEl = {
        id: historyRowCount,
        highScore,
        time: `${min}m ${String(sec).padStart(2, '0')}s`
    }
    console.log(`time outside: ${historyEl.time}`)
    if (historyArray.length !== 0 && historyEl.highScore === historyArray[historyArray.length - 1].highScore) {
        if (historyEl.time !== historyArray[historyArray.length - 1].time) {
            console.log(`Updating time from ${historyArray[historyArray.length - 1].time} to ${historyEl.time}`)
            historyArray[historyArray.length - 1].time = historyEl.time
            localStorage.setItem('historyArray', JSON.stringify(historyArray))
            let lastChildTextNode = historyList.lastElementChild.querySelector('.time-node')
            if (lastChildTextNode) {
                lastChildTextNode.textContent = historyEl.time
            }
        }
    } else {
        historyArray.push(historyEl)
        localStorage.setItem('historyArray', JSON.stringify(historyArray))
        li.innerHTML =
            `
            <div class="bg-white w-full flex justify-center items-center text-black text-xl font-sans font-medium">${historyRowCount}</div>
            <div class="w-full bg-white/10 px-6 flex flex-row justify-between items-center">
                <div class="text-white text-[18px] font-mono font-medium">${historyArray[historyArray.length - 1].highScore}</div>
                <div class="w-10 h-0.5 rounded-full bg-white"></div>
                <div class="time-node text-white text-[18px] font-mono font-medium">${historyArray[historyArray.length - 1].time}</div>
            </div>
        `
        historyList.appendChild(li)
    }
    if (historyArray.length === 1) {
        clearHistoryBtn.style.opacity = 1
        clearHistoryBtn.style.pointerEvents = 'auto'
    }
    historyRowCount++
    console.log(historyArray)
}

function clearHistory() {
    localStorage.removeItem('historyArray')
    historyArray = []
    historyRowCount = 1
    historyList.innerHTML =
        `
            <p class="w-full flex justify-center mt-8 text-base text-white/60 font-mono font-medium">No History Yet</p>
        `
        clearHistoryBtn.style.opacity = 0.5
    clearHistoryBtn.style.pointerEvents = 'none'
}

clearHistoryBtn.addEventListener('click', clearHistory)

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

    if (!boardGrid[`${head.x}-${head.y}`]?.classList.contains('head')) boardGrid[`${head.x}-${head.y}`]?.classList.add('head')

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
        fruit = generateRandomFood()
        boardGrid[`${fruit.x}-${fruit.y}`].classList.add('fruit')
        snake.unshift({ x: fruit.x, y: fruit.y })
    }

    if (highScore < score) {
        highScore = score
        localStorage.setItem('highScore', `${highScore}`)
        highScoreEl.textContent = `High Score: ${highScore}`
        
        // Re-enable the high score reset button when high score increases from 0
        if (highScore > 0) {
            hsResetBtn.style.opacity = 1
            hsResetBtn.style.pointerEvents = 'auto'
        }
    }

    snake.unshift(head)
    snake.pop()


    if (head.x < 0 || head.x > rows - 1 || head.y < 0 || head.y > cols - 1 || isCollide) {
        console.log('Collision detected!', 'Head:', head, 'Bounds:', rows, 'x', cols, 'isCollide:', isCollide)
        isAlertOpen = true
        appendHistory()
        openAlert()
        resetTimer()
    }

    //render the snake
    snake.forEach((snakeCell) => {
        boardGrid[`${snakeCell.x}-${snakeCell.y}`]?.classList.add('fill')
    })

}

document.addEventListener('keydown', (e) => {
    if (!isPaused && !isSettingsOpen) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (!isStarted) {
                isStarted = true
                renderInterval = setInterval(() => {
                    render()
                }, currentSpeed)
                // Start timer when game starts
                clearInterval(timerInterval)
                timerInterval = setInterval(() => {
                    runTimer()
                }, 1000)
            }
        }

        if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up'
        else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down'
        else if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left'
        else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right'
    }
    if (e.key === 'Escape') {
        if (!isPaused && !isSettingsOpen) {
            pauseGame()
            isPaused = true
        } else if (isSettingsOpen) {
            closeSettings()
            isSettingsOpen = false
        } else {
            resumeGame()
            isPaused = false
        }
    }
    if (e.key === 'Enter' && (isAlertOpen || isPaused)) {
        if (isPaused) resumeGame()
        else if (isAlertOpen) restartGame()
    }
    if (e.key === 'Tab') e.preventDefault()
})

// Initial render to show the snake
render()

function increaseSnakeSpeed() {
    speedLevel++
    if (speedLevel > 4) speedLevel = 4
    speedMeter.textContent = speedLevel
    currentSpeed = snakeSpeeds[speedLevel - 1]
    console.log(currentSpeed)
}
function decreaseSnakeSpeed() {
    speedLevel--
    if (speedLevel < 1) speedLevel = 1
    speedMeter.textContent = speedLevel
    currentSpeed = snakeSpeeds[speedLevel - 1]
    console.log(currentSpeed)
}

speedIncBtn.addEventListener('click', increaseSnakeSpeed)
speedDecBtn.addEventListener('click', decreaseSnakeSpeed)

let boardCells = null
document.addEventListener('DOMContentLoaded', () => {
    boardCells = document.querySelectorAll('.cell')
    // Call toggleGrid on page load to set initial state
    toggleGrid()
})

function toggleGrid() {
    if (!boardCells) return // Safety check

    if (gridSwitch.checked === true) {
        // Show grid borders
        boardCells.forEach(cell => {
            cell.style.border = "0.5px solid rgba(255, 255, 255, 0.2)"
        })
    } else {
        // Hide grid borders
        boardCells.forEach(cell => {
            cell.style.border = "0.5px solid transparent"
        })
    }
}

gridSwitch.addEventListener('change', toggleGrid)