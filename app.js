document.addEventListener('DOMContentLoaded', () => {
    // Elementos do jogo
    const dino = document.querySelector('.dino');
    const cactus = document.querySelector('.cactus');
    const groundLine = document.querySelector('.ground-line');
    const cloudsContainer = document.querySelector('.clouds-container');
    const scoreDisplay = document.querySelector('.score');
    const highScoreDisplay = document.querySelector('.high-score');
    const gameOverDisplay = document.querySelector('.game-over');
    const startInstruction = document.querySelector('.start-instruction');
    const body = document.querySelector('body');
    
    // Variáveis do jogo
    let isGameOver = false;
    let isJumping = false;
    let isGameStarted = false;
    let score = 0;
    let highScore = localStorage.getItem('dinoHighScore') || 0;
    let gameSpeed = 1.5;
    let cloudSpawnInterval;
    let scoreInterval;
    
    // Atualizar high score
    highScoreDisplay.textContent = `HI ${String(highScore).padStart(2, '0')}`;
    
    // Inicializar dinossauro
    function initDino() {
        dino.innerHTML = `
            <div class="dino-body">
                <div class="dino-head">
                    <div class="dino-eye"></div>
                </div>
            </div>
            <div class="dino-leg dino-leg-front"></div>
            <div class="dino-leg dino-leg-back"></div>
        `;
    }
    
    // Criar nuvens
    function createCloud() {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud', 'moving-cloud');
        
        const size = Math.random() * 15 + 10;
        const top = Math.random() * 40;
        
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size}px`;
        cloud.style.top = `${top}px`;
        cloud.style.right = '-50px';
        
        cloudsContainer.appendChild(cloud);
        
        // Remover nuvem após sair da tela
        setTimeout(() => {
            if (cloud.parentNode) {
                cloud.parentNode.removeChild(cloud);
            }
        }, 20000);
    }
    
    // Alternar modo noturno
    function toggleNightMode() {
        body.classList.toggle('night-mode');
    }
    
    // Iniciar jogo
    function startGame() {
        if (isGameStarted) return;
        
        isGameStarted = true;
        isGameOver = false;
        score = 0;
        gameSpeed = 1.5;
        
        // Esconder instrução inicial
        startInstruction.style.display = 'none';
        gameOverDisplay.style.display = 'none';
        
        // Iniciar animações
        cactus.classList.add('moving');
        groundLine.classList.add('moving-ground');
        
        // Ajustar velocidade baseada no gameSpeed
        cactus.style.animationDuration = `${gameSpeed}s`;
        
        // Gerar nuvens
        cloudSpawnInterval = setInterval(createCloud, 3000);
        
        // Iniciar pontuação
        scoreInterval = setInterval(() => {
            if (!isGameOver) {
                score++;
                scoreDisplay.textContent = String(score).padStart(2, '0');
                
                // Aumentar dificuldade a cada 100 pontos
                if (score % 100 === 0) {
                    gameSpeed *= 0.9;
                    cactus.style.animationDuration = `${gameSpeed}s`;
                    
                    // Alternar modo noturno a cada 200 pontos
                    if (score % 200 === 0) {
                        toggleNightMode();
                    }
                }
            }
        }, 100);
    }
    
    // Pular
    function jump() {
        if (isJumping || !isGameStarted) return;
        
        isJumping = true;
        dino.classList.add('jumping');
        
        setTimeout(() => {
            dino.classList.remove('jumping');
            isJumping = false;
        }, 500);
    }
    
    // Verificar colisões
    function checkCollision() {
        if (!isGameStarted || isGameOver) return;
        
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();
        
        // Ajustar a área de colisão para ser mais precisa
        if (
            cactusRect.left < dinoRect.right - 10 &&
            cactusRect.right > dinoRect.left + 10 &&
            cactusRect.top < dinoRect.bottom - 5 &&
            cactusRect.bottom > dinoRect.top + 5
        ) {
            gameOver();
        }
    }
    
    // Game over
    function gameOver() {
        isGameOver = true;
        isGameStarted = false;
        
        // Parar animações
        cactus.classList.remove('moving');
        groundLine.classList.remove('moving-ground');
        
        // Parar geração de nuvens e pontuação
        clearInterval(cloudSpawnInterval);
        clearInterval(scoreInterval);
        
        // Atualizar high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('dinoHighScore', highScore);
            highScoreDisplay.textContent = `HI ${String(highScore).padStart(2, '0')}`;
        }
        
        // Mostrar tela de game over
        gameOverDisplay.style.display = 'block';
        startInstruction.style.display = 'block';
    }
    
    // Reiniciar jogo
    function restartGame() {
        if (!isGameOver) return;
        
        // Reposicionar cacto
        cactus.style.right = '-20px';
        
        // Mostrar instrução inicial
        startInstruction.style.display = 'block';
        
        // Limpar nuvens
        cloudsContainer.innerHTML = '';
    }
    
    // Event listeners
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
    
    // Suporte para toque em dispositivos móveis
    document.addEventListener('touchstart', () => {
        if (!isGameStarted && !isGameOver) {
            startGame();
        } else if (isGameOver) {
            restartGame();
        } else {
            jump();
        }
    });
    
    // Loop de verificação de colisão
    setInterval(checkCollision, 10);
    
    // Inicializar o jogo
    initDino();
    
    // Criar algumas nuvens iniciais
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createCloud(), i * 1000);
    }
});
