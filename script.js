/* ════════════════════════════════════════════════════════
   PUNKT 3: BOOT SEQUENCE
════════════════════════════════════════════════════════ */
const BOOT_LINES = [
  // ── NAGŁÓWEK ────────────────────────────────────────────────────────
  { text: 'Initializing system boot sequence...', cls: 'dim', delay: 120 },
  { text: '', cls: '', delay: 220 },

  // ── SEKCJA 1: Pop!_OS / środowisko hosta ───────────────────────────
  { text: '[ INFO ] Host environment verified: Pop!_OS 24.04 LTS (x86_64)', cls: 'info', delay: 340 },
  { text: '[  OK  ] Loaded custom kernel modules', cls: 'ok', delay: 480 },
  { text: '[  OK  ] Started System Logging Service', cls: 'ok', delay: 590 },
  { text: '', cls: '', delay: 670 },

  // ── SEKCJA 2: Chmura i OPSEC ───────────────────────────────────────
  { text: '[  OK  ] Establishing encrypted cloud routing table', cls: 'ok', delay: 780 },
  { text: '[ WARN ] OPSEC Shield Active: Zero-Trust architecture enforced. Unsigned requests will be dropped', cls: 'warn', delay: 940 },
  { text: '[  OK  ] Secured external uplink', cls: 'ok', delay: 1120 },
  { text: '', cls: '', delay: 1200 },

  // ── SEKCJA 3: Hardware / Raspberry Pi Pico ─────────────────────────
  { text: '[  OK  ] Probing external interfaces...', cls: 'ok', delay: 1300 },
  { text: '[ INFO ] Hardware node detected: RP2350 (MicroPython runtime) attached to /dev/ttyACM0', cls: 'info', delay: 1430 },
  { text: '', cls: '', delay: 1540 },

  // ── SEKCJA 4: Virtual filesystems ─────────────────────────────────
  { text: 'Mounting virtual filesystems...', cls: 'dim', delay: 1620 },
  { text: '[  OK  ] Mounted /home/radoslawdunaj', cls: 'ok', delay: 1720 },
  { text: '[  OK  ] Mounted /home/radoslawdunaj/bio', cls: 'ok', delay: 1820 },
  { text: '[  OK  ] Mounted /home/radoslawdunaj/career_history', cls: 'ok', delay: 1920 },
  { text: '[  OK  ] Mounted /home/radoslawdunaj/source_code', cls: 'ok', delay: 2020 },
  { text: '[  OK  ] Mounted /home/radoslawdunaj/service_log', cls: 'ok', delay: 2110 },
  { text: '', cls: '', delay: 2190 },
  { text: 'Loading user profile: radoslawdunaj...', cls: '', delay: 2260 },
  { text: '[  OK  ] Profile loaded. Welcome back', cls: 'ok', delay: 2440 },
  { text: '', cls: '', delay: 2510 },
  { text: 'Launching portfolio interface...', cls: 'dim', delay: 2570 },
];

const bootEl   = document.getElementById('boot');
const linesEl  = document.getElementById('boot-lines');
const mainEl   = document.getElementById('main');
const BOOT_END = 3150; // ms kiedy strona przejmuje

BOOT_LINES.forEach(({ text, cls, delay }) => {
  setTimeout(() => {
    const div = document.createElement('div');
    div.className = 'boot-line visible' + (cls ? ' ' + cls : '');
    div.textContent = text || '\u00A0'; // NBSP dla pustych linii
    linesEl.appendChild(div);
    // autoscroll
    linesEl.scrollTop = linesEl.scrollHeight;
  }, delay);
});

setTimeout(() => {
  bootEl.classList.add('hidden');
  mainEl.classList.add('visible');
  // uruchom typewriter PO odsłonięciu strony
  startTypewriter();
}, BOOT_END);

/* ════════════════════════════════════════════════════════
   PUNKT 1 + 2: TYPEWRITER + GLITCH DECODE + LAG
════════════════════════════════════════════════════════ */

// Pula znaków do animacji dekodowania
const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

/**
 * Wpisuje jeden znak z animacją glitch-decode.
 * Przez FRAMES klatek pokazuje losowy znak w miejscu docelowej litery,
 * potem ustawia właściwy znak i wywołuje callback.
 *
 * @param {HTMLElement} span    - element do zapisu
 * @param {number}      pos     - indeks znaku w span.textContent
 * @param {string}      target  - docelowy znak
 * @param {number}      frames  - ile klatek glitchu przed ujawnieniem
 * @param {number}      frameMs - czas jednej klatki glitchu [ms]
 * @param {Function}    done    - callback po zakończeniu
 */
