// ─── DATA ───
const selectedVideos = {};
let selectedTeam = 'blue';
let currentTab = 0;

const videosData = [
  { id: 'v1', title: 'Emboscada no muro', dur: '0:18', cam: 'Câmera 2', price: 4.9 },
  { id: 'v2', title: 'Eliminação dupla', dur: '0:24', cam: 'Câmera 1', price: 4.9 },
  { id: 'v3', title: 'Sprint final', dur: '0:31', cam: 'Câmera 3', price: 4.9 },
  { id: 'v4', title: 'Defesa da base', dur: '0:12', cam: 'Câmera 4', price: 4.9 },
  { id: 'v5', title: 'Flanqueamento', dur: '0:27', cam: 'Câmera 2', price: 4.9 },
  { id: 'v6', title: 'Compilado Reels-ready', dur: '0:45', cam: 'Multi-câm', price: 9.9, featured: true },
];

const playersData = [
  { num: '01', name: 'Ana Souza', team: 'blue', aparicoes: 8, status: 'ok' },
  { num: '03', name: 'Rafael Lima', team: 'blue', aparicoes: 5, status: 'ok' },
  { num: '07', name: 'João Eduardo Freitas', team: 'blue', aparicoes: 12, status: 'ok' },
  { num: '09', name: 'Bianca Costa', team: 'blue', aparicoes: 7, status: 'ok' },
  { num: '11', name: 'Pedro Henrique', team: 'blue', aparicoes: 3, status: 'checking' },
  { num: '12', name: 'Carlos Melo', team: 'red', aparicoes: 5, status: 'checking' },
  { num: '15', name: 'Fernanda Alves', team: 'red', aparicoes: 9, status: 'ok' },
  { num: '18', name: 'Thiago Rocha', team: 'red', aparicoes: 4, status: 'ok' },
  { num: '19', name: 'Felipe Duarte', team: 'red', aparicoes: 2, status: 'error' },
  { num: '22', name: 'Marina Santos', team: 'red', aparicoes: 6, status: 'ok' },
];

// ─── NAVIGATION ───
function goTo(screenId, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
  if (btn) btn.classList.add('active');

  const titles = {
    's-cadastro': 'Cadastro do Jogador',
    's-partida': 'Partida ao Vivo',
    's-videos': 'Meus Vídeos',
    's-pagamento': 'Pagamento',
    's-operador': 'Painel do Operador',
    's-jogadores': 'Jogadores',
  };
  document.getElementById('page-title').textContent = titles[screenId] || '';

  if (screenId === 's-videos') renderVideoGrid();
  if (screenId === 's-pagamento') renderCart();
  if (screenId === 's-jogadores') renderPlayers('all');
  if (screenId === 's-partida') updatePartidaDisplay();

  document.querySelector('.content').style.animation = 'none';
  setTimeout(() => document.querySelector('.content').style.animation = 'fadeIn .2s ease', 10);
}

// ─── TEAM SELECT ───
function selectTeam(team) {
  selectedTeam = team;
  document.getElementById('btn-blue').className = 'team-btn' + (team === 'blue' ? ' selected-blue' : '');
  document.getElementById('btn-red').className = 'team-btn' + (team === 'red' ? ' selected-red' : '');
}

// ─── REGISTER ───
function confirmarCadastro() {
  const nome = document.getElementById('reg-nome').value.trim();
  const colete = document.getElementById('reg-colete').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  if (!nome || !colete) { showToast('⚠️', 'Preencha nome e número do colete!'); return; }
  document.getElementById('display-nome').textContent = nome.split(' ')[0];
  document.getElementById('display-colete').textContent = colete.padStart(2, '0');
  const timeEl = document.getElementById('display-time');
  timeEl.textContent = selectedTeam === 'blue' ? 'Time Azul' : 'Time Vermelho';
  timeEl.style.color = selectedTeam === 'blue' ? 'var(--blue-team)' : 'var(--red-team)';
  document.querySelector('.user-role').textContent = `Colete #${colete.padStart(2, '0')} · ${selectedTeam === 'blue' ? 'Time Azul' : 'Time Vermelho'}`;
  document.querySelector('.user-name').textContent = nome.split(' ')[0];
  showToast('✅', `Cadastro confirmado! Bem-vindo, ${nome.split(' ')[0]}!`);
  setTimeout(() => goTo('s-partida', document.querySelectorAll('.nav-item')[1]), 800);
}

