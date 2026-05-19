const listeners = new Set();
let current = { screen: 'menu', params: {} };

export function navigate(screen, params = {}) {
  current = { screen, params };
  listeners.forEach((fn) => fn(current));
  window.location.hash = params.levelId ? `${screen}/${params.levelId}` : screen;
}

export function getRoute() {
  return current;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function parseHash() {
  const hash = window.location.hash.slice(1) || 'menu';
  const [screen, levelId] = hash.split('/');
  const valid = ['menu', 'map', 'play', 'achievements', 'parents', 'result'];
  if (valid.includes(screen)) {
    current = { screen, params: levelId ? { levelId } : {} };
  }
  return current;
}

export function initRouter() {
  parseHash();
  window.addEventListener('hashchange', () => {
    parseHash();
    listeners.forEach((fn) => fn(current));
  });
}
