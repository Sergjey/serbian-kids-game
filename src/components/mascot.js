import { t } from '../i18n/ru.js';

export function mascotHtml(message = null) {
  const msg = message ?? t.tagline;
  return `
    <div class="mascot" aria-hidden="true">
      <svg class="mascot__svg" viewBox="0 0 80 80" width="72" height="72">
        <circle cx="40" cy="40" r="36" fill="#FFB347"/>
        <circle cx="28" cy="34" r="5" fill="#333"/>
        <circle cx="52" cy="34" r="5" fill="#333"/>
        <ellipse cx="40" cy="48" rx="10" ry="6" fill="#333"/>
        <path d="M12 28 Q40 8 68 28" fill="#E8913A" stroke="none"/>
        <circle cx="22" cy="44" r="4" fill="#FF9999" opacity="0.6"/>
        <circle cx="58" cy="44" r="4" fill="#FF9999" opacity="0.6"/>
      </svg>
      <p class="mascot__bubble">${msg}</p>
    </div>
  `;
}

export function randomPraise() {
  const list = t.mascotPraise;
  return list[Math.floor(Math.random() * list.length)];
}

export function randomEncourage() {
  const list = t.mascotEncourage;
  return list[Math.floor(Math.random() * list.length)];
}
