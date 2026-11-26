# BUILD-REPORT — DompetKeluarga (best-household-budget-site-20261126-1457)

Dibangun dari nol dalam satu sesi builder yang dimulai setelah bounty dibuka
(26 Nov 2026 21:57 WIB). Semua file entry ditulis segar di sesi ini dari
spesifikasi dan kit — tidak ada file yang disalin dari build sebelumnya.

## Yang dibangun

Situs anggaran rumah tangga statis untuk Keluarga Santoso, Jakarta Timur,
November 2026 (semua angka dalam rupiah). File statis di bawah `app/`, tanpa
build step, tanpa pustaka, tanpa permintaan jaringan.

Lima halaman hash-routed, masing-masing dicapai lewat tautan navigasi:

1. **Ringkasan (#/)** — kartu pemasukan Rp 10.342.000, pengeluaran
   Rp 5.246.000, sisa tabungan Rp 5.096.000; donat pengeluaran per kategori;
   tren batang 6 bulan; 5 transaksi terakhir; cuplikan tabungan
   (Rp 21.100.000 dari target Rp 39.500.000); peringatan Pendidikan melewati
   anggaran (Rp 775.000 dari Rp 700.000, 111%); pengalih bulan Sep–Nov 2026.
2. **Transaksi (#/transaksi)** — 38 transaksi November; tambah, ubah, hapus
   (total ikut berubah); filter jenis, kategori, kata kunci; pengalih bulan;
   unduh CSV bulan berjalan.
3. **Anggaran (#/anggaran)** — 8 kategori dengan bilah progres dan lencana
   Aman / Hampir habis / Lewat anggaran; ubah anggaran inline per kategori;
   perbandingan patokan 50/30/20 (kebutuhan 40%, keinginan 10%, tabungan 49%).
4. **Tujuan Menabung (#/tujuan)** — 4 tujuan (Dana Darurat Rp 9.250.000/
   Rp 15.000.000, Liburan Yogyakarta Rp 2.850.000/Rp 4.500.000, DP Motor
   Rp 3.400.000/Rp 8.000.000, Pendidikan Anak Rp 5.600.000/Rp 12.000.000);
   tambah dana, buat tujuan baru, hapus tujuan.
5. **Laporan (#/laporan)** — tabel perbandingan 6 bulan, peringkat kategori,
   5 pengeluaran terbesar, 4 tips hemat, cara memakai situs, tombol reset
   data contoh.

Data tersimpan di localStorage kunci `dompetkeluarga-v3`; situs berjalan dari
data contoh saat localStorage kosong. Grafik donat dan batang digambar sebagai
SVG polos tanpa pustaka. Tampilan responsif sampai ukuran ponsel.

## File

- `app/index.html`, `app/style.css`, `app/data.js`, `app/store.js`,
  `app/charts.js`, `app/views.js`, `app/main.js`
- `main.ts` (Node 22, stdlib saja), `serve.ts`, `shots.json`, `README.md`,
  `LICENSE` (MIT), `vendor/makefun-frontend.ts` (salinan kit, tidak diubah)
- `screenshots/1-ringkasan.jpg` (1280×1000), `2-transaksi.jpg` (1280×1000),
  `3-anggaran.jpg` (1280×1000), `4-ringkasan-hp.jpg` (390×844) — render asli
  situs ini di headless Chrome (Chrome for Testing 159 + puppeteer-core),
  diambil dalam sesi ini.

## Determinisme

`main.ts` dijalankan dua kali (`MAKEFUN_OUTPUT_DIR` berbeda); kedua output
byte-identical (`diff -r` kosong). Dossier: first load 7 file, 17.181 byte
gzip-9 (60.879 raw); total app 7 file, 60.879 byte.

## Pengujian (headless Chrome, sesi ini)

30 pemeriksaan, semuanya lolos: angka dashboard November dan Oktober,
pengalih bulan, 38 baris transaksi, filter (kata kunci "Bensin" → 2 baris),
tambah/ubah/hapus transaksi mengubah total, edit anggaran tersimpan, tambah
dana tujuan, buat/hapus tujuan, halaman laporan, reset mengembalikan data
contoh, nol page error, nol failed request, nol external request.

## Revisi setelah pengujian

Dua angka yang semula literal hardcode diubah menjadi turunan data, supaya
tetap benar saat pengguna mengubah transaksi: catatan tren di Ringkasan kini
dihitung dari `MONTHLY_HISTORY` (pengeluaran November turun Rp 644.000
dibanding Oktober), dan kartu "Bulan Paling Hemat" di Laporan kini diambil
dari bulan dengan pengeluaran terendah di `MONTHLY_HISTORY`. Uji ulang penuh
setelah revisi: 30/30 lolos.

## Kit check

`node cli/makefun.mjs check --kit . --repo <entry> --worktree` (26 Nov 2026
22:32 WIB): 4 passed — `competition_open`, `snapshot` (18 file, 599.489
byte), `license_osi` (MIT), `entrypoint` (main.ts → node22). 1 failed —
`transcripts_present` (belum ada bundle transkrip; dibuat oleh parent run
dari sesi builder ini). 5 checks "at submission" ditangani parent run setelah
repo dibuat: `repo_public`, `repo_owner`, `repo_created_after_open`,
`commit_in_repo`, `duplicate_snapshot`.

Catatan: kit lokal level 50, sedangkan make.fun di level 53 — check
menyarankan mengunduh ulang kit; tidak memengaruhi hasil check ini.

## Tidak dilakukan di sesi ini

Tidak membuat repo GitHub, tidak push, tidak submit — ditangani parent run.
