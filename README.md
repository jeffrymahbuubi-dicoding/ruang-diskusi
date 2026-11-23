# Ruang Diskusi

Aplikasi forum diskusi berbasis React dan Redux. Data diambil dari Forum API Dicoding
(`https://forum-api.dicoding.dev/v1`).

## Fitur

- Daftar akun dan masuk; sesi tetap tersimpan setelah halaman dimuat ulang.
- Daftar diskusi dengan judul, cuplikan isi, waktu dibuat, jumlah komentar, serta nama dan avatar pembuat.
- Halaman detail diskusi beserta komentar.
- Membuat diskusi baru dan menulis komentar (khusus pengguna yang sudah masuk).
- Indikator loading pada setiap permintaan ke API.
- Memberi suara (suka dan tidak suka) pada diskusi dan komentar.
- Klasemen pengguna.
- Penyaringan diskusi berdasarkan kategori.

## Menjalankan aplikasi

Prasyarat: Node.js 22.22.2 atau lebih baru pada seri 22, 24.15.0 atau lebih baru pada seri 24, atau 26 ke atas (versi 23
dan 25 tidak didukung paket pengujian). Batas ini berasal dari paket pengujian (jsdom); aplikasinya sendiri cukup dengan
Node.js 20.19 atau 22.12.

```
npm install
npm run dev
npm run build
npm run lint
```

- `npm run dev` menjalankan aplikasi pada server pengembangan Vite di http://127.0.0.1:5173 (port harus kosong).
- `npm run build` membuat berkas produksi di folder `dist`.
- `npm run lint` memeriksa kode `src`, `cypress`, dan `.storybook` dengan ESLint (style guide Dicoding Academy).

## Pengujian

Berkas pengujian berada di samping kode yang diuji (`reducer.test.js`, `action.test.js`, `<Nama>.test.jsx`). Setiap berkas
dibuka dengan komentar skenario pengujian.

- `npm test` menjalankan pengujian unit dan komponen dengan Vitest, React Testing Library, dan jsdom (mode watch).
- `npm run e2e` menjalankan pengujian end-to-end dengan Cypress. Server pengembangan harus sudah berjalan: jalankan
  `npm run dev` di terminal lain terlebih dahulu. Jawaban Forum API pada pengujian ini diganti dengan `cy.intercept`,
  sehingga tidak ada permintaan ke API sungguhan.
- `npm run ci:test` menjalankan Vitest satu kali (tanpa watch), lalu menyalakan server pengembangan, menunggu server
  siap, dan menjalankan Cypress. Perintah inilah yang dipakai CI.

## Storybook

- `npm run storybook` membuka Storybook pada http://localhost:6006.
- `npm run build-storybook` membuat berkas statis di `storybook-static`.

## CI/CD

- CI: alur kerja `.github/workflows/ci.yml` (GitHub Actions) berjalan pada setiap pull request ke branch `master`.
  Job `automation-test-job` menjalankan `npm ci`, `npm run ci:test`, lalu `npm run lint`.
- Proteksi branch: `master` hanya berubah lewat pull request, dan pemeriksaan `automation-test-job` harus lulus
  sebelum merge.
- CD: Vercel men-deploy setiap perubahan pada `master`. `vercel.json` mengarahkan semua alamat ke `index.html`
  agar rute sisi klien (misalnya `/leaderboards`) tetap terbuka saat halaman dimuat ulang.

Aplikasi: https://ruang-diskusi-seven.vercel.app

## Struktur folder

```
.github/workflows/  alur kerja CI (GitHub Actions)
.storybook/         konfigurasi Storybook
cypress/            pengujian end-to-end, fixture, dan berkas dukungan
src/
  components/   komponen UI yang dapat dipakai ulang
  hooks/        custom hooks
  pages/        komponen tingkat atas untuk setiap halaman
  states/       pengelolaan state Redux (action, reducer, dan thunk per state)
  stories/      stories Storybook
  styles/       berkas CSS
  utils/        akses API dan fungsi bantu
  App.jsx       komponen aplikasi dan daftar rute
  index.jsx     titik masuk aplikasi
```

## API yang digunakan

Forum API menyediakan pendaftaran dan login, daftar pengguna, diskusi, komentar, pemberian suara,
dan klasemen. Seluruh pemanggilan berada di `src/utils/api.js` dan hanya dijalankan melalui thunk
di folder `src/states`.
