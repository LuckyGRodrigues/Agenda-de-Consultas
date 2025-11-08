const service = require('../services/clienteService');

module.exports = {
  list(req, res) {
    try {
      res.status(200).json(service.list());
    } catch (err) {
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  getById(req, res) {
    try {
      const id = req.params.id;
      const item = service.get(id);
      res.status(200).json(item);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno' });
    }
  },
  
  login(req, res) {
    try {
      const nome = req.body?.nome;
      const cliente = service.login(nome);
      req.session.clientId = cliente.id;
      res.status(200).json({ message: 'logado', cliente });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Erro interno' });
    }
  }
};
