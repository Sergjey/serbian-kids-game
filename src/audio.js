let audioCtx = null;

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

export function speakSerbian(text, soundOn) {
  if (!soundOn || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sr-RS';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}
