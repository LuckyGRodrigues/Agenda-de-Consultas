const repository = {
  profissionais: [
    {
      id: 1,
      name: "Drª Ana Silva",
      especialidade: "Clínico-Geral",
      expAnos: 8,
      icone: "female",
      disponibilidade: [1,2,3,4,5],
      avaliacao: 4.8
    },
    {
      id: 2,
      nome: "Dr. Bruno Costa",
      especialidade: "Clínico-Geral",
      expAnos: 12,
      icone: "male",
      disponibilidade: [1,3,5],
      avaliacao: 4.9
    },
    {
      id: 3,
      nome: "Drª Carla Menezes",
      especialidade: "Clínico-Geral",
      expAnos: 5,
      icone: "female",
      disponibilidade: [2,4],
      avaliacao: 4.7
    }
  ],

  getAll() {
    return this.profissionais;
  },

  getById(id) {
    return this.profissionais.find((p) => p.id == id) || null;
  },

  getQueryParam(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}

};

module.exports = repository;
