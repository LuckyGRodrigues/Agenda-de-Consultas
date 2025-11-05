const repository = {
  consultas: [
    { id: 1, clienteId: 1, profissionalId: 1, data: '2025-11-10T10:00:00Z', descricao: 'Consulta de rotina' },
    { id: 2, clienteId: 2, profissionalId: 2, data: '2025-11-12T14:30:00Z', descricao: 'Acompanhamento' }
  ],

  getAll() {
    return this.consultas;
  },

  getById(id) {
    return this.consultas.find((c) => c.id == id) || null;
  }
};

module.exports = repository;
