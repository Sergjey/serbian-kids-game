import levelsData from './data/levels.json';
import { loadProgress, saveProgress } from './storage.js';

export function getLevels() {
  return levelsData;
}

export function getLevel(id) {
  return levelsData.find((l) => l.id === id);
}

export function getLevelIndex(id) {
  return levelsData.findIndex((l) => l.id === id);
}

export function isLevelUnlocked(levelId, progress = loadProgress()) {
  const index = getLevelIndex(levelId);
  if (index <= 0) return true;
  const prev = levelsData[index - 1];
  const prevStars = progress.levels[prev.id]?.stars ?? 0;
  return prevStars >= 1;
}

export function starsFromMistakes(mistakes) {
  if (mistakes <= 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

export function recordAnswer(correct) {
  const progress = loadProgress();
  if (correct) {
    progress.xp += 10;
    progress.stats.currentStreak += 1;
    if (progress.stats.currentStreak > progress.stats.bestStreak) {
      progress.stats.bestStreak = progress.stats.currentStreak;
    }
  } else {
    progress.stats.currentStreak = 0;
  }
  saveProgress(progress);
  return progress;
}

export function completeLevel(levelId, mistakes) {
  const progress = loadProgress();
  const stars = starsFromMistakes(mistakes);
  const existing = progress.levels[levelId]?.stars ?? 0;
  const isNewComplete = existing === 0;

  progress.levels[levelId] = {
    stars: Math.max(existing, stars),
    mistakes,
    completedAt: Date.now(),
  };

  if (stars === 3) {
    progress.xp += 50;
  }

  if (isNewComplete) {
    progress.stats.completedCount += 1;
  }

  progress.stats.currentStreak = 0;
  saveProgress(progress);
  return { progress, stars, isNewComplete };
}

export function getCompletedCount(progress = loadProgress()) {
  return Object.values(progress.levels).filter((l) => l.stars >= 1).length;
}
