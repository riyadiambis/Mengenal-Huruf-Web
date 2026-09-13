/* ==========================================================================
   TAHAP 2 & ATURAN E: TEXT-TO-SPEECH (TTS) & AUDIO SFX
   ========================================================================== */
let preferredVoice = null;

function loadVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  // Filter Indonesian voices
  const idVoices = voices.filter(v => v.lang && v.lang.toLowerCase().includes('id'));
  if (idVoices.length > 0) {
    // Prioritize female names
    const femaleVoice = idVoices.find(v => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('wanita') || name.includes('perempuan') || name.includes('woman');
    });
    preferredVoice = femaleVoice || idVoices[0];
  } else {
    preferredVoice = null;
  }
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoice;
}
window.addEventListener('DOMContentLoaded', loadVoice);

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.85;
    utterance.pitch = 1.15;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    // Silent fallback
  }
}

function playBeep(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'try-again') {
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(220.00, ctx.currentTime + 0.2); // A3
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {}
}

function triggerHaptic() {
  if ('vibrate' in navigator) {
    try { navigator.vibrate([40, 30, 40]); } catch (e) {}
  }
}

/* ==========================================================================
   UTILITIES: SHUFFLE & HELPERS
   ========================================================================== */
// Fisher-Yates shuffle
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Algoritma Pengecoh Cerdas (Aturan G lalu Aturan F sesuai KLARIFIKASI 1)
function getDistractors(targetChar) {
  const upper = targetChar.toUpperCase();
  const isVowel = VOWELS.includes(upper);

  // 1. Tentukan tipe huruf jawaban: vokal atau konsonan.
  // 2. Buat daftar kandidat yang HANYA berisi huruf bertipe sama. Ini wajib dan tidak boleh dilanggar.
  const candidatePool = (isVowel ? VOWELS : CONSONANTS).filter(c => c !== upper);

  // 3. Dari daftar kandidat itu, prioritaskan huruf yang satu kelompok dengan jawaban di daftar huruf mudah tertukar.
  const prioritySet = new Set();
  CONFUSING_GROUPS.forEach(group => {
    if (group.includes(upper)) {
      group.forEach(member => {
        // Hanya masukkan jika ada dalam candidatePool (artinya bertipe sama persis!)
        if (member !== upper && candidatePool.includes(member)) {
          prioritySet.add(member);
        }
      });
    }
  });

  const priorityCandidates = shuffleArray(Array.from(prioritySet));
  const chosenDistractors = [];

  for (const char of priorityCandidates) {
    if (chosenDistractors.length < 2) {
      chosenDistractors.push(char);
    }
  }

  // 4. Jika anggota sekelompok yang setipe kurang dari 2, lengkapi dengan huruf lain dari daftar kandidat setipe acak.
  if (chosenDistractors.length < 2) {
    const remainingPool = shuffleArray(candidatePool.filter(c => !chosenDistractors.includes(c)));
    for (const char of remainingPool) {
      if (chosenDistractors.length < 2) {
        chosenDistractors.push(char);
      }
    }
  }

  return chosenDistractors;
}

// Helper acak huruf Level 5 (Klarifikasi 3: hasil acak tidak boleh sama persis dengan kata asli)
function getShuffledLettersForWord(word) {
  const letters = word.split('');
  let shuffled = shuffleArray([...letters]);
  let attempts = 0;
  while (shuffled.join('') === word && attempts < 20) {
    shuffled = shuffleArray([...letters]);
    attempts++;
  }
  if (shuffled.join('') === word && shuffled.length > 1) {
    for (let i = 0; i < shuffled.length - 1; i++) {
      if (shuffled[i] !== shuffled[i + 1]) {
        [shuffled[i], shuffled[i + 1]] = [shuffled[i + 1], shuffled[i]];
        break;
      }
    }
  }
  return shuffled;
}

/* ==========================================================================
   TAHAP 3: MODE KENALAN HURUF
   ========================================================================== */
let kenalanStartIdx = 0; // 'A'
let kenalanEndIdx = 25;  // 'Z'
let currentKenalanIdx = 0;

function initKenalanSelectors() {
  const selStart = document.getElementById('kenalan-select-start');
  const selEnd = document.getElementById('kenalan-select-end');
  selStart.innerHTML = '';
  selEnd.innerHTML = '';

  ALPHABET_DATA.forEach((item, idx) => {
    selStart.add(new Option(item.char, idx));
    selEnd.add(new Option(item.char, idx));
  });

  selStart.value = 0;
  selEnd.value = 25;
  renderKenalanPills();
  updateKenalanCard();
}

function onKenalanRangeChange() {
  const rawStart = parseInt(document.getElementById('kenalan-select-start').value, 10) || 0;
  const rawEnd = parseInt(document.getElementById('kenalan-select-end').value, 10) || 25;

  kenalanStartIdx = Math.min(rawStart, rawEnd);
  kenalanEndIdx = Math.max(rawStart, rawEnd);

  document.getElementById('kenalan-select-start').value = kenalanStartIdx;
  document.getElementById('kenalan-select-end').value = kenalanEndIdx;

  document.getElementById('kenalan-range-badge').textContent = 
    `${ALPHABET_DATA[kenalanStartIdx].char} - ${ALPHABET_DATA[kenalanEndIdx].char}`;

  // Reset to first in range if current out of bounds
  if (currentKenalanIdx < kenalanStartIdx || currentKenalanIdx > kenalanEndIdx) {
    currentKenalanIdx = kenalanStartIdx;
  }

  renderKenalanPills();
  updateKenalanCard();
}

