// DompetKeluarga — store.js
// Owns the app state: loads it from localStorage (key dompetkeluarga-v3),
// falls back to the sample data in data.js, and offers the small set of
// operations the views need: month switching, transaction CRUD, budget
// edits, goal funding, and the totals every page shows.

const STORAGE_KEY = 'dompetkeluarga-v3';

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.transactions && parsed.budgets && parsed.goals && parsed.month) {
        return parsed;
      }
    }
  } catch (err) {
    // Corrupt or unavailable storage: start from the sample data.
  }
  return sampleState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage full or blocked: the site keeps working in memory.
  }
}

function resetState() {
  state = sampleState();
  saveState();
}

function currentMonth() {
  return state.month;
}

function setMonth(month) {
  if (SAMPLE_MONTHS.includes(month)) {
    state.month = month;
    saveState();
  }
}

function monthTransactions(month) {
  const list = state.transactions[month] || [];
  return list.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

function monthTotals(month) {
  let income = 0;
  let expense = 0;
  for (const t of state.transactions[month] || []) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, savings: income - expense };
}

function categoryTotals(month) {
  const sums = {};
  for (const c of CATEGORIES) sums[c.id] = 0;
  for (const t of state.transactions[month] || []) {
    if (t.type === 'expense' && sums[t.category] !== undefined) sums[t.category] += t.amount;
  }
  return sums;
}

function categoryName(id) {
  if (id === 'gaji') return 'Pemasukan';
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.name : id;
}

function categoryColor(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.color : '#6b7280';
}

function categoryIcon(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.icon : '📦';
}

function addTransaction(tx) {
  const month = tx.date.slice(0, 7);
  if (!state.transactions[month]) state.transactions[month] = [];
  const id = 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  state.transactions[month].push({ id, ...tx });
  saveState();
  return id;
}

function updateTransaction(id, patch) {
  for (const month of Object.keys(state.transactions)) {
    const i = state.transactions[month].findIndex((t) => t.id === id);
    if (i !== -1) {
      state.transactions[month][i] = { ...state.transactions[month][i], ...patch };
      saveState();
      return true;
    }
  }
  return false;
}

function deleteTransaction(id) {
  for (const month of Object.keys(state.transactions)) {
    const i = state.transactions[month].findIndex((t) => t.id === id);
    if (i !== -1) {
      state.transactions[month].splice(i, 1);
      saveState();
      return true;
    }
  }
  return false;
}

function findTransaction(id) {
  for (const month of Object.keys(state.transactions)) {
    const found = state.transactions[month].find((t) => t.id === id);
    if (found) return found;
  }
  return null;
}

function setBudget(categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, Math.round(amount));
  saveState();
}

function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return false;
  goal.saved = Math.min(goal.target, goal.saved + Math.max(0, Math.round(amount)));
  saveState();
  return true;
}

function addGoal(name, target, note) {
  const id = 'g' + Date.now().toString(36);
  state.goals.push({ id, name, target: Math.max(1, Math.round(target)), saved: 0, note: note || '' });
  saveState();
  return id;
}

function deleteGoal(goalId) {
  const i = state.goals.findIndex((g) => g.id === goalId);
  if (i === -1) return false;
  state.goals.splice(i, 1);
  saveState();
  return true;
}

// Formatting helpers used by every view.
function rupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function shortRupiah(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000).toLocaleString('id-ID') + ' rb';
  return rupiah(n);
}

function formatDate(iso) {
  const parts = iso.split('-');
  const day = Number(parts[2]);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return day + ' ' + monthNames[Number(parts[1]) - 1] + ' ' + parts[0];
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
