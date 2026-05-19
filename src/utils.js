export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom(arr, count, exclude = null) {
  const pool = exclude ? arr.filter((x) => x !== exclude) : [...arr];
  return shuffle(pool).slice(0, count);
}

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function starsHtml(count, max = 3) {
  return Array.from({ length: max }, (_, i) =>
    i < count ? '<span class="star star--on">★</span>' : '<span class="star">☆</span>',
  ).join('');
}
