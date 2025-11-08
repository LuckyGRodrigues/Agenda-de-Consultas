(function() {
    const protegidas = ['medicos.html', 'agenda.html', 'consultas.html'];
    const pagina = location.pathname.split('/').pop();
    
    if (protegidas.includes(pagina)) {
        document.documentElement.style.visibility = 'hidden';
        
        fetch('http://localhost:3000/check-auth', { credentials: 'include' })
            .then(res => res.json())
            .then(data => data.authenticated ? document.documentElement.style.visibility = 'visible' : location.replace('/404-not-found'))
            .catch(() => location.replace('/404-not-found'));
    }
})();

async function handleLogout() {
    try {
        await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

const homeData = [
  {
    icon: 'medical_services',
    title: 'Minhas Consultas',
    description: 'Verifique suas consultas agendadas',
    link: 'consultas.html',
    buttonText: 'Ver consultas'
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
    link: 'contato.html',
    buttonText: 'Saiba Mais'
  }
];

let doctors = [];
let consultas = [];

async function carregarMedicos() {
  try {
    const res = await fetch('http://localhost:3000/profissionais', { credentials: 'include' });
    doctors = await res.json();
  } catch (error) {
    console.error('Erro ao carregar médicos:', error);
    doctors = [];
  }
}

async function carregarConsultas() {
  try {
    const res = await fetch('http://localhost:3000/minhas-consultas', { credentials: 'include' });
    consultas = await res.json();
  } catch (error) {
    console.error('Erro ao carregar consultas:', error);
    consultas = [];
  }
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatarData(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function diasDisponiveis(qtd = 21) {
  const dias = [];
  const hoje = new Date();
  for (let i = 0; i < qtd; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    dias.push(data);
  }
  return dias;
}

function horariosPadrao() {
  const slots = [];
  for (let hora = 8; hora <= 17; hora++) {
    slots.push(`${String(hora).padStart(2, '0')}:00`);
    if (hora < 17) slots.push(`${String(hora).padStart(2, '0')}:30`);
  }
  return slots;
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

async function renderDoctors() {
  const container = document.getElementById('doctors-grid');
  if (!container) return;

  await carregarMedicos();

  container.innerHTML = doctors.map(doctor => `
    <div class="card doctor-card">
      <span class="material-icons doctor-icon">${doctor.icon}</span>
      <h3>${doctor.nome}</h3>
      <div class="doctor-info">
        <p class="specialty">${doctor.especialidade} • ${doctor.expAnos} anos de experiência</p>
      </div>
      <button onclick="irParaAgenda('${encodeURIComponent(doctor.nome)}')" class="btn btn-primary">
        <span class="material-icons">event</span>
        Agendar Consulta
      </button>
    </div>
  `).join('');
}

function irParaAgenda(nomeMedico) {
  window.location.href = `agenda.html?doctor=${nomeMedico}`;
}

async function renderAgenda() {
  await carregarMedicos();
  
  const nomeMedico = decodeURIComponent(getQueryParam('doctor') || '');
  const medico = doctors.find(d => d.nome === nomeMedico);
  if (!medico) return;

  const infoMedico = document.getElementById('doctor-info');
  if (infoMedico) {
    infoMedico.innerHTML = `
      <div class="doctor-card">
        <span class="material-icons doctor-icon">${medico.icon}</span>
        <h3>${medico.nome}</h3>
        <p class="muted">${medico.especialidade} • ${medico.expAnos} anos</p>
      </div>
    `;
  }

  renderCalendario(medico);

  const botaoConfirmar = document.getElementById('confirm-btn');
  if (botaoConfirmar) {
    botaoConfirmar.addEventListener('click', () => {
      const dataSelecionada = document.querySelector('.day.selected')?.dataset.date;
      const horarioSelecionado = document.querySelector('.slot.selected')?.dataset.time;

      if (!dataSelecionada || !horarioSelecionado) return;

      alert('Consulta agendada com sucesso!');
      window.location.href = 'consultas.html';
    });
  }
}

function renderCalendario(medico) {
  const diasGrid = document.getElementById('days');
  if (!diasGrid) return;

  const dias = diasDisponiveis();
  diasGrid.innerHTML = dias.map(data => {
    const diaSemana = data.getDay();
    const disponivel = medico.disponibilidade.includes(diaSemana);
    const dataStr = data.toISOString().split('T')[0];

    return `
      <div class="day ${disponivel ? '' : 'disabled'}"
           data-date="${dataStr}"
           ${disponivel ? 'onclick="selecionarDia(this)"' : ''}>
        <div class="date-num">${data.getDate()}/${data.getMonth() + 1}</div>
        <div class="weekday">${data.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
      </div>
    `;
  }).join('');
}

function selecionarDia(elemento) {
  document.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
  elemento.classList.add('selected');

  const data = elemento.dataset.date;
  renderHorarios(data);

  document.getElementById('selected-info').textContent =
    `Data selecionada: ${formatarData(data)}. Escolha um horário.`;
}

function renderHorarios(data) {
  const containerSlots = document.getElementById('slots');
  if (!containerSlots) return;

  const horarios = horariosPadrao();
  containerSlots.innerHTML = horarios.map(hora => `
    <div class="slot" onclick="selecionarHorario(this)" data-time="${hora}">
      ${hora}
    </div>
  `).join('');
}

function selecionarHorario(elemento) {
  document.querySelectorAll('.slot').forEach(el => el.classList.remove('selected'));
  elemento.classList.add('selected');

  const data = document.querySelector('.day.selected').dataset.date;
  const hora = elemento.dataset.time;

  document.getElementById('selected-info').textContent =
    `Selecionado: ${formatarData(data)} às ${hora}`;

  document.getElementById('confirm-btn').disabled = false;
}

async function renderConsultas() {
  const container = document.getElementById('lista-consultas');
  if (!container) return;

  await carregarConsultas();

  if (!consultas.length) {
    container.innerHTML = `
      <div class="mensagem-vazia">
        <span class="material-icons">event_busy</span>
        <p>Nenhuma consulta agendada no momento.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = consultas.map(c => `
    <div class="consulta-card">
      <span class="material-icons consulta-icone">${c.icone}</span>
      <div class="consulta-info">
        <h3>${c.medico}</h3>
        <p>${c.especialidade}</p>
        <p>📅 ${formatarData(c.data)} • 🕒 ${c.horario}</p>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('index.html') || path.endsWith('/')) {
    renderHome();
  } else if (path.includes('medicos.html')) {
    renderDoctors();
  } else if (path.includes('agenda.html')) {
    renderAgenda();
  } else if (path.includes('consultas.html')) {
    renderConsultas();
  }
});
