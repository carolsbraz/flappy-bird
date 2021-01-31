const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const flappybird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    desenha() {
        contexto.drawImage(sprites, flappybird.spriteX, flappybird.spriteY, flappybird.width, flappybird.height, flappybird.x, flappybird.y, flappybird.width, flappybird.height);
    }
}

function loop() {
    flappybird.desenha()
    requestAnimationFrame(loop)
}

loop()