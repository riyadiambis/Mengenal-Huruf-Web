# ISSUE: Bangun Aplikasi Web "Ayo Belajar Huruf"

## Ringkasan Proyek

Buat **satu file `index.html`** (HTML + CSS + JS dalam satu file) berisi aplikasi edukasi
anak usia TK–SD kelas 1 untuk belajar mengenal huruf dan membaca kata. Aplikasi dijalankan
langsung di browser tanpa server, tanpa framework, tanpa build step, dan siap di-hosting
gratis di GitHub Pages.

**Target perangkat utama: HP (mobile-first, max-width ≈ 460 px).**

---

## Referensi Desain

Seluruh keputusan visual — palet warna, tipografi, bentuk kartu, gaya tombol — **harus
mengacu pada file-file di folder `docs/stitch_modern_static_web_redesign/`**:

| Subfolder | Menunjukkan |
|---|---|
| `ayo_belajar_huruf_redesign_interaktif/` | Tata letak utama: header, 3 tab navigasi, Mode Kenalan Huruf (flashcard + rentang huruf + scroll pill) |
| `ayo_belajar_huruf_mode_tebak_huruf/` | Mode Tebak Huruf: quiz card, 3 tombol jawaban chunky, skor bintang, penanda soal |
| `ayo_belajar_huruf_baca_kata_level_2_kata_4_huruf/` | Mode Baca Kata Level 2: kata 4 huruf, satu huruf dihilangkan, 3 pilihan |
| `ayo_belajar_huruf_baca_kata_level_3_kata_panjang/` | Mode Baca Kata Level 3: kata 5–6 huruf, tombol "Kata Berikutnya" |

Tiap subfolder berisi `code.html` (struktur & style) dan `screen.png` (screenshot).
**Buka dan baca semua file ini sebelum menulis kode.** Gunakan sebagai "north star" untuk:

