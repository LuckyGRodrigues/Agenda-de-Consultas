const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const routes = require('./routes/app');
app.use('/', routes);

app.use((req, res, next) => {
    const paginasProtegidas = ['/medicos.html', '/agenda.html'];
    if (paginasProtegidas.includes(req.path)) {
        return res.status(404).json({ error: 'Página não encontrada' });
    }
    next();
});

app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});