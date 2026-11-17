const API = 'http://localhost:3000/api/jogos';
const API_REL = 'http://localhost:3000/api/relatorio/generos';
const API_AVAL = (jogoId) => `${API}/${jogoId}/avaliacoes`;
const API_AVAL_D = (avalId) => `http://localhost:3000/api/avaliacoes/${avalId}`;

// ── Estado global ──────────────────────
let estado = { page: 1, sort: 'id', order: 'asc', nome: '' };
let jogosCache = [];
let detalheJogoId = null;

// ── DOM ──────────────────────────────────
const gamesGrid = document.getElementById('games-grid');
const emptyState = document.getElementById('empty-state');
const paginationEl = document.getElementById('pagination');
const toastEl = document.getElementById('toast');

// ── Toast ──────────────────────────────
let toastTimer;
function showToast(msg, tipo = 'success') {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.className = `toast ${tipo}`;
    toastTimer = setTimeout(() => { toastEl.className = 'toast hidden'; }, 4000);
}

// ── Escape HTML ──────────────────────────────
function esc(str) {
    if (!str && str !== 0) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════
//  JOGOS — listar, renderizar, paginar
// ═══════════════════════════════════════════════

async function loadGames() {
    const params = new URLSearchParams({
        page: estado.page,
        sort: estado.sort,
        order: estado.order,
    });
    if (estado.nome) params.set('nome', estado.nome);

    try {
        const res = await fetch(`${API}?${params}`);
        const data = await res.json();
        jogosCache = data.jogos;
        renderCards(data.jogos);
        renderPagination(data.pagina, data.paginas, data.total);
    } catch {
        showToast('Erro ao carregar jogos.', 'error');
    }
}

function renderCards(jogos) {
    if (!jogos.length) {
        gamesGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');
    gamesGrid.innerHTML = jogos.map(j => `
    <div class="card">
      <div class="card-body">
        <div class="card-top">
          <h3 class="card-title">${esc(j.titulo)}</h3>
          <div class="card-rating">
            <span class="score">${Number(j.nota).toFixed(1)}</span>
            <span class="label">nota</span>
          </div>
        </div>
        <span class="card-genre">${esc(j.genero)}</span>
        <div class="card-meta">
          <span>${esc(j.plataforma)}</span>
          <span>${esc(j.desenvolvedora)}</span>
          <span>${j.ano_lancamento}</span>
        </div>
        ${j.descricao ? `<p class="card-desc">${esc(j.descricao)}</p>` : ''}
      </div>
      <div class="card-actions">
        <button class="btn-detail" data-id="${j.id}">Detalhes</button>
        <button class="btn-edit"   data-id="${j.id}">Editar</button>
        <button class="btn-delete" data-id="${j.id}">Excluir</button>
      </div>
    </div>
  `).join('');

    gamesGrid.querySelectorAll('.btn-detail').forEach(b =>
        b.addEventListener('click', () => abrirDetalhe(b.dataset.id)));
    gamesGrid.querySelectorAll('.btn-edit').forEach(b =>
        b.addEventListener('click', () => {
            const j = jogosCache.find(x => x.id == b.dataset.id);
            if (j) abrirModal(j);
        }));
    gamesGrid.querySelectorAll('.btn-delete').forEach(b =>
        b.addEventListener('click', () => excluirJogo(b.dataset.id)));
}

function renderPagination(pagina, totalPaginas, total) {
    if (totalPaginas <= 1) {
        paginationEl.innerHTML = `<span class="total-count">${total} jogo${total !== 1 ? 's' : ''}</span>`;
        return;
    }
    let html = `<span class="total-count">${total} jogos</span><div class="pages">`;
    html += `<button class="page-btn" data-page="${pagina - 1}" ${pagina === 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = 1; i <= totalPaginas; i++)
        html += `<button class="page-btn ${i === pagina ? 'active' : ''}" data-page="${i}">${i}</button>`;
    html += `<button class="page-btn" data-page="${pagina + 1}" ${pagina === totalPaginas ? 'disabled' : ''}>›</button></div>`;
    paginationEl.innerHTML = html;
    paginationEl.querySelectorAll('.page-btn:not([disabled])').forEach(b =>
        b.addEventListener('click', () => {
            estado.page = parseInt(b.dataset.page);
            loadGames();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }));
}

// ── Busca / ordenação ──────────────────────────────
let searchTimer;
document.getElementById('search').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        estado.nome = e.target.value.trim();
        estado.page = 1;
        loadGames();
    }, 300);
});
document.getElementById('sort-by').addEventListener('change', e => {
    estado.sort = e.target.value; estado.page = 1; loadGames();
});
document.getElementById('sort-order').addEventListener('change', e => {
    estado.order = e.target.value; estado.page = 1; loadGames();
});

// ═══════════════════════════════════════════════
//  MODAL ADICIONAR / EDITAR
// ═══════════════════════════════════════════════
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const formJogo = document.getElementById('form-jogo');
const jogoId = document.getElementById('jogo-id');

function abrirModal(jogo = null) {
    formJogo.reset(); jogoId.value = '';
    if (jogo) {
        modalTitle.textContent = 'Editar jogo';
        jogoId.value = jogo.id;
        ['titulo', 'genero', 'plataforma', 'desenvolvedora', 'ano_lancamento', 'nota', 'descricao']
            .forEach(f => { document.getElementById(f).value = jogo[f] ?? ''; });
    } else {
        modalTitle.textContent = 'Adicionar jogo';
    }
    modalOverlay.classList.remove('hidden');
    document.getElementById('titulo').focus();
}
function fecharModal() { modalOverlay.classList.add('hidden'); }

document.getElementById('btn-add').addEventListener('click', () => abrirModal());
document.getElementById('btn-close').addEventListener('click', fecharModal);
document.getElementById('btn-cancel').addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) fecharModal(); });

formJogo.addEventListener('submit', async e => {
    e.preventDefault();
    const dados = {
        titulo: document.getElementById('titulo').value.trim(),
        genero: document.getElementById('genero').value.trim(),
        plataforma: document.getElementById('plataforma').value.trim(),
        desenvolvedora: document.getElementById('desenvolvedora').value.trim(),
        ano_lancamento: parseInt(document.getElementById('ano_lancamento').value),
        nota: parseFloat(document.getElementById('nota').value),
        descricao: document.getElementById('descricao').value.trim(),
    };
    const id = jogoId.value;
    const url = id ? `${API}/${id}` : API;
    const method = id ? 'PUT' : 'POST';
    try {
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        const r = await res.json();
        if (!res.ok) return showToast(r.erro || 'Erro ao salvar.', 'error');
        fecharModal();
        showToast(id ? 'Jogo atualizado!' : 'Jogo adicionado!');
        loadGames();
    } catch { showToast('Erro ao conectar ao servidor.', 'error'); }
});

// ── Excluir jogo ──────────────────────────────
async function excluirJogo(id) {
    if (!confirm('Excluir este jogo?')) return;
    try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        const r = await res.json();
        if (!res.ok) return showToast(r.erro || 'Erro ao excluir.', 'error');
        showToast('Jogo excluído.');
        loadGames();
    } catch { showToast('Erro ao conectar ao servidor.', 'error'); }
}

// ═══════════════════════════════════════════════
//  MODAL DETALHES + AVALIAÇÕES
// ═══════════════════════════════════════════════
const detailOverlay = document.getElementById('detail-overlay');
const detailTitle = document.getElementById('detail-title');
const detailBody = document.getElementById('detail-body');

async function abrirDetalhe(id) {
    detalheJogoId = id;
    try {
        const [jogoRes, avalRes] = await Promise.all([
            fetch(`${API}/${id}`),
            fetch(API_AVAL(id))
        ]);
        const jogo = await jogoRes.json();
        const aval = await avalRes.json();
        detailTitle.textContent = jogo.titulo;
        renderDetalhe(jogo, aval);
        detailOverlay.classList.remove('hidden');
    } catch { showToast('Erro ao carregar detalhes.', 'error'); }
}

function fecharDetalhe() { detailOverlay.classList.add('hidden'); detalheJogoId = null; }
document.getElementById('detail-close').addEventListener('click', fecharDetalhe);
detailOverlay.addEventListener('click', e => { if (e.target === detailOverlay) fecharDetalhe(); });

function renderDetalhe(jogo, avaliacoes) {
    const media = avaliacoes.length
        ? (avaliacoes.reduce((s, a) => s + parseFloat(a.nota), 0) / avaliacoes.length).toFixed(1)
        : null;

    const reviewsHtml = avaliacoes.length
        ? avaliacoes.map(a => `
        <div class="review-card">
          <div class="review-top">
            <span class="review-author">${esc(a.autor)}</span>
            <div class="review-right">
              <span class="review-score">${Number(a.nota).toFixed(1)}</span>
              <button class="btn-del-review" data-id="${a.id}" title="Excluir avaliação">✕</button>
            </div>
          </div>
          ${a.comentario ? `<p class="review-comment">${esc(a.comentario)}</p>` : ''}
          <p class="review-date">${new Date(a.criado_em).toLocaleDateString('pt-BR')}</p>
        </div>`).join('')
        : '<p class="no-reviews">Nenhuma avaliação ainda.</p>';

    detailBody.innerHTML = `
    <div class="detail-info">
      <div class="detail-row"><span class="detail-label">Gênero</span><span class="detail-value">${esc(jogo.genero)}</span></div>
      <div class="detail-row"><span class="detail-label">Nota</span><span class="detail-value" style="color:var(--accent-light);font-weight:800">${Number(jogo.nota).toFixed(1)}</span></div>
      <div class="detail-row"><span class="detail-label">Plataforma</span><span class="detail-value">${esc(jogo.plataforma)}</span></div>
      <div class="detail-row"><span class="detail-label">Desenvolvedora</span><span class="detail-value">${esc(jogo.desenvolvedora)}</span></div>
      <div class="detail-row"><span class="detail-label">Ano</span><span class="detail-value">${jogo.ano_lancamento}</span></div>
      ${jogo.descricao ? `<div class="detail-row full"><span class="detail-label">Descrição</span><p class="detail-desc">${esc(jogo.descricao)}</p></div>` : ''}
    </div>
    <hr class="detail-divider">
    <div>
      <div class="reviews-heading">
        <h3>Avaliações</h3>
        ${media ? `<span class="avg-badge">Média: ${media}</span>` : ''}
      </div>
      <div class="reviews-list">${reviewsHtml}</div>
      <form class="add-review-form" id="form-review">
        <h4>Adicionar avaliação</h4>
        <div class="form-row">
          <input type="text"   id="rev-autor" placeholder="Seu nome" required>
          <input type="number" id="rev-nota"  placeholder="Nota" min="0" max="10" step="0.1" required>
        </div>
        <textarea id="rev-comentario" placeholder="Comentário (opcional)" rows="2"></textarea>
        <button type="submit" class="btn-primary btn-sm">Enviar avaliação</button>
      </form>
    </div>`;

    // Excluir avaliação
    detailBody.querySelectorAll('.btn-del-review').forEach(b =>
        b.addEventListener('click', () => excluirAvaliacao(b.dataset.id)));

    // Enviar avaliação
    document.getElementById('form-review').addEventListener('submit', async ev => {
        ev.preventDefault();
        const dados = {
            autor: document.getElementById('rev-autor').value.trim(),
            nota: parseFloat(document.getElementById('rev-nota').value),
            comentario: document.getElementById('rev-comentario').value.trim(),
        };
        try {
            const res = await fetch(API_AVAL(detalheJogoId), {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados)
            });
            const r = await res.json();
            if (!res.ok) return showToast(r.erro || 'Erro ao enviar.', 'error');
            showToast('Avaliação adicionada!');
            abrirDetalhe(detalheJogoId);
        } catch { showToast('Erro ao conectar.', 'error'); }
    });
}

async function excluirAvaliacao(id) {
    if (!confirm('Excluir esta avaliação?')) return;
    try {
        const res = await fetch(API_AVAL_D(id), { method: 'DELETE' });
        const r = await res.json();
        if (!res.ok) return showToast(r.erro || 'Erro ao excluir.', 'error');
        showToast('Avaliação excluída.');
        abrirDetalhe(detalheJogoId);
    } catch { showToast('Erro ao conectar.', 'error'); }
}

// ═══════════════════════════════════════════════
//  MODAL RELATÓRIO
// ═══════════════════════════════════════════════
const reportOverlay = document.getElementById('report-overlay');
const reportBody = document.getElementById('report-body');

async function abrirRelatorio() {
    try {
        const res = await fetch(API_REL);
        const data = await res.json();
        const max = Math.max(...data.map(d => d.total));
        reportBody.innerHTML = data.map(d => `
      <div class="report-row">
        <span class="report-genre" title="${esc(d.genero)}">${esc(d.genero)}</span>
        <div class="report-bar-wrap">
          <div class="report-bar" style="width:${Math.round((d.total / max) * 100)}%"></div>
        </div>
        <span class="report-stats">${d.total} jogo${d.total > 1 ? 's' : ''} · <strong>${d.media_nota}</strong></span>
      </div>`).join('');
        reportOverlay.classList.remove('hidden');
    } catch { showToast('Erro ao carregar relatório.', 'error'); }
}

function fecharRelatorio() { reportOverlay.classList.add('hidden'); }
document.getElementById('btn-report').addEventListener('click', abrirRelatorio);
document.getElementById('report-close').addEventListener('click', fecharRelatorio);
reportOverlay.addEventListener('click', e => { if (e.target === reportOverlay) fecharRelatorio(); });

// ── Init ──────────────────────────────
loadGames();