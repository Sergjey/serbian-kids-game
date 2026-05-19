import { t } from '../i18n/ru.js';
import { getLevels, isLevelUnlocked } from '../progress.js';
import { loadProgress } from '../storage.js';
import { starsHtml } from '../utils.js';
import { navigate } from '../router.js';

export function renderLevelMap(root) {
  const progress = loadProgress();
  const levels = getLevels();

  const cards = levels
    .map((level) => {
      const unlocked = isLevelUnlocked(level.id, progress);
      const stars = progress.levels[level.id]?.stars ?? 0;
      return `
        <button
          type="button"
          class="level-card ${unlocked ? '' : 'level-card--locked'}"
          data-level="${level.id}"
          data-locked="${unlocked ? 'false' : 'true'}"
          aria-label="${level.title}"
        >
          <span class="level-card__icon">${level.icon}</span>
          <span class="level-card__title">${level.title}</span>
          <span class="level-card__stars">${starsHtml(stars)}</span>
          ${unlocked ? '' : '<span class="level-card__lock">🔒</span>'}
        </button>
      `;
    })
    .join('');

  root.innerHTML = `
    <div class="screen screen--map">
      <header class="header header--row">
        <button type="button" class="btn btn--ghost btn--back" data-action="back">← ${t.back}</button>
        <h2 class="subtitle">${t.levelMap}</h2>
        <p class="xp-badge">${t.xp}: ${progress.xp}</p>
      </header>
      <div class="level-grid">${cards}</div>
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => navigate('menu'));

  root.querySelectorAll('.level-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.locked === 'true') {
        const tip = document.createElement('p');
        tip.className = 'toast';
        tip.textContent = t.locked;
        root.appendChild(tip);
        setTimeout(() => tip.remove(), 2000);
        return;
      }
      navigate('play', { levelId: btn.dataset.level });
    });
  });
}
