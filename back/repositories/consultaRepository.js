const repository = {
  consultas: [
    { id: 1, clienteId: 1, profissionalId: 1, data: '2025-11-15T14:00', descricao: 'Consulta de rotina' },
    { id: 2, clienteId: 2, profissionalId: 2, data: '2025-11-20T10:00', descricao: 'Retorno de exame' },
    { id: 3, clienteId: 3, profissionalId: 3, data: '2025-12-10T15:00', descricao: 'Consulta de rotina' }
  ],

  getAll() {
    return this.consultas;
  },

  getById(id) {
    return this.consultas.find(c => c.id == id) || null;
  },

  formatDate(date) {
      return date.toLocaleDateString('pt-BR');
  },

  nextAvailableDays(count = 21) {
      const days = [];
      const today = new Date();
      for (let i = 0; i < count; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          days.push(date);
      }
      return days;
  },

  defaultTimeSlots() {
      const slots = [];
      for (let hour = 8; hour <= 17; hour++) {
          slots.push(`${String(hour).padStart(2, '0')}:00`);
          if (hour < 17) {
              slots.push(`${String(hour).padStart(2, '0')}:30`);
          }
      }
      return slots;
  },

  renderAgenda() {
    const doctorName = decodeURIComponent(getQueryParam('doctor') || '');
    const doctor = doctors.find(d => d.name === doctorName);
    
    if (!doctor) return;

    const doctorInfo = document.getElementById('doctor-info');
    if (doctorInfo) {
      doctorInfo.innerHTML = `
        <div class="doctor-card">
          <span class="material-icons doctor-icon">${doctor.icon}</span>
          <h3>${doctor.name}</h3>
          <p class="muted">${doctor.specialty} • ${doctor.years} anos</p>
        </div>
      `;
    }

    this.renderCalendar(doctor);

    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const selectedDate = document.querySelector('.day.selected')?.dataset.date;
        const selectedTime = document.querySelector('.slot.selected')?.dataset.time;
        
        if (!selectedDate || !selectedTime) return;

        const appointment = {
          doctor: doctor.name,
          date: selectedDate,
          time: selectedTime,
          createdAt: new Date().toISOString()
        };

        saveAppointment(appointment);
        alert('Consulta agendada com sucesso!');
        window.location.href = 'medicos.html';
      });
    }
  },

  renderCalendar(doctor) {
    const daysGrid = document.getElementById('days');
    if (!daysGrid) return;

    const days = nextAvailableDays();
    daysGrid.innerHTML = days.map(date => {
      const dayOfWeek = date.getDay();
      const isAvailable = doctor.availableDays.includes(dayOfWeek);
      const dateStr = date.toISOString().split('T')[0];
      
      return `
        <div class="day ${isAvailable ? '' : 'disabled'}"
             data-date="${dateStr}"
             ${isAvailable ? 'onclick="repository.selectDate(this)"' : ''}>
          <div class="date-num">${date.getDate()}/${date.getMonth() + 1}</div>
          <div class="weekday">${date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
        </div>
      `;
    }).join('');
  },

  selectDate(element) {
    document.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const date = element.dataset.date;
    this.renderTimeSlots(date);
    
    document.getElementById('selected-info').textContent = 
      `Data selecionada: ${formatDate(new Date(date))}. Escolha um horário.`;
  },

  renderTimeSlots(date) {
    const slotsContainer = document.getElementById('slots');
    if (!slotsContainer) return;

    const appointments = getAppointments();
    const doctorName = decodeURIComponent(getQueryParam('doctor') || '');
    
    const takenSlots = appointments
      .filter(a => a.date === date && a.doctor === doctorName)
      .map(a => a.time);

    const slots = defaultTimeSlots();
    slotsContainer.innerHTML = slots.map(time => `
      <div class="slot ${takenSlots.includes(time) ? 'taken' : ''}"
           onclick="${!takenSlots.includes(time) ? 'repository.selectTime(this)' : ''}"
           data-time="${time}">
        ${time}
      </div>
    `).join('');
  },

  selectTime(element) {
    document.querySelectorAll('.slot').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const date = document.querySelector('.day.selected').dataset.date;
    const time = element.dataset.time;
    
    document.getElementById('selected-info').textContent = 
      `Selecionado: ${formatDate(new Date(date))} às ${time}`;
    
    document.getElementById('confirm-btn').disabled = false;
  }
};

module.exports = repository;
