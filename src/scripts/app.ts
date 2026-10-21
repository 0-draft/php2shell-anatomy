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
// attack playback state
const ATK_LAST = 5;
const ATK_THREAT = [15, 40, 55, 75, 90, 100];
// node class per stage (attacker is always the red source); others escalate
const ATK_NODES: Record<string, string>[] = [
  { attacker: 'breach', web: 'scan' },
  { attacker: 'breach', edge: 'bypass', web: 'breach' },
  { attacker: 'breach', edge: 'bypass', web: 'breach' },
  { attacker: 'breach', edge: 'bypass', web: 'breach' },
  { attacker: 'breach', edge: 'bypass', web: 'breach', db: 'breach', internal: 'reach' },
  { attacker: 'breach', edge: 'bypass', web: 'breach', db: 'breach', internal: 'breach' },
];
const ATK_PULSE = ['web', 'web', 'web', 'web', 'internal', 'web'];
const ATK_HOTLINKS = [0, 2, 2, 2, 4, 4]; // how many links (from left) are "hot" per stage
const ATK_STATUS: Record<string, string> = {
  scan: 'TARGET',
  bypass: 'BYPASSED',
  breach: 'OWNED',
  reach: 'REACHED',
};
let atkStage = 0;
let atkLinesStage = -1; // how many stages of terminal lines are currently painted
let atkPlaying = false;
let atkStepTimer: ReturnType<typeof setTimeout> | null = null;

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
          `<div class="why-card"><div class="ic">${esc(c[0])}</div><h3>${esc(c[1])}</h3><p>${c[2]}</p></div>`,
      )
      .join('');

  const how = byId('howCards');
  if (how)
    how.innerHTML = (t.how as string[][])
      .map(
        (c, i) =>
          `<div class="hcard" data-h="${i}"><span class="bar"></span><div class="ph">${esc(c[0])}</div><h3>${esc(c[1])}</h3><p>${c[2]}</p></div>`,
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
          `<div class="def${c[4] ? ' primary' : ''}">${c[2] ? `<span class="star">${esc(c[2])}</span>` : ''}<div class="n">${esc(c[0])}</div><h3>${esc(c[1])}</h3><p>${c[3]}</p></div>`,
      )
      .join('');

  renderAtk();

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

function atkNodeStatus(node: string, cls: string | undefined): string {
  if (node === 'attacker') return 'SOURCE';
  return cls ? (ATK_STATUS[cls] ?? '') : '';
}

function paintAtkMeta(stage: number): void {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stageNo = byId('atkStageNo');
  if (stageNo) stageNo.textContent = `${pad(stage + 1)} / 06`;
  const meter = byId('atkMeter');
  if (meter) meter.style.width = `${ATK_THREAT[stage]}%`;
  const tv = byId('atkThreatV');
  if (tv) tv.textContent = String(ATK_THREAT[stage]);

  const sched = ATK_NODES[stage];
  document.querySelectorAll<HTMLElement>('#atkMap .atk-node').forEach((el) => {
    const node = el.getAttribute('data-node') ?? '';
    el.classList.remove('scan', 'bypass', 'breach', 'reach', 'pulse');
    const cls = sched[node];
    if (cls) el.classList.add(cls);
    if (ATK_PULSE[stage] === node) el.classList.add('pulse');
    const st = el.querySelector<HTMLElement>('.atk-st');
    if (st) st.textContent = atkNodeStatus(node, cls);
  });

  const hot = ATK_HOTLINKS[stage];
  document.querySelectorAll<HTMLElement>('#atkMap .atk-link').forEach((el, i) => {
    el.classList.toggle('hot', i < hot);
  });

  document.querySelectorAll<HTMLElement>('#atkFlow .atk-step').forEach((el, i) => {
    el.classList.toggle('active', i === stage);
  });

  document.querySelectorAll<HTMLElement>('#atkPips button').forEach((el, i) => {
    el.classList.toggle('done', i < stage);
    el.classList.toggle('active', i === stage);
  });
}

function atkLineClass(line: string): string {
  if (line.startsWith('[!]')) return 'l bad';
  if (line.startsWith('[+]') || line.startsWith('[>]')) return 'l ok';
  if (line.startsWith('$')) return 'l cmd';
  return 'l';
}
function appendStageLines(stage: number, stagger: boolean): void {
  const term = byId('atkTerm');
  if (!term) return;
  const lines = (d().attackTerm as string[][])[stage] ?? [];
  lines.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = atkLineClass(line);
    el.textContent = line;
    if (stagger) el.style.animationDelay = `${i * 0.12}s`;
    term.appendChild(el);
  });
  term.scrollTop = term.scrollHeight;
}
function rebuildTerm(uptoStage: number): void {
  const term = byId('atkTerm');
  if (!term) return;
  term.innerHTML = '';
  for (let s = 0; s <= uptoStage; s++) appendStageLines(s, false);
  atkLinesStage = uptoStage;
}

