const repo = require('../repositories/profissionalRepository');

const service = {
  list() {
    return repo.getAll();
  },

  get(id) {
    const item = repo.getById(id);
    if (!item) throw { status: 404, message: 'Profissional não encontrado' };
    return item;
  }
};

module.exports = service;
