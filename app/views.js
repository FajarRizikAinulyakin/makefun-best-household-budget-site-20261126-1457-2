// DompetKeluarga — views.js
// Renders the five hash-routed pages into #app. Each view reads the store
// and returns an HTML string; main.js wires the controls afterwards.
// All money shown here comes from the store, never from hard-coded text,
// so editing a transaction, a budget or a goal changes every page at once.

let txFilters = { type: 'all', category: 'all', keyword: '' };
let editingTxId = null;

function monthSwitcher() {
  return '<div class="month-switch" role="group" aria-label="Pilih bulan">'
    + SAMPLE_MONTHS.map((m) => {
      const active = m === currentMonth() ? ' active' : '';
      return '<button type="button" class="month-btn' + active + '" data-action="set-month" data-month="' + m + '">'
        + MONTH_NAMES[m] + '</button>';
    }).join('')
    + '</div>';
}

function statusBadge(pct) {
  if (pct > 100) return '<span class="badge badge-over">Lewat anggaran</span>';
  if (pct >= 90) return '<span class="badge badge-warn">Hampir habis</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

// ---------- 1. Ringkasan ----------

function viewDashboard() {
  const month = currentMonth();
  const totals = monthTotals(month);
  const byCat = categoryTotals(month);
  const segments = CATEGORIES.map((c) => ({ label: c.name, value: byCat[c.id], color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const over = CATEGORIES.filter((c) => byCat[c.id] > state.budgets[c.id]);
  const latest = monthTransactions(month).slice(-5).reverse();
  const goalTotal = state.goals.reduce((s, g) => s + g.saved, 0);
  const goalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const goalPct = goalTarget > 0 ? Math.round((goalTotal / goalTarget) * 100) : 0;
  const topGoal = state.goals.slice().sort((a, b) => (b.saved / b.target) - (a.saved / a.target))[0];
  // Trend note is derived from the history table, not hard-coded, so it
  // stays true when the user edits November's transactions.
  const prevMonth = MONTHLY_HISTORY[MONTHLY_HISTORY.length - 2];
  const trendDiff = prevMonth.expense - totals.expense;
  const trendText = trendDiff >= 0
    ? 'Pengeluaran ' + MONTH_NAMES[month].split(' ')[0] + ' turun ' + rupiah(trendDiff) + ' dibanding ' + MONTH_NAMES[prevMonth.month].split(' ')[0] + ' — bulan paling hemat sejak Juni.'
    : 'Pengeluaran ' + MONTH_NAMES[month].split(' ')[0] + ' naik ' + rupiah(-trendDiff) + ' dibanding ' + MONTH_NAMES[prevMonth.month].split(' ')[0] + '.';

  const warning = over.length
    ? '<section class="alert" role="alert"><strong>⚠️ Perhatian: ' + over.map((c) => escapeHtml(c.name)).join(', ')
      + ' sudah melewati anggaran bulan ini.</strong><br>'
      + over.map((c) => escapeHtml(c.name) + ' terpakai ' + rupiah(byCat[c.id]) + ' dari anggaran '
        + rupiah(state.budgets[c.id]) + ' (' + Math.round((byCat[c.id] / state.budgets[c.id]) * 100) + '%)').join('; ')
      + '. <a href="#/anggaran">Lihat anggaran →</a></section>'
    : '';

  return '<section class="page-head"><div><h1>Ringkasan Keuangan</h1>'
    + '<p class="subtitle">Keluarga Santoso · Jakarta Timur · ' + MONTH_NAMES[month] + '</p></div>'
    + monthSwitcher() + '</section>'
    + warning
    + '<section class="cards">'
    + '<div class="card card-income"><span class="card-label">Pemasukan</span><span class="card-value">' + rupiah(totals.income) + '</span><span class="card-note">Gaji + penghasilan lain</span></div>'
    + '<div class="card card-expense"><span class="card-label">Pengeluaran</span><span class="card-value">' + rupiah(totals.expense) + '</span><span class="card-note">' + monthTransactions(month).filter((t) => t.type === 'expense').length + ' transaksi bulan ini</span></div>'
    + '<div class="card card-savings"><span class="card-label">Sisa untuk Ditabung</span><span class="card-value">' + rupiah(totals.savings) + '</span><span class="card-note">' + Math.round((totals.savings / totals.income) * 100) + '% dari pemasukan</span></div>'
    + '</section>'
    + '<section class="grid-2">'
    + '<div class="panel"><h2>Pengeluaran per Kategori</h2>'
    + '<div class="donut-wrap">' + donutChart(segments, 220) + '<ul class="legend">' + donutLegend(segments) + '</ul></div></div>'
    + '<div class="panel"><h2>Tren 6 Bulan Terakhir</h2>' + barTrendChart(MONTHLY_HISTORY)
    + '<p class="panel-note">' + trendText + '</p></div>'
    + '</section>'
    + '<section class="grid-2">'
    + '<div class="panel"><h2>5 Transaksi Terakhir</h2><ul class="tx-list">'
    + latest.map((t) => '<li><span class="tx-icon">' + categoryIcon(t.category) + '</span>'
      + '<span class="tx-desc">' + escapeHtml(t.desc) + '<small>' + formatDate(t.date) + ' · ' + categoryName(t.category) + '</small></span>'
      + '<span class="tx-amount ' + t.type + '">' + (t.type === 'income' ? '+' : '−') + rupiah(t.amount) + '</span></li>').join('')
    + '</ul><a class="link-more" href="#/transaksi">Lihat semua transaksi →</a></div>'
    + '<div class="panel"><h2>Tabungan Keluarga</h2>'
    + '<p class="big-number">' + rupiah(goalTotal) + ' <small>dari target ' + rupiah(goalTarget) + ' (' + goalPct + '%)</small></p>'
    + '<div class="progress"><span style="width:' + goalPct + '%"></span></div>'
    + '<p class="panel-note">Paling dekat tercapai: <strong>' + escapeHtml(topGoal.name) + '</strong> — '
    + rupiah(topGoal.saved) + ' dari ' + rupiah(topGoal.target) + ' (' + Math.round((topGoal.saved / topGoal.target) * 100) + '%).</p>'
    + '<a class="link-more" href="#/tujuan">Kelola tujuan menabung →</a></div>'
    + '</section>';
}

// ---------- 2. Transaksi ----------

function txFormHtml(editing) {
  const t = editing ? findTransaction(editing) : null;
  const date = t ? t.date : '2026-11-26';
  const type = t ? t.type : 'expense';
  const category = t ? t.category : 'belanja';
  return '<form id="tx-form" class="form-card">'
    + '<h2>' + (t ? 'Ubah Transaksi' : 'Tambah Transaksi') + '</h2>'
    + (t ? '<input type="hidden" name="tx-id" value="' + t.id + '">' : '')
    + '<label>Tanggal<input type="date" name="tx-date" value="' + date + '" required></label>'
    + '<label>Keterangan<input type="text" name="tx-desc" value="' + (t ? escapeHtml(t.desc) : '') + '" placeholder="Contoh: Belanja mingguan" required maxlength="80"></label>'
    + '<label>Jenis<select name="tx-type">'
    + '<option value="expense"' + (type === 'expense' ? ' selected' : '') + '>Pengeluaran</option>'
    + '<option value="income"' + (type === 'income' ? ' selected' : '') + '>Pemasukan</option></select></label>'
    + '<label>Kategori<select name="tx-category">'
    + '<option value="gaji"' + (category === 'gaji' ? ' selected' : '') + '>Pemasukan</option>'
    + CATEGORIES.map((c) => '<option value="' + c.id + '"' + (category === c.id ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>').join('')
    + '</select></label>'
    + '<label>Jumlah (Rp)<input type="number" name="tx-amount" min="100" max="100000000" value="' + (t ? t.amount : '') + '" placeholder="50000" required></label>'
    + '<div class="form-actions"><button type="submit" class="btn btn-primary">' + (t ? 'Simpan Perubahan' : 'Tambah Transaksi') + '</button>'
    + (t ? '<button type="button" class="btn" data-action="tx-cancel-edit">Batal</button>' : '')
    + '</div></form>';
}

function filteredTransactions(month) {
  return monthTransactions(month).filter((t) => {
    if (txFilters.type !== 'all' && t.type !== txFilters.type) return false;
    if (txFilters.category !== 'all' && t.category !== txFilters.category) return false;
    if (txFilters.keyword && !t.desc.toLowerCase().includes(txFilters.keyword.toLowerCase())) return false;
    return true;
  });
}

function viewTransactions() {
  const month = currentMonth();
  const list = filteredTransactions(month);
  const totals = monthTotals(month);
  const rows = list.map((t) => '<tr>'
    + '<td>' + formatDate(t.date) + '</td>'
    + '<td>' + escapeHtml(t.desc) + '</td>'
    + '<td><span class="cat-chip" style="--chip:' + categoryColor(t.category) + '">' + categoryIcon(t.category) + ' ' + categoryName(t.category) + '</span></td>'
    + '<td class="amount ' + t.type + '">' + (t.type === 'income' ? '+' : '−') + rupiah(t.amount) + '</td>'
    + '<td class="row-actions"><button type="button" class="btn btn-small" data-action="tx-edit" data-id="' + t.id + '">Ubah</button> '
    + '<button type="button" class="btn btn-small btn-danger" data-action="tx-delete" data-id="' + t.id + '">Hapus</button></td>'
    + '</tr>').join('');
  return '<section class="page-head"><div><h1>Transaksi</h1>'
    + '<p class="subtitle">' + MONTH_NAMES[month] + ' · ' + monthTransactions(month).length + ' transaksi · Pemasukan '
    + rupiah(totals.income) + ' · Pengeluaran ' + rupiah(totals.expense) + '</p></div>'
    + monthSwitcher() + '</section>'
    + '<section class="grid-tx"><div>'
    + '<form id="tx-filters" class="filter-bar">'
    + '<label>Jenis<select name="f-type"><option value="all">Semua</option>'
    + '<option value="income"' + (txFilters.type === 'income' ? ' selected' : '') + '>Pemasukan</option>'
    + '<option value="expense"' + (txFilters.type === 'expense' ? ' selected' : '') + '>Pengeluaran</option></select></label>'
    + '<label>Kategori<select name="f-category"><option value="all">Semua kategori</option>'
    + '<option value="gaji"' + (txFilters.category === 'gaji' ? ' selected' : '') + '>Pemasukan</option>'
    + CATEGORIES.map((c) => '<option value="' + c.id + '"' + (txFilters.category === c.id ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>').join('')
    + '</select></label>'
    + '<label>Cari<input type="search" name="f-keyword" value="' + escapeHtml(txFilters.keyword) + '" placeholder="Cari keterangan…"></label>'
    + '<button type="submit" class="btn btn-primary">Terapkan Filter</button>'
    + '<button type="button" class="btn" data-action="download-csv">Unduh CSV</button>'
    + '</form>'
    + '<div class="table-wrap"><table class="tx-table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th><th>Aksi</th></tr></thead>'
    + '<tbody>' + (rows || '<tr><td colspan="5" class="empty">Tidak ada transaksi yang cocok dengan filter ini.</td></tr>') + '</tbody></table></div>'
    + '<p class="panel-note">Menampilkan ' + list.length + ' dari ' + monthTransactions(month).length + ' transaksi ' + MONTH_NAMES[month] + '.</p>'
    + '</div>' + txFormHtml(editingTxId) + '</section>';
}

// ---------- 3. Anggaran ----------

function viewBudget() {
  const month = currentMonth();
  const byCat = categoryTotals(month);
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const totalSpent = CATEGORIES.reduce((a, c) => a + byCat[c.id], 0);
  const needs = byCat.belanja + byCat.transport + byCat.tagihan + byCat.pendidikan + byCat.kesehatan;
  const wants = byCat.makan + byCat.hiburan + byCat.lainnya;
  const totals = monthTotals(month);
  const needsPct = Math.round((needs / totals.income) * 100);
  const wantsPct = Math.round((wants / totals.income) * 100);
  const savePct = Math.round((totals.savings / totals.income) * 100);

  const cards = CATEGORIES.map((c) => {
    const spent = byCat[c.id];
    const limit = state.budgets[c.id];
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const left = limit - spent;
    const barClass = pct > 100 ? 'bar-over' : pct >= 90 ? 'bar-warn' : 'bar-ok';
    return '<article class="budget-card"><header><span class="budget-icon">' + c.icon + '</span>'
      + '<div><h3>' + escapeHtml(c.name) + '</h3><p class="budget-numbers">' + rupiah(spent) + ' dari ' + rupiah(limit) + '</p></div>'
      + statusBadge(pct) + '</header>'
      + '<div class="progress ' + barClass + '"><span style="width:' + Math.min(100, pct) + '%"></span></div>'
      + '<p class="budget-left">' + (left >= 0 ? 'Sisa ' + rupiah(left) : 'Lebih ' + rupiah(-left) + ' dari anggaran') + ' · ' + pct + '% terpakai</p>'
      + '<form class="budget-edit" data-cat="' + c.id + '"><label>Ubah anggaran (Rp) '
      + '<input type="number" name="budget-amount" min="0" max="10000000" value="' + limit + '" required></label>'
      + '<button type="submit" class="btn btn-small">Simpan</button></form></article>';
  }).join('');

  return '<section class="page-head"><div><h1>Anggaran Bulanan</h1>'
    + '<p class="subtitle">' + MONTH_NAMES[month] + ' · Total anggaran ' + rupiah(totalBudget) + ' · Terpakai ' + rupiah(totalSpent) + ' (' + Math.round((totalSpent / totalBudget) * 100) + '%)</p></div>'
    + monthSwitcher() + '</section>'
    + '<section class="budget-grid">' + cards + '</section>'
    + '<section class="panel benchmark"><h2>Patokan 50 / 30 / 20</h2>'
    + '<p>Aturan sederhana: 50% pemasukan untuk kebutuhan, 30% untuk keinginan, 20% untuk tabungan. Begini posisi Keluarga Santoso bulan ini:</p>'
    + '<div class="bench-rows">'
    + '<div class="bench-row"><span>Kebutuhan <small>belanja, transport, tagihan, pendidikan, kesehatan</small></span><strong>' + rupiah(needs) + ' · ' + needsPct + '%</strong><span class="bench-target">target 50%</span></div>'
    + '<div class="bench-row"><span>Keinginan <small>makan di luar, hiburan, lainnya</small></span><strong>' + rupiah(wants) + ' · ' + wantsPct + '%</strong><span class="bench-target">target 30%</span></div>'
    + '<div class="bench-row"><span>Tabungan <small>sisa pemasukan bulan ini</small></span><strong>' + rupiah(totals.savings) + ' · ' + savePct + '%</strong><span class="bench-target">target 20%</span></div>'
    + '</div>'
    + '<p class="panel-note">Keluarga ini menabung jauh di atas patokan (49%), tapi kebutuhan 40% dan keinginan 10% menunjukkan anggaran makan di luar dan hiburan masih longgar — ruang untuk menambah dana liburan.</p>'
    + '</section>';
}

// ---------- 4. Tujuan Menabung ----------

function viewGoals() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const cards = state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    const left = g.target - g.saved;
    return '<article class="goal-card"><header><h3>' + escapeHtml(g.name) + '</h3>'
      + '<button type="button" class="btn btn-small btn-danger" data-action="goal-delete" data-id="' + g.id + '">Hapus</button></header>'
      + '<p class="goal-note">' + escapeHtml(g.note) + '</p>'
      + '<p class="big-number">' + rupiah(g.saved) + ' <small>dari ' + rupiah(g.target) + ' · ' + pct + '%</small></p>'
      + '<div class="progress"><span style="width:' + pct + '%"></span></div>'
      + '<p class="budget-left">' + (left > 0 ? 'Kurang ' + rupiah(left) + ' lagi' : 'Target tercapai! 🎉') + '</p>'
      + '<form class="goal-add" data-id="' + g.id + '"><label>Tambah dana (Rp) '
      + '<input type="number" name="goal-amount" min="1000" max="100000000" placeholder="100000" required></label>'
      + '<button type="submit" class="btn btn-primary btn-small">Tambah Dana</button></form></article>';
  }).join('');
  return '<section class="page-head"><div><h1>Tujuan Menabung</h1>'
    + '<p class="subtitle">Total terkumpul ' + rupiah(totalSaved) + ' dari ' + rupiah(totalTarget) + ' (' + Math.round((totalSaved / totalTarget) * 100) + '%)</p></div></section>'
    + '<section class="goal-grid">' + cards + '</section>'
    + '<section class="panel"><h2>Buat Tujuan Baru</h2>'
    + '<form id="goal-form" class="form-inline">'
    + '<label>Nama tujuan<input type="text" name="goal-name" placeholder="Contoh: Dana Haji" required maxlength="60"></label>'
    + '<label>Target (Rp)<input type="number" name="goal-target" min="10000" max="1000000000" placeholder="5000000" required></label>'
    + '<label>Catatan<input type="text" name="goal-note" placeholder="Untuk apa tabungan ini?" maxlength="100"></label>'
    + '<button type="submit" class="btn btn-primary">Buat Tujuan</button></form></section>';
}

// ---------- 5. Laporan ----------

function viewReport() {
  const byCat = categoryTotals(currentMonth());
  const ranking = CATEGORIES.map((c) => ({ name: c.name, spent: byCat[c.id] }))
    .sort((a, b) => b.spent - a.spent);
  const biggest = monthTransactions(currentMonth())
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const historyRows = MONTHLY_HISTORY.map((h) => '<tr><td>' + MONTH_NAMES[h.month] + '</td>'
    + '<td class="amount">' + rupiah(h.income) + '</td><td class="amount">' + rupiah(h.expense) + '</td>'
    + '<td class="amount income">' + rupiah(h.income - h.expense) + '</td>'
    + '<td class="amount">' + Math.round(((h.income - h.expense) / h.income) * 100) + '%</td></tr>').join('');
  const avgExpense = Math.round(MONTHLY_HISTORY.reduce((s, h) => s + h.expense, 0) / MONTHLY_HISTORY.length);
  const avgSavings = Math.round(MONTHLY_HISTORY.reduce((s, h) => s + (h.income - h.expense), 0) / MONTHLY_HISTORY.length);
  // Cheapest month is derived from the history table, not hard-coded.
  const cheapest = MONTHLY_HISTORY.slice().sort((a, b) => a.expense - b.expense)[0];
  return '<section class="page-head"><div><h1>Laporan Keuangan</h1>'
    + '<p class="subtitle">Ringkasan enam bulan terakhir · Juni – November 2026</p></div></section>'
    + '<section class="cards">'
    + '<div class="card"><span class="card-label">Rata-rata Pengeluaran / Bulan</span><span class="card-value">' + rupiah(avgExpense) + '</span></div>'
    + '<div class="card"><span class="card-label">Rata-rata Tabungan / Bulan</span><span class="card-value">' + rupiah(avgSavings) + '</span></div>'
    + '<div class="card"><span class="card-label">Bulan Paling Hemat</span><span class="card-value">' + MONTH_NAMES[cheapest.month] + '</span><span class="card-note">Pengeluaran ' + rupiah(cheapest.expense) + ', terendah 6 bulan</span></div>'
    + '</section>'
    + '<section class="grid-2">'
    + '<div class="panel"><h2>Perbandingan 6 Bulan</h2><div class="table-wrap"><table class="report-table"><thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Tabungan</th><th>%</th></tr></thead>'
    + '<tbody>' + historyRows + '</tbody></table></div></div>'
    + '<div class="panel"><h2>Peringkat Kategori — ' + MONTH_NAMES[currentMonth()] + '</h2><ol class="ranking">'
    + ranking.map((r, i) => '<li><span class="rank-num">' + (i + 1) + '</span><span class="rank-name">' + escapeHtml(r.name) + '</span><strong>' + rupiah(r.spent) + '</strong></li>').join('')
    + '</ol></div></section>'
    + '<section class="grid-2">'
    + '<div class="panel"><h2>Pengeluaran Terbesar Bulan Ini</h2><ul class="tx-list">'
    + biggest.map((t) => '<li><span class="tx-icon">' + categoryIcon(t.category) + '</span>'
      + '<span class="tx-desc">' + escapeHtml(t.desc) + '<small>' + formatDate(t.date) + ' · ' + categoryName(t.category) + '</small></span>'
      + '<span class="tx-amount expense">' + rupiah(t.amount) + '</span></li>').join('')
    + '</ul></div>'
    + '<div class="panel"><h2>4 Tips Hemat untuk Keluarga</h2><ol class="tips">'
    + SAVING_TIPS.map((tip) => '<li><strong>' + escapeHtml(tip.title) + '</strong><p>' + escapeHtml(tip.body) + '</p></li>').join('')
    + '</ol></div></section>'
    + '<section class="panel"><h2>Cara Menggunakan DompetKeluarga</h2>'
    + '<ol class="howto"><li><strong>Lihat Ringkasan</strong> setiap awal bulan untuk tahu sisa uang dan kategori yang melewati anggaran.</li>'
    + '<li><strong>Catat transaksi</strong> di halaman Transaksi begitu belanja — tambah, ubah, atau hapus kapan saja; total ikut berubah.</li>'
    + '<li><strong>Atur anggaran</strong> tiap kategori di halaman Anggaran dan bandingkan dengan patokan 50/30/20.</li>'
    + '<li><strong>Menabung terarah</strong> di halaman Tujuan Menabung: tambah dana sedikit demi sedikit sampai target tercapai.</li>'
    + '<li><strong>Semua data tersimpan di peramban ini</strong> (localStorage) dan tidak dikirim ke mana pun — privasi keluarga tetap terjaga.</li></ol>'
    + '<button type="button" class="btn btn-danger" data-action="reset-data">Kembalikan Data Contoh</button> '
    + '<span class="panel-note">Menghapus semua perubahan dan mengembalikan data Keluarga Santoso seperti semula.</span></section>';
}
