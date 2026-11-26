// DompetKeluarga — sample data for Keluarga Santoso, Jakarta Timur.
// All figures are in Indonesian rupiah. November 2026 is the current month:
// income Rp 10.342.000, expenses Rp 5.246.000, savings Rp 5.096.000.
// September and October carry smaller transaction lists so the month
// switcher shows real data for every month it offers.

const SAMPLE_MONTHS = ['2026-09', '2026-10', '2026-11'];

const MONTH_NAMES = {
  '2026-06': 'Juni 2026',
  '2026-07': 'Juli 2026',
  '2026-08': 'Agustus 2026',
  '2026-09': 'September 2026',
  '2026-10': 'Oktober 2026',
  '2026-11': 'November 2026',
};

// Six-month history used by the trend chart and the report table.
const MONTHLY_HISTORY = [
  { month: '2026-06', income: 9850000, expense: 5980000 },
  { month: '2026-07', income: 10100000, expense: 5410000 },
  { month: '2026-08', income: 9920000, expense: 6120000 },
  { month: '2026-09', income: 10250000, expense: 5620000 },
  { month: '2026-10', income: 10180000, expense: 5890000 },
  { month: '2026-11', income: 10342000, expense: 5246000 },
];

const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', color: '#2e7d4f', icon: '🛒' },
  { id: 'makan', name: 'Makan di Luar', color: '#d97b29', icon: '🍽️' },
  { id: 'transport', name: 'Transportasi', color: '#2f6fb2', icon: '🛵' },
  { id: 'tagihan', name: 'Tagihan & Utilitas', color: '#6c4fa1', icon: '💡' },
  { id: 'pendidikan', name: 'Pendidikan', color: '#b23a48', icon: '📚' },
  { id: 'kesehatan', name: 'Kesehatan', color: '#0f766e', icon: '🩺' },
  { id: 'hiburan', name: 'Hiburan', color: '#c2417a', icon: '🎬' },
  { id: 'lainnya', name: 'Lainnya', color: '#6b7280', icon: '📦' },
];

// Monthly budget limits (rupiah) per category.
const SAMPLE_BUDGETS = {
  belanja: 1500000,
  makan: 600000,
  transport: 500000,
  tagihan: 1200000,
  pendidikan: 700000,
  kesehatan: 400000,
  hiburan: 350000,
  lainnya: 300000,
};

