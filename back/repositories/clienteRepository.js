const repository = {
  clientes: [
    { id: 1, nome: 'Cliente A', telefone: '1111-1111' },
    { id: 2, nome: 'Cliente B', telefone: '2222-2222' }
  ],

  getAll() {
    return this.clientes;
  },

  getById(id) {
    return this.clientes.find((c) => c.id == id) || null;
  },
  
  findByName(nome) {
    return this.clientes.find((c) => c.nome === nome) || null;
  }
};

module.exports = repository;
