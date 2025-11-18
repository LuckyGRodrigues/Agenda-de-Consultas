import express from 'express';
const router = express.Router();
import path from 'path';
import session from 'express-session';
import simpleLogger from '../middlewares/simpleLogger.js';
import requireAuth from '../middlewares/requireAuth.js';
import clienteController from '../controllers/clienteController.js';
import profissionalController from '../controllers/profissionalController.js';
import consultaController from '../controllers/consultaController.js';

router.use(session({
    name: "session.id",
    secret: "segredo-super-segredo",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
}));

router.use(simpleLogger);

router.post('/login', clienteController.login);

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/check-auth', (req, res) => {
    if (req.session && req.session.clientId) {
        return res.json({ authenticated: true, clientId: req.session.clientId });
    }
    res.status(401).json({ authenticated: false });
});

router.get('/clientes', requireAuth, clienteController.list);
router.get('/clientes/:id', requireAuth, clienteController.getById);

router.get('/profissionais', requireAuth, profissionalController.list);
router.get('/profissionais/:id', requireAuth, profissionalController.getById);

router.get('/consultas', requireAuth, consultaController.list);
router.get('/consultas/:id', requireAuth, consultaController.getById);
router.get('/minhas-consultas', requireAuth, consultaController.listByCliente);

export default router;