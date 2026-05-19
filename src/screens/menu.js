import { t } from '../i18n/ru.js';
import { mascotHtml } from '../components/mascot.js';
import { loadProgress } from '../storage.js';
import { navigate } from '../router.js';

export function renderMenu(root) {
  const progress = loadProgress();
  root.innerHTML = `
    <div class="screen screen--menu">
      <header class="header">
        <h1 class="title">${t.appTitle}</h1>
        <p class="xp-badge">${t.xp}: <strong>${progress.xp}</strong></p>
      </header>
      ${mascotHtml()}
      <nav class="menu-nav">
        <button type="button" class="btn btn--primary btn--large" data-action="start">${t.start}</button>
        <button type="button" class="btn btn--secondary" data-action="achievements">${t.achievements}</button>
        <button type="button" class="btn btn--ghost" data-action="parents">${t.parents}</button>
      </nav>
    </div>
  `;

  root.querySelector('[data-action="start"]').addEventListener('click', () => navigate('map'));
  root.querySelector('[data-action="achievements"]').addEventListener('click', () => navigate('achievements'));
  root.querySelector('[data-action="parents"]').addEventListener('click', () => navigate('parents'));
}
