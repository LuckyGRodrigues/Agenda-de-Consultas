const repo = require('../repositories/consultaRepository');

const service = {
  list() {
    return repo.getAll();
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