function decodeChar(span, pos, target, frames, frameMs, done) {
  let f = 0;

  // Zapisujemy znaki już potwierdzone
  const locked = span.textContent; // np. "Ra"

  const tick = setInterval(() => {
    // Odbuduj tekst: locked + glitch na pozycji pos + reszta pusta
    span.textContent = locked + randChar();
    f++;
    if (f >= frames) {
      clearInterval(tick);
      span.textContent = locked + target; // ustaw właściwy znak
      done();
    }
  }, frameMs);
}

/**
 * Wpisuje cały tekst litera po literze, każda z glitch-decode.
 * Obsługuje opcjonalny lag (pauza) na wskazanym indeksie znaku.
 *
 * @param {HTMLElement} el        - kontener (h1)
 * @param {string}      text      - tekst do wpisania
 * @param {string}      tag       - tag HTML dla spana
 * @param {string}      cls       - klasa CSS
 * @param {number}      lagAt     - indeks znaku, po którym wstawiamy lag (-1 = brak)
 * @param {number}      lagMs     - czas lagu [ms]
 * @param {Function}    onDone    - callback po wpisaniu całego tekstu
 */
function typeGlitch(el, text, tag, cls, lagAt, lagMs, onDone) {
  const cursor = document.getElementById('main-cursor');
  const span   = document.createElement(tag || 'span');
  if (cls) span.className = cls;
  el.insertBefore(span, cursor);

  let charIdx = 0;

  function nextChar() {
    if (charIdx >= text.length) {
      if (onDone) onDone();
      return;
    }

    const target = text[charIdx];
    const pos    = charIdx;
    charIdx++;

    // Znaki specjalne (łamanie linii, spacje) — wstaw od razu bez glitchu
    if (target === '\n' || target === ' ') {
      // dla \n używamy osobnego br — tutaj nie powinno trafić,
      // spację wstawiamy bez efektu
      span.textContent += target;
      setTimeout(nextChar, 60);
      return;
    }

    // Glitch: 2 klatki po 12ms = 24ms na znak + 5ms przerwy = ~29ms/znak
    decodeChar(span, pos, target, 2, 12, () => {
      if (pos === lagAt) setTimeout(nextChar, lagMs);
      else               setTimeout(nextChar, 5);
    });
  }

  nextChar();
}

/* ════════════════════════════════════════════════════════
   SOFT REVEAL — Miękkie pojawianie się sekcji
   Kaskada 160ms między sekcjami. Pauza 300ms po nagłówku.
════════════════════════════════════════════════════════ */

function stamp(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('stamp-hidden');
  // Wymuś reflow — bez tego przeglądarka może scalić obie klasy
  void el.offsetWidth;
  el.classList.add('stamp-active');
}

function revealSections() {
  const DELAY   = 300; // pauza po nagłówku
  const CASCADE = 160; // ms między sekcjami

  const sequence = [
    'sec-bio',
    'card-linkedin',
    'card-github',
    'card-instagram',
  ];

  sequence.forEach((id, i) => {
    setTimeout(() => stamp(id), DELAY + i * CASCADE);
  });

  // Footer — po ostatniej karcie
  setTimeout(() => {
    document.getElementById('sec-footer').classList.add('visible');
    // Glitch startuje po pełnym załadowaniu strony — dodatkowe 800ms buforu
    setTimeout(scheduleGlitch, 800);
  }, DELAY + sequence.length * CASCADE + 80);
}

function startTypewriter() {
  const label  = document.querySelector('.header-label');
  const h1     = document.getElementById('h1-target');
  const subtitle = document.querySelector('.subtitle');

  // Czyścimy label i subtitle — będą wpisane przez glitch
  const labelOriginal    = label.textContent;
  const subtitleOriginal = subtitle.textContent;
  label.textContent    = '';
  subtitle.textContent = '';

  // Kursor glitchu dla labela i subtitle (własny span inline)
  function glitchInline(el, text, cls, lagAt, lagMs, onDone) {
    const span = document.createElement('span');
    if (cls) span.className = cls;
    el.appendChild(span);

    let charIdx = 0;
    function nextChar() {
      if (charIdx >= text.length) { if (onDone) onDone(); return; }
      const target = text[charIdx];
      const pos    = charIdx;
      charIdx++;
      if (target === ' ') { span.textContent += target; setTimeout(nextChar, 5); return; }
      decodeChar(span, pos, target, 2, 12, () => {
        if (pos === lagAt) setTimeout(nextChar, lagMs);
        else               setTimeout(nextChar, 5);
      });
    }
    nextChar();
  }

  // KROK 1: "portfolio"  (9 znaków × 40ms = 360ms)
  glitchInline(label, labelOriginal, '', -1, 0, () => {

    // KROK 2: "Radosław" z lagiem 140ms po 'o' (indeks 3)
    setTimeout(() => {
      typeGlitch(h1, 'Radosław', 'span', '', 3, 140, () => {

        const br     = document.createElement('br');
        const cursor = document.getElementById('main-cursor');
        h1.insertBefore(br, cursor);

        // KROK 3: "Dunaj"
        setTimeout(() => {
          typeGlitch(h1, 'Dunaj', 'span', 'typed-name', -1, 0, () => {

            // KROK 4: "Inżynier Logistyki / Pasjonat IT"
            setTimeout(() => {
              glitchInline(subtitle, subtitleOriginal, '', -1, 0, () => {

                // KROK 5: reveal sekcji
                setTimeout(revealSections, 60);
              });
            }, 25);
          });
        }, 25);
      });
    }, 25);
  });
}

