const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: 375, y: 520, width: 50, height: 50 };
let score = 10; // Cambiado de 0 a 10
let items = [];
let gameRunning = true;

function createItem() {
    const types = ['solar', 'wind', 'coal', 'oil'];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * (canvas.width - 30);
    items.push({ x, y: 0, width: 30, height: 30, type });
}

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawItems() {
    items.forEach(item => {
        if (item.type === 'solar') ctx.fillStyle = 'yellow';
        else if (item.type === 'wind') ctx.fillStyle = 'blue';
        else ctx.fillStyle = 'black';
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });
}

function updateItems() {
    items.forEach(item => item.y += 4);
    items = items.filter(item => item.y < canvas.height);
}

function checkCollisions() {
    items.forEach((item, index) => {
        if (
            item.x < player.x + player.width &&
            item.x + item.width > player.x &&
            item.y < player.y + player.height &&
            item.y + item.height > player.y
        ) {
            if (item.type === 'solar' || item.type === 'wind') {
                score += 10;
            } else {
                score -= 10;
            }
            items.splice(index, 1);
        }
    });
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawItems();
    updateItems();
    checkCollisions();

    document.getElementById('score').textContent = score;

    if (score >= 100) {
        gameRunning = false;
        setTimeout(() => alert('¡Felicidades! Has salvado al planeta.'), 100);
        resetGame();
    } else if (score <= 0) {
        gameRunning = false;
        setTimeout(() => alert('Perdiste. Las energías contaminantes dominaron.'), 100);
        resetGame();
    }

    requestAnimationFrame(updateGame);
}

function resetGame() {
    score = 10; // Reinicia con 10 puntos
    items = [];
    gameRunning = true;
}

function startGame() {
    createItem();
    setInterval(createItem, 1000);
    requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= 20;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += 20;
});

startGame();