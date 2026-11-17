-- ══════════════════════════════════════════
--  GameShelf — Script de criação do banco
-- ══════════════════════════════════════════

-- Tabela principal: jogos
CREATE TABLE jogos (
    id              SERIAL PRIMARY KEY,
    titulo          VARCHAR(255) NOT NULL,
    genero          VARCHAR(100) NOT NULL,
    plataforma      VARCHAR(100) NOT NULL,
    desenvolvedora  VARCHAR(255) NOT NULL,
    ano_lancamento  INTEGER      NOT NULL,
    nota            DECIMAL(3,1) NOT NULL CHECK (nota >= 0 AND nota <= 10),
    descricao       TEXT
);

-- 10 registros iniciais
INSERT INTO jogos (titulo, genero, plataforma, desenvolvedora, ano_lancamento, nota, descricao) VALUES
('The Legend of Zelda: Breath of the Wild', 'Aventura',    'Nintendo Switch',      'Nintendo',          2017, 9.8, 'Um mundo aberto épico onde a exploração é a essência da aventura.'),
('Hollow Knight',                           'Metroidvania','PC, Switch, PS4',      'Team Cherry',       2017, 9.3, 'Jogo de ação em um reino subterrâneo de insetos.'),
('Red Dead Redemption 2',                   'Ação',        'PC, PS4, Xbox One',    'Rockstar Games',    2018, 9.7, 'Uma épica história de um fora-da-lei no Velho Oeste americano.'),
('Hades',                                   'Roguelike',   'PC, Switch, PS4',      'Supergiant Games',  2020, 9.5, 'Fuja do submundo grego em um roguelike com narrativa fascinante.'),
('God of War',                              'Ação',        'PC, PS4, PS5',         'Santa Monica Studio',2018,9.4, 'Kratos e Atreus em jornada épica pela mitologia nórdica.'),
('Celeste',                                 'Plataforma',  'PC, Switch, PS4',      'Maddy Thorson',     2018, 9.0, 'Uma jovem escala uma montanha enquanto lida com seus medos internos.'),
('Stardew Valley',                          'Simulação',   'PC, Switch, PS4',      'ConcernedApe',      2016, 9.2, 'Abandone a vida na cidade e construa uma fazenda do zero.'),
('Sekiro: Shadows Die Twice',               'Ação',        'PC, PS4, Xbox One',    'FromSoftware',      2019, 9.1, 'Um shinobi busca vingança no Japão feudal.'),
('Minecraft',                               'Sandbox',     'PC, Switch, PS4, Xbox','Mojang Studios',    2011, 9.0, 'Construa, explore e sobreviva em um mundo infinito de blocos.'),
('Cyberpunk 2077',                          'RPG',         'PC, PS5, Xbox Series', 'CD Projekt Red',    2020, 8.5, 'Um mercenário em busca de imortalidade na Night City.');

-- Segunda tabela: avaliações (relacionada a jogos via FK)
CREATE TABLE avaliacoes (
    id         SERIAL PRIMARY KEY,
    jogo_id    INTEGER      NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
    autor      VARCHAR(100) NOT NULL,
    nota       DECIMAL(3,1) NOT NULL CHECK (nota >= 0 AND nota <= 10),
    comentario TEXT,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7 avaliações iniciais
INSERT INTO avaliacoes (jogo_id, autor, nota, comentario) VALUES
(1, 'Marcos Silva',   9.5, 'Uma das melhores experiências que já tive em jogos.'),
(2, 'Julia Ferreira', 9.0, 'Arte incrível e gameplay super desafiador.'),
(3, 'Pedro Santos',   9.8, 'Uma obra-prima do entretenimento moderno.'),
(1, 'Ana Lima',      10.0, 'Redefiniu o que um jogo de mundo aberto pode ser.'),
(5, 'Carlos Mendes',  9.2, 'A narrativa entre pai e filho é impecável.'),
(11, 'Beatriz Costa',  9.7, 'Narrativa e gameplay perfeitos.'),
(7, 'Rafael Oliveira',8.9, 'Relaxante e viciante ao mesmo tempo.');