/* ════════════════════════════════════════════════════════
   HARDWARE REFRESH ENGINE
   Linia skanera przelatuje przez stronę via rAF.
   JS synchronizuje rozbłyski elementów z pozycją linii.
════════════════════════════════════════════════════════ */

// Elementy reaktywne — grupy z progami Y i klasą flash
// Budowane przy starcie skanu (getBoundingClientRect jest live)
function buildTargets() {
  const targets = [];

  // Header
  const hdr = document.querySelector('header');
  if (hdr) targets.push({ el: hdr, cls: 'flash-accent' });

  // typed-name (imię)
  const name = document.querySelector('.typed-name');
  if (name) targets.push({ el: name, cls: 'flash-accent' });

  // bio-label
  const bio = document.querySelector('.bio-label');
  if (bio) targets.push({ el: bio, cls: 'flash-accent' });

  // Karty
  document.querySelectorAll('.card').forEach(c => {
    targets.push({ el: c, cls: 'flash-accent' });
  });



  return targets;
}

function runScan(onDone) {
  const scanner   = document.getElementById('scanner');
  const vh        = window.innerHeight;
  const duration  = 200;            // ms — szybki skan jako korekta systemu
  const flashZone = 22;             // px — strefa wyzwalania rozbłysku
  const flashDur  = 350;            // ms — czas trwania rozbłysku

  const targets = buildTargets();
  const mapped = targets.map(t => {
    const r = t.el.getBoundingClientRect();
    return { ...t, triggerY: r.top + r.height * 0.4, fired: false };
  });

  // Ustaw linię na górze i uwidocznij
  scanner.style.setProperty('--scan-y', '-4px');
  scanner.style.opacity = '0.95';

  const start = performance.now();

  function frame(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Linia jedzie od -4px do vh+4px
    const y = -4 + (vh + 8) * progress;
    scanner.style.setProperty('--scan-y', y + 'px');

    // Fade-out ostatnie 15% — linia znika zanim wyjdzie za ekran
    if (progress > 0.85) {
      scanner.style.opacity = ((1 - progress) / 0.15 * 0.95).toString();
    }

    // Rozbłyski elementów synchroniczne z pozycją linii
    mapped.forEach(t => {
      if (!t.fired && y >= t.triggerY - flashZone && y <= t.triggerY + flashZone) {
        t.fired = true;
        t.el.classList.add(t.cls);
        setTimeout(() => t.el.classList.remove(t.cls), flashDur);
      }
    });

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      scanner.style.opacity = '0';
      if (onDone) onDone();
    }
  }

  requestAnimationFrame(frame);
}

function scheduleSequence() {
  // Losowy interwał: 6–12 sekund między sekwencjami
  const wait = 6000 + Math.random() * 6000;

  setTimeout(() => {
    const wrapper = document.getElementById('main');
    if (!wrapper) { scheduleSequence(); return; }

    // FAZA 1 — Jitter (80ms)
    wrapper.classList.add('jitter');

    setTimeout(() => {
      // Usuń jitter — CSS animation forwards zatrzymuje w stanie końcowym,
      // usunięcie klasy resetuje natychmiast do transform:none
      wrapper.classList.remove('jitter');

      // FAZA 2 — Fast Scanner natychmiast po jitter
      runScan(() => {
        // Sekwencja zakończona — zaplanuj następną
        scheduleSequence();
      });

    }, 240); // dokładnie czas trwania animacji jitter

  }, wait);
}

// Alias dla wywołania z revealSections
function scheduleGlitch() { scheduleSequence(); }

/* ════════════════════════════════════════════════════════
   ROCZNIK W FOOTERZE
════════════════════════════════════════════════════════ */
document.getElementById('year').textContent = new Date().getFullYear();