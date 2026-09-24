// ====================================================
// script.js — Saxofone Alto — Atividade Programação Web
// Disciplina: Programação para Web — UFOPA
// ====================================================


// ---- SELEÇÃO DE ELEMENTOS DO DOM ----

// Seleciona o botão de alternância de modo claro/escuro pelo id
const btnModo = document.getElementById('btn-modo');

// Seleciona o span do ícone dentro do botão de modo pelo id
const iconeModo = document.getElementById('icone-modo');

// Seleciona o span do texto dentro do botão de modo pelo id
const textoModo = document.getElementById('texto-modo');

// Seleciona o campo de entrada de nome pelo id
const campoNome = document.getElementById('campo-nome');

// Seleciona o parágrafo onde a saudação gerada pelo JS vai aparecer pelo id
const elSaudacao = document.getElementById('saudacao');

// Seleciona o painel que exibe a nota ativa pelo id
const displayNota = document.getElementById('display-nota');

// Seleciona o elemento grande com o nome da nota pelo id
const elNomeNota = document.getElementById('nome-nota');

// Seleciona o elemento de descrição da nota pelo id
const elDescNota = document.getElementById('desc-nota');

// Seleciona o botão de curtir pelo id
const btnCurtir = document.getElementById('btn-curtir');

// Seleciona o span que exibe o número de curtidas pelo id
const elContador = document.getElementById('contador');

// Seleciona todos os botões de nota com seletor de classe (querySelector)
const botoesNota = document.querySelectorAll('.btn-nota');


// ---- VARIÁVEIS DE ESTADO ----

// Guarda o total de curtidas, começando em zero
let totalCurtidas = 0;

// Indica se o modo claro está ativo (false = modo escuro, que é o padrão)
let modoClaroAtivo = false;

// Armazena o contexto de áudio da Web Audio API para ser reutilizado entre chamadas
let audioCtx = null;


// ---- MAPA DE DESCRIÇÕES DAS NOTAS ----

// Objeto que associa o nome de cada nota musical a uma frase descritiva
const descricaoNotas = {
    // Dó: nota fundamental da escala maior
    'Dó': 'A nota fundamental — base de tudo na escala maior.',
    // Ré: segunda nota da escala
    'Ré': 'Segunda nota — suave e equilibrada.',
    // Mi: terceira nota, muito usada no jazz
    'Mi': 'Terceira nota — frequente no jazz e no blues.',
    // Fá: quarta nota, presente nos acordes de subdominante
    'Fá': 'Quarta nota — usada em acordes de subdominante.',
    // Sol: quinta nota, a mais ressonante
    'Sol': 'Quinta nota — a mais ressonante do instrumento.',
    // Lá: sexta nota, referência de afinação (440 Hz)
    'Lá': 'Sexta nota — referência de afinação mundial (440 Hz).',
    // Si: sétima nota, cria tensão que resolve no Dó
    'Si': 'Sétima nota — cria tensão que quer resolver no Dó.'
};


// ---- SÍNTESE DE ÁUDIO: SIMULADOR SONORO DO SAXOFONE ----

