import { content, type Lang } from '../i18n';
import { PATCH_TARGET_MS, patchIsLive, formatCountdown, chooseVerdict } from '../logic';

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string): void {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* ignore */
  }
}
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function byId(id: string): HTMLElement | null {
  return document.getElementById(id);
}

let cur: Lang = lsGet('p2s_lang') === 'ja' ? 'ja' : 'en';
const expState = { ver: '8.3', waf: 'unknown' };
let howTimer: ReturnType<typeof setInterval> | null = null;
let howIdx = 0;

const reduce =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function d(): Record<string, any> {
  return content[cur];
}

function render(): void {
  const t = d();
  document.documentElement.lang = cur;

  document.querySelectorAll<HTMLElement>('[data-i]').forEach((el) => {
    const k = el.getAttribute('data-i');
    if (k && typeof t[k] === 'string') el.innerHTML = t[k];
  });
  const tog = byId('langTog');
  if (tog) tog.textContent = t._label;

  const stats = byId('heroStats');
  if (stats)
    stats.innerHTML = (t.stats as string[][])
      .map(
        (s) =>
          `<div class="hstat"><div class="v ${s[2] === 'cool' ? 'cool' : ''}">${s[0]}</div><div class="k">${esc(s[1])}${s[2] && s[2] !== 'cool' ? ' ' + esc(s[2]) : ''}</div></div>`,
      )
      .join('');

  const why = byId('whyCards');
  if (why)
    why.innerHTML = (t.why as string[][])
      .map(
        (c) =>
          `<div class="why-card"><div class="ic">${esc(c[0])}</div><h3>${c[1]}</h3><p>${c[2]}</p></div>`,
      )
      .join('');

  const how = byId('howCards');
  if (how)
    how.innerHTML = (t.how as string[][])
      .map(
        (c, i) =>
          `<div class="hcard" data-h="${i}"><span class="bar"></span><div class="ph">${esc(c[0])}</div><h3>${c[1]}</h3><p>${c[2]}</p></div>`,
      )
      .join('');

  const ver = byId('expVer');
  if (ver)
    ver.innerHTML = (t.verOpts as string[][])
      .map(
        (o) =>
          `<button type="button" data-v="${o[1]}"${o[1] === expState.ver ? ' class="sel"' : ''}>${esc(o[0])}</button>`,
      )
      .join('');
  const waf = byId('expWaf');
  if (waf)
    waf.innerHTML = (t.wafOpts as string[][])
      .map(
        (o) =>
          `<button type="button" data-w="${o[1]}"${o[1] === expState.waf ? ' class="sel"' : ''}>${esc(o[0])}</button>`,
      )
      .join('');

  const tl = byId('tl');
  if (tl)
    tl.innerHTML = (t.tl as [string, string, boolean, string, string][])
      .map(
        (it) =>
          `<div class="tl-item${it[2] ? ' crit' : ''}"><div class="when">${esc(it[0])}<small>${esc(it[1])}</small></div><div class="what"><h3>${esc(it[3])}</h3><p>${it[4]}</p></div></div>`,
      )
      .join('');

  const mx = byId('matrix');
  if (mx)
    mx.innerHTML =
      `<div class="mrow head"><span>${esc(t.mxHead[0])}</span><span>${esc(t.mxHead[1])}</span><span>${esc(t.mxHead[2])}</span></div>` +
      (t.mx as string[][])
        .map(
          (r) =>
            `<div class="mrow"><span class="ver">${esc(r[0])}</span><span class="state ${r[1]}">${esc(r[2])}</span><span class="note">${esc(r[3])}</span></div>`,
        )
        .join('');

  const targets = byId('targets');
  if (targets)
    targets.innerHTML = (t.targets as string[]).map((x) => `<span>${esc(x)}</span>`).join('');

  const defs = byId('defs');
  if (defs)
    defs.innerHTML = (t.def as [string, string, string, string, boolean][])
      .map(
        (c) =>
          `<div class="def${c[4] ? ' primary' : ''}">${c[2] ? `<span class="star">${esc(c[2])}</span>` : ''}<div class="n">${esc(c[0])}</div><h3>${c[1]}</h3><p>${c[3]}</p></div>`,
      )
      .join('');

  renderVerdict();
  renderStatus();
  restartHow();
}

function renderStatus(): void {
  const t = d();
  const now = Date.now();
  const pill = byId('statusPill');
  const big = byId('statusBig');
  const note = byId('statusNote');
  if (!pill || !big || !note) return;
  if (!patchIsLive(now)) {
    pill.className = 'pill pre';
    pill.textContent = t.liveTag;
    big.textContent = (t.preBig as string).replace('{t}', formatCountdown(PATCH_TARGET_MS - now));
    big.style.color = 'var(--warn)';
    note.innerHTML = t.preNote;
  } else {
    pill.className = 'pill post';
    pill.textContent = t.liveTag;
    big.textContent = t.postBig;
    big.style.color = 'var(--live)';
    note.innerHTML = t.postNote;
  }
}

function renderVerdict(): void {
  const t = d();
  const key = chooseVerdict(expState.ver, expState.waf, patchIsLive(Date.now()));
  const vd = t.verdicts[key] as [string, string, string, string];
  const el = byId('expVerdict');
  if (!el) return;
  const level = vd[0];
  const label = (t.levelLabels as Record<string, string>)[level] ?? level.toUpperCase();
  const v = expState.ver;
  el.className = 'exp-verdict ' + level;
  el.innerHTML =
    `<div class="vlevel">${esc(label)}</div>` +
    `<h3>${vd[1].replace(/\{v\}/g, v)}</h3>` +
    `<p>${vd[2].replace(/\{v\}/g, v)}</p>` +
    `<div class="action">▸ ${vd[3].replace(/\{v\}/g, v)}</div>`;
}

function cycleHow(): void {
  const cards = document.querySelectorAll<HTMLElement>('#howCards .hcard');
  if (!cards.length) return;
  cards.forEach((c, i) => {
    c.classList.toggle('active', i === howIdx);
    const bar = c.querySelector<HTMLElement>('.bar');
    if (bar) bar.style.width = i === howIdx ? '100%' : '0';
  });
  howIdx = (howIdx + 1) % cards.length;
}
function restartHow(): void {
  if (howTimer) {
    clearInterval(howTimer);
    howTimer = null;
  }
  howIdx = 0;
  if (reduce) {
    document.querySelectorAll<HTMLElement>('#howCards .hcard').forEach((c) => {
      c.classList.add('active');
      const bar = c.querySelector<HTMLElement>('.bar');
      if (bar) bar.style.width = '100%';
    });
    return;
  }
  cycleHow();
  howTimer = setInterval(cycleHow, 2600);
}

export function init(): void {
  const ver = byId('expVer');
  if (ver)
    ver.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      expState.ver = b.getAttribute('data-v') ?? expState.ver;
      render();
    });
  const waf = byId('expWaf');
  if (waf)
    waf.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      expState.waf = b.getAttribute('data-w') ?? expState.waf;
      render();
    });
  const tog = byId('langTog');
  if (tog)
    tog.addEventListener('click', () => {
      cur = cur === 'en' ? 'ja' : 'en';
      lsSet('p2s_lang', cur);
      render();
    });

  const rail = document.querySelector<HTMLElement>('.rail');
  const onScroll = () => {
    const h = document.documentElement;
    if (rail)
      rail.style.setProperty(
        '--scroll',
        (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4),
      );
  };
  document.addEventListener('scroll', onScroll, { passive: true });

  setInterval(renderStatus, 1000);
  render();
  onScroll();
}
