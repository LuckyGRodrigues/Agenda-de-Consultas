const express = require('express');
const router = express.Router();
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

router.get('/', (req, res) => res.status(200).json({ message: 'Olá, backend com Node.js!' }));

router.post('/login', clienteController.login);

router.get('/clientes', requireAuth, clienteController.list);
router.get('/clientes/:id', requireAuth, clienteController.getById);

router.get('/profissionais', requireAuth, profissionalController.list);
router.get('/profissionais/:id', requireAuth, profissionalController.getById);

router.get('/consultas', requireAuth, consultaController.list);
router.get('/consultas/:id', requireAuth, consultaController.getById);

module.exports = router;