// Função que usa a Web Audio API para sintetizar um som parecido com um saxofone
function tocarNota(frequencia) {
    // Verifica se o AudioContext ainda não foi criado e o inicializa
    if (!audioCtx) {
        // Cria o contexto de áudio, com fallback para navegadores mais antigos
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Retoma o contexto caso esteja suspenso pela política de autoplay do browser
    if (audioCtx.state === 'suspended') {
        // Solicita a retomada do contexto de áudio suspenso
        audioCtx.resume();
    }

    // Armazena o instante atual do contexto de áudio em uma variável
    const agora = audioCtx.currentTime;

    // Cria o oscilador principal com onda dente de serra (imita os harmônicos do saxofone)
    const oscPrincipal = audioCtx.createOscillator();
    // Define o tipo de onda do oscilador como sawtooth (dente de serra)
    oscPrincipal.type = 'sawtooth';
    // Define a frequência do oscilador como a nota selecionada pelo usuário
    oscPrincipal.frequency.setValueAtTime(frequencia, agora);

    // Cria um segundo oscilador levemente desafinado para dar espessura ao som
    const oscSecundario = audioCtx.createOscillator();
    // Define o tipo de onda do segundo oscilador também como sawtooth
    oscSecundario.type = 'sawtooth';
    // Aplica desvio de 0,3% na frequência para criar batimento e espessura sonora
    oscSecundario.frequency.setValueAtTime(frequencia * 1.003, agora);

    // Cria um filtro passa-baixa para remover frequências excessivamente agudas
    const filtro = audioCtx.createBiquadFilter();
    // Define o tipo do filtro como passa-baixa (lowpass)
    filtro.type = 'lowpass';
    // Define a frequência de corte do filtro (4x a frequência fundamental)
    filtro.frequency.value = frequencia * 4;
    // Define o fator de qualidade Q do filtro para uma resposta suave
    filtro.Q.value = 1.2;

    // Cria o nó de ganho para aplicar o envelope ADSR de amplitude
    const ganho = audioCtx.createGain();
    // Define o volume inicial como zero (silêncio no início do envelope)
    ganho.gain.setValueAtTime(0, agora);
    // Fase de ATAQUE: eleva o volume de 0 a 0,3 em 60 milissegundos
    ganho.gain.linearRampToValueAtTime(0.3, agora + 0.06);
    // Fase de DECAIMENTO: reduz ligeiramente até o valor de sustain em 150ms
    ganho.gain.linearRampToValueAtTime(0.22, agora + 0.20);
    // Fase de SUSTAIN: mantém o volume constante por 700 milissegundos
    ganho.gain.setValueAtTime(0.22, agora + 0.90);
    // Fase de RELEASE: desce gradualmente a zero em mais 350 milissegundos
    ganho.gain.linearRampToValueAtTime(0, agora + 1.25);

    // Cria um oscilador LFO (baixa frequência) para gerar o vibrato do instrumento
    const lfo = audioCtx.createOscillator();
    // Define o tipo de onda do LFO como seno (vibrato suave e natural)
    lfo.type = 'sine';
    // Define a taxa do vibrato em 5,2 oscilações por segundo
    lfo.frequency.value = 5.2;

    // Cria o nó de ganho que controla a profundidade (amplitude) do vibrato
    const profVibrato = audioCtx.createGain();
    // Define a profundidade do vibrato em 3,5 Hz de variação de frequência
    profVibrato.gain.value = 3.5;

    // Conecta o LFO ao nó de profundidade de vibrato
    lfo.connect(profVibrato);
    // Conecta o vibrato ao parâmetro de frequência do oscilador principal
    profVibrato.connect(oscPrincipal.frequency);
    // Conecta o vibrato ao parâmetro de frequência do oscilador secundário
    profVibrato.connect(oscSecundario.frequency);

    // Conecta o oscilador principal ao filtro
    oscPrincipal.connect(filtro);
    // Conecta o oscilador secundário ao mesmo filtro
    oscSecundario.connect(filtro);
    // Conecta o filtro ao nó de ganho (envelope)
    filtro.connect(ganho);
    // Conecta o nó de ganho à saída de áudio do dispositivo
    ganho.connect(audioCtx.destination);

    // Inicia o oscilador principal imediatamente
    oscPrincipal.start(agora);
    // Inicia o oscilador secundário imediatamente
    oscSecundario.start(agora);
    // Inicia o oscilador LFO de vibrato imediatamente
    lfo.start(agora);

    // Agenda a parada do oscilador principal após 1,25 segundos
    oscPrincipal.stop(agora + 1.25);
    // Agenda a parada do oscilador secundário após 1,25 segundos
    oscSecundario.stop(agora + 1.25);
    // Agenda a parada do LFO de vibrato após 1,25 segundos
    lfo.stop(agora + 1.25);
}


// ---- FUNÇÃO: ATIVAR E EXIBIR UMA NOTA NO DISPLAY ----

// Define a função que recebe o botão acionado e atualiza o display visual e sonoro
function ativarNota(botao) {
    // Lê o nome da nota no atributo data-nota do botão recebido
    const nota = botao.getAttribute('data-nota');

    // Lê a cor da nota no atributo data-cor do botão
    const cor = botao.getAttribute('data-cor');

    // Lê a frequência da nota no atributo data-freq e converte para número
    const frequencia = parseFloat(botao.getAttribute('data-freq'));

    // Toca o som da nota usando a função de síntese de áudio
    tocarNota(frequencia);

    // Atualiza o nome da nota no display com textContent
    elNomeNota.textContent = nota;

    // Busca a descrição da nota no objeto e exibe no display com textContent
    elDescNota.textContent = descricaoNotas[nota];

    // Altera a cor do texto da nota no display via .style.color
    elNomeNota.style.color = cor;

    // Altera a cor da borda do painel display via .style.borderColor
    displayNota.style.borderColor = cor;

    // Adiciona brilho externo ao display via .style.boxShadow
    displayNota.style.boxShadow = '0 0 28px ' + cor + '55';

    // Remove a classe de animação para resetar e poder reutilizá-la
    displayNota.classList.remove('tocando');

    // Força a reflow do DOM para reiniciar a animação corretamente
    void displayNota.offsetWidth;

    // Adiciona a classe de animação de pulso ao display
    displayNota.classList.add('tocando');

    // Remove a classe "ativa" de todos os botões de nota para limpar o estado anterior
    botoesNota.forEach(function (btn) {
        // Remove individualmente a classe de cada botão
        btn.classList.remove('ativa');
    });

    // Adiciona a classe "ativa" apenas no botão que foi acionado
    botao.classList.add('ativa');
}


// ---- EVENTO 1: TOGGLE MODO ESCURO / CLARO (evento: click) ----

// Registra o ouvinte de clique no botão de alternância de modo
btnModo.addEventListener('click', function () {
    // Inverte o estado booleano do modo claro
    modoClaroAtivo = !modoClaroAtivo;

    // Adiciona ou remove a classe "modo-claro" do body conforme o estado
    document.body.classList.toggle('modo-claro', modoClaroAtivo);

    // Verifica se o modo claro foi ativado agora
    if (modoClaroAtivo) {
        // Atualiza o ícone para lua (para voltar ao modo escuro)
        iconeModo.textContent = '🌙';
        // Atualiza o texto do botão com textContent para "Modo Escuro"
        textoModo.textContent = 'Modo Escuro';
    } else {
        // Atualiza o ícone para sol (para ir ao modo claro)
        iconeModo.textContent = '☀️';
        // Atualiza o texto do botão com textContent para "Modo Claro"
        textoModo.textContent = 'Modo Claro';
    }
});


// ---- EVENTO 2: SAUDAÇÃO PERSONALIZADA (evento: input) ----

// Registra o ouvinte de input no campo de nome (dispara a cada caractere)
campoNome.addEventListener('input', function () {
    // Lê o conteúdo atual do campo de nome com .value e remove espaços nas bordas
    const nome = campoNome.value.trim();

    // Verifica se o campo está vazio após remover os espaços
    if (nome === '') {
        // Apaga o texto de saudação se o campo estiver vazio (textContent)
        elSaudacao.textContent = '';
    } else {
        // Monta e exibe a saudação personalizada com o nome digitado via textContent
        elSaudacao.textContent = '🎷 Olá, ' + nome + '! Bem-vindo(a) ao mundo do saxofone!';
    }
});


// ---- EVENTO 3: CLIQUE NOS BOTÕES DE NOTA (evento: click) ----

// Itera sobre cada botão de nota para registrar o ouvinte de clique
botoesNota.forEach(function (botao) {
    // Adiciona evento de clique ao botão atual do laço
    botao.addEventListener('click', function () {
        // Chama a função que ativa a nota visualmente e sonoramente
        ativarNota(botao);
    });
});


// ---- EVENTO 4: TECLAS DO TECLADO PARA NOTAS (evento: keydown) ----

// Registra o ouvinte de teclado no documento inteiro para capturar qualquer tecla
document.addEventListener('keydown', function (evento) {
    // Verifica se o usuário está digitando no campo de nome para não interferir
    if (document.activeElement === campoNome) {
        // Interrompe o processamento se o foco estiver no input de nome
        return;
    }

    // Percorre todos os botões de nota para encontrar o que corresponde à tecla
    botoesNota.forEach(function (botao) {
        // Lê a tecla esperada pelo botão a partir do atributo data-tecla
        const teclaEsperada = botao.getAttribute('data-tecla');

        // Compara a tecla pressionada (convertida a minúsculo) com a tecla esperada
        if (evento.key.toLowerCase() === teclaEsperada) {
            // Ativa a nota correspondente chamando a função ativarNota
            ativarNota(botao);
        }
    });
});


// ---- EVENTO 5: CONTADOR DE CURTIDAS (evento: click) ----

// Registra o ouvinte de clique no botão de curtir
btnCurtir.addEventListener('click', function () {
    // Soma 1 ao total de curtidas a cada clique
    totalCurtidas = totalCurtidas + 1;

    // Exibe o novo valor no elemento contador com textContent
    elContador.textContent = totalCurtidas;

    // Aplica animação de pulso comprimindo o botão via .style.transform
    btnCurtir.style.transform = 'scale(0.90)';

    // Agenda o retorno do botão ao tamanho original após 160 milissegundos
    setTimeout(function () {
        // Remove a transformação de escala para restaurar o tamanho normal
        btnCurtir.style.transform = '';
    }, 160);
});