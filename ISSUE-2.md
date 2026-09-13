# ISSUE-2: Pengembangan Tahap Kedua "Ayo Belajar Huruf"

## Ringkasan Proyek
Dokumen ini berisi perencanaan *high-level* untuk pengembangan tahap kedua aplikasi web statis "Ayo Belajar Huruf". Proyek ini adalah perluasan dari file `index.html` tunggal yang sudah berjalan. **Penting:** Jangan merombak struktur dasar atau fitur yang sudah berfungsi; pertahankan fondasi yang ada, cukup tambahkan fitur baru dan perbaiki bug sesuai instruksi di bawah. Dokumen ini ditujukan sebagai panduan step-by-step implementasi untuk AI.

---

## 1. Struktur Level Baru (Mode Baca Kata)
Mode Baca Kata dirombak menjadi 5 level yang berurutan. Jangan merusak fungsionalitas Level 1, 2, dan 3 yang lama, melainkan sesuaikan penomoran dan fungsinya:

*   **🌱 Level 1 - Kenal Suku Kata**
    *   Flashcard suku kata satu per satu seperti sekarang. Tetap pertahankan tombol "Sudah Paham".
    *   Ini adalah mode pengenalan murni, belum ada sistem skor.
*   **🧩 Level 2 - Lengkapi Suku Kata**
    *   *Mekanik baru:* Anak mendengar satu suku kata (misal terdengar "BU"), lalu melengkapi satu huruf yang hilang (di layar tampil `_ U`).
    *   Pilihan jawaban berisi 3 huruf (1 benar, 2 pengecoh).
*   **🚀 Level 3 - Lengkapi Kata 4 Huruf**
    *   Sama seperti Level 2 di versi sekarang.
*   **🏆 Level 4 - Lengkapi Kata Panjang**
    *   Kata 5 sampai 6 huruf, satu huruf hilang. Sama seperti Level 3 di versi sekarang.
*   **🧱 Level 5 - Susun Huruf**
    *   *Interaksi baru:* Anak mendengar satu kata utuh, lalu menyusun kata itu dari huruf-huruf yang tersedia dalam urutan yang benar.
    *   Huruf disajikan sebagai tombol dengan urutan teracak. Anak menekan satu per satu untuk memasukkannya ke slot kata.
    *   Terdapat tombol "Hapus" untuk membatalkan huruf terakhir yang dimasukkan.
    *   Sistem mengecek kebenaran kata otomatis setelah semua slot terisi.

---

## 2. Aturan Domain Baru (Wajib Dipatuhi)
Aturan-aturan ini tidak boleh disederhanakan menggunakan *Math.random()* biasa.

**F. Pengecoh harus huruf yang mudah tertukar**
Pengecoh (distractor) **TIDAK BOLEH** diambil acak dari seluruh abjad. Definisikan dan gunakan kelompok huruf yang sering tertukar bagi anak:
*   *Bentuk mirip:* `b d p q`, `m n w`, `u v`, `i j l`, `f t`, `c e`, `g q y`, `h n`
*   *Bunyi mirip:* `s z`, `f v`, `k g`, `t d`, `p b`, `m n`
*   *Vokal:* `a e i o u`

*Aturan Pemilihan Pengecoh:*
1.  Cari kelompok yang memuat huruf jawaban benar.
2.  Ambil pengecoh dari kelompok tersebut terlebih dahulu.
3.  Jika jumlah anggota kelompok kurang (butuh 2 pengecoh), baru lengkapi dengan huruf acak lain.
4.  Pengecoh tidak boleh sama dengan jawaban benar dan tidak boleh kembar.

**G. Pengecoh harus setipe dengan huruf yang disembunyikan**
*   Jika huruf yang disembunyikan adalah **VOKAL**, kedua pengecoh juga harus vokal.
*   Jika huruf yang disembunyikan adalah **KONSONAN**, kedua pengecoh juga harus konsonan.
*(Tanpa aturan ini, anak bisa menebak benar hanya dengan melihat mana satu-satunya vokal di antara pilihan tanpa mendengar soalnya)*.

**H. Sesi terbatas dan bisa diselesaikan**
*   Setiap level latihan (Level 2 sampai 5) dan Level 1 dijalankan dalam bentuk "Sesi" dengan jumlah soal terbatas.
*   Sebelum mulai, sediakan UI agar guru bisa memilih panjang sesi: **10, 15, atau 20 soal** (Default: 10). Pilihan ini harus jelas terlihat sebelum anak mulai, bukan disembunyikan di menu pengaturan.
*   Soal diambil secara acak dari bank soal. Dalam satu sesi, **tidak boleh ada soal yang sama muncul dua kali**.
*   Setelah soal terakhir dijawab, akhiri sesi dan tampilkan Layar Hasil Sesi.

