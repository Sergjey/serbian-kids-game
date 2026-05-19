import { t } from '../i18n/ru.js';
import { shuffle, pickRandom } from '../utils.js';
import { speakSerbian } from '../audio.js';

export function createQuizRound(words, allWords, onAnswer, soundOn) {
  const root = document.createElement('div');
  root.className = 'game-round';

  let index = 0;
  let mistakes = 0;

  function showQuestion() {
    root.innerHTML = '';
    if (index >= words.length) {
      onAnswer({ mistakes, done: true });
      return;
    }

    const word = words[index];
    const wrong = pickRandom(allWords, 3, word).map((w) => w.ru);
    const options = shuffle([word.ru, ...wrong]);

    const header = document.createElement('h2');
    header.className = 'game-round__title';
    header.textContent = t.quizTitle;

    const prompt = document.createElement('p');
    prompt.className = 'game-round__prompt game-round__prompt--sr';
    prompt.textContent = word.sr;

    const listenBtn = document.createElement('button');
    listenBtn.type = 'button';
    listenBtn.className = 'btn btn--ghost btn--small';
    listenBtn.textContent = `🔊 ${t.listen}`;
    listenBtn.addEventListener('click', () => speakSerbian(word.sr, soundOn));

    const sub = document.createElement('p');
    sub.className = 'game-round__sub';
    sub.textContent = t.chooseRussian;

    const grid = document.createElement('div');
    grid.className = 'options-grid';

    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        grid.querySelectorAll('button').forEach((b) => (b.disabled = true));
        const correct = opt === word.ru;
        btn.classList.add(correct ? 'option-btn--correct' : 'option-btn--wrong');
        if (!correct) {
          mistakes++;
          grid.querySelectorAll('.option-btn').forEach((b) => {
            if (b.textContent === word.ru) b.classList.add('option-btn--correct');
          });
        }
        setTimeout(() => {
          index++;
          onAnswer({ correct, mistakes, done: false });
          showQuestion();
        }, correct ? 600 : 1000);
      });
      grid.appendChild(btn);
    });

    const progress = document.createElement('p');
    progress.className = 'game-round__progress';
    progress.textContent = `${index + 1} / ${words.length}`;

    root.append(header, prompt, listenBtn, sub, grid, progress);
  }

  showQuestion();
  return root;
}
