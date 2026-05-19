import { t } from '../i18n/ru.js';
import { loadProgress, saveProgress, resetProgress } from '../storage.js';
import { navigate } from '../router.js';

export function renderParents(root) {
  const progress = loadProgress();

  root.innerHTML = `
    <div class="screen screen--parents">
      <header class="header header--row">
        <button type="button" class="btn btn--ghost btn--back" data-action="back">← ${t.back}</button>
        <h2 class="subtitle">${t.parentsTitle}</h2>
      </header>
      <div class="parents-panel">
        <p class="parents-about">${t.parentsAbout}</p>
        <label class="toggle">
          <input type="checkbox" id="sound-toggle" ${progress.settings.sound ? 'checked' : ''} />
          <span>${t.parentsSound}</span>
        </label>
        <button type="button" class="btn btn--danger" data-action="reset">${t.parentsReset}</button>
        <p class="reset-msg" id="reset-msg" hidden></p>
      </div>
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => navigate('menu'));

  root.querySelector('#sound-toggle').addEventListener('change', (e) => {
    progress.settings.sound = e.target.checked;
    saveProgress(progress);
  });

  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    if (confirm(t.parentsResetConfirm)) {
      resetProgress();
      const msg = root.querySelector('#reset-msg');
      msg.hidden = false;
      msg.textContent = t.parentsResetDone;
      setTimeout(() => navigate('menu'), 1200);
    }
  });
}
