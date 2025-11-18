import repo from '../repositories/clienteRepository.js';

const service = {
  list() {
    return repo.getAll();
  },

  get(id) {
    const item = repo.getById(id);
    if (!item) throw { status: 404, message: 'Cliente não encontrado' };
    return item;
  },

  login(nome) {
    if (!nome) throw { status: 400, message: 'nome é obrigatório' };
    const cliente = repo.findByName(nome);
    if (!cliente) throw { status: 404, message: 'Cliente não encontrado' };
    return cliente;
  }
};

export default service;
