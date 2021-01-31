const sprites = new Image();
const som_HIT = new Audio();
let frames = 0
sprites.src = './sprites.png';
som_HIT.src = './sounds/hit.wav'

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

function criaChao() {

    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2
            const movimentacao = chao.x = chao.x - movimentoDoChao

            chao.x = movimentacao % repeteEm
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        }
    }

    return chao
}


function fazColisao(fb, chao) {
    const fby = fb.y + fb.height
    const chaoy = chao.y
    if (fby >= chaoy) {

        return true
    } else {
        return false
    }
}

function criaFlappybird() {

    const flappybird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.25,
        pulo: 4.6,
        atualiza() {

            if (fazColisao(flappybird, globais.chao)) {

                som_HIT.play()
                setTimeout(() => {
                    mudaTela(telas.inicio)
                }, 500)

                return
            }

            flappybird.velocidade = flappybird.velocidade + flappybird.gravidade
            flappybird.y = flappybird.y + flappybird.velocidade
        },
        pula() {
            flappybird.velocidade = -flappybird.pulo
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, },
            { spriteX: 0, spriteY: 26, },
            { spriteX: 0, spriteY: 52, },
            { spriteX: 0, spriteY: 26, },
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloDeFrames = 10
            const passouOIntervalo = frames % intervaloDeFrames == 0
            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappybird.frameAtual;
                const baseRepeticao = flappybird.movimentos.length
                flappybird.frameAtual = incremento % baseRepeticao
            }

        },
        desenha() {
            flappybird.atualizaFrameAtual()
            const { spriteX, spriteY } = flappybird.movimentos[flappybird.frameAtual]

            contexto.drawImage(sprites, spriteX, spriteY, flappybird.width, flappybird.height, flappybird.x, flappybird.y, flappybird.width, flappybird.height);
        }
    }

    return flappybird
}


const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
}

// Telas

let telaAtiva = {}
let globais = {};

function mudaTela(novaTela) {
    telaAtiva = novaTela
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa()
    }
}

const telas = {
    inicio: {
        inicializa() {
            globais.flappybird = criaFlappybird()
            globais.chao = criaChao()
        },
        desenha() {
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.flappybird.desenha()
            mensagemGetReady.desenha()
        },
        click() {
            mudaTela(telas.jogo)
        },
        atualiza() {
            globais.chao.atualiza()
        }
    },
    jogo: {
        desenha() {
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.flappybird.desenha()

        },
        click() {
            globais.flappybird.pula()
        },
        atualiza() {
            globais.flappybird.atualiza()
        }
    }
}

function loop() {
    telaAtiva.desenha()
    telaAtiva.atualiza()
    frames = frames + 1
    requestAnimationFrame(loop)
}

window.addEventListener('click', () => {
    if (telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaTela(telas.inicio)
loop()