function updatePartidaDisplay() {
  const nome = document.getElementById('reg-nome').value.trim();
  if (nome) document.getElementById('display-nome').textContent = nome.split(' ')[0];
}

// ─── VIDEOS ───
function renderVideoGrid() {
  const grid = document.getElementById('video-grid');
  grid.innerHTML = videosData.map(v => `
    <div class="video-card ${selectedVideos[v.id] ? 'selected' : ''}" onclick="toggleVideo(this, '${v.id}', ${v.price})">
      <div class="video-thumb">
        <div class="video-play">▶</div>
        <div class="video-tag">${v.dur} · ${v.cam}</div>
        ${v.featured ? `<div style="position:absolute;top:7px;left:7px;font-size:9px;background:rgba(232,255,60,0.2);color:var(--accent);padding:2px 7px;border-radius:4px;font-weight:600">REELS</div>` : ''}
        <div class="video-sel-check">✓</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-price">R$ ${v.price.toFixed(2).replace('.',',')}</div>
      </div>
    </div>
  `).join('');
}

function setVideoTab(i, btn) {
  [0,1,2].forEach(j => {
    document.getElementById('vtab-'+j).style.display = j === i ? 'block' : 'none';
  });
  document.querySelectorAll('#videos-tabs .tab').forEach((t,j) => t.classList.toggle('active-tab', j===i));
}

function toggleVideo(el, id, price) {
  if (selectedVideos[id]) {
    delete selectedVideos[id];
    el.classList.remove('selected');
  } else {
    selectedVideos[id] = price;
    el.classList.add('selected');
  }
  updateSelCount();
}

function updateSelCount() {
  const n = Object.keys(selectedVideos).length;
  const badge = document.getElementById('sel-count');
  const cartBadge = document.getElementById('cart-badge');
  if (n > 0) {
    badge.style.display = 'inline-flex';
    badge.textContent = n;
    cartBadge.style.display = 'inline-flex';
    cartBadge.textContent = `${n} selecionado${n > 1 ? 's' : ''}`;
  } else {
    badge.style.display = 'none';
    cartBadge.style.display = 'none';
  }
}

