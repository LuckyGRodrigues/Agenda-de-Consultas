const repository = {
  profissionais: [
    { id: 1, nome: 'Dr. Silva', especialidade: 'Cardiologia' },
    { id: 2, nome: 'Dra. Souza', especialidade: 'Dermatologia' }
  ],

  getAll() {
    return this.profissionais;
  },

  getById(id) {
    return this.profissionais.find((p) => p.id == id) || null;
  }
};

module.exports = repository;