function renderKenalanPills() {
  const container = document.getElementById('kenalan-pill-scroll');
  container.innerHTML = '';

  for (let i = kenalanStartIdx; i <= kenalanEndIdx; i++) {
    const item = ALPHABET_DATA[i];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `letter-pill ${i === currentKenalanIdx ? 'active' : ''}`;
    btn.textContent = item.char;
    btn.onclick = () => {
      currentKenalanIdx = i;
      renderKenalanPills();
      updateKenalanCard();
      speakCurrentCard();
    };
    container.appendChild(btn);
  }
}

function updateKenalanCard() {
  const item = ALPHABET_DATA[currentKenalanIdx];
  const bigLetter = document.getElementById('kenalan-big-letter');
  const emoji = document.getElementById('kenalan-mascot-emoji');
  const name = document.getElementById('kenalan-mascot-name');
  const phonetic = document.getElementById('kenalan-mascot-phonetic');
  const indicator = document.getElementById('kenalan-indicator');

  // Animasi pop
  bigLetter.classList.remove('pop-anim');
  void bigLetter.offsetWidth;
  bigLetter.classList.add('pop-anim');

  bigLetter.textContent = item.char;
  emoji.textContent = item.emoji;
  name.textContent = item.name;
  phonetic.textContent = item.phonetic;

  const totalInRange = kenalanEndIdx - kenalanStartIdx + 1;
  const posInRange = currentKenalanIdx - kenalanStartIdx + 1;
  indicator.textContent = `Huruf ke-${posInRange} dari ${totalInRange}`;
}

function navigateLetter(dir) {
  const totalInRange = kenalanEndIdx - kenalanStartIdx + 1;
  let currentOffset = currentKenalanIdx - kenalanStartIdx;
  currentOffset = (currentOffset + dir + totalInRange) % totalInRange;
  currentKenalanIdx = kenalanStartIdx + currentOffset;

  renderKenalanPills();
  updateKenalanCard();
  speakCurrentCard();
}

function speakCurrentCard() {
  const item = ALPHABET_DATA[currentKenalanIdx];
  speak(`${item.char}... ${item.name}`);
}

/* ==========================================================================
   TAHAP 4 & ATURAN A: MODE TEBAK HURUF (ANTI HURUF BERDEKATAN)
   ========================================================================== */
let tebakStartIdx = 0;
let tebakEndIdx = 25;
let tebakRecentAnswers = []; // Max 4 elements, FIFO
let currentTebakItem = null;
let tebakQuestionCount = 1;
let tebakScore = 0;

function initTebakSelectors() {
  const selStart = document.getElementById('tebak-select-start');
  const selEnd = document.getElementById('tebak-select-end');
  selStart.innerHTML = '';
  selEnd.innerHTML = '';

  ALPHABET_DATA.forEach((item, idx) => {
    selStart.add(new Option(item.char, idx));
    selEnd.add(new Option(item.char, idx));
  });

  selStart.value = 0;
  selEnd.value = 25;
}

function onTebakRangeChange() {
  const rawStart = parseInt(document.getElementById('tebak-select-start').value, 10) || 0;
  const rawEnd = parseInt(document.getElementById('tebak-select-end').value, 10) || 25;

  tebakStartIdx = Math.min(rawStart, rawEnd);
  tebakEndIdx = Math.max(rawStart, rawEnd);

  document.getElementById('tebak-select-start').value = tebakStartIdx;
  document.getElementById('tebak-select-end').value = tebakEndIdx;

  document.getElementById('tebak-range-badge').textContent = 
    `${ALPHABET_DATA[tebakStartIdx].char} - ${ALPHABET_DATA[tebakEndIdx].char}`;

  generateQuizQuestion();
}

function resetTebakSession() {
  const confirmed = window.confirm('Mulai ulang sesi latihan dari awal? Skor bintang akan kembali ke 0.');
  if (!confirmed) return;

  tebakScore = 0;
  tebakQuestionCount = 1;
  tebakRecentAnswers = [];

  document.getElementById('tebak-score-val').textContent = '0';
  document.getElementById('tebak-soal-indicator').textContent = 'Soal 1';

  generateQuizQuestion();
}

