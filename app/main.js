// DompetKeluarga — main.js
// Boots the app: hash routing between the five pages and one delegated
// event layer for every control (month switcher, forms, edit/delete,
// budget edits, goal funding, CSV download, data reset).

const ROUTES = {
  '/': { title: 'Ringkasan', render: viewDashboard },
  '/transaksi': { title: 'Transaksi', render: viewTransactions },
  '/anggaran': { title: 'Anggaran', render: viewBudget },
  '/tujuan': { title: 'Tujuan Menabung', render: viewGoals },
  '/laporan': { title: 'Laporan', render: viewReport },
};

const NAV = [
  { path: '#/', label: 'Ringkasan' },
  { path: '#/transaksi', label: 'Transaksi' },
  { path: '#/anggaran', label: 'Anggaran' },
  { path: '#/tujuan', label: 'Tujuan Menabung' },
  { path: '#/laporan', label: 'Laporan' },
];

function currentRoute() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route];
  document.getElementById('app').innerHTML = view.render();
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + route);
  });
  document.title = 'DompetKeluarga — ' + view.title;
}

function downloadCsv() {
  const month = currentMonth();
  const rows = [['Tanggal', 'Keterangan', 'Kategori', 'Jenis', 'Jumlah (Rp)']];
  for (const t of monthTransactions(month)) {
    rows.push([t.date, t.desc, categoryName(t.category), t.type === 'income' ? 'Pemasukan' : 'Pengeluaran', String(t.amount)]);
  }
  const csv = rows.map((r) => r.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dompetkeluarga-' + month + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function handleClick(event) {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'set-month') {
    setMonth(el.dataset.month);
    render();
  } else if (action === 'tx-edit') {
    editingTxId = el.dataset.id;
    render();
    const form = document.getElementById('tx-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (action === 'tx-cancel-edit') {
    editingTxId = null;
    render();
  } else if (action === 'tx-delete') {
    const t = findTransaction(el.dataset.id);
    if (t && confirm('Hapus transaksi "' + t.desc + '" (' + rupiah(t.amount) + ')?')) {
      deleteTransaction(el.dataset.id);
      render();
    }
  } else if (action === 'goal-delete') {
    const g = state.goals.find((goal) => goal.id === el.dataset.id);
    if (g && confirm('Hapus tujuan menabung "' + g.name + '"?')) {
      deleteGoal(el.dataset.id);
      render();
    }
  } else if (action === 'reset-data') {
    if (confirm('Kembalikan semua data ke contoh Keluarga Santoso? Perubahan Anda akan hilang.')) {
      resetState();
      editingTxId = null;
      render();
    }
  } else if (action === 'download-csv') {
    downloadCsv();
  }
}

function handleSubmit(event) {
  const form = event.target;
  if (form.id === 'tx-form') {
    event.preventDefault();
    const data = new FormData(form);
    const id = data.get('tx-id');
    const tx = {
      date: String(data.get('tx-date')),
      desc: String(data.get('tx-desc')).trim(),
      type: String(data.get('tx-type')),
      category: String(data.get('tx-category')),
      amount: Math.max(1, Math.round(Number(data.get('tx-amount')) || 0)),
    };
    if (!tx.desc || !tx.amount) return;
    if (id) {
      updateTransaction(id, tx);
      editingTxId = null;
    } else {
      addTransaction(tx);
    }
    render();
  } else if (form.id === 'tx-filters') {
    event.preventDefault();
    const data = new FormData(form);
    txFilters = {
      type: String(data.get('f-type')),
      category: String(data.get('f-category')),
      keyword: String(data.get('f-keyword') || '').trim(),
    };
    render();
  } else if (form.id === 'goal-form') {
    event.preventDefault();
    const data = new FormData(form);
    addGoal(
      String(data.get('goal-name')).trim(),
      Number(data.get('goal-target')),
      String(data.get('goal-note') || '').trim(),
    );
    render();
  } else if (form.classList.contains('goal-add')) {
    event.preventDefault();
    const data = new FormData(form);
    addToGoal(form.dataset.id, Number(data.get('goal-amount')));
    render();
  } else if (form.classList.contains('budget-edit')) {
    event.preventDefault();
    const data = new FormData(form);
    setBudget(form.dataset.cat, Number(data.get('budget-amount')));
    render();
  }
}

function buildNav() {
  document.getElementById('main-nav').innerHTML = NAV.map((item) =>
    '<a class="nav-link" href="' + item.path + '">' + item.label + '</a>').join('');
}

document.addEventListener('click', handleClick);
document.addEventListener('submit', handleSubmit);
window.addEventListener('hashchange', render);
buildNav();
render();
