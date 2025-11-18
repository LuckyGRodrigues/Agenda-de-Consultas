import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes/app.js';
import * as db from './database.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

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
    db.init().catch(err => console.error('Erro ao inicializar o DB:', err));
});