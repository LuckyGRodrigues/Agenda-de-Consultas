const service = require('../services/profissionalService');

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
  }
};
