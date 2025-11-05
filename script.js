const homeData = [
    {
        icon: 'star_rate',
        title: 'Avaliações',
        description: 'Veja o que nossos pacientes dizem sobre nosso atendimento',
        link: 'avaliacoes.html',
        buttonText: 'Ver Avaliações'
    },
    {
        icon: 'people',
        title: 'Médicos Especialistas',
        description: 'Profissionais altamente qualificados',
        link: 'medicos.html',
        buttonText: 'Ver Médicos'
    },
    {
        icon: 'support_agent',
        title: 'Suporte 24/7',
        description: 'Atendimento personalizado a qualquer hora',
        link: 'sobre-nos.html',
        buttonText: 'Saiba Mais'
    }
];

const doctors = [
    {
        name: "Drª Ana Silva",
        specialty: "Clínico-Geral",
        years: 8,
        icon: "female",
        availableDays: [1,2,3,4,5],
        rating: 4.8
    },
    {
        name: "Dr. Bruno Costa",
        specialty: "Clínico-Geral",
        years: 12,
        icon: "male",
        availableDays: [1,3,5],
        rating: 4.9
    },
    {
        name: "Drª Carla Menezes",
        specialty: "Clínico-Geral",
        years: 5,
        icon: "female",
        availableDays: [2,4],
        rating: 4.7
    }
];

const reviews = [
    {
        name: "Maria Silva",
        rating: 5,
        comment: "Excelente atendimento! Os médicos são muito atenciosos e profissionais.",
        date: "2023-10-15",
        doctor: "Drª Ana Silva",
        avatar: "female"
    },
    {
        name: "João Santos",
        rating: 4,
        comment: "Ótima clínica, profissionais competentes. Recomendo!",
        date: "2023-10-10",
        doctor: "Dr. Bruno Costa",
        avatar: "male"
    },
    {
        name: "Ana Paula",
        rating: 5,
        comment: "Muito satisfeita com o atendimento recebido. A Dra. Carla é excelente!",
        date: "2023-10-05",
        doctor: "Drª Carla Menezes",
        avatar: "female"
    }
];

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR');
}

function nextAvailableDays(count = 21) {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }
    return days;
}

function defaultTimeSlots() {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        if (hour < 17) {
            slots.push(`${String(hour).padStart(2, '0')}:30`);
        }
    }
    return slots;
}

function getAppointments() {
    try {
        return JSON.parse(localStorage.getItem('appointments') || '[]');
    } catch {
        return [];
    }
}

function saveAppointment(appointment) {
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function renderHome() {
    const container = document.getElementById('home-content');
    if (!container) return;

    container.innerHTML = homeData.map(item => `
        <div class="card">
            <span class="material-icons card-icon">${item.icon}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}" class="btn btn-primary">
                <span class="material-icons">${item.icon}</span>
                ${item.buttonText}
            </a>
        </div>
    `).join('');
}

function renderDoctors() {
    const container = document.getElementById('doctors-grid');
    if (!container) return;

    container.innerHTML = doctors.map(doctor => `
        <div class="card doctor-card">
            <span class="material-icons doctor-icon">${doctor.icon}</span>
            <h3>${doctor.name}</h3>
            <div class="doctor-info">
                <p class="specialty">${doctor.specialty} • ${doctor.years} anos de experiência</p>
                <p class="rating">Avaliação: ${'⭐'.repeat(Math.round(doctor.rating))}</p>
            </div>
            <button onclick="goToAgenda('${encodeURIComponent(doctor.name)}')" class="btn btn-primary">
                <span class="material-icons">event</span>
                Agendar Consulta
            </button>
        </div>
    `).join('');
}

function goToAgenda(doctorName) {
    window.location.href = `agenda.html?doctor=${doctorName}`;
}

function renderReviews() {
    const container = document.getElementById('reviews-grid');
    if (!container) return;

    container.innerHTML = reviews.map(review => `
        <div class="card review-card">
            <div class="review-header">
                <span class="material-icons avatar-icon">${review.avatar}</span>
                <div class="review-info">
                    <h3>${review.name}</h3>
                    <div class="review-meta">
                        <div class="rating">${'⭐'.repeat(review.rating)}</div>
                        <span class="muted">• ${new Date(review.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            </div>
            <p class="review-comment">"${review.comment}"</p>
            <div class="review-doctor">
                <span class="material-icons">medical_services</span>
                <span>Atendido por: ${review.doctor}</span>
            </div>
        </div>
    `).join('');
}

function renderAgenda() {
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

    renderCalendar(doctor);

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
}

function renderCalendar(doctor) {
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
                ${isAvailable ? 'onclick="selectDate(this)"' : ''}>
                <div class="date-num">${date.getDate()}/${date.getMonth() + 1}</div>
                <div class="weekday">${date.toLocaleDateString('pt-BR', {weekday: 'short'})}</div>
            </div>
        `;
    }).join('');
}

function selectDate(element) {
    document.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const date = element.dataset.date;
    renderTimeSlots(date);
    
    document.getElementById('selected-info').textContent = 
        `Data selecionada: ${formatDate(new Date(date))}. Escolha um horário.`;
}

function renderTimeSlots(date) {
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
             onclick="${!takenSlots.includes(time) ? 'selectTime(this)' : ''}"
             data-time="${time}">
            ${time}
        </div>
    `).join('');
}

function selectTime(element) {
    document.querySelectorAll('.slot').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const date = document.querySelector('.day.selected').dataset.date;
    const time = element.dataset.time;
    
    document.getElementById('selected-info').textContent = 
        `Selecionado: ${formatDate(new Date(date))} às ${time}`;
    
    document.getElementById('confirm-btn').disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        renderHome();
    } else if (path.includes('medicos.html')) {
        renderDoctors();
    } else if (path.includes('agenda.html')) {
        renderAgenda();
    } else if (path.includes('avaliacoes.html')) {
        renderReviews();
    }
});