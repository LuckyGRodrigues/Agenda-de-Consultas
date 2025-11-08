const repository = {
  consultas: [
    { 
      id: 1, 
      clienteId: 1, 
      profissionalId: 1, 
      data: '2025-11-10', 
      horario: '10:00',
      descricao: 'Consulta de rotina' 
    },
    { 
      id: 2, 
      clienteId: 1, 
      profissionalId: 3, 
      data: '2025-11-15', 
      horario: '14:30',
      descricao: 'Retorno de exame' 
    },
    { 
      id: 3, 
      clienteId: 2, 
      profissionalId: 2, 
      data: '2025-11-20', 
      horario: '09:00',
      descricao: 'Consulta de rotina' 
    },
    { 
      id: 4, 
      clienteId: 2, 
      profissionalId: 1, 
      data: '2025-11-25', 
      horario: '11:00',
      descricao: 'Check-up geral' 
    },
    { 
      id: 5, 
      clienteId: 3, 
      profissionalId: 3, 
      data: '2025-11-12', 
      horario: '15:00',
      descricao: 'Primeira consulta' 
    }
  ],

  getAll() {
    return this.consultas;
  },

  getByClienteId(clienteId) {
    return this.consultas.filter(c => c.clienteId == clienteId);
  },

  getById(id) {
    return this.consultas.find(c => c.id == id) || null;
  },
};

module.exports = repository;
