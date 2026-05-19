let audioCtx = null;
let manifest = null;
let manifestPromise = null;
let serbianVoice = null;
let voicesReady = null;
let currentClip = null;

const BASE = import.meta.env.BASE_URL;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function beep(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* ignore */
  }
}

export function playCorrect(soundOn) {
  if (!soundOn) return;
  beep(523, 0.1);
  setTimeout(() => beep(659, 0.15), 80);
}

export function playWrong(soundOn) {
  if (!soundOn) return;
  beep(200, 0.2, 'triangle', 0.12);
}

export function playWin(soundOn) {
  if (!soundOn) return;
  [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.12), i * 100));
}

async function loadManifest() {
  if (manifest) return manifest;
  if (!manifestPromise) {
    manifestPromise = fetch(`${BASE}audio/manifest.json`)
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  manifest = await manifestPromise;
  return manifest;
}

function pickSerbianVoice(voices) {
  const score = (v) => {
    let s = 0;
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    if (lang === 'sr-rs') s += 100;
    else if (lang.startsWith('sr')) s += 80;
    if (/sophie|natural|neural|premium|enhanced|google/.test(name)) s += 40;
    if (v.localService) s += 10;
    return s;
  };
  const sorted = [...voices].sort((a, b) => score(b) - score(a));
  return sorted.length && score(sorted[0]) > 0 ? sorted[0] : null;
}

export function initSpeech() {
  if (!window.speechSynthesis || voicesReady) return voicesReady;
  voicesReady = new Promise((resolve) => {
    const apply = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        serbianVoice = pickSerbianVoice(voices);
        resolve(serbianVoice);
      }
    };
    apply();
    window.speechSynthesis.onvoiceschanged = apply;
    setTimeout(apply, 500);
  });
  return voicesReady;
}

function stopSpeech() {
  window.speechSynthesis?.cancel();
  if (currentClip) {
    currentClip.pause();
    currentClip.currentTime = 0;
    currentClip = null;
  }
}

async function playRecorded(text) {
  const map = await loadManifest();
  const file = map[text];
  if (!file) return false;

  stopSpeech();
  const clip = new Audio(`${BASE}audio/${file}`);
  clip.preload = 'auto';
  currentClip = clip;

  try {
    await clip.play();
    return true;
  } catch {
    currentClip = null;
    return false;
  }
}

function speakFallback(text) {
  if (!window.speechSynthesis) return;

  stopSpeech();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sr-RS';
  if (serbianVoice) u.voice = serbianVoice;
  u.rate = 0.92;
  u.pitch = 1.05;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

/** Natural neural audio when available; improved browser voice as fallback. */
export async function speakSerbian(text, soundOn) {
  if (!soundOn || !text) return;

  await initSpeech();

  const played = await playRecorded(text);
  if (!played) speakFallback(text);
}
