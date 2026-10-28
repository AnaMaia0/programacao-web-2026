# 🍽️ RecipeFolio — Catálogo Interativo de Receitas

Aplicação web desenvolvida para a avaliação **Trabalho em Grupo 1** da disciplina de **Programação Web (UFOPA)**. O projeto consiste em um catálogo interativo de receitas culinárias que consome dados de APIs públicas via requisições HTTP assíncronas, permitindo pesquisar pratos, navegar de A a Z, visualizar detalhes completos traduzidos para o português e gerenciar uma lista persistente de favoritos.

---

## 👥 Integrantes do Grupo

| Nome | Matrícula |
| :--- | :--- |
| **Ana Clara Lages Maia** | 2024005285 |
| **Roberta Mendes Monteiro** | 2024000091 |

---

## ✨ Funcionalidades

- **Destaques na Página Inicial (`Início`)**: Carregamento dinâmico de uma seleção curada de receitas populares ao abrir a aplicação.
- **Catálogo de A a Z (`Catálogo`)**: Barra alfabética interativa gerada dinamicamente via DOM para explorar receitas pela letra inicial.
- **Pesquisa por Nome**: Formulário de busca (`submit`) para consultar receitas em tempo real na API por termo pesquisado.
- **Modal de Detalhes**: Exibição de informações completas ao selecionar uma receita, incluindo imagem em destaque, categoria, nacionalidade/origem, tags, lista de ingredientes com medidas, modo de preparo e link para vídeo no YouTube (com verificação automática de disponibilidade).
- **Tradução para Português (PT-BR)**: Combinação de dicionários locais (categorias, nacionalidades, ingredientes e medidas culinárias) com a API gratuita *MyMemory* para tradução assíncrona dos títulos e instruções de preparo.
- **Sistema de Favoritos com Persistência (`localStorage`)**: Adição e remoção de receitas favoritas diretamente nos cartões ou no modal de detalhes, com contador atualizado em tempo real e persistência de dados entre recarregamentos da página (`JSON.stringify` e `JSON.parse`).
- **Estados de Interface (Feedback Visual)**: Indicadores visuais de carregamento (*spinner* e mensagens dinâmicas), estado vazio (*empty state*) para buscas ou listas sem itens, e tratamento de erros de rede/HTTP com botão de nova tentativa (*Tentar novamente*).
- **Design Responsivo e Acessível**: Layout construído com HTML5 semântico, CSS Grid adaptável a diferentes tamanhos de tela (desktop, tablet e mobile) e suporte a navegação por teclado (como fechar o modal com a tecla `Esc`).

---

## 🚀 Tecnologias e APIs Utilizadas

- **HTML5 Semântico**: Estruturação com `<header>`, `<nav>`, `<main>`, `<article>`, `<form>` e atributos de acessibilidade ARIA.
- **CSS3**: Estilização própria com variáveis CSS (`:root`), *CSS Grid*, *Flexbox*, animações e *Media Queries* (sem uso de frameworks).
- **JavaScript (Vanilla JS)**: Manipulação do DOM, eventos (`click`, `submit`, `keydown`, `resize`), `fetch()` com `async/await`, tratamento de exceções (`try/catch`) e armazenamento local com `localStorage`.
- **APIs Públicas Consumidas**:
  - [TheMealDB API](https://www.themealdb.com/api.php) — Busca de receitas, listagem por letra inicial e consulta de detalhes por ID.
  - [MyMemory Translated API](https://mymemory.translated.net/doc/spec.php) — Tradução complementar de textos do inglês para o português (`en|pt-BR`).

---

## 📂 Estrutura de Arquivos

```text
Trabalho Grupo/
├── index.html       # Estrutura principal e semântica da aplicação
├── README.md        # Documentação do projeto
├── css/
│   └── style.css    # Estilos, variáveis de tema e responsividade
└── js/
    └── app.js       # Lógica de consumo da API, manipulação do DOM e localStorage
```

---

## ▶️ Como Executar o Projeto

Por ser uma aplicação puramente *frontend* construída com HTML, CSS e JavaScript nativos (e consumindo APIs públicas sem necessidade de chave de autenticação), não é necessário instalar dependências ou configurar servidor backend:

1. **Clonar o repositório** (ou extrair o arquivo `.zip`):
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Acesse a pasta **`Trabalho Grupo`**.
3. Abra o arquivo **`index.html`** diretamente em qualquer navegador web moderno (Google Chrome, Edge, Firefox, etc.) com conexão à internet, ou utilize a extensão **Live Server** no VS Code.