- **Palet warna**: navy (#1e3a5f / #1c3150), yellow (#facc15 / #ffc93c), teal (#059669),
  coral (#fb7185), background grid biru muda.
- **Font**: Fredoka (heading, huruf besar) dan Quicksand/Nunito (body, keterangan).
  Load dari Google Fonts.
- **Gaya tombol**: chunky 3D dengan `border`, `box-shadow` bawah, efek `:active`
  translateY ke bawah (terasa "menekan").
- **Background**: pola grid kotak-kotak (notepad) menggunakan CSS `linear-gradient`.
- **Kartu konten**: `border-radius` besar (2xl–3xl), border tebal warna navy, shadow pop.

> **PENTING — Jangan pakai Tailwind CDN.** Referensi memakai Tailwind untuk kemudahan
> prototipe, tapi output akhir harus **vanilla CSS murni**. Terjemahkan semua class
> Tailwind ke CSS biasa. Boleh definisikan CSS custom properties (variabel) di `:root`
> untuk memudahkan konsistensi warna.

---

## Arsitektur File

```
web membaca/
├── docs/                          ← referensi desain (jangan diubah)
│   └── stitch_modern_static_web_redesign/
├── index.html                     ← OUTPUT UTAMA (satu file, bisa langsung dibuka)
├── README.md                      ← cara menjalankan & deploy ke GitHub Pages
└── ISSUE.md                       ← dokumen ini
```

Semua CSS ditulis di dalam `<style>` dan semua JS di dalam `<script>` di file
`index.html` yang sama. Tidak ada file terpisah.

---

## Tahap Pembangunan (Step by Step)

### Tahap 0 — Scaffolding HTML & CSS Foundation

**Tujuan**: file `index.html` kosong tapi sudah punya fondasi visual lengkap.

1. Buat boilerplate HTML5 dengan `lang="id"`, charset UTF-8, viewport mobile
   (`maximum-scale=1.0, user-scalable=no`).
2. Tambahkan tag `<link>` Google Fonts: **Fredoka** (wght 400–700) dan **Nunito**
   (wght 600–900).
3. Di dalam `<style>`, definisikan:
   - CSS variables di `:root` untuk semua warna (navy, yellow, teal, coral, green,
     background, border, dll.).
   - Reset dasar (`box-sizing: border-box`, margin/padding nol pada body).
   - `body` dengan font Fredoka, background grid kotak-kotak (lihat pola CSS
     `linear-gradient` di referensi), warna teks navy, `-webkit-tap-highlight-color:
     transparent`.
   - Class `.btn-3d` untuk efek tombol chunky: `transition: all 0.12s`, saat `:active`
     `transform: translateY(4–6px)` dan shadow mengecil.
   - Class `.card` untuk kartu konten: border tebal navy, border-radius besar,
     box-shadow pop.
   - Media query atau `max-width` pada kontainer utama (~460 px) agar tetap centang
     di layar besar.
4. Struktur body:
   - `<header>` — judul "Ayo Belajar Huruf!" dengan highlight kuning di bawah kata
     "Huruf!" dan emoji balon 🎈.
   - `<nav>` — 3 tombol tab: 🔤 Kenalan Huruf, 🎯 Tebak Huruf, 📖 Baca Kata.
   - `<main>` — kontainer kosong tempat konten mode akan dirender.
   - `<footer>` — teks "Dibuat dengan cinta untuk belajar membaca 💛".
5. Tab yang aktif diberi background kuning, tab lainnya putih. Klik tab memanggil
   fungsi `switchTab(name)` yang akan dibuat di tahap berikutnya.

**Kriteria selesai**: file bisa dibuka di browser, menampilkan header, 3 tab (belum
berfungsi), dan footer. Visual sudah sesuai referensi.

---

### Tahap 1 — Data Statis (JavaScript)

**Tujuan**: semua data konten sudah tersedia sebagai konstanta JavaScript.

1. Array `ALPHABET_DATA` berisi 26 objek `{ char, word, emoji }` untuk A–Z.
   Contoh: `{ char: 'A', word: 'Apel', emoji: '🍎' }`.
   Gunakan kata-kata konkret yang dikenali anak dan emoji yang jelas visualnya.
   Daftar lengkap yang disarankan (boleh disesuaikan asal tetap 26 item):

   ```
   A Apel 🍎, B Bebek 🦆, C Ceri 🍒, D Domba 🐑, E Elang 🦅,
   F Flamingo 🦩, G Gajah 🐘, H Harimau 🐯, I Ikan 🐟, J Jeruk 🍊,
   K Kucing 🐱, L Lumba-lumba 🐬, M Monyet 🐵, N Nanas 🍍,
   O Orangutan 🦧, P Paus 🐳, Q Quran 📖, R Rusa 🦌, S Sapi 🐮,
   T Tupai 🐿️, U Unta 🐫, V Vas 🏺, W Wortel 🥕, X Xilofon 🎼,
   Y Yoyo 🪀, Z Zebra 🦓
   ```

2. Array `SYLLABLE_DATA` untuk Mode Baca Kata Level 1. Berisi minimal 20 objek
   suku kata buka (konsonan + vokal): `{ syllable: 'BA', hint: '🏀' }`.
   Contoh: BA, BI, BU, CA, DA, DI, DU, GA, GU, HA, KA, KI, KU, LA, LI, MA, MI,
   NA, PA, PI, PU, RA, RI, RU, SA, SI, SU, TA, TI, TU.
   Pastikan jumlahnya cukup banyak (minimal 20) agar pengacakan bermakna.

3. Array `WORDS_4` untuk Level 2, berisi minimal 15 kata 4-huruf umum:
   `{ word: 'BOLA', emoji: '⚽' }`.
   Contoh: BOLA, BUKU, SAPI, TOPI, ROTI, MATA, KUDA, DASI, BAJU, GULA, PAKU,
   RUSA, TAMU, SATU, DUA, TIGA, LIMA, GIGI, KAKI, TALI.

4. Array `WORDS_LONG` untuk Level 3, berisi minimal 15 kata 5–6 huruf:
   `{ word: 'KANCIL', emoji: '🦌' }`.
   Contoh: KANCIL, MANGGA, JERAPAH, KELAPA, JERUK, PENSIL, EMBER, SAPU,
   KERBAU, KAMBING, SENDOK, GARPU, PAYUNG, LANGIT, BUNGA, SEPATU.
   (Pastikan panjang tiap kata antara 5–6 huruf.)

**Kriteria selesai**: data bisa diakses dari console browser tanpa error.

---

### Tahap 2 — Sistem Text-to-Speech (TTS)

**Tujuan**: fungsi `speak(text)` yang reliable untuk dipakai semua mode.

1. Buat variabel modul `let preferredVoice = null;`.
2. Buat fungsi `loadVoice()`:
   - Ambil daftar suara via `speechSynthesis.getVoices()`.
   - Filter suara yang `lang` mengandung `'id'` (case-insensitive).
   - Dari hasil filter, cari yang `name`-nya mengandung kata `'female'`, `'wanita'`,
     `'perempuan'`, atau `'woman'` (case-insensitive). Jika ada, pakai itu.
   - Jika tidak ada yang mengandung kata female, pakai suara Indonesia pertama yang
     ditemukan.
   - Jika tidak ada suara Indonesia sama sekali, biarkan `preferredVoice = null`
     (browser akan pakai default).
3. Panggil `loadVoice()` pada event `DOMContentLoaded`. Juga pasang listener di
   `speechSynthesis.onvoiceschanged = loadVoice` karena beberapa browser (terutama
   Chrome) baru menyediakan daftar suara setelah event ini.
4. Buat fungsi `speak(text)`:
   - Cek `'speechSynthesis' in window`, jika tidak ada, return saja.
   - `speechSynthesis.cancel()` untuk menghentikan ucapan sebelumnya.
   - Buat `SpeechSynthesisUtterance(text)`, set `lang = 'id-ID'`,
     `rate = 0.85`, `pitch = 1.15`.
   - Jika `preferredVoice` tidak null, set `utterance.voice = preferredVoice`.
   - `speechSynthesis.speak(utterance)`.
5. **(Opsional tapi bagus)** Buat fungsi `playBeep(type)` menggunakan Web Audio API
   untuk SFX singkat saat jawaban benar/salah — lihat contoh di referensi
   `redesign_interaktif/code.html`.

**Kriteria selesai**: panggil `speak('Halo anak-anak')` dari console, terdengar suara
Indonesia.

---

### Tahap 3 — Mode Kenalan Huruf

**Tujuan**: tab "Kenalan Huruf" berfungsi penuh.

**3a. Pengaturan Rentang Huruf**

1. Render sebuah kartu pengaturan di bagian atas:
   - Label "Pilih Rentang Huruf:" di kiri, badge "A - Z" di kanan (badge ini update
     dinamis sesuai pilihan).
   - Dua dropdown `<select>`: "Dari: [A]" dan "Ke: [Z]", masing-masing berisi option
     A–Z.
   - Validasi: jika "Dari" > "Ke", tukar nilainya (atau ambil min/max).
   - Di bawah dropdown, render baris tombol pill horizontal yang bisa di-scroll
     (`overflow-x: auto`, sembunyikan scrollbar). Tiap pill adalah satu huruf dalam
     rentang. Pill huruf aktif diberi warna kuning, sisanya putih.

2. Simpan state: `rangeStart` (indeks 0–25), `rangeEnd` (indeks 0–25),
   `currentLetterIndex` (indeks dalam ALPHABET_DATA).

3. Saat dropdown berubah (`onchange`), update rentang, render ulang pill, dan reset
   `currentLetterIndex` ke huruf pertama dalam rentang baru.

**3b. Flashcard Huruf**

1. Render kartu flashcard besar berisi:
   - Tombol ◀ (sebelumnya) dan ▶ (selanjutnya) di kiri-kanan atas.
   - Indikator "Huruf ke-X dari Y" di tengah atas.
   - Huruf raksasa (font-size ~6–8rem, font-weight black).
   - Emoji benda besar (font-size ~4rem) yang bisa diklik untuk mendengar suara.
   - Nama benda di bawah emoji (font tebal, capitalize).
   - Tombol "🔊 Dengarkan" lebar penuh di bawah.

2. Klik huruf pill → update flashcard ke huruf itu.
3. Klik ◀/▶ → navigasi ke huruf sebelum/sesudahnya **dalam rentang** (wrap around).
4. Klik "Dengarkan" atau klik emoji → panggil `speak('K... Kucing')` (huruf, jeda,
   nama benda).
5. Saat navigasi, tambahkan animasi kecil (scale bounce) pada huruf besar.

**Kriteria selesai**: bisa pilih rentang A–G, scroll pill, klik huruf, dengar suara,
navigasi maju mundur.

---

### Tahap 4 — Mode Tebak Huruf

**Tujuan**: tab "Tebak Huruf" berfungsi penuh.

**4a. Pengaturan Rentang Huruf (Shared)**

1. Mode ini juga punya kartu pengaturan rentang yang sama persis seperti Mode Kenalan
   Huruf. Bisa pakai fungsi render yang sama, tapi simpan state rentangnya terpisah
   (`quizRangeStart`, `quizRangeEnd`) supaya guru bisa set rentang berbeda per mode.
   Atau, jika ingin lebih simpel, pakai satu state rentang global yang berlaku untuk
   kedua mode — pilih salah satu pendekatan saja.

**4b. Quiz Card**

1. Render kartu kuis berisi:
   - Header: badge "Soal X" di kiri, badge "⭐ Y Bintang" di kanan.
   - Emoji benda besar di tengah (animate bounce ringan).
   - Teks: "Ini huruf awal dari **[Nama Benda]** apa ya?"
   - 3 tombol jawaban besar (grid 3 kolom): 1 huruf benar + 2 huruf pengecoh.
   - Banner feedback (tersembunyi, muncul setelah jawab).

2. **Logika soal baru** — fungsi `generateQuizQuestion()`:
   - Dari ALPHABET_DATA yang berada dalam rentang, pilih satu item sebagai jawaban.
   - **Aturan anti-berdekatan**: simpan array `recentAnswers` (max 4 elemen, FIFO).
     Huruf yang ada di `recentAnswers` TIDAK BOLEH terpilih sebagai jawaban berikutnya.
   - Pengecualian: jika setelah memfilter `recentAnswers` dari kandidat rentang,
     kandidat habis (0 tersisa), maka **abaikan `recentAnswers`** dan pilih dari seluruh
     rentang.
   - Setelah jawaban dipilih, push ke `recentAnswers`, dan jika panjangnya > 4,
     shift elemen terlama.
   - Pilih 2 huruf pengecoh dari ALPHABET_DATA (boleh di luar rentang, asal berbeda
     dari huruf benar dan berbeda satu sama lain).
   - Acak urutan 3 pilihan sebelum ditampilkan.

3. **Interaksi jawaban**:
   - **Benar**: tombol berubah hijau, banner muncul "🎉 Pintar sekali! [huruf] untuk
     [benda]!", skor bintang + 1, animasi pop di badge bintang, play SFX sukses,
     `speak('Hebat! Benar, huruf [X]')`. Setelah 1.5 detik, otomatis lanjut ke soal
     berikutnya.
   - **Salah**: tombol berubah coral/merah muda, banner muncul "Yuk coba lagi! 😊",
     play SFX try-again, `speak('Ayo coba lagi')`. Tombol-tombol TIDAK di-disable
     (anak boleh coba lagi di soal yang sama). Setelah 1 detik, warna tombol reset.
   - Counter "Soal X" naik setiap soal baru (bukan setiap klik).

**Kriteria selesai**: pilih rentang A–E, mainkan 10 soal, tidak ada huruf jawaban
yang muncul berturut-turut, skor bintang bertambah, feedback benar/salah jelas.

---

### Tahap 5 — Mode Baca Kata Level 1 (Flashcard Suku Kata)

**Tujuan**: sub-tab "Level 1 - Suku Kata" di dalam tab Baca Kata.

**5a. Sub-navigasi Level**

1. Di dalam tab "Baca Kata", render baris 3 tombol sub-level:
   - 🌱 Level 1 — Suku Kata
   - 🚀 Level 2 — Kata 4 Huruf
   - 🏆 Level 3 — Kata Panjang
2. Tombol level aktif diberi warna teal, lainnya putih.

**5b. Flashcard Suku Kata (satu per satu)**

1. Saat mode/level dibuka, **acak ulang urutan** `SYLLABLE_DATA` menggunakan
   Fisher-Yates shuffle. Simpan array hasil acak di state (`shuffledSyllables`).
   **Jangan tampilkan kartu dalam urutan array asli.**

2. Cek localStorage key `'syllable_mastered'` (try-catch!). Ini berisi objek
   `{ [syllable]: expiryTimestamp }`. Filter `shuffledSyllables`: hanya tampilkan
   kartu yang belum mastered atau yang `expiryTimestamp < Date.now()`.

3. Jika semua kartu tersembunyi (sudah dikuasai semua), tampilkan pesan:
   "🎉 Hebat! Semua suku kata sudah dikuasai! Coba lagi nanti ya."

4. Render **satu kartu** pada satu waktu (bukan daftar scroll), berisi:
   - Indikator "Kartu X dari Y" di atas.
   - Suku kata besar (misal "BA") di tengah, dalam kotak berwarna oranye/kuning
     dengan border chunky.
   - Emoji hint kecil di bawah suku kata.
   - Tombol "🔊 Dengarkan" — panggil `speak('[suku kata]')`.
   - Tombol navigasi: "◀ Sebelumnya" dan "▶ Selanjutnya".
   - Tombol "✅ Sudah Paham" (warna teal/hijau).

5. **Tombol navigasi maju/mundur**: pindah ke kartu sebelumnya/selanjutnya dalam
   `shuffledSyllables` yang belum dimasked. Wrap around jika perlu.

6. **Tombol "Sudah Paham"**:
   - Simpan `{ [syllable]: Date.now() + 7200000 }` ke localStorage key
     `'syllable_mastered'` (try-catch!).
   - Hapus kartu itu dari tampilan.
   - Lanjut ke kartu berikutnya. Jika tidak ada lagi, tampilkan pesan sukses.

7. Semua akses `localStorage.getItem` dan `localStorage.setItem` **wajib di dalam
   try-catch**. Jika error, abaikan saja (anggap tidak ada data mastered).

**Kriteria selesai**: buka Level 1, urutan kartu acak, tekan "Sudah Paham" pada
beberapa kartu, tutup tab lalu buka lagi — kartu yang di-paham tidak muncul.
Tunggu 2 jam (atau ubah waktu untuk testing), kartu muncul kembali.

---

### Tahap 6 — Mode Baca Kata Level 2 (Kata 4 Huruf, Isi Huruf Hilang)

**Tujuan**: sub-tab "Level 2 - Kata 4 Huruf".

1. Saat level dibuka, acak ulang urutan `WORDS_4`. Simpan `currentWordIndex = 0`,
   `wordScore = 0`.

2. Untuk setiap soal, panggil fungsi `generateWordQuiz(wordObj)`:
   - Ambil `word` (misal `'BOLA'`).
   - **Pilih posisi huruf yang dihilangkan secara acak** (indeks 0 sampai 3).
     Jangan selalu posisi pertama atau terakhir.
   - Huruf benar = `word[posisi]`.
   - Pilih 2 huruf pengecoh: acak dari A–Z, harus berbeda dari huruf benar dan
     berbeda satu sama lain (tidak boleh kembar).
   - Acak urutan 3 pilihan.
   - Return `{ displayLetters, missingIndex, correctLetter, choices }`.

3. Render kartu (lihat referensi `baca_kata_level_2`):
   - Header: "Kata X dari Y" di tengah, badge "⭐ Z" di kanan.
   - Huruf-huruf kata ditampilkan besar horizontal, huruf yang hilang diganti `_`
     dengan garis bawah tebal.
   - Tombol "🔊 Dengarkan Kata" — panggil `speak('[kata utuh]')`.
   - 3 tombol jawaban besar (grid 3 kolom).
   - Area feedback di bawah.

4. **Interaksi jawaban**:
   - **Benar**: huruf `_` terisi, warna hijau, tombol jawaban hijau, skor +1,
     feedback "🎉 Hebat! [KATA]", `speak('[huruf]! Hebat, [kata]!')`.
     Tampilkan tombol "Kata Berikutnya" atau auto-lanjut setelah 2 detik.
   - **Salah**: huruf `_` terisi sesaat dengan warna merah, feedback "Coba lagi ya!",
     `speak('Bukan')`. Setelah 0.9 detik, reset `_`. Anak boleh coba lagi.

5. Jika semua kata sudah dijawab benar, tampilkan pesan selesai dan skor total.

**Kriteria selesai**: mainkan sampai habis, posisi huruf hilang bervariasi,
pilihan tidak ada yang kembar.

---

### Tahap 7 — Mode Baca Kata Level 3 (Kata Panjang 5–6 Huruf)

**Tujuan**: sub-tab "Level 3 - Kata Panjang".

1. Logikanya **identik dengan Level 2**, hanya sumber datanya `WORDS_LONG` dan
   panjang katanya 5–6 huruf.

2. Semua aturan sama: posisi huruf hilang diacak, 2 pengecoh unik, urutan diacak.

3. Tampilan sama dengan Level 2 tapi spacing huruf lebih rapat karena kata lebih
   panjang (`letter-spacing` atau `gap` yang lebih kecil).

4. Referensi visual: lihat `baca_kata_level_3/screen.png` — perhatikan tracking
   huruf yang lebih lebar dan tombol "Kata Berikutnya" yang eksplisit.

**Kriteria selesai**: kata panjang tampil rapi, huruf hilang di posisi acak, interaksi
benar/salah berfungsi.

---

### Tahap 8 — Tab Switching & State Management

**Tujuan**: navigasi antar mode berjalan mulus.

1. Fungsi `switchTab(tabName)`:
   - Sembunyikan semua section (`.tab-pane`) dengan `display: none`.
   - Tampilkan section yang sesuai.
   - Update style tombol tab: aktif = kuning, lainnya = putih.
   - Jika masuk tab "Tebak Huruf", panggil `initQuiz()` atau `generateQuizQuestion()`.
   - Jika masuk tab "Baca Kata", render sub-level terakhir yang aktif.

2. Fungsi `switchBacaLevel(level)`:
   - Update style tombol sub-level.
   - Render konten sesuai level (1, 2, atau 3).
   - Level 1: acak ulang suku kata + filter mastered.
   - Level 2/3: acak ulang kata + reset skor.

3. **Jangan simpan state di URL hash**. Cukup variabel JavaScript biasa.

**Kriteria selesai**: berpindah-pindah antar tab dan level tanpa error,
state (skor, posisi kartu) terjaga selama sesi.

---

### Tahap 9 — Polish & Animasi

**Tujuan**: sentuhan akhir agar terasa premium dan menyenangkan.

1. Animasi pada huruf besar saat berubah: scale bounce (kecil → besar → normal).
2. Animasi wiggle/bounce pada emoji mascot.
3. Animasi pop pada badge bintang saat skor bertambah (scale up lalu kembali).
4. Transisi warna halus pada tombol jawaban (benar → hijau, salah → coral).
5. Haptic feedback opsional: `navigator.vibrate([40, 30, 40])` saat jawaban benar
   (cek dulu apakah API tersedia).
6. Pastikan semua tombol `user-select: none` dan `-webkit-tap-highlight-color:
   transparent` supaya tidak muncul highlight biru saat disentuh di HP.
7. Pastikan tidak ada scroll horizontal yang tidak disengaja di body.

**Kriteria selesai**: interaksi terasa responsif dan menyenangkan di HP.

---

### Tahap 10 — Buat README.md

**Tujuan**: instruksi singkat untuk pengguna/guru.

Isi README.md:

```markdown
# Ayo Belajar Huruf! 🎈

Aplikasi web gratis untuk anak usia TK–SD kelas 1 belajar mengenal huruf
dan membaca kata, langsung dari browser HP.

## Cara Menjalankan

1. Buka file `index.html` di browser apa saja (Chrome, Safari, Firefox).
2. Atau kunjungi: `https://[username].github.io/[repo-name]/`

Tidak perlu instalasi, tidak perlu internet (kecuali untuk Google Fonts
dan text-to-speech).

## Cara Publish ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload file `index.html` dan `README.md` ke branch `main`.
3. Buka Settings → Pages → Source: pilih branch `main`, folder `/ (root)`.
4. Klik Save. Dalam 1–2 menit, situs aktif di URL yang ditampilkan.

## Fitur

- 🔤 Mode Kenalan Huruf (A–Z dengan suara dan emoji)
- 🎯 Mode Tebak Huruf (kuis pilihan ganda dengan skor bintang)
- 📖 Mode Baca Kata 3 level (suku kata → kata 4 huruf → kata panjang)
- 🔊 Suara text-to-speech Bahasa Indonesia
- 📱 Mobile-first, dioptimalkan untuk HP
- 🆓 100% gratis, tanpa server, tanpa iklan
```

---

## Aturan Domain yang WAJIB Dipatuhi

Aturan-aturan di bawah ini adalah constraint bisnis yang **tidak boleh disederhanakan
atau diganti** dengan implementasi yang lebih mudah.

### A. Anti Huruf Berdekatan (Mode Tebak Huruf)

```
Simpan array `recentAnswers` berisi maks 4 huruf terakhir yang jadi jawaban.
Huruf di `recentAnswers` DILARANG jadi jawaban soal berikutnya.

PENGECUALIAN:
  Jika (jumlah huruf dalam rentang) - (jumlah huruf di recentAnswers yang ada
  dalam rentang) === 0, maka ABAIKAN recentAnswers dan pilih bebas dari rentang.

Jangan ganti dengan Math.random() biasa tanpa pengecekan.
```

### B. Urutan Flashcard Harus Acak (Mode Baca Kata Level 1)

```
Setiap kali mode/level dibuka:
  1. Copy SYLLABLE_DATA ke array baru.
  2. Jalankan Fisher-Yates shuffle pada array baru.
  3. Simpan hasil shuffle sebagai state aktif.

Tombol maju/mundur menavigasi array YANG SUDAH DIACAK, bukan array asli.
Array asli TIDAK BOLEH dimutasi.
```

### C. Aturan "Sudah Paham" (localStorage)

```
Saat tombol "Sudah Paham" ditekan:
  1. Hitung waktu kedaluwarsa: Date.now() + 7_200_000 (2 jam).
  2. Baca objek dari localStorage key 'syllable_mastered' (try-catch).
  3. Tambahkan/update entry: { [syllable]: expiryTimestamp }.
  4. Tulis kembali ke localStorage (try-catch).

Saat mode dibuka:
  1. Baca objek 'syllable_mastered' dari localStorage (try-catch).
  2. Filter: hanya tampilkan kartu yang TIDAK ADA di objek ATAU yang
     expiryTimestamp < Date.now().
  3. Jika semua terfilter, tampilkan pesan "Semua sudah dikuasai".

SEMUA localStorage harus try-catch. Jangan sampai app crash.
```

### D. Posisi Huruf Hilang Diacak (Level 2 & 3)

```
Untuk setiap soal kata:
  posisi = Math.floor(Math.random() * kata.length)
  hurufBenar = kata[posisi]
  pengecoh1 = huruf acak (bukan hurufBenar)
  pengecoh2 = huruf acak (bukan hurufBenar, bukan pengecoh1)
  pilihan = shuffle([hurufBenar, pengecoh1, pengecoh2])
```

### E. Pemilihan Suara TTS

```
1. Panggil speechSynthesis.getVoices().
2. Juga pasang listener onvoiceschanged (jangan andalkan getVoices() langsung).
3. Filter voices yang lang mengandung 'id'.
4. Dari hasil, prioritaskan yang name mengandung 'female'/'wanita'/'perempuan'.
5. Jika tidak ada suara ID, biarkan null (browser pakai default).
```

---

## Catatan UX Penting

| Aspek | Aturan |
|---|---|
| Target device | HP (mobile-first), max-width ~460px |
| Ukuran tombol | Minimal tinggi 48px, idealnya 56–80px untuk tombol jawaban |
| Bahasa UI | Bahasa Indonesia sederhana, ramah anak |
| Feedback salah | Tidak menyalahkan. Gunakan "Coba lagi ya! 😊", bukan "Salah!" |
| Feedback benar | Penuh semangat. "🎉 Pintar sekali!", "Hebat!" |
| Warna feedback | Benar = hijau emerald, Salah = coral/pink lembut |
| Font size huruf | Huruf utama minimal 4rem (64px) di flashcard/quiz |
| Aksesibilitas | Setiap tombol harus punya teks yang bermakna (bukan hanya ikon) |

---

## Checklist Final Sebelum Submit

- [ ] File `index.html` bisa dibuka langsung di browser tanpa server
- [ ] Tidak ada error di console browser
- [ ] Semua 3 tab berfungsi dan bisa berpindah-pindah
- [ ] Mode Kenalan Huruf: rentang, navigasi, suara berfungsi
- [ ] Mode Tebak Huruf: quiz berjalan, anti-berdekatan berlaku, skor berfungsi
- [ ] Mode Baca Kata Level 1: urutan acak, "Sudah Paham" + localStorage berfungsi
- [ ] Mode Baca Kata Level 2: posisi huruf hilang acak, interaksi benar/salah
- [ ] Mode Baca Kata Level 3: sama seperti Level 2 tapi kata lebih panjang
- [ ] TTS terdengar saat klik tombol dengarkan dan setelah jawab soal
- [ ] Tampilan mobile rapi di layar HP 375px–430px
- [ ] Tidak ada Tailwind CDN — semua styling vanilla CSS
- [ ] Tidak ada `import`, `require`, atau dependensi npm
- [ ] README.md ada dan berisi instruksi jelas
- [ ] Semua localStorage dibungkus try-catch
