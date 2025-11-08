const repo = require('../repositories/consultaRepository');
const profissionalRepo = require('../repositories/profissionalRepository');

const service = {
  list() {
    return repo.getAll();
  },

  listByCliente(clienteId) {
    const consultas = repo.getByClienteId(clienteId);
    return consultas.map(c => {
      const profissional = profissionalRepo.getById(c.profissionalId);
      return {
        id: c.id,
        medico: profissional?.nome || 'Médico não encontrado',
        especialidade: profissional?.especialidade || '',
        data: c.data,
        horario: c.horario,
        icone: 'check_circle'
      };
    });
  },

  get(id) {
    const item = repo.getById(id);
    if (!item) throw { status: 404, message: 'Consulta não encontrada' };
    return item;
  },

  formatDate(date) {
    return repo.formatDate(date);
  },

  nextAvailableDays(count = 21) {
    return repo.nextAvailableDays(count);
  },

  defaultTimeSlots() {
    return repo.defaultTimeSlots();
  },

  renderAgenda() {
    return repo.renderAgenda();
  },

  renderCalendar(doctor) {
    return repo.renderCalendar(doctor);
  },

  selectDate(element) {
    return repo.selectDate(element);
  },

  renderTimeSlots(date) {
    return repo.renderTimeSlots(date);
  },

  selectTime(element) {
    return repo.selectTime(element);
  }
};

module.exports = service;
