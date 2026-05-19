import { t } from '../i18n/ru.js';
import { shuffle } from '../utils.js';

export function createMatchRound(words, onAnswer) {
  const root = document.createElement('div');
  root.className = 'game-round';

  const pairCount = Math.min(5, words.length);
  const roundWords = shuffle(words).slice(0, pairCount);
  let mistakes = 0;
  let matched = 0;
  let selected = null;

  const header = document.createElement('h2');
  header.className = 'game-round__title';
  header.textContent = t.matchTitle;

  const hint = document.createElement('p');
  hint.className = 'game-round__sub';
  hint.textContent = t.matchHint;

  const status = document.createElement('p');
  status.className = 'game-round__progress';

  const board = document.createElement('div');
  board.className = 'match-board';

  const cards = [];
  roundWords.forEach((word, i) => {
    cards.push({ id: `ru-${i}`, text: word.ru, pairId: i, lang: 'ru' });
    cards.push({ id: `sr-${i}`, text: word.sr, pairId: i, lang: 'sr' });
  });

  function updateStatus() {
    status.textContent = `${t.pairsLeft}: ${pairCount - matched}`;
  }

  function renderBoard() {
    board.innerHTML = '';
    shuffle(cards.filter((c) => !c.matched)).forEach((card) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `match-card match-card--${card.lang}`;
      if (card.matched) btn.classList.add('match-card--done');
      if (selected?.id === card.id) btn.classList.add('match-card--selected');
      btn.textContent = card.text;
      btn.disabled = card.matched;
      btn.addEventListener('click', () => onCardClick(card, btn));
      board.appendChild(btn);
    });
    updateStatus();
  }

  function onCardClick(card, btn) {
    if (card.matched) return;

    if (!selected) {
      selected = { card, btn };
      btn.classList.add('match-card--selected');
      return;
    }

    if (selected.card.id === card.id) {
      selected.btn.classList.remove('match-card--selected');
      selected = null;
      return;
    }

    const first = selected.card;
    selected.btn.classList.remove('match-card--selected');
    selected = null;

    if (first.pairId === card.pairId && first.lang !== card.lang) {
      card.matched = true;
      first.matched = true;
      matched++;
      onAnswer({ correct: true, mistakes, done: false });
      if (matched >= pairCount) {
        setTimeout(() => onAnswer({ mistakes, done: true }), 400);
      } else {
        renderBoard();
      }
    } else {
      mistakes++;
      btn.classList.add('match-card--wrong');
      board.querySelectorAll('button').forEach((b) => (b.disabled = true));
      onAnswer({ correct: false, mistakes, done: false });
      setTimeout(() => {
        btn.classList.remove('match-card--wrong');
        board.querySelectorAll('button').forEach((b) => (b.disabled = false));
        renderBoard();
      }, 700);
    }
  }

  root.append(header, hint, status, board);
  renderBoard();
  return root;
}
