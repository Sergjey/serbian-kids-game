import { t } from '../i18n/ru.js';
import { getAchievementsList } from '../achievements.js';
import { loadProgress } from '../storage.js';
import { navigate } from '../router.js';

export function renderAchievements(root) {
  const progress = loadProgress();
  const list = getAchievementsList();

  const items = list
    .map((a) => {
      const got = progress.achievements.includes(a.id);
      return `
        <article class="badge ${got ? 'badge--unlocked' : 'badge--locked'}">
          <span class="badge__icon">${a.icon}</span>
          <h3 class="badge__title">${a.title}</h3>
          <p class="badge__desc">${a.description}</p>
          <span class="badge__status">${got ? t.unlocked : t.lockedBadge}</span>
        </article>
      `;
    })
    .join('');

  root.innerHTML = `
    <div class="screen screen--achievements">
      <header class="header header--row">
        <button type="button" class="btn btn--ghost btn--back" data-action="back">← ${t.back}</button>
        <h2 class="subtitle">${t.achievementsTitle}</h2>
      </header>
      <div class="badge-grid">${items}</div>
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => navigate('menu'));
}
