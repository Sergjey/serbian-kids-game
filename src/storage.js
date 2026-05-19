const STORAGE_KEY = 'serbian-game-v1';

export function defaultProgress() {
  return {
    xp: 0,
    levels: {},
    achievements: [],
    settings: { sound: true },
    stats: {
      currentStreak: 0,
      bestStreak: 0,
      completedCount: 0,
    },
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const data = JSON.parse(raw);
    return { ...defaultProgress(), ...data, settings: { ...defaultProgress().settings, ...data.settings }, stats: { ...defaultProgress().stats, ...data.stats } };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