// Penerapan ATURAN DOMAIN A secara presisi
function generateQuizQuestion() {
  // 1. Dapatkan kandidat dalam rentang
  const rangeCandidates = [];
  for (let i = tebakStartIdx; i <= tebakEndIdx; i++) {
    rangeCandidates.push(ALPHABET_DATA[i]);
  }

  // Hitung batas dinamis recentAnswers berdasarkan ukuran rentang.
  // Pada rentang 5 huruf, hanya 2 huruf terakhir yang dilarang, bukan 4.
  const maxRecent = Math.max(1, Math.floor(rangeCandidates.length / 2));

  // Potong recentAnswers jika melebihi batas baru (misal rentang baru diperkecil)
  while (tebakRecentAnswers.length > maxRecent) {
    tebakRecentAnswers.shift();
  }

  // 2. Filter kandidat yang TIDAK ada di recentAnswers
  let validCandidates = rangeCandidates.filter(item => !tebakRecentAnswers.includes(item.char));

  // PENGECUALIAN ATURAN A:
  // Jika setelah memfilter recentAnswers kandidat habis, abaikan recentAnswers
  if (validCandidates.length === 0) {
    validCandidates = rangeCandidates;
  }

  // Pilih 1 huruf acak dari validCandidates
  const chosenItem = validCandidates[Math.floor(Math.random() * validCandidates.length)];
  currentTebakItem = chosenItem;

  // Update recentAnswers (FIFO, max = maxRecent)
  tebakRecentAnswers.push(chosenItem.char);
  if (tebakRecentAnswers.length > maxRecent) {
    tebakRecentAnswers.shift();
  }

  // 3. Buat 2 pengecoh acak unik dari ALPHABET_DATA
  const otherLetters = ALPHABET_DATA.filter(it => it.char !== chosenItem.char);
  const shuffledOthers = shuffleArray(otherLetters);
  const distractors = [shuffledOthers[0].char, shuffledOthers[1].char];

  // 4. Acak urutan 3 pilihan
  const choices = shuffleArray([chosenItem.char, distractors[0], distractors[1]]);

  // Render ke UI
  document.getElementById('tebak-soal-indicator').textContent = `Soal ${tebakQuestionCount}`;
  document.getElementById('tebak-mascot-emoji').textContent = chosenItem.emoji;

  // Sembunyikan nama benda — hanya emoji yang terlihat, nama HANYA lewat TTS
  const revealedName = document.getElementById('tebak-revealed-name');
  revealedName.style.display = 'none';
  revealedName.textContent = '';

  const banner = document.getElementById('tebak-feedback-banner');
  banner.className = 'feedback-banner';
  banner.textContent = '';

  const optionsGrid = document.getElementById('tebak-options-grid');
  optionsGrid.innerHTML = '';

  choices.forEach(char => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-3d btn-choice';
    btn.textContent = char;
    btn.onclick = () => handleTebakAnswer(btn, char);
    optionsGrid.appendChild(btn);
  });
}

function handleTebakAnswer(btn, chosenChar) {
  const banner = document.getElementById('tebak-feedback-banner');
  const starBadge = document.getElementById('tebak-star-badge');
  const scoreVal = document.getElementById('tebak-score-val');
  const allBtns = document.querySelectorAll('#tebak-options-grid button');

  if (chosenChar === currentTebakItem.char) {
    // JAWABAN BENAR
    allBtns.forEach(b => b.disabled = true);
    btn.classList.add('correct');
    tebakScore++;
    scoreVal.textContent = tebakScore;

    starBadge.classList.remove('animate-star');
    void starBadge.offsetWidth;
    starBadge.classList.add('animate-star');

    playBeep('success');
    triggerHaptic();
    speak(`Hebat! Benar, huruf ${chosenChar} untuk ${currentTebakItem.name}`);

    // Setelah benar, BARU tampilkan nama benda di layar
    const revealedName = document.getElementById('tebak-revealed-name');
    revealedName.style.display = 'block';
    revealedName.innerHTML = `<strong>${currentTebakItem.emoji} ${currentTebakItem.name}</strong>`;

    banner.className = 'feedback-banner success';
    banner.innerHTML = `<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg> Pintar sekali! <strong>${chosenChar}</strong> untuk <strong>${currentTebakItem.name}</strong>!`;

    setTimeout(() => {
      tebakQuestionCount++;
      generateQuizQuestion();
    }, 1500);
  } else {
    // JAWABAN SALAH (Ramah anak, tidak menyalahkan)
    btn.classList.add('wrong', 'shake-anim');
    playBeep('try-again');
    speak('Ayo coba lagi');

    banner.className = 'feedback-banner try-again';
    banner.innerHTML = `Yuk coba lagi! Cari huruf depan dari benda ini ya! 😊`;

    setTimeout(() => {
      btn.classList.remove('wrong', 'shake-anim');
    }, 1000);
  }
}

function speakQuizHint() {
  if (currentTebakItem) {
    speak(`Gambar ${currentTebakItem.name}. Huruf awalnya apa ya?`);
  }
}

/* ==========================================================================
   TAHAP 3, 4, 5: MODE BACA KATA (5 LEVEL, SESI, & SUSUN HURUF)
   ========================================================================== */
let currentBacaLevel = 1;      // 1 to 5
let sessionLength = 10;        // 10, 15, or 20 (Aturan H, default 10)
let sessionQuestions = [];     // Bank soal sesi aktif
let sessionIndex = 0;          // Indeks soal aktif (0-indexed)
let sessionScore = 0;          // Skor bintang sesi (Level 2-5)
let sessionErrors = [];        // Daftar kata salah (Aturan I)