// ─── CART ───
function renderCart() {
  const list = document.getElementById('cart-list');
  const keys = Object.keys(selectedVideos);
  if (keys.length === 0) {
    list.innerHTML = `<div style="font-size:13px;color:var(--text3);text-align:center;padding:1rem 0">Nenhum vídeo selecionado ainda.<br><button class="btn btn-sm" style="margin-top:8px" onclick="goTo('s-videos', document.querySelectorAll('.nav-item')[2])">← Escolher vídeos</button></div>`;
    document.getElementById('cart-total').textContent = 'R$ 0,00';
    return;
  }

  const allVideos = [...videosData,
    { id: 'time-1', title: 'Highlight do Time Azul', price: 9.9 },
    { id: 'time-2', title: 'Tomada de bandeira', price: 4.9 },
    { id: 'time-3', title: 'Grito de vitória', price: 4.9 },
    { id: 'full-1', title: 'Partida completa #12', price: 29.9 },
  ];

  let total = 0;
  list.innerHTML = keys.map(id => {
    const v = allVideos.find(x => x.id === id);
    if (!v) return '';
    total += v.price;
    return `<div class="checkout-row">
      <span>🎬 ${v.title}</span>
      <span>R$ ${v.price.toFixed(2).replace('.',',')}</span>
    </div>`;
  }).join('');
  document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2).replace('.',',')}`;
}

// ─── PAY ───
function selectPay(method) {
  document.getElementById('pay-pix').classList.toggle('selected', method === 'pix');
  document.getElementById('pay-card').classList.toggle('selected', method === 'card');
  document.getElementById('pix-panel').style.display = method === 'pix' ? 'block' : 'none';
  document.getElementById('card-panel').style.display = method === 'card' ? 'block' : 'none';
  document.querySelectorAll('.pay-option input[type=radio]').forEach((r,i) => r.checked = (method==='pix' && i===0) || (method==='card' && i===1));
}

function pagarAgora() {
  const keys = Object.keys(selectedVideos);
  if (keys.length === 0) { showToast('⚠️', 'Selecione ao menos um vídeo!'); return; }
  showModal('modal-pagamento-ok');
}

function formatCard(el) {
  el.value = el.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim();
}

// ─── PLAYERS ───
function renderPlayers(filter) {
  let data = playersData;
  if (filter === 'blue') data = data.filter(p => p.team === 'blue');
  else if (filter === 'red') data = data.filter(p => p.team === 'red');
  else if (filter === 'error') data = data.filter(p => p.status !== 'ok');

  const list = document.getElementById('players-list');
  list.innerHTML = data.map(p => `
    <div class="player-row">
      <div class="player-num ${p.team === 'red' ? 'red' : ''}">${p.num}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">${p.name}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${p.team === 'blue' ? 'Time Azul' : 'Time Vermelho'} · ${p.aparicoes} aparições</div>
      </div>
      ${p.status === 'ok' ? '<span class="badge badge-green">✓ Identificado</span>'
        : p.status === 'checking' ? '<span class="badge badge-amber">⏳ Verificando</span>'
        : '<span class="badge badge-red">✗ Erro ID</span>'}
    </div>
  `).join('');
}

function filterPlayers(filter, btn) {
  document.querySelectorAll('#filter-btns .btn').forEach(b => {
    b.style.background = '';
    b.style.borderColor = '';
    b.style.color = '';
  });
  btn.style.background = 'var(--surface3)';
  btn.style.borderColor = 'rgba(255,255,255,0.2)';
  btn.style.color = 'var(--text)';
  renderPlayers(filter);
}

function addPlayer() {
  const name = document.getElementById('new-player-name').value.trim();
  const num = document.getElementById('new-player-num').value.trim();
  const team = document.getElementById('new-player-team').value;
  if (!name || !num) { showToast('⚠️', 'Preencha nome e número!'); return; }
  playersData.push({ num: num.padStart(2, '0'), name, team, aparicoes: 0, status: 'checking' });
  closeModal('modal-add-player');
  showToast('✅', `${name} adicionado(a)!`);
  renderPlayers('all');
  document.getElementById('new-player-name').value = '';
  document.getElementById('new-player-num').value = '';
}

// ─── OPERATOR ───
function resolverAlerta() {
  document.getElementById('alert-cam3').style.display = 'none';
  showToast('📡', 'Câmera 3 reconectada com sucesso!');
}

function encerrarPartida() {
  closeModal('modal-stop');
  showToast('⏹', 'Partida encerrada! Processando vídeos...');
}

// ─── TIMER ───
let totalSecs = 23 * 60 + 41;
function updateTimer() {
  if (totalSecs <= 0) return;
  totalSecs--;
  const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const s = (totalSecs % 60).toString().padStart(2, '0');
  const t = `${m}:${s}`;
  const td = document.getElementById('timer-display');
  const ot = document.getElementById('op-timer');
  const tb = document.querySelector('.topbar-actions .badge-red');
  if (td) td.textContent = t;
  if (ot) ot.textContent = t;
  if (tb) tb.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:var(--red-team);animation:pulse 1.5s infinite;display:inline-block"></span> Partida #12 · ${t} restantes`;
}
setInterval(updateTimer, 1000);

// ─── TOAST ───
let toastTimer;
function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── MODAL ───
function showModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── RESPONSIVE ───
if (window.innerWidth <= 700) {
  document.getElementById('menu-btn').style.display = 'inline-flex';
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', function() {
  renderVideoGrid();
  renderPlayers('all');
});
