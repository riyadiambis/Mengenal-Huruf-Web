# Ayo Belajar Huruf! 🎈

Aplikasi web edukasi interaktif untuk anak usia TK hingga SD kelas 1 untuk belajar mengenal huruf A sampai Z dan melatih kemampuan membaca kata seru secara bertahap, langsung dari browser HP tanpa instalasi aplikasi.

---

## 🚀 Cara Menjalankan

1. Buka file `index.html` langsung di browser mana pun (Google Chrome, Safari, Microsoft Edge, Mozilla Firefox).
2. Atau jika sudah di-deploy, kunjungi tautan: `https://riyadiambis.github.io/web-membaca/`

> **Catatan**: Aplikasi ini 100% *client-side* (HTML + Vanilla CSS + JavaScript dalam 1 file tunggal). Tidak butuh server, tidak butuh database, dan tidak memerlukan dependensi build tools (`npm`, `vite`, dll.).

---

## 🌐 Cara Publish ke GitHub Pages

Aplikasi ini dirancang khusus agar siap di-hosting secara gratis di GitHub Pages:

1. Buat repository baru di GitHub (misalnya: `web-membaca`).
2. Push / upload file `index.html` dan `README.md` ke branch `main`.
3. Di halaman GitHub repository, buka menu **Settings** ⚙️ → **Pages**.
4. Di bagian **Build and deployment** > **Source**:
   - Pilih `Deploy from a branch`
   - Branch: `main` dan folder: `/ (root)`
5. Klik **Save**. Dalam 1–2 menit, website sudah online dan dapat diakses langsung melalui link GitHub Pages!

---

## ✨ Fitur & Aturan Pedagogis

### 1. 🔤 Mode Kenalan Huruf
- Menampilkan kartu huruf besar (A–Z) disertai contoh benda ramah anak dan emoji visual.
- **Pengaturan Rentang Huruf**: Guru atau orang tua dapat membatasi rentang latihan (contoh: hanya huruf A sampai E) menggunakan dropdown dan deretan tombol pill horizontal.
- **Suara Indonesia**: Melafalkan huruf dan nama bendanya dengan intonasi ramah anak melalui Text-to-Speech bawaan browser.

### 2. 🎯 Mode Tebak Huruf
- Kuis pilihan ganda interaktif: menebak huruf awal dari emoji benda dengan 3 pilihan huruf chunky.
- **Aturan Anti-Huruf Berdekatan (Domain Rule A)**: Sistem mencatat 4 huruf jawaban terakhir (FIFO). Huruf yang baru saja keluar tidak akan diulang berturut-turut kecuali rentang huruf yang dipilih guru terlalu sempit.
- **Umpan Balik Positif**: Dilengkapi skor bintang (⭐), efek suara Web Audio API, dan animasi haptic responsif tanpa menyalahkan anak saat salah memilih.

### 3. 📖 Mode Baca Kata (3 Tingkat Kesulitan)
- **🌱 Level 1 - Suku Kata**:
  - Flashcard suku kata satu per satu (bukan daftar yang di-scroll).
  - Urutan kartu selalu diacak ulang menggunakan algoritma **Fisher-Yates** setiap kali dibuka (**Domain Rule B**).
  - Tombol **"Sudah Paham"** (**Domain Rule C**): Kartu yang sudah dikuasai disembunyikan selama 2 jam dan disimpan aman di `localStorage` (dengan pengaman `try-catch`).
- **🚀 Level 2 - Kata 4 Huruf**:
  - Melengkapi 1 huruf yang hilang (`_`) pada kata 4 huruf umum (contoh: `B O _ A`).
  - Posisi huruf yang dikosongkan diacak setiap soal (**Domain Rule D**). Pilihan huruf terdiri dari 1 jawaban benar dan 2 pengecoh acak yang tidak kembar.
- **🏆 Level 3 - Kata Panjang (5–6 Huruf)**:
  - Format sama dengan Level 2 dengan kata yang lebih panjang (contoh: `K A _ C I L`).

---

## 🎨 Spesifikasi Desain & UX
- **Mobile First**: Lebar konten optimal maksimum ~440px, nyaman digenggam dan dioperasikan satu tangan di HP.
- **Chunky 3D Tactile Buttons**: Tombol dengan efek border tebal dan bayangan timbul yang terasa menekan saat disentuh.
- **Buku Tulis Bergaris**: Background grid kotak-kotak lembut seperti buku matematika anak sekolah.
- **Tipografi Ramah Anak**: Menggunakan font Google Fonts *Fredoka* dan *Nunito*.
