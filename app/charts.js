// DompetKeluarga — charts.js
// Plain-SVG charts, drawn by hand with no library: a donut of spending per
// category and a grouped bar trend of income vs. expenses over six months.

function donutChart(segments, size) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 14;
  const inner = radius - 26;
  if (total <= 0) {
    return '<svg class="donut" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Belum ada pengeluaran">'
      + '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="#e5e0d5" stroke-width="26"/>'
      + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" class="donut-center">Rp 0</text></svg>';
  }
  let offset = -Math.PI / 2;
  let arcs = '';
  for (const s of segments) {
    if (s.value <= 0) continue;
    const frac = s.value / total;
    const a0 = offset;
    const a1 = offset + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + radius * Math.cos(a0);
    const y0 = cy + radius * Math.sin(a0);
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    arcs += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1)
      + ' A ' + radius + ' ' + radius + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1)
      + ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1)
      + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1)
      + ' Z" fill="' + s.color + '"><title>' + escapeHtml(s.label) + ': ' + rupiah(s.value) + '</title></path>';
    offset = a1;
  }
  const pct = Math.round((segments[0] ? segments[0].value / total : 0) * 100);
  return '<svg class="donut" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Donat pengeluaran per kategori">'
    + arcs
    + '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" class="donut-center">Total</text>'
    + '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" class="donut-total">' + shortRupiah(total) + '</text>'
    + '</svg>';
}

function donutLegend(segments) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return segments.map((s) => {
    const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
    return '<li><span class="dot" style="background:' + s.color + '"></span>'
      + '<span class="legend-name">' + escapeHtml(s.label) + '</span>'
      + '<span class="legend-value">' + rupiah(s.value) + ' · ' + pct + '%</span></li>';
  }).join('');
}

function barTrendChart(history) {
  const width = 640;
  const height = 260;
  const padLeft = 56;
  const padBottom = 30;
  const padTop = 16;
  const plotW = width - padLeft - 16;
  const plotH = height - padTop - padBottom;
  const maxVal = Math.max(...history.map((h) => Math.max(h.income, h.expense))) * 1.08;
  const groupW = plotW / history.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  let bars = '';
  let labels = '';
  history.forEach((h, i) => {
    const gx = padLeft + i * groupW + groupW / 2;
    const ih = (h.income / maxVal) * plotH;
    const eh = (h.expense / maxVal) * plotH;
    const yBase = padTop + plotH;
    bars += '<rect x="' + (gx - barW - 3).toFixed(1) + '" y="' + (yBase - ih).toFixed(1)
      + '" width="' + barW + '" height="' + ih.toFixed(1) + '" rx="3" fill="#2e7d4f">'
      + '<title>Pemasukan ' + MONTH_NAMES[h.month] + ': ' + rupiah(h.income) + '</title></rect>';
    bars += '<rect x="' + (gx + 3).toFixed(1) + '" y="' + (yBase - eh).toFixed(1)
      + '" width="' + barW + '" height="' + eh.toFixed(1) + '" rx="3" fill="#d97b29">'
      + '<title>Pengeluaran ' + MONTH_NAMES[h.month] + ': ' + rupiah(h.expense) + '</title></rect>';
    const short = MONTH_NAMES[h.month].split(' ')[0].slice(0, 3);
    labels += '<text x="' + gx.toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle" class="axis-label">' + short + '</text>';
  });
  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padTop + plotH * (1 - f);
    const val = Math.round((maxVal * f) / 1000000 * 10) / 10;
    return '<line x1="' + padLeft + '" y1="' + y.toFixed(1) + '" x2="' + (width - 16) + '" y2="' + y.toFixed(1) + '" class="grid-line"/>'
      + '<text x="' + (padLeft - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" class="axis-label">' + val + ' jt</text>';
  }).join('');
  return '<svg class="bars" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Tren pemasukan dan pengeluaran 6 bulan">'
    + gridLines + bars + labels + '</svg>'
    + '<p class="chart-legend"><span class="dot" style="background:#2e7d4f"></span> Pemasukan'
    + ' &nbsp; <span class="dot" style="background:#d97b29"></span> Pengeluaran</p>';
}
