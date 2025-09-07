<script>
document.addEventListener('DOMContentLoaded', () => {
    const dino = document.querySelector('.dino');
    const obstaclesContainer = document.querySelector('.obstacles');
    const groundSprite = document.querySelector('.ground-sprite');
    const cloudsContainer = document.querySelector('.clouds-container');
    const scoreDisplay = document.querySelector('.score');
    const highScoreDisplay = document.querySelector('.high-score');
    const gameOverDisplay = document.querySelector('.game-over');
    const finalScoreDisplay = document.querySelector('.final-score span');
    const startInstruction = document.querySelector('.start-instruction');
    const jumpButton = document.querySelector('.jump-button');
    const body = document.querySelector('body');
    
    let isGameOver = false;
    let isJumping = false;
    let isGameStarted = false;
    let score = 0;
    let highScore = localStorage.getItem('dinoHighScore') || 0;
    let gameSpeed = 1.5;
    let cloudSpawnInterval;
    let scoreInterval;
    let obstacleInterval;
    
    highScoreDisplay.textContent = `HI ${String(highScore).padStart(2, '0')}`;
    
    function createCloud() {
        const cloud = document.createElement('img');
        cloud.classList.add('cloud', 'moving-cloud');
        cloud.src = './assets/images/cloud.png';
        
        const size = Math.random() * 20 + 20;
        const top = Math.random() * 40;
        
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size}px`;
        cloud.style.top = `${top}px`;
        cloud.style.right = '-50px';
        
        cloudsContainer.appendChild(cloud);
        
        setTimeout(() => {
            if (cloud.parentNode) {
                cloud.parentNode.removeChild(cloud);
            }
        }, 20000);
    }
    
    function toggleNightMode() {
        body.classList.toggle('night-mode');
    }
    
    function createObstacle() {
        if (!isGameStarted || isGameOver) return;
        
        const obstacle = document.createElement('img');
        obstacle.classList.add('obstacle', 'moving', 'cactus');
        obstacle.src = './assets/images/block.png';
        
        obstaclesContainer.appendChild(obstacle);
        
        obstacle.style.animationDuration = `${gameSpeed}s`;
        
        setTimeout(() => {
            if (obstacle.parentNode) {
                obstacle.parentNode.removeChild(obstacle);
            }
        }, gameSpeed * 1000 + 1000);
    }
    
    function startGame() {
        if (isGameStarted) return;
        
        isGameStarted = true;
        isGameOver = false;
        score = 0;
        gameSpeed = 1.5;
        
        startInstruction.style.display = 'none';
        gameOverDisplay.style.display = 'none';
        
        obstaclesContainer.innerHTML = '';
        
        groundSprite.classList.add('moving-ground');
        
        cloudSpawnInterval = setInterval(createCloud, 3000);
        
        obstacleInterval = setInterval(createObstacle, 1500);
        
        scoreInterval = setInterval(() => {
            if (!isGameOver) {
                score++;
                scoreDisplay.textContent = String(score).padStart(2, '0');
                
                if (score % 100 === 0) {
                    gameSpeed *= 0.9;
                    
                    document.querySelectorAll('.obstacle').forEach(obs => {
                        obs.style.animationDuration = `${gameSpeed}s`;
                    });
                    
                    if (score % 200 === 0) {
                        toggleNightMode();
                    }
                }
            }
        }, 100);
    }
    
    function jump() {
        if (isJumping || !isGameStarted) return;
        
        isJumping = true;
        dino.classList.add('jumping');
        
        setTimeout(() => {
            dino.classList.remove('jumping');
            isJumping = false;
        }, 500);
    }
    
    function checkCollision() {
        if (!isGameStarted || isGameOver) return;
        
        const dinoRect = dino.getBoundingClientRect();
        const obstacles = document.querySelectorAll('.obstacle');
        
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            if (
                obstacleRect.left < dinoRect.right - 15 &&
                obstacleRect.right > dinoRect.left + 15 &&
                obstacleRect.top < dinoRect.bottom - 5 &&
                obstacleRect.bottom > dinoRect.top + 5
            ) {
                gameOver();
            }
        });
    }
    
    function gameOver() {
        isGameOver = true;
        isGameStarted = false;
        
        groundSprite.classList.remove('moving-ground');
        
        clearInterval(cloudSpawnInterval);
        clearInterval(obstacleInterval);
        clearInterval(scoreInterval);
        
        document.querySelectorAll('.obstacle').forEach(obs => {
            obs.style.animationPlayState = 'paused';
        });
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('dinoHighScore', highScore);
            highScoreDisplay.textContent = `HI ${String(highScore).padStart(2, '0')}`;
        }
        
        finalScoreDisplay.textContent = String(score).padStart(2, '0');
        gameOverDisplay.style.display = 'block';
        startInstruction.style.display = 'block';
    }
    
    function restartGame() {
        if (!isGameOver) return;
        
        obstaclesContainer.innerHTML = '';
        
        startInstruction.style.display = 'block';
        gameOverDisplay.style.display = 'none';
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') {
            if (!isGameStarted && !isGameOver) {
                startGame();
            } else if (isGameOver) {
                restartGame();
            } else {
                jump();
            }
        }
    });
    
    jumpButton.addEventListener('click', () => {
        if (!isGameStarted && !isGameOver) {
            startGame();
        } else if (isGameOver) {
            restartGame();
        } else {
            jump();
        }
    });
    
    document.addEventListener('touchstart', (e) => {
        if (e.target !== jumpButton) {
            if (!isGameStarted && !isGameOver) {
                startGame();
            } else if (isGameOver) {
                restartGame();
            } else {
                jump();
            }
        }
    });
    
    setInterval(checkCollision, 10);
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createCloud(), i * 1000);
    }
    
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        jumpButton.style.display = 'block';
    }
});
</script>
