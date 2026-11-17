const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════
//  JOGOS
// ══════════════════════════════════════════

// GET /api/jogos?nome=&sort=titulo&order=asc&page=1
app.get('/api/jogos', async (req, res) => {
    try {
        const { nome, sort, order, page } = req.query;
        const LIMIT = 6;
        const paginaAtual = Math.max(parseInt(page) || 1, 1);
        const offset = (paginaAtual - 1) * LIMIT;

        const camposPermitidos = ['titulo', 'nota', 'ano_lancamento', 'genero', 'desenvolvedora', 'id'];
        const sortBy = camposPermitidos.includes(sort) ? sort : 'id';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

        const params = [];
        let where = '';
        if (nome && nome.trim()) {
            params.push(`%${nome.trim()}%`);
            where = `WHERE titulo ILIKE $1`;
        }

        const countResult = await pool.query(`SELECT COUNT(*) FROM jogos ${where}`, params);
        const total = parseInt(countResult.rows[0].count);

        const dataResult = await pool.query(
            `SELECT * FROM jogos ${where}
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
            [...params, LIMIT, offset]
        );

        res.json({
            jogos: dataResult.rows,
            total,
            paginas: Math.ceil(total / LIMIT) || 1,
            pagina: paginaAtual,
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// GET /api/jogos/:id
app.get('/api/jogos/:id', async (req, res) => {
    try {
        const r = await pool.query('SELECT * FROM jogos WHERE id = $1', [req.params.id]);
        if (r.rows.length === 0) return res.status(404).json({ erro: 'Jogo não encontrado.' });
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST /api/jogos
app.post('/api/jogos', async (req, res) => {
    const { titulo, genero, plataforma, desenvolvedora, ano_lancamento, nota, descricao } = req.body;
    if (!titulo || !genero || !plataforma || !desenvolvedora || !ano_lancamento || !nota)
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    try {
        const r = await pool.query(
            'INSERT INTO jogos (titulo, genero, plataforma, desenvolvedora, ano_lancamento, nota, descricao) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [titulo, genero, plataforma, desenvolvedora, ano_lancamento, nota, descricao]
        );
        res.status(201).json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// PUT /api/jogos/:id
app.put('/api/jogos/:id', async (req, res) => {
    const { titulo, genero, plataforma, desenvolvedora, ano_lancamento, nota, descricao } = req.body;
    if (!titulo || !genero || !plataforma || !desenvolvedora || !ano_lancamento || !nota)
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    try {
        const r = await pool.query(
            'UPDATE jogos SET titulo=$1, genero=$2, plataforma=$3, desenvolvedora=$4, ano_lancamento=$5, nota=$6, descricao=$7 WHERE id=$8 RETURNING *',
            [titulo, genero, plataforma, desenvolvedora, ano_lancamento, nota, descricao, req.params.id]
        );
        if (r.rows.length === 0) return res.status(404).json({ erro: 'Jogo não encontrado.' });
        res.json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// DELETE /api/jogos/:id
app.delete('/api/jogos/:id', async (req, res) => {
    try {
        const r = await pool.query('DELETE FROM jogos WHERE id=$1 RETURNING *', [req.params.id]);
        if (r.rows.length === 0) return res.status(404).json({ erro: 'Jogo não encontrado.' });
        res.json({ mensagem: 'Jogo excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ══════════════════════════════════════════
//  AVALIAÇÕES
// ══════════════════════════════════════════

// GET /api/jogos/:id/avaliacoes
app.get('/api/jogos/:id/avaliacoes', async (req, res) => {
    try {
        const r = await pool.query(
            'SELECT * FROM avaliacoes WHERE jogo_id=$1 ORDER BY criado_em DESC',
            [req.params.id]
        );
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST /api/jogos/:id/avaliacoes
app.post('/api/jogos/:id/avaliacoes', async (req, res) => {
    const { autor, nota, comentario } = req.body;
    if (!autor || !nota)
        return res.status(400).json({ erro: 'Autor e nota são obrigatórios.' });
    try {
        const r = await pool.query(
            'INSERT INTO avaliacoes (jogo_id, autor, nota, comentario) VALUES ($1,$2,$3,$4) RETURNING *',
            [req.params.id, autor, nota, comentario]
        );
        res.status(201).json(r.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// DELETE /api/avaliacoes/:id
app.delete('/api/avaliacoes/:id', async (req, res) => {
    try {
        const r = await pool.query('DELETE FROM avaliacoes WHERE id=$1 RETURNING *', [req.params.id]);
        if (r.rows.length === 0) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
        res.json({ mensagem: 'Avaliação excluída.' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ══════════════════════════════════════════
//  RELATÓRIO
// ══════════════════════════════════════════

// GET /api/relatorio/generos
app.get('/api/relatorio/generos', async (req, res) => {
    try {
        const r = await pool.query(`
      SELECT genero,
             COUNT(*)::int        AS total,
             ROUND(AVG(nota), 1)  AS media_nota
      FROM jogos
      GROUP BY genero
      ORDER BY total DESC, media_nota DESC
    `);
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🎮 GameShelf rodando em http://localhost:${PORT}`));