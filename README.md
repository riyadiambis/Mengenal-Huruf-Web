# Ayo Belajar Huruf! 🎈

Aplikasi belajar membaca untuk anak TK sampai SD kelas 1. Buka satu link, langsung bisa dipakai. Tidak perlu unduh aplikasi, tidak perlu daftar akun, tidak ada iklan.

[🚀 Coba sekarang](https://riyadiambis.github.io/Mengenal-Huruf-Web/)

---

## Kenapa aplikasi ini dibuat

Aplikasi ini lahir dari kelas les yang beneran, bukan dari ide di atas kertas.

Saya mengajar dua anak yang levelnya berbeda jauh. Yang satu daya tangkapnya cepat tapi gampang bosan, satunya lagi tekun tapi butuh banyak pengulangan sebelum sesuatu nempel di ingatan. Aplikasi belajar huruf yang ada di luar sana rata-rata memaksa keduanya lewat jalur yang sama: mulai dari A, lanjut B, lanjut C, sampai Z.

Padahal anak yang baru kenal 5 huruf nggak butuh 26 kartu. Dia butuh 5 huruf itu diulang sampai benar-benar hafal.

Jadi aplikasi ini dibangun dengan satu prinsip: guru yang menentukan sejauh mana anak berlatih hari ini, bukan aplikasinya.

---

## Fitur

### 🔤 Kenalan Huruf
Kartu huruf besar dengan contoh benda dan emoji. Anak menekan huruf, aplikasi menyebutkan bunyinya dengan suara Bahasa Indonesia.

Guru bisa mengatur rentang latihan, misalnya hanya A sampai E. Huruf yang belum diajarkan tidak akan muncul sama sekali, jadi anak tidak kewalahan.

### 🎯 Tebak Huruf
Kuis pilihan ganda. Muncul emoji benda, anak memilih huruf awalnya dari tiga pilihan, lalu mengumpulkan bintang.

Nama bendanya hanya disebutkan lewat suara dan tidak ditulis di layar. Ini disengaja. Kalau tulisannya ikut ditampilkan, anak cukup menyalin huruf pertamanya tanpa benar-benar mengenali bentuk huruf.

### 📖 Baca Kata (3 tingkat)
Naik bertahap sesuai kesiapan anak:

| Level | Latihan | Contoh |
| :--- | :--- | :--- |
| 🌱 Level 1 | Suku kata, satu kartu per layar | BA, SU, MI |
| 🚀 Level 2 | Melengkapi huruf hilang pada kata 4 huruf | B O _ A |
| 🏆 Level 3 | Kata yang lebih panjang | K A _ C I L |

Di Level 1 ada tombol "Sudah Paham". Suku kata yang sudah dikuasai anak akan disembunyikan selama dua jam, jadi waktu belajar tidak habis untuk mengulang hal yang sudah bisa.

---

## Yang membedakan aplikasi ini

Sebagian besar aplikasi sejenis mengacak soal dengan satu baris Math.random(). Kelihatannya acak, tapi di lapangan sering bikin masalah. Aplikasi ini punya beberapa aturan yang dipegang ketat:

- **Huruf tidak muncul berdekatan.** Sistem mengingat beberapa huruf jawaban terakhir dan tidak mengulangnya. Anak tidak akan dapat huruf yang sama tiga kali berturut-turut lalu menebak asal karena sudah hafal polanya.
- **Urutan kartu selalu berubah.** Setiap kali dibuka, urutan kartu diacak ulang. Anak tidak bisa menghafal "setelah BA pasti BI" tanpa benar-benar membaca kartunya.
- **Posisi huruf yang hilang berpindah-pindah.** Huruf yang dikosongkan tidak selalu di awal atau di akhir kata, jadi anak harus membaca kata utuhnya dulu.
- **Salah tidak dihukum.** Tidak ada tombol yang mati, tidak ada nyawa yang habis, tidak ada suara gagal yang bikin ciut. Anak boleh mencoba lagi di soal yang sama sampai berhasil.

---

## Cocok untuk siapa

- Guru les dan bimbel yang mengajar beberapa anak dengan level berbeda dalam satu sesi
- Orang tua yang ingin menemani anak belajar huruf tanpa harus menyiapkan bahan sendiri
- Anak TK sampai SD kelas 1 yang sedang di tahap mengenal huruf dan merangkai suku kata

---

## Cara pakai

Buka [linknya](https://riyadiambis.github.io/Mengenal-Huruf-Web/) di HP, lalu:

1. Masuk ke **Kenalan Huruf**, atur rentang huruf sesuai yang sudah diajarkan ke anak
2. Biarkan anak bermain di **Tebak Huruf** untuk menguji huruf yang sama
3. Kalau anak sudah lancar, lanjut ke **Baca Kata** mulai dari Level 1

Satu sesi 15 sampai 20 menit biasanya sudah cukup untuk anak seusia ini.

---

## Catatan teknis

- Dibangun sebagai satu file HTML statis dengan Vanilla CSS dan JavaScript. Tanpa framework, tanpa build step, tanpa backend, tanpa database.
- Suara memakai Text-to-Speech bawaan browser, jadi tidak ada file audio yang perlu diunduh. Kualitas suaranya mengikuti suara Bahasa Indonesia yang tersedia di perangkat masing-masing.
- Progres "Sudah Paham" disimpan di penyimpanan lokal browser, bukan di server. Artinya data tetap ada di HP itu saja dan tidak dikirim ke mana pun.

---

## Menjalankan di komputer sendiri

```bash
git clone https://github.com/riyadiambis/Mengenal-Huruf-Web.git
cd Mengenal-Huruf-Web
```

Lalu buka `index.html` di browser. Selesai, tidak ada langkah lain.

---

## Lisensi

Bebas dipakai dan dimodifikasi untuk keperluan mengajar.