// Level 1 specific stats (Klarifikasi 2)
let lvl1UnderstoodInSession = 0;
let lvl1ViewedSet = new Set();

// Helper localStorage dengan try-catch aman (Aturan C)
function getMasteredSyllables() {
  try {
    const raw = localStorage.getItem('syllable_mastered');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveMasteredSyllable(syllableStr) {
  try {
    const mastered = getMasteredSyllables();
    mastered[syllableStr] = Date.now() + 7200000; // 2 jam = 7.200.000 ms
    localStorage.setItem('syllable_mastered', JSON.stringify(mastered));
  } catch (e) {}
}

function resetSyllableMasteredForTest() {
  try {
    localStorage.removeItem('syllable_mastered');
  } catch (e) {}
  initLevel1Session();
}

// Pemilihan Panjang Sesi (Aturan H)
function setSessionLength(len) {
  sessionLength = len;
  [10, 15, 20].forEach(n => {
    const btn = document.getElementById(`btn-session-${n}`);
    if (btn) {
      if (n === len) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
  startBacaSession();
}

function updateSubNavScrollIndicator() {
  const scrollEl = document.getElementById('sub-nav-scroll');
  const wrapper = document.getElementById('sub-nav-wrapper');
  if (!scrollEl || !wrapper) return;
  const isAtEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 8;
  if (isAtEnd) {
    wrapper.classList.add('at-end');
  } else {
    wrapper.classList.remove('at-end');
  }
}

// Pemilihan Level Baca Kata (1 sampai 5)
function switchBacaLevel(levelNum) {
  currentBacaLevel = levelNum;

  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`btn-lvl-${i}`);
    if (btn) {
      if (i === levelNum) {
        btn.classList.add('active');
        // Otomatis scroll pill yang aktif ke posisi terlihat (scrollIntoView)
        btn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      } else {
        btn.classList.remove('active');
      }
    }
  }

  setTimeout(updateSubNavScrollIndicator, 350);
  startBacaSession();
}

// Inisialisasi Sesi Baru pada Level yang Dipilih
function startBacaSession() {
  // Sembunyikan result screen
  document.getElementById('subpane-baca-result').classList.add('hidden');

  sessionIndex = 0;
  sessionScore = 0;
  sessionErrors = [];

  const paneLvl1 = document.getElementById('subpane-lvl-1');
  const paneQuiz = document.getElementById('subpane-lvl-quiz');
  const paneLvl5 = document.getElementById('subpane-lvl-5');

  paneLvl1.classList.add('hidden');
  paneQuiz.classList.add('hidden');
  paneLvl5.classList.add('hidden');

  if (currentBacaLevel === 1) {
    paneLvl1.classList.remove('hidden');
    initLevel1Session();
  } else if (currentBacaLevel >= 2 && currentBacaLevel <= 4) {
    paneQuiz.classList.remove('hidden');
    initQuizSession();
  } else if (currentBacaLevel === 5) {
    paneLvl5.classList.remove('hidden');
    initScrambleSession();
  }
}

function resetCurrentSession() {
  const confirmed = window.confirm('Mulai ulang sesi latihan ini dari awal?');
  if (!confirmed) return;
  startBacaSession();
}

function restartCurrentSession() {
  startBacaSession();
}

function chooseAnotherLevel() {
  document.getElementById('subpane-baca-result').classList.add('hidden');
  switchBacaLevel(1);
  const scrollEl = document.getElementById('sub-nav-scroll');
  if (scrollEl) {
    scrollEl.scrollTo({ left: 0, behavior: 'smooth' });
  }
  setTimeout(updateSubNavScrollIndicator, 350);
}

/* --------------------------------------------------------------------------
   LEVEL 1: KENAL SUKU KATA (KLARIFIKASI 2: TANPA SKOR)
   -------------------------------------------------------------------------- */
function initLevel1Session() {
  const now = Date.now();
  const mastered = getMasteredSyllables();

  // Aturan B: Salin SYLLABLE_DATA ke array baru, acak dengan Fisher-Yates
  const shuffled = shuffleArray([...SYLLABLE_DATA]);

  // Aturan C: Filter kartu yang kedaluwarsanya belum lewat
  const available = shuffled.filter(item => {
    const expiry = mastered[item.syllable];
    return !expiry || expiry < now;
  });

  // KLARIFIKASI 2: Gunakan sisa kartu jika kurang dari sessionLength, jangan duplikasi
  const actualCount = Math.min(sessionLength, available.length);
  sessionQuestions = available.slice(0, actualCount);

  sessionIndex = 0;
  lvl1UnderstoodInSession = 0;
  lvl1ViewedSet = new Set();

  const cardContent = document.getElementById('lvl1-card-content');
  const allMastered = document.getElementById('lvl1-all-mastered');

  if (sessionQuestions.length === 0) {
    cardContent.classList.add('hidden');
    allMastered.classList.remove('hidden');
    return;
  }

  cardContent.classList.remove('hidden');
  allMastered.classList.add('hidden');
  renderLevel1Card();
}

function renderLevel1Card() {
  if (sessionIndex >= sessionQuestions.length) {
    showSessionResult();
    return;
  }

  const item = sessionQuestions[sessionIndex];
  lvl1ViewedSet.add(item.syllable);

  document.getElementById('lvl1-card-indicator').textContent = 
    `Kartu ${sessionIndex + 1} dari ${sessionQuestions.length}`;
  document.getElementById('lvl1-syllable-text').textContent = item.syllable;
  document.getElementById('lvl1-syllable-icon').textContent = item.icon || '⭐';
  document.getElementById('lvl1-syllable-word').textContent = item.word || item.syllable;
}

function navigateSyllable(dir) {
  if (sessionQuestions.length === 0) return;
  const nextIdx = sessionIndex + dir;
  if (nextIdx < 0) {
    sessionIndex = sessionQuestions.length - 1;
  } else if (nextIdx >= sessionQuestions.length) {
    showSessionResult();
    return;
  } else {
    sessionIndex = nextIdx;
  }
  renderLevel1Card();
  speakCurrentSyllable();
}

function speakCurrentSyllable() {
  if (sessionQuestions.length > 0 && sessionIndex < sessionQuestions.length) {
    const item = sessionQuestions[sessionIndex];
    speak(`${item.syllable}... ${item.word || ''}`);
  }
}

function markCurrentSyllableUnderstood() {
  if (sessionQuestions.length === 0 || sessionIndex >= sessionQuestions.length) return;
  const item = sessionQuestions[sessionIndex];
  saveMasteredSyllable(item.syllable);
  lvl1UnderstoodInSession++;

  playBeep('success');
  triggerHaptic();

  sessionIndex++;
  if (sessionIndex >= sessionQuestions.length) {
    showSessionResult();
  } else {
    renderLevel1Card();
    speakCurrentSyllable();
  }
}

/* --------------------------------------------------------------------------
   LEVEL 2, 3, 4: LENGKAPI HURUF (QUIZ DENGAN ATURAN G & F)
   -------------------------------------------------------------------------- */
let currentQuizItem = null;
let isQuizAnswered = false;
let quizCurrentHadError = false;

function initQuizSession() {
  let sourceData = [];
  if (currentBacaLevel === 2) {
    sourceData = SYLLABLE_DATA;
  } else if (currentBacaLevel === 3) {
    sourceData = WORDS_4;
  } else if (currentBacaLevel === 4) {
    sourceData = WORDS_LONG;
  }

  const shuffled = shuffleArray([...sourceData]);
  sessionQuestions = shuffled.slice(0, Math.min(sessionLength, shuffled.length));
  sessionIndex = 0;
  sessionScore = 0;
  sessionErrors = [];

  document.getElementById('lvl-quiz-score-val').textContent = '0';
  generateQuizQuestionCard();
}

function generateQuizQuestionCard() {
  if (sessionIndex >= sessionQuestions.length) {
    showSessionResult();
    return;
  }

  isQuizAnswered = false;
  quizCurrentHadError = false;

  const qItem = sessionQuestions[sessionIndex];
  const indicator = document.getElementById('lvl-quiz-progress');
  indicator.textContent = `Soal ${sessionIndex + 1} dari ${sessionQuestions.length}`;

  const mascotArea = document.getElementById('lvl-quiz-mascot-area');
  const emojiEl = document.getElementById('lvl-quiz-emoji');
  const syllableHint = document.getElementById('lvl-quiz-syllable-hint');
  const wordDisplay = document.getElementById('lvl-quiz-word-display');
  const banner = document.getElementById('lvl-quiz-feedback-banner');
  const nextBtn = document.getElementById('btn-lvl-quiz-next');
  const listenText = document.getElementById('lvl-quiz-listen-text');

  banner.className = 'feedback-banner';
  banner.textContent = '';
  nextBtn.classList.add('hidden');

  let targetText = '';
  let correctLetter = '';
  let missingIndex = 0;

  if (currentBacaLevel === 2) {
    // Level 2: Lengkapi Suku Kata (misal "BU")
    targetText = qItem.syllable;
    missingIndex = Math.random() < 0.5 ? 0 : 1;
    correctLetter = targetText[missingIndex];

    mascotArea.style.display = 'none';
    syllableHint.classList.remove('hidden');
    document.getElementById('lvl-quiz-hint-icon').textContent = qItem.icon || '📚';
    document.getElementById('lvl-quiz-hint-word').textContent = qItem.word || qItem.syllable;
    listenText.textContent = 'Dengarkan Suku Kata';

    wordDisplay.className = 'syllable-slot-box';
  } else {
    // Level 3 & 4: Kata 4 Huruf / Kata Panjang
    targetText = qItem.word;
    missingIndex = Math.floor(Math.random() * targetText.length);
    correctLetter = targetText[missingIndex];

    mascotArea.style.display = 'flex';
    emojiEl.textContent = qItem.emoji || '📖';
    syllableHint.classList.add('hidden');
    listenText.textContent = 'Dengarkan Kata';

    wordDisplay.className = (currentBacaLevel === 4) ? 'word-slot-container dense' : 'word-slot-container';
  }

  // Render slots
  wordDisplay.innerHTML = '';
  for (let i = 0; i < targetText.length; i++) {
    if (i === missingIndex) {
      const slot = document.createElement('span');
      slot.className = 'missing-slot';
      slot.id = 'quiz-missing-slot';
      slot.textContent = '_';
      wordDisplay.appendChild(slot);
    } else {
      const span = document.createElement('span');
      span.textContent = targetText[i];
      wordDisplay.appendChild(span);
    }
  }

  // Pengecoh Cerdas dengan Aturan G lalu F (Klarifikasi 1)
  const distractors = getDistractors(correctLetter);
  const choices = shuffleArray([correctLetter, distractors[0], distractors[1]]);

  currentQuizItem = {
    item: qItem,
    targetText: targetText,
    correctLetter: correctLetter,
    missingIndex: missingIndex,
    choices: choices
  };

  // Render options grid
  const optionsGrid = document.getElementById('lvl-quiz-options-grid');
  optionsGrid.innerHTML = '';

  choices.forEach(char => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-3d btn-choice';
    btn.textContent = char;
    btn.onclick = () => handleQuizChoice(btn, char);
    optionsGrid.appendChild(btn);
  });
}

function handleQuizChoice(btn, chosenChar) {
  if (isQuizAnswered) return;

  const slot = document.getElementById('quiz-missing-slot');
  const banner = document.getElementById('lvl-quiz-feedback-banner');
  const starBadge = document.getElementById('lvl-quiz-star-badge');
  const scoreVal = document.getElementById('lvl-quiz-score-val');
  const nextBtn = document.getElementById('btn-lvl-quiz-next');
  const allBtns = document.querySelectorAll('#lvl-quiz-options-grid button');

  if (chosenChar === currentQuizItem.correctLetter) {
    // BENAR
    isQuizAnswered = true;
    allBtns.forEach(b => b.disabled = true);
    btn.classList.add('correct');

    slot.textContent = chosenChar;
    slot.className = 'missing-slot filled-correct';

    if (!quizCurrentHadError) {
      sessionScore++;
      scoreVal.textContent = sessionScore;
      starBadge.classList.remove('animate-star');
      void starBadge.offsetWidth;
      starBadge.classList.add('animate-star');
    }

    playBeep('success');
    triggerHaptic();

    const successText = currentBacaLevel === 2 ? currentQuizItem.targetText : `${currentQuizItem.targetText} ${currentQuizItem.item.emoji || ''}`;
    speak(`Benar! ${chosenChar}... ${currentQuizItem.targetText}!`);

    banner.className = 'feedback-banner success';
    banner.innerHTML = `<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg> Betul sekali! <strong>${successText}</strong>`;

    nextBtn.classList.remove('hidden');

    // Otomatis lanjut jika tidak ditekan dalam 1.8 detik
    setTimeout(() => {
      if (isQuizAnswered) {
        advanceQuizQuestion();
      }
    }, 1800);
  } else {
    // SALAH
    slot.textContent = chosenChar;
    slot.className = 'missing-slot filled-wrong';
    btn.classList.add('wrong', 'shake-anim');

    playBeep('try-again');
    speak('Bukan');

    if (!sessionErrors.includes(currentQuizItem.targetText)) {
      sessionErrors.push(currentQuizItem.targetText);
    }
    quizCurrentHadError = true;

    banner.className = 'feedback-banner try-again';
    banner.innerHTML = `Coba lagi ya! Bukan huruf <strong>${chosenChar}</strong> <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;

    setTimeout(() => {
      slot.textContent = '_';
      slot.className = 'missing-slot';
      btn.classList.remove('wrong', 'shake-anim');
    }, 900);
  }
}

function advanceQuizQuestion() {
  sessionIndex++;
  generateQuizQuestionCard();
}

function speakCurrentQuizQuestion() {
  if (currentQuizItem) {
    speak(currentQuizItem.targetText);
  }
}

/* --------------------------------------------------------------------------
   LEVEL 5: SUSUN HURUF (KLARIFIKASI 3 & 4)
   -------------------------------------------------------------------------- */
let scrambleSlots = [];
let scramblePool = [];
let isScrambleLocked = false;
let scrambleCurrentHadError = false;

function initScrambleSession() {
  // KLARIFIKASI 3: WORDS_4 dan WORDS_LONG digabung, HANYA kata 4-5 huruf (tidak ada 6 huruf)
  const combined = [...WORDS_4, ...WORDS_LONG].filter(item => item.word.length >= 4 && item.word.length <= 5);
  const shuffled = shuffleArray(combined);
  sessionQuestions = shuffled.slice(0, Math.min(sessionLength, shuffled.length));
  sessionIndex = 0;
  sessionScore = 0;
  sessionErrors = [];

  document.getElementById('lvl5-score-val').textContent = '0';
  generateScrambleQuestion();
}

function generateScrambleQuestion() {
  if (sessionIndex >= sessionQuestions.length) {
    showSessionResult();
    return;
  }

  isScrambleLocked = false;
  scrambleCurrentHadError = false;

  const qItem = sessionQuestions[sessionIndex];
  const word = qItem.word;

  document.getElementById('lvl5-progress').textContent = 
    `Soal ${sessionIndex + 1} dari ${sessionQuestions.length}`;
  document.getElementById('lvl5-mascot-emoji').textContent = qItem.emoji || '📖';

  const banner = document.getElementById('lvl5-feedback-banner');
  banner.className = 'feedback-banner';
  banner.textContent = '';

  // KLARIFIKASI 3: Huruf tepat sejumlah kata, urutan teracak dan tidak sama persis dengan kata asli
  const shuffledLetters = getShuffledLettersForWord(word);

  scramblePool = shuffledLetters.map((char, idx) => ({
    id: idx,
    letter: char,
    isUsed: false
  }));

  scrambleSlots = new Array(word.length).fill(null);

  renderScrambleUI();
}

function renderScrambleUI() {
  const slotsContainer = document.getElementById('lvl5-slots-container');
  const poolContainer = document.getElementById('lvl5-pool-container');

  slotsContainer.innerHTML = '';
  scrambleSlots.forEach((slotData, slotIdx) => {
    const slotEl = document.createElement('div');
    slotEl.className = `scramble-slot ${slotData ? 'filled' : ''}`;
    slotEl.textContent = slotData ? slotData.letter : '';
    slotEl.onclick = () => {
      if (isScrambleLocked || !slotData) return;
      unslotLetter(slotIdx);
    };
    slotsContainer.appendChild(slotEl);
  });

  poolContainer.innerHTML = '';
  scramblePool.forEach((item, poolIdx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-letter-scramble';
    btn.textContent = item.letter;
    btn.disabled = item.isUsed || isScrambleLocked;
    btn.onclick = () => {
      if (isScrambleLocked || item.isUsed) return;
      slotLetter(poolIdx);
    };
    poolContainer.appendChild(btn);
  });
}

function slotLetter(poolIdx) {
  if (isScrambleLocked) return;
  const firstEmptySlotIdx = scrambleSlots.findIndex(s => s === null);
  if (firstEmptySlotIdx === -1) return;

  const poolItem = scramblePool[poolIdx];
  poolItem.isUsed = true;
  scrambleSlots[firstEmptySlotIdx] = {
    letter: poolItem.letter,
    poolIdx: poolIdx
  };

  // Bunyikan huruf yang dipilih, KECUALI jika ini adalah huruf terakhir yang mengisi slot penuh
  const isLastLetter = scrambleSlots.every(s => s !== null);
  if (!isLastLetter) {
    speak(poolItem.letter);
  }

  renderScrambleUI();
  checkScrambleCompletion();
}

function unslotLetter(slotIdx) {
  if (isScrambleLocked) return;
  const slotData = scrambleSlots[slotIdx];
  if (!slotData) return;

  scramblePool[slotData.poolIdx].isUsed = false;
  scrambleSlots[slotIdx] = null;

  renderScrambleUI();
}

function undoLastScrambleLetter() {
  if (isScrambleLocked) return;
  for (let i = scrambleSlots.length - 1; i >= 0; i--) {
    if (scrambleSlots[i] !== null) {
      unslotLetter(i);
      break;
    }
  }
}

function resetScrambleSlots() {
  if (isScrambleLocked) return;
  scramblePool.forEach(p => p.isUsed = false);
  scrambleSlots = new Array(scrambleSlots.length).fill(null);
  renderScrambleUI();
}

function checkScrambleCompletion() {
  const isComplete = scrambleSlots.every(s => s !== null);
  if (!isComplete) return;

  const qItem = sessionQuestions[sessionIndex];
  const assembledWord = scrambleSlots.map(s => s.letter).join('');
  const targetWord = qItem.word;

  isScrambleLocked = true;

  const slotEls = document.querySelectorAll('#lvl5-slots-container .scramble-slot');
  const banner = document.getElementById('lvl5-feedback-banner');

  if (assembledWord === targetWord) {
    // BENAR
    slotEls.forEach(el => {
      el.classList.remove('filled-wrong');
      el.classList.add('filled-correct');
    });

    playBeep('success');
    triggerHaptic();

    if (!scrambleCurrentHadError) {
      sessionScore++;
      document.getElementById('lvl5-score-val').textContent = sessionScore;
      const starBadge = document.getElementById('lvl5-star-badge');
      starBadge.classList.remove('animate-star');
      void starBadge.offsetWidth;
      starBadge.classList.add('animate-star');
    }

    speak(`Hebat! ${targetWord}!`);

    banner.className = 'feedback-banner success';
    banner.innerHTML = `<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg> Betul sekali! <strong>${targetWord}</strong> ${qItem.emoji || ''}`;

    setTimeout(() => {
      sessionIndex++;
      generateScrambleQuestion();
    }, 1600);
  } else {
    // SALAH (KLARIFIKASI 4)
    slotEls.forEach(el => {
      el.classList.add('filled-wrong', 'shake-anim');
    });

    playBeep('try-again');
    speak(targetWord); // Bunyikan kembali kata yang benar lewat suara

    if (!sessionErrors.includes(targetWord)) {
      sessionErrors.push(targetWord);
    }
    scrambleCurrentHadError = true;

    banner.className = 'feedback-banner try-again';
    banner.innerHTML = `Yuk coba lagi susun hurufnya! <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;

    // Setelah sekitar 1 detik, kosongkan semua slot dan kembalikan huruf ke posisi pilihan
    setTimeout(() => {
      resetScrambleSlots();
      isScrambleLocked = false;
      banner.className = 'feedback-banner';
      banner.textContent = '';
    }, 1100);
  }
}

function speakCurrentScrambleWord() {
  if (sessionQuestions[sessionIndex]) {
    speak(sessionQuestions[sessionIndex].word);
  }
}

/* --------------------------------------------------------------------------
   LAYAR HASIL SESI (ATURAN I & KLARIFIKASI 2)
   -------------------------------------------------------------------------- */
function showSessionResult() {
  document.getElementById('subpane-lvl-1').classList.add('hidden');
  document.getElementById('subpane-lvl-quiz').classList.add('hidden');
  document.getElementById('subpane-lvl-5').classList.add('hidden');

  const resultPane = document.getElementById('subpane-baca-result');
  resultPane.classList.remove('hidden');

  const statsScored = document.getElementById('result-stats-scored');
  const statsLvl1 = document.getElementById('result-stats-lvl1');
  const titleEl = document.getElementById('result-title');
  const subtitleEl = document.getElementById('result-subtitle');
  const iconEl = document.getElementById('result-icon');

  if (currentBacaLevel === 1) {
    // KLARIFIKASI 2: Level 1 tidak memakai sistem skor
    statsScored.style.display = 'none';
    statsLvl1.style.display = 'flex';

    iconEl.innerHTML = '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>';
    titleEl.textContent = 'Sesi Selesai! Hebat!';
    subtitleEl.textContent = 'Latihan Suku Kata selesai dengan sangat baik!';

    document.getElementById('result-lvl1-viewed').textContent = `${lvl1ViewedSet.size} Kartu`;
    document.getElementById('result-lvl1-understood').textContent = `${lvl1UnderstoodInSession} Kartu`;

    speak(`Hebat! Kamu sudah menyelesaikan sesi suku kata hari ini!`);
  } else {
    // Level 2 sampai 5 (Skor Bintang & Evaluasi Kata Salah)
    statsScored.style.display = 'flex';
    statsLvl1.style.display = 'none';

    const totalQ = sessionQuestions.length;
    document.getElementById('result-score-ratio').textContent = `${sessionScore} / ${totalQ}`;
    document.getElementById('result-stars').innerHTML = `<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" style="color: #f59e0b;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ${sessionScore}`;

    const wrongBox = document.getElementById('result-wrong-box');
    const wrongList = document.getElementById('result-wrong-list');
    const perfectBox = document.getElementById('result-perfect-box');

    if (sessionErrors.length > 0) {
      wrongBox.style.display = 'block';
      perfectBox.style.display = 'none';
      wrongList.innerHTML = '';
      sessionErrors.forEach(errItem => {
        const tag = document.createElement('span');
        tag.className = 'result-eval-badge';
        tag.textContent = errItem;
        wrongList.appendChild(tag);
      });
    } else {
      wrongBox.style.display = 'none';
      perfectBox.style.display = 'block';
    }

    if (sessionScore === totalQ) {
      iconEl.innerHTML = '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>';
      titleEl.textContent = 'Sempurna! Luar Biasa!';
      subtitleEl.textContent = 'Semua soal berhasil kamu selesaikan dengan benar!';
      speak(`Luar biasa! Sempurna! Kamu dapat ${sessionScore} bintang!`);
    } else {
      iconEl.innerHTML = '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>';
      titleEl.textContent = 'Sesi Selesai! Pintar!';
      subtitleEl.textContent = 'Kamu hebat dan pantang menyerah belajar membaca!';
      speak(`Hebat! Kamu menyelesaikan latihan dan dapat ${sessionScore} bintang!`);
    }
  }
}

/* ==========================================================================
   TAB SWITCHING
   ========================================================================== */
function switchTab(tabName) {
  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.add('hidden');
    p.style.display = 'none';
  });

  document.querySelectorAll('.main-nav button').forEach(b => {
    b.classList.remove('active');
  });

  const targetPane = document.getElementById(`pane-${tabName}`);
  const targetBtn = document.getElementById(`tab-btn-${tabName}`);

  if (targetPane && targetBtn) {
    targetPane.classList.remove('hidden');
    targetPane.style.display = 'flex';
    targetBtn.classList.add('active');
  }

  if (tabName === 'tebak') {
    generateQuizQuestion();
  } else if (tabName === 'baca') {
    switchBacaLevel(currentBacaLevel);
    setTimeout(updateSubNavScrollIndicator, 200);
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  initKenalanSelectors();
  initTebakSelectors();
  window.addEventListener('resize', updateSubNavScrollIndicator);
  setTimeout(updateSubNavScrollIndicator, 250);
});
