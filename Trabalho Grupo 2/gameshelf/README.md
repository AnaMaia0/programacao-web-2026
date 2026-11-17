# GameShelf — Catálogo de Jogos

Trabalho em Grupo — API Própria com Banco de Dados  
Disciplina: Programação para Web · UFOPA

---

## Integrantes

- Ana Clara Lages Maia; Matrícula: 2024005285

---

## Tema

Catálogo de jogos digitais com operações completas de listagem, cadastro, edição e exclusão via interface web. Inclui busca por título, ordenação, paginação, tela de detalhes por jogo, avaliações de usuários e relatório por gênero.

---

## Banco de dados escolhido: PostgreSQL

### Justificativa

O PostgreSQL foi escolhido por ser um banco relacional robusto, ideal para dados bem estruturados como um catálogo de jogos, onde todos os registros compartilham os mesmos campos (título, gênero, plataforma, desenvolvedora, ano, nota e descrição). Sua tipagem estrita (`INTEGER`, `DECIMAL`, `VARCHAR`, `TEXT`) e suporte a constraints (`NOT NULL`, `CHECK`) garantem integridade dos dados sem esforço adicional na aplicação. Além disso, o pgAdmin 4 facilita a visualização e o gerenciamento do banco durante o desenvolvimento.

### Modelagem

**Tabela `jogos`** — entidade principal:

| Campo | Tipo | Restrição |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| titulo | VARCHAR(255) | NOT NULL |
| genero | VARCHAR(100) | NOT NULL |
| plataforma | VARCHAR(100) | NOT NULL |
| desenvolvedora | VARCHAR(255) | NOT NULL |
| ano_lancamento | INTEGER | NOT NULL |
| nota | DECIMAL(3,1) | NOT NULL, entre 0 e 10 |
| descricao | TEXT | — |

**Tabela `avaliacoes`** — relacionada a `jogos` via chave estrangeira:

| Campo | Tipo | Restrição |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| jogo_id | INTEGER | NOT NULL, FK → jogos(id) ON DELETE CASCADE |
| autor | VARCHAR(100) | NOT NULL |
| nota | DECIMAL(3,1) | NOT NULL, entre 0 e 10 |
| comentario | TEXT | — |
| criado_em | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Limitações

O PostgreSQL exige instalação de um servidor separado na máquina, o que adiciona uma etapa de configuração em relação a alternativas como o SQLite (arquivo único). A porta padrão pode variar entre instalações (5432 ou 5433), exigindo atenção na configuração do `.env`.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 ou superior) com pgAdmin 4

---

## Passo a passo para executar

### 1. Instalar o PostgreSQL

Acesse https://www.postgresql.org/download/, baixe o instalador para o seu sistema operacional e siga o assistente. Durante a instalação:
- Defina uma senha para o usuário `postgres` (guarde-a — será usada no `.env`)
- Mantenha a porta padrão (geralmente **5432** ou **5433**)
- Instale o pgAdmin 4 quando solicitado

### 2. Criar o banco de dados

Abra o **pgAdmin 4**, clique com o botão direito em **Databases → Create → Database** e crie um banco chamado:

```
gameshelf
```

### 3. Criar as tabelas e popular o banco

No pgAdmin, clique com o botão direito no banco `gameshelf` → **Query Tool**.  
Abra o arquivo `database.sql` (na raiz do projeto), copie todo o conteúdo, cole no Query Tool e clique em **Execute (F5)**.

Isso criará as tabelas `jogos` e `avaliacoes` e inserirá os registros iniciais.

### 4. Configurar as variáveis de ambiente

Na pasta `gameshelf/`, crie um arquivo chamado `.env` com o seguinte conteúdo:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gameshelf
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

> ⚠️ Substitua `sua_senha_aqui` pela senha definida na instalação do PostgreSQL.  
> Se a sua instalação usar a porta **5433**, ajuste `DB_PORT=5433`.  
> Para verificar a porta: no pgAdmin, clique com o botão direito no servidor → Properties → aba Connection.

### 5. Instalar as dependências

No terminal, dentro da pasta `gameshelf/`:

```bash
npm install
```

### 6. Iniciar o servidor

```bash
node server.js
```

O terminal deve exibir:
```
🎮 GameShelf rodando em http://localhost:3000
✅ Conectado ao PostgreSQL
```

### 7. Abrir a aplicação

Acesse no navegador:

```
http://localhost:3000
```

---

## Rotas da API

### Jogos

| Verbo | Rota | Descrição |
|---|---|---|
| GET | /api/jogos | Lista jogos (suporta `?nome=`, `?sort=`, `?order=`, `?page=`) |
| GET | /api/jogos/:id | Retorna um jogo pelo ID |
| POST | /api/jogos | Cadastra um novo jogo |
| PUT | /api/jogos/:id | Atualiza um jogo pelo ID |
| DELETE | /api/jogos/:id | Exclui um jogo pelo ID |

### Avaliações

| Verbo | Rota | Descrição |
|---|---|---|
| GET | /api/jogos/:id/avaliacoes | Lista avaliações de um jogo |
| POST | /api/jogos/:id/avaliacoes | Adiciona avaliação a um jogo |
| DELETE | /api/avaliacoes/:id | Exclui uma avaliação pelo ID |

### Relatório

| Verbo | Rota | Descrição |
|---|---|---|
| GET | /api/relatorio/generos | Total e média de nota por gênero (GROUP BY) |

---

## Itens extras implementados

- **Busca/filtro:** campo de busca por título com parâmetro `?nome=` enviado ao servidor
- **GET /api/jogos/:id:** rota individual com tela de detalhe do jogo
- **Paginação e ordenação:** `?page=`, `?sort=` e `?order=` com 6 itens por página
- **Segunda tabela:** `avaliacoes` relacionada a `jogos` com CRUD completo
- **Relatório com agregação:** `GET /api/relatorio/generos` usa `GROUP BY` e `AVG()` no banco

---

## Uso de IA

Este projeto foi desenvolvido com auxílio do Claude para:
- Suporte na resolução de erros de conexão com o banco

## Bibliotecas utilizadas

- [Express](https://expressjs.com/) — servidor HTTP
- [pg](https://node-postgres.com/) — driver PostgreSQL para Node.js
- [cors](https://www.npmjs.com/package/cors) — habilita requisições entre origens diferentes
- [dotenv](https://www.npmjs.com/package/dotenv) — leitura de variáveis de ambiente
- [Exo 2](https://fonts.google.com/specimen/Exo+2) — tipografia via Google Fonts