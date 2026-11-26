# DompetKeluarga — Anggaran Rumah Tangga Keluarga Santoso

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/FajarRizikAinulyakin/makefun-best-household-budget-site-20261126-1457-2/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/FajarRizikAinulyakin/makefun-best-household-budget-site-20261126-1457-2/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

DompetKeluarga adalah situs anggaran rumah tangga untuk Keluarga Santoso di Jakarta Timur — file statis tanpa build step, tanpa pustaka eksternal, dan tanpa satu pun permintaan jaringan. Semua data contoh tersimpan di peramban (localStorage) dan tidak dikirim ke mana pun.

## Yang bisa dilakukan

- **Ringkasan (#/)** — kartu pemasukan Rp 10.342.000, pengeluaran Rp 5.246.000, dan sisa tabungan Rp 5.096.000 untuk November 2026; donat pengeluaran per kategori, tren 6 bulan, 5 transaksi terakhir, cuplikan tujuan menabung, dan peringatan kategori yang melewati anggaran (Pendidikan, 111%).
- **Transaksi (#/transaksi)** — 38 transaksi November; tambah, ubah, dan hapus transaksi; filter berdasarkan jenis, kategori, dan kata kunci; pengalih bulan September–November; unduh bulan berjalan sebagai CSV.
- **Anggaran (#/anggaran)** — 8 kategori anggaran dengan bilah progres dan lencana status (Aman / Hampir habis / Lewat anggaran); ubah tiap anggaran langsung di halaman; perbandingan dengan patokan 50/30/20.
- **Tujuan Menabung (#/tujuan)** — 4 tujuan (Dana Darurat, Liburan Yogyakarta, DP Motor, Pendidikan Anak); tambah dana ke tujuan, buat tujuan baru, hapus tujuan.
- **Laporan (#/laporan)** — tabel perbandingan 6 bulan, peringkat kategori, 5 pengeluaran terbesar, 4 tips hemat, cara memakai situs, dan tombol mengembalikan data contoh.

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

## Menyerahkan (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib saja) menyalin `app/` dan `screenshots/` ke direktori output dan menulis `dossier.json` dengan pustaka `vendor/makefun-frontend.ts`.

## Struktur

- `app/index.html` — kerangka halaman dan navigasi
- `app/style.css` — seluruh tampilan, responsif sampai ukuran ponsel
- `app/data.js` — data contoh Keluarga Santoso (transaksi, anggaran, tujuan)
- `app/store.js` — state, localStorage (`dompetkeluarga-v3`), dan perhitungan
- `app/charts.js` — grafik donat dan batang SVG tanpa pustaka
- `app/views.js` — lima halaman situs
- `app/main.js` — routing hash dan pengendali semua kontrol
- `screenshots/` — tangkapan layar asli situs ini di headless Chrome
- `main.ts`, `serve.ts` — program penyerahan dan server pengembangan

## Lisensi

MIT — lihat `LICENSE`.
