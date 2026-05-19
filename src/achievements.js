import achievementsData from './data/achievements.json';
import { loadProgress, saveProgress } from './storage.js';
import { getCompletedCount } from './progress.js';
import levelsData from './data/levels.json';

export function getAchievementsList() {
  return achievementsData;
}

function unlock(id, progress) {
  if (!progress.achievements.includes(id)) {
    progress.achievements.push(id);
    return true;
  }
  return false;
}

export function checkAchievements(context = {}) {
  const progress = loadProgress();
  const newlyUnlocked = [];
  const completed = getCompletedCount(progress);

  const checks = [
    { id: 'first_step', when: completed >= 1 },
    { id: 'streak_5', when: (progress.stats.bestStreak ?? 0) >= 5 || (context.streak ?? 0) >= 5 },
    { id: 'perfect_level', when: context.stars === 3 || Object.values(progress.levels).some((l) => l.stars === 3) },
    { id: 'three_units', when: completed >= 3 },
    { id: 'five_units', when: completed >= 5 },
    { id: 'all_units', when: completed >= levelsData.length },
    { id: 'xp_100', when: progress.xp >= 100 },
    { id: 'xp_500', when: progress.xp >= 500 },
  ];

  for (const { id, when } of checks) {
    if (when && unlock(id, progress)) {
      newlyUnlocked.push(achievementsData.find((a) => a.id === id));
    }
  }

  if (progress.achievements.length >= 5) {
    if (unlock('collector', progress)) {
      newlyUnlocked.push(achievementsData.find((a) => a.id === 'collector'));
    }
  }

  saveProgress(progress);
  return { progress, newlyUnlocked: newlyUnlocked.filter(Boolean) };
}
