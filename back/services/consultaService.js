const repo = require('../repositories/consultaRepository');

const service = {
  list() {
    return repo.getAll();
  },

  get(id) {
    const item = repo.getById(id);
    if (!item) throw { status: 404, message: 'Consulta não encontrada' };
    return item;
  }
};

module.exports = service;
