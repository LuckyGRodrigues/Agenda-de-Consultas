const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const simpleLogger = require('../middlewares/simpleLogger');
const requireAuth = require('../middlewares/requireAuth');
const clienteController = require('../controllers/clienteController');
const profissionalController = require('../controllers/profissionalController');
const consultaController = require('../controllers/consultaController');

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

module.exports = router;