**I. Layar Hasil Sesi**
Setelah sesi selesai, tampilkan layar (overlay/pane baru) yang berisi:
*   Jumlah benar dari total soal.
*   Jumlah total bintang yang dikumpulkan.
*   Daftar soal yang sempat dijawab salah, ditulis lengkap (misal: "BU, MATA, KANCIL"). Tujuannya agar guru tahu apa yang perlu diulang besok.
*   Tombol "Main Lagi" (memulai sesi baru) dan tombol kembali ke pilihan level.
*   Kalimat UX harus tetap ramah anak dan tidak menghakimi, meskipun banyak salah.

---

## 3. Perluasan Bank Soal
Data dalam script JS wajib diperbanyak dan divalidasi:
*   **SYLLABLE_DATA:** Perbanyak menjadi minimal 40 suku kata.
*   **WORDS_4:** Perbanyak menjadi minimal 40 kata (semuanya tepat 4 huruf).
*   **WORDS_LONG:** Perbanyak menjadi minimal 40 kata (semuanya 5 atau 6 huruf).
*   *Syarat Validasi:* Semua kata harus konkret dan dikenali oleh anak TK-SD kelas 1. Setiap kata wajib dilengkapi emoji yang benar-benar mewakili maknanya. Pastikan memvalidasi string `.length` dari setiap kata agar tidak ada yang meleset dari kriteria levelnya.

---

## 4. Perbaikan Bug yang Sudah Terlihat
1.  **Level 1 (Kenal Suku Kata):** Saat ini emoji petunjuk tidak sesuai dengan suku katanya dan teks suku kata tampil dua kali. Perbaiki agar emoji benar-benar mewakili contoh kata, dan tidak ada teks ganda.
2.  **UI Tombol Level:** Label tombol level terpotong dan terbelah tidak rapi di layar sempit (tampil seperti "Level 1Suku Kata"). Perbaiki CSS agar label tetap terbaca rapi di lebar layar HP (375px).

---

## 5. Catatan UX & Desain
*   **Mobile-First:** Target lebar maksimal tetap 440px (HP).
*   **Gaya Visual:** Tetap ikuti gaya visual yang sudah ada sekarang (chunky buttons, border tebal, warna-warni ceria). Jangan mengganti tema atau membuang CSS yang sudah ada.
*   **Aksesibilitas Sentuhan:** Tombol besar dan mudah disentuh (khususnya untuk Mode Susun Huruf).
*   **Bahasa:** Bahasa Indonesia sederhana dan ramah anak.

---

## 6. Tahapan Implementasi (Step-by-Step)
Ikuti urutan pengerjaan berikut secara bertahap (high-level plan):

1.  **Tahap 1: Perbaikan Bug & Perluasan Bank Soal**
    *   Perbaiki CSS pada tombol pemilihan level yang terpotong.
    *   Perbaiki render DOM pada flashcard Level 1 agar emoji dan teks tidak ganda/meleset.
    *   Perbanyak `SYLLABLE_DATA`, `WORDS_4`, dan `WORDS_LONG` menjadi masing-masing minimal 40 item dan tambahkan emojinya.
2.  **Tahap 2: Algoritma Pengecoh Cerdas (Aturan F & G)**
    *   Buat konstanta kelompok huruf yang mudah tertukar.
    *   Tulis ulang logika pencarian pengecoh (`distractors`) agar memprioritaskan kesamaan tipe (Vokal/Konsonan) dan mengambil huruf dari kelompok tertukar jika tersedia.
3.  **Tahap 3: Sistem Sesi, Batas Soal, dan Layar Hasil (Aturan H & I)**
    *   Tambahkan UI (misalnya deretan pill/dropdown) untuk memilih panjang sesi (10/15/20) di setiap kartu mode.
    *   Buat state management sesi (array soal teracak, soal ke-n, daftar salah).
    *   Buat UI Layar Hasil Sesi yang muncul setelah soal terakhir dijawab, menampilkan skor dan daftar evaluasi.
4.  **Tahap 4: Reorganisasi Level Baca Kata (Level 1-4)**
    *   Sesuaikan menu UI menjadi 5 Level.
    *   Implementasikan Level 2 baru (Lengkapi Suku Kata).
    *   Pastikan Level 1, 2, 3, dan 4 mengadopsi sistem Sesi yang baru dibuat di Tahap 3.
5.  **Tahap 5: Interaksi Susun Huruf (Level 5)**
    *   Bangun UI dan logika interaksi Susun Huruf: slot kata kosong, render tombol-tombol huruf acak di bawahnya, dan tombol hapus/undo.
    *   Hubungkan verifikasi input huruf ke sistem Sesi dan hasil akhir.
6.  **Tahap 6: QA dan Finishing**
    *   Uji coba seluruh flow aplikasi di ukuran layar 375px - 440px.
    *   Pastikan tidak ada interaksi yang rusak dari tahap pengembangan sebelumnya.