// 38 November transactions. Expense sums per category:
// belanja 1.450.000, makan 485.000, transport 460.000, tagihan 1.180.000,
// pendidikan 775.000, kesehatan 320.000, hiburan 296.000, lainnya 280.000.
// Income: 7.500.000 + 2.400.000 + 350.000 + 92.000 = 10.342.000.
const SAMPLE_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', desc: 'Gaji Ayah — Budi Santoso', category: 'gaji', type: 'income', amount: 7500000 },
  { id: 't02', date: '2026-11-01', desc: 'Gaji Ibu — Sari Santoso', category: 'gaji', type: 'income', amount: 2400000 },
  { id: 't03', date: '2026-11-02', desc: 'SPP Sekolah Anak', category: 'pendidikan', type: 'expense', amount: 350000 },
  { id: 't04', date: '2026-11-02', desc: 'Belanja Mingguan Pasar Minggu', category: 'belanja', type: 'expense', amount: 385000 },
  { id: 't05', date: '2026-11-03', desc: 'Makan Siang Keluarga', category: 'makan', type: 'expense', amount: 125000 },
  { id: 't06', date: '2026-11-04', desc: 'Bensin Motor', category: 'transport', type: 'expense', amount: 150000 },
  { id: 't07', date: '2026-11-05', desc: 'Listrik PLN', category: 'tagihan', type: 'expense', amount: 420000 },
  { id: 't08', date: '2026-11-05', desc: 'Perawatan Motor', category: 'lainnya', type: 'expense', amount: 110000 },
  { id: 't09', date: '2026-11-06', desc: 'Belanja Bulanan Supermarket', category: 'belanja', type: 'expense', amount: 312000 },
  { id: 't10', date: '2026-11-06', desc: 'Obat & Vitamin', category: 'kesehatan', type: 'expense', amount: 145000 },
  { id: 't11', date: '2026-11-07', desc: 'Internet & TV Kabel', category: 'tagihan', type: 'expense', amount: 310000 },
  { id: 't12', date: '2026-11-07', desc: 'Nonton Bioskop', category: 'hiburan', type: 'expense', amount: 120000 },
  { id: 't13', date: '2026-11-08', desc: 'Warung Nasi Padang', category: 'makan', type: 'expense', amount: 98000 },
  { id: 't14', date: '2026-11-08', desc: 'Buku & Alat Tulis', category: 'pendidikan', type: 'expense', amount: 185000 },
  { id: 't15', date: '2026-11-09', desc: 'Tagihan Air PAM', category: 'tagihan', type: 'expense', amount: 285000 },
  { id: 't16', date: '2026-11-10', desc: 'Ojek Online', category: 'transport', type: 'expense', amount: 120000 },
  { id: 't17', date: '2026-11-11', desc: 'Belanja Sayur & Buah', category: 'belanja', type: 'expense', amount: 245000 },
  { id: 't18', date: '2026-11-11', desc: 'Langganan Streaming', category: 'hiburan', type: 'expense', amount: 89000 },
  { id: 't19', date: '2026-11-12', desc: 'Pulsa & Paket Data', category: 'tagihan', type: 'expense', amount: 165000 },
  { id: 't20', date: '2026-11-13', desc: 'Bakso & Es Teh', category: 'makan', type: 'expense', amount: 87000 },
  { id: 't21', date: '2026-11-13', desc: 'Hadiah Ulang Tahun', category: 'lainnya', type: 'expense', amount: 75000 },
  { id: 't22', date: '2026-11-14', desc: 'Freelance Desain Grafis', category: 'gaji', type: 'income', amount: 350000 },
  { id: 't23', date: '2026-11-14', desc: 'Periksa Gigi Anak', category: 'kesehatan', type: 'expense', amount: 95000 },
  { id: 't24', date: '2026-11-15', desc: 'Les Matematika', category: 'pendidikan', type: 'expense', amount: 140000 },
  { id: 't25', date: '2026-11-16', desc: 'Belanja Mingguan', category: 'belanja', type: 'expense', amount: 198000 },
  { id: 't26', date: '2026-11-17', desc: 'Bensin Mobil', category: 'transport', type: 'expense', amount: 110000 },
  { id: 't27', date: '2026-11-17', desc: 'Laundry', category: 'lainnya', type: 'expense', amount: 55000 },
  { id: 't28', date: '2026-11-18', desc: 'Mainan Anak', category: 'hiburan', type: 'expense', amount: 52000 },
  { id: 't29', date: '2026-11-19', desc: 'Makan Malam Ayam Geprek', category: 'makan', type: 'expense', amount: 95000 },
  { id: 't30', date: '2026-11-20', desc: 'Seragam & Tas Sekolah', category: 'pendidikan', type: 'expense', amount: 100000 },
  { id: 't31', date: '2026-11-21', desc: 'Belanja Daging & Ikan', category: 'belanja', type: 'expense', amount: 176000 },
  { id: 't32', date: '2026-11-22', desc: 'Jual Barang Bekas', category: 'gaji', type: 'income', amount: 92000 },
  { id: 't33', date: '2026-11-22', desc: 'Masker & P3K', category: 'kesehatan', type: 'expense', amount: 80000 },
  { id: 't34', date: '2026-11-23', desc: 'Parkir & Tol', category: 'transport', type: 'expense', amount: 80000 },
  { id: 't35', date: '2026-11-24', desc: 'Jajan Sore Anak', category: 'makan', type: 'expense', amount: 80000 },
  { id: 't36', date: '2026-11-25', desc: 'Beli Buku Cerita', category: 'hiburan', type: 'expense', amount: 35000 },
  { id: 't37', date: '2026-11-26', desc: 'Belanja Kebutuhan Dapur', category: 'belanja', type: 'expense', amount: 134000 },
  { id: 't38', date: '2026-11-26', desc: 'Peralatan Rumah', category: 'lainnya', type: 'expense', amount: 40000 },
];

// September 2026: income 10.250.000, expenses 5.620.000 (14 transactions).
const SAMPLE_TRANSACTIONS_SEP = [
  { id: 's01', date: '2026-09-01', desc: 'Gaji Ayah — Budi Santoso', category: 'gaji', type: 'income', amount: 7500000 },
  { id: 's02', date: '2026-09-01', desc: 'Gaji Ibu — Sari Santoso', category: 'gaji', type: 'income', amount: 2400000 },
  { id: 's03', date: '2026-09-03', desc: 'Belanja Bulanan Supermarket', category: 'belanja', type: 'expense', amount: 850000 },
  { id: 's04', date: '2026-09-05', desc: 'Listrik PLN', category: 'tagihan', type: 'expense', amount: 720000 },
  { id: 's05', date: '2026-09-07', desc: 'Belanja Mingguan', category: 'belanja', type: 'expense', amount: 640000 },
  { id: 's06', date: '2026-09-09', desc: 'SPP Sekolah Anak', category: 'pendidikan', type: 'expense', amount: 580000 },
  { id: 's07', date: '2026-09-11', desc: 'Bensin & Servis Motor', category: 'transport', type: 'expense', amount: 540000 },
  { id: 's08', date: '2026-09-13', desc: 'Internet & TV Kabel', category: 'tagihan', type: 'expense', amount: 480000 },
  { id: 's09', date: '2026-09-15', desc: 'Makan di Luar Keluarga', category: 'makan', type: 'expense', amount: 450000 },
  { id: 's10', date: '2026-09-18', desc: 'Periksa Kesehatan Keluarga', category: 'kesehatan', type: 'expense', amount: 390000 },
  { id: 's11', date: '2026-09-20', desc: 'Liburan Akhir Pekan', category: 'hiburan', type: 'expense', amount: 360000 },
  { id: 's12', date: '2026-09-23', desc: 'Hadiah & Keperluan Lain', category: 'lainnya', type: 'expense', amount: 330000 },
  { id: 's13', date: '2026-09-26', desc: 'Belanja Sayur & Buah', category: 'belanja', type: 'expense', amount: 280000 },
  { id: 's14', date: '2026-09-27', desc: 'Freelance Desain Grafis', category: 'gaji', type: 'income', amount: 350000 },
];

