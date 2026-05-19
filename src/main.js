import './styles/main.css';
import { initRouter, subscribe, parseHash, navigate } from './router.js';
import { renderMenu } from './screens/menu.js';
import { renderLevelMap } from './screens/levelMap.js';
import { renderGame } from './screens/game.js';
import { renderAchievements } from './screens/achievementsScreen.js';
import { renderParents } from './screens/parents.js';
import { isLevelUnlocked } from './progress.js';

const app = document.getElementById('app');

function render(route) {
  const { screen, params } = route;

  if (screen === 'play') {
    if (!params.levelId) {
      navigate('map');
      return;
    }
    if (!isLevelUnlocked(params.levelId)) {
      navigate('map');
      return;
    }
    renderGame(app, params.levelId);
    return;
  }

  switch (screen) {
    case 'map':
      renderLevelMap(app);
      break;
    case 'achievements':
      renderAchievements(app);
      break;
    case 'parents':
      renderParents(app);
      break;
    case 'menu':
    default:
      renderMenu(app);
      break;
  }
}

initRouter();
parseHash();
subscribe(render);
render(parseHash());