function setAtkStage(i: number, animate: boolean): void {
  atkStage = i;
  paintAtkMeta(i);
  if (animate && i === atkLinesStage + 1) {
    appendStageLines(i, true);
    atkLinesStage = i;
  } else {
    rebuildTerm(i);
  }
}

function updateAtkPlayBtn(): void {
  const t = d();
  const btn = byId('atkPlay');
  const label = byId('atkPlayL');
  const ic = document.querySelector<HTMLElement>('#atkPlay .atk-play-ic');
  if (!btn || !label) return;
  btn.classList.toggle('playing', atkPlaying);
  const done = !atkPlaying && atkStage >= ATK_LAST && atkLinesStage >= ATK_LAST;
  label.textContent = done ? t.seqReplay : t.seqPlay;
  if (ic) ic.textContent = done ? '⟲' : '▶';
}

function stopAtk(): void {
  if (atkStepTimer) {
    clearTimeout(atkStepTimer);
    atkStepTimer = null;
  }
  atkPlaying = false;
}

function scrollToStep(i: number): void {
  const steps = document.querySelectorAll<HTMLElement>('#atkFlow .atk-step');
  steps[i]?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
}

// Play = an auto-tour that scrolls the narrative; the observer drives the instrument.
function playTick(i: number): void {
  const steps = document.querySelectorAll<HTMLElement>('#atkFlow .atk-step');
  if (i >= steps.length) {
    atkPlaying = false;
    updateAtkPlayBtn();
    return;
  }
  scrollToStep(i);
  atkStepTimer = setTimeout(() => playTick(i + 1), 2400);
}

function playAtk(): void {
  if (reduce) {
    setAtkStage(ATK_LAST, false);
    updateAtkPlayBtn();
    return;
  }
  if (atkPlaying) return;
  atkPlaying = true;
  updateAtkPlayBtn();
  playTick(0);
}

let atkObserver: IntersectionObserver | null = null;
function setupAtkObserver(): void {
  if (atkObserver) atkObserver.disconnect();
  if (reduce || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const i = Number((en.target as HTMLElement).getAttribute('data-step'));
        if (!Number.isNaN(i) && i !== atkStage) setAtkStage(i, true);
      }
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  );
  document.querySelectorAll<HTMLElement>('#atkFlow .atk-step').forEach((el) => obs.observe(el));
  atkObserver = obs;
}

function renderAtk(): void {
  const t = d();
  const nodes = t.seqNodes as Record<string, string>;
  document.querySelectorAll<HTMLElement>('#atkMap .atk-node').forEach((el) => {
    const node = el.getAttribute('data-node') ?? '';
    const nl = el.querySelector<HTMLElement>('.atk-nl');
    if (nl && nodes[node]) nl.textContent = nodes[node];
  });
  const flow = byId('atkFlow');
  if (flow)
    flow.innerHTML = (t.attackSeq as string[][])
      .map(
        (s, i) =>
          `<div class="atk-step${i === atkStage ? ' active' : ''}" data-step="${i}"><div class="atk-step-n">${String(i + 1).padStart(2, '0')}</div><div class="cst">${esc(s[0])}</div><h3>${esc(s[1])}</h3><p>${esc(s[2])}</p><div class="cdmg"><span class="cdmg-k">${esc(t.seqDamage)}</span>${esc(s[3])}</div></div>`,
      )
      .join('');
  const pips = byId('atkPips');
  if (pips && !pips.children.length) {
    pips.innerHTML = (t.attackSeq as string[][])
      .map((_s, i) => `<button type="button" data-p="${i}" aria-label="stage ${i + 1}"></button>`)
      .join('');
  }
  stopAtk();
  atkLinesStage = -1;
  setAtkStage(reduce ? ATK_LAST : atkStage, false);
  updateAtkPlayBtn();
  setupAtkObserver();
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

  const atkPlay = byId('atkPlay');
  if (atkPlay)
    atkPlay.addEventListener('click', () => {
      if (atkPlaying) {
        stopAtk();
        updateAtkPlayBtn();
      } else {
        playAtk();
      }
    });
  const atkPips = byId('atkPips');
  if (atkPips)
    atkPips.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      stopAtk();
      updateAtkPlayBtn();
      scrollToStep(Number(b.getAttribute('data-p')));
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