// October 2026: income 10.180.000, expenses 5.890.000 (16 transactions).
const SAMPLE_TRANSACTIONS_OCT = [
  { id: 'o01', date: '2026-10-01', desc: 'Gaji Ayah — Budi Santoso', category: 'gaji', type: 'income', amount: 7500000 },
  { id: 'o02', date: '2026-10-01', desc: 'Gaji Ibu — Sari Santoso', category: 'gaji', type: 'income', amount: 2400000 },
  { id: 'o03', date: '2026-10-03', desc: 'Listrik PLN', category: 'tagihan', type: 'expense', amount: 720000 },
  { id: 'o04', date: '2026-10-05', desc: 'Belanja Bulanan Supermarket', category: 'belanja', type: 'expense', amount: 680000 },
  { id: 'o05', date: '2026-10-07', desc: 'SPP & Buku Sekolah', category: 'pendidikan', type: 'expense', amount: 590000 },
  { id: 'o06', date: '2026-10-09', desc: 'Belanja Mingguan', category: 'belanja', type: 'expense', amount: 540000 },
  { id: 'o07', date: '2026-10-11', desc: 'Bensin Mobil', category: 'transport', type: 'expense', amount: 510000 },
  { id: 'o08', date: '2026-10-13', desc: 'Internet & TV Kabel', category: 'tagihan', type: 'expense', amount: 480000 },
  { id: 'o09', date: '2026-10-15', desc: 'Makan Malam Keluarga', category: 'makan', type: 'expense', amount: 430000 },
  { id: 'o10', date: '2026-10-17', desc: 'Obat & Vitamin', category: 'kesehatan', type: 'expense', amount: 410000 },
  { id: 'o11', date: '2026-10-19', desc: 'Belanja Sayur & Buah', category: 'belanja', type: 'expense', amount: 380000 },
  { id: 'o12', date: '2026-10-21', desc: 'Nonton Bioskop & Jajan', category: 'hiburan', type: 'expense', amount: 350000 },
  { id: 'o13', date: '2026-10-23', desc: 'Perawatan Rumah', category: 'lainnya', type: 'expense', amount: 320000 },
  { id: 'o14', date: '2026-10-25', desc: 'Jajan Sore Anak', category: 'makan', type: 'expense', amount: 280000 },
  { id: 'o15', date: '2026-10-27', desc: 'Belanja Kebutuhan Dapur', category: 'belanja', type: 'expense', amount: 200000 },
  { id: 'o16', date: '2026-10-28', desc: 'Freelance Desain Grafis', category: 'gaji', type: 'income', amount: 280000 },
];

const SAMPLE_GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 15000000, saved: 9250000, note: 'Cadangan 3 bulan pengeluaran keluarga' },
  { id: 'g2', name: 'Liburan Yogyakarta', target: 4500000, saved: 2850000, note: 'Liburan akhir tahun bersama anak-anak' },
  { id: 'g3', name: 'DP Motor', target: 8000000, saved: 3400000, note: 'Ganti motor lama yang sudah sering mogok' },
  { id: 'g4', name: 'Pendidikan Anak', target: 12000000, saved: 5600000, note: 'Tabungan masuk SMP tahun depan' },
];

const SAVING_TIPS = [
  { title: 'Masak di rumah 4 kali seminggu', body: 'Keluarga Santoso menghabiskan Rp 485.000 untuk makan di luar bulan ini. Memasak dua kali lagi di rumah bisa menghemat sekitar Rp 150.000 sebulan.' },
  { title: 'Belanja mingguan dengan daftar', body: 'Belanja harian mencapai Rp 1.450.000, 97% dari anggarannya. Daftar belanja tetap mencegah beli impulsif di pasar dan supermarket.' },
  { title: 'Pangkas langganan yang jarang dipakai', body: 'Cek lagi langganan streaming Rp 89.000 sebulan — kalau hanya ditonton seminggu sekali, jeda dulu dan alihkan ke Dana Darurat.' },
  { title: 'Sisihkan tabungan di awal gajian', body: 'Bulan ini keluarga berhasil menabung Rp 5.096.000 (49% pemasukan). Pindahkan 20% gaji ke rekening tabungan begitu gajian masuk, sebelum belanja.' },
];

function sampleState() {
  return {
    month: '2026-11',
    transactions: {
      '2026-09': SAMPLE_TRANSACTIONS_SEP.map((t) => ({ ...t })),
      '2026-10': SAMPLE_TRANSACTIONS_OCT.map((t) => ({ ...t })),
      '2026-11': SAMPLE_TRANSACTIONS.map((t) => ({ ...t })),
    },
    budgets: { ...SAMPLE_BUDGETS },
    goals: SAMPLE_GOALS.map((g) => ({ ...g })),
  };
}
