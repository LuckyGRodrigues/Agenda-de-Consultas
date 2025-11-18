const repository = {
  clientes: [
    { id: 1, nome: 'Ana Souza', telefone: '9095-0546' },
    { id: 2, nome: 'Carlos Oliveira', telefone: '3742-8650' },
    { id: 3, nome: 'Mariana Costa', telefone: '4750-9800' }
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

export default repository;
