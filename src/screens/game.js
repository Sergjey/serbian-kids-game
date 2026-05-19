import { t } from '../i18n/ru.js';
import { getLevel, getLevels, completeLevel, recordAnswer } from '../progress.js';
import { loadProgress } from '../storage.js';
import { checkAchievements } from '../achievements.js';
import { navigate } from '../router.js';
import { shuffle, starsHtml } from '../utils.js';
import { playCorrect, playWrong, playWin } from '../audio.js';
import { mascotHtml, randomPraise, randomEncourage } from '../components/mascot.js';
import { createFlashcardRound } from '../games/flashcard.js';
import { createQuizRound } from '../games/quiz.js';
import { createMatchRound } from '../games/match.js';

const ROUNDS = [
  { type: 'flashcard', label: t.flashcardTitle },
  { type: 'quiz', label: t.quizTitle },
  { type: 'match', label: t.matchTitle },
];

export function renderGame(root, levelId) {
  const level = getLevel(levelId);
  if (!level) {
    navigate('map');
    return;
  }

  const allWords = getLevels().flatMap((l) => l.words);
  const roundWords = shuffle(level.words).slice(0, 6);
  let roundIndex = 0;
  let totalMistakes = 0;
  let sessionStreak = 0;
  let feedbackEl = null;

  const progress = loadProgress();
  const soundOn = progress.settings.sound;

  root.innerHTML = `
    <div class="screen screen--game">
      <header class="header header--row">
        <button type="button" class="btn btn--ghost btn--back" data-action="back">← ${t.back}</button>
        <h2 class="subtitle">${level.icon} ${level.title}</h2>
      </header>
      <div class="round-indicator" id="round-indicator"></div>
      <div id="game-area"></div>
      <div id="feedback" class="feedback" hidden></div>
    </div>
  `;

  const gameArea = root.querySelector('#game-area');
  const roundIndicator = root.querySelector('#round-indicator');
  feedbackEl = root.querySelector('#feedback');

  root.querySelector('[data-action="back"]').addEventListener('click', () => {
    if (confirm('Выйти из уровня? Прогресс этого прохождения не сохранится.')) {
      navigate('map');
    }
  });

  function showFeedback(text, type) {
    feedbackEl.hidden = false;
    feedbackEl.className = `feedback feedback--${type}`;
    feedbackEl.textContent = text;
    setTimeout(() => {
      feedbackEl.hidden = true;
    }, 1200);
  }

  function runRound() {
    if (roundIndex >= ROUNDS.length) {
      finishLevel();
      return;
    }

    const round = ROUNDS[roundIndex];
    roundIndicator.textContent = `${t.round} ${roundIndex + 1} ${t.of} ${ROUNDS.length}: ${round.label}`;
    gameArea.innerHTML = '';

    const onAnswer = ({ correct, mistakes, done }) => {
      if (done) {
        totalMistakes += mistakes ?? 0;
        roundIndex++;
        setTimeout(runRound, 300);
        return;
      }

      if (correct === undefined) return;

      recordAnswer(correct);
      if (correct) {
        sessionStreak++;
        playCorrect(soundOn);
        showFeedback(randomPraise(), 'ok');
        if (sessionStreak >= 3) {
          gameArea.insertAdjacentHTML('beforeend', mascotHtml(randomPraise()));
        }
      } else {
        sessionStreak = 0;
        playWrong(soundOn);
        showFeedback(randomEncourage(), 'err');
      }

      checkAchievements({ streak: sessionStreak });
    };

    let roundEl;
    if (round.type === 'flashcard') {
      roundEl = createFlashcardRound(roundWords, allWords, onAnswer, soundOn);
    } else if (round.type === 'quiz') {
      roundEl = createQuizRound(roundWords, allWords, onAnswer, soundOn);
    } else {
      roundEl = createMatchRound(roundWords, onAnswer);
    }
    gameArea.appendChild(roundEl);
  }

  function finishLevel() {
    const { stars } = completeLevel(levelId, totalMistakes);
    playWin(soundOn);
    const { newlyUnlocked } = checkAchievements({ stars });

    let extra = '';
    if (newlyUnlocked.length) {
      extra = `<p class="new-achievements">🎉 Новая награда: ${newlyUnlocked.map((a) => a.title).join(', ')}</p>`;
    }

    gameArea.innerHTML = `
      <div class="level-result">
        ${mascotHtml(t.levelComplete)}
        <h2>${t.levelComplete}</h2>
        <p>${t.yourStars}</p>
        <p class="stars-big">${starsHtml(stars)}</p>
        ${extra}
        <button type="button" class="btn btn--primary btn--large" data-action="continue">${t.continue}</button>
      </div>
    `;

    gameArea.querySelector('[data-action="continue"]').addEventListener('click', () => navigate('map'));
  }

  runRound();
}
