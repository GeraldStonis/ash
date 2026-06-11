/**
 * Full-site CSS Glitch Effect
 * ----------------------------
 * Captures the current viewport with html-to-image, then overlays 5 glitch
 * layers that use clip-path keyframe animations (ported from the
 * CSSGlitchEffect-master demo1 by Codrops).
 *
 * Usage:  triggerGlitchEffect(durationMs)
 */

import { toJpeg } from 'html-to-image';

// ─── Inject keyframes + base styles (once) ──────────────────────────
let stylesInjected = false;

function injectGlitchStyles() {
  if (stylesInjected) return;
  stylesInjected = true;

  const css = `
/* ── Glitch overlay container ──────────────────────────────────── */
.site-glitch-overlay {
  --glitch-width: 100vw;
  --glitch-height: 100vh;
  --gap-horizontal: 10px;
  --gap-vertical: 5px;
  --time-anim: 4s;
  --delay-anim: 0s;
  --blend-mode-1: none;
  --blend-mode-2: none;
  --blend-mode-3: none;
  --blend-mode-4: none;
  --blend-mode-5: overlay;
  --blend-color-1: transparent;
  --blend-color-2: transparent;
  --blend-color-3: transparent;
  --blend-color-4: transparent;
  --blend-color-5: #af4949;

  position: fixed;
  inset: 0;
  z-index: 999999;
  pointer-events: none;
  overflow: hidden;
}

.site-glitch-overlay .glitch__img {
  position: absolute;
  top: calc(-1 * var(--gap-vertical));
  left: calc(-1 * var(--gap-horizontal));
  width: calc(100% + var(--gap-horizontal) * 2);
  height: calc(100% + var(--gap-vertical) * 2);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transform: translate3d(0,0,0);
}

.site-glitch-overlay .glitch__img:nth-child(n+2) {
  opacity: 0;
}

.site-glitch-overlay.active .glitch__img:nth-child(n+2) {
  animation-duration: var(--time-anim);
  animation-delay: var(--delay-anim);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.site-glitch-overlay.active .glitch__img:nth-child(1) {
  background-blend-mode: var(--blend-mode-1);
  background-color: var(--blend-color-1);
}

.site-glitch-overlay.active .glitch__img:nth-child(2) {
  background-color: var(--blend-color-2);
  background-blend-mode: var(--blend-mode-2);
  animation-name: site-glitch-anim-1;
}

.site-glitch-overlay.active .glitch__img:nth-child(3) {
  background-color: var(--blend-color-3);
  background-blend-mode: var(--blend-mode-3);
  animation-name: site-glitch-anim-2;
}

.site-glitch-overlay.active .glitch__img:nth-child(4) {
  background-color: var(--blend-color-4);
  background-blend-mode: var(--blend-mode-4);
  animation-name: site-glitch-anim-3;
}

.site-glitch-overlay.active .glitch__img:nth-child(5) {
  background-color: var(--blend-color-5);
  background-blend-mode: var(--blend-mode-5);
  animation-name: site-glitch-anim-flash;
}

/* ── Keyframes (ported from demo1.css) ─────────────────────────── */
@keyframes site-glitch-anim-1 {
  0% {
    opacity: 1;
    transform: translate3d(var(--gap-horizontal),0,0);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  2%  { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); }
  4%  { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
  6%  { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); }
  8%  { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); }
  10% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); }
  12% { clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%); }
  14% { clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%); }
  16% { clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%); }
  18% { clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%); }
  20% { clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%); }
  21.9% {
    opacity: 1;
    transform: translate3d(var(--gap-horizontal),0,0);
  }
  22%, 100% {
    opacity: 0;
    transform: translate3d(0,0,0);
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
  }
}

@keyframes site-glitch-anim-2 {
  0% {
    opacity: 1;
    transform: translate3d(calc(-1 * var(--gap-horizontal)),0,0);
    clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%);
  }
  3%  { clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%); }
  5%  { clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); }
  7%  { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); }
  9%  { clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%); }
  11% { clip-path: polygon(0 52%, 100% 52%, 100% 59%, 0 59%); }
  13% { clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%); }
  15% { clip-path: polygon(0 75%, 100% 75%, 100% 75%, 0 75%); }
  17% { clip-path: polygon(0 65%, 100% 65%, 100% 40%, 0 40%); }
  19% { clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%); }
  20% { clip-path: polygon(0 14%, 100% 14%, 100% 33%, 0 33%); }
  21.9% {
    opacity: 1;
    transform: translate3d(calc(-1 * var(--gap-horizontal)),0,0);
  }
  22%, 100% {
    opacity: 0;
    transform: translate3d(0,0,0);
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
  }
}

@keyframes site-glitch-anim-3 {
  0% {
    opacity: 1;
    transform: translate3d(0, calc(-1 * var(--gap-vertical)), 0) scale3d(-1,-1,1);
    clip-path: polygon(0 1%, 100% 1%, 100% 3%, 0 3%);
  }
  1.5% { clip-path: polygon(0 10%, 100% 10%, 100% 9%, 0 9%); }
  2%   { clip-path: polygon(0 5%, 100% 5%, 100% 6%, 0 6%); }
  2.5% { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); }
  3%   { clip-path: polygon(0 10%, 100% 10%, 100% 10%, 0 10%); }
  5%   { clip-path: polygon(0 30%, 100% 30%, 100% 25%, 0 25%); }
  5.5% { clip-path: polygon(0 15%, 100% 15%, 100% 16%, 0 16%); }
  7%   { clip-path: polygon(0 40%, 100% 40%, 100% 39%, 0 39%); }
  8%   { clip-path: polygon(0 20%, 100% 20%, 100% 21%, 0 21%); }
  9%   { clip-path: polygon(0 60%, 100% 60%, 100% 55%, 0 55%); }
  10.5%{ clip-path: polygon(0 30%, 100% 30%, 100% 31%, 0 31%); }
  11%  { clip-path: polygon(0 70%, 100% 70%, 100% 69%, 0 69%); }
  13%  { clip-path: polygon(0 40%, 100% 40%, 100% 41%, 0 41%); }
  14%  { clip-path: polygon(0 80%, 100% 80%, 100% 75%, 0 75%); }
  14.5%{ clip-path: polygon(0 50%, 100% 50%, 100% 51%, 0 51%); }
  15%  { clip-path: polygon(0 90%, 100% 90%, 100% 90%, 0 90%); }
  16%  { clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%); }
  18%  { clip-path: polygon(0 100%, 100% 100%, 100% 99%, 0 99%); }
  20%  { clip-path: polygon(0 70%, 100% 70%, 100% 71%, 0 71%); }
  21.9% {
    opacity: 1;
    transform: translate3d(0, calc(-1 * var(--gap-vertical)), 0) scale3d(-1,-1,1);
  }
  22%, 100% {
    opacity: 0;
    transform: translate3d(0,0,0);
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
  }
}

@keyframes site-glitch-anim-flash {
  0%, 5% {
    opacity: 0.2;
    transform: translate3d(var(--gap-horizontal), var(--gap-vertical), 0);
  }
  5.5%, 100% {
    opacity: 0;
    transform: translate3d(0, 0, 0);
  }
}
`;

  const style = document.createElement('style');
  style.id = 'site-glitch-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

// ─── Trigger the glitch effect ──────────────────────────────────────
let glitchActive = false;

export async function triggerGlitchEffect(durationMs: number = 30000): Promise<void> {
  if (glitchActive) return;
  glitchActive = true;

  injectGlitchStyles();

  // Capture current viewport using html-to-image (handles modern CSS like oklch)
  const dataUrl = await toJpeg(document.body, {
    quality: 0.8,
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    skipFonts: true,
    filter: (node: HTMLElement) => {
      // Skip the glitch overlay itself if it exists
      return node.id !== 'site-glitch-overlay';
    },
  });

  // Build overlay DOM
  const overlay = document.createElement('div');
  overlay.className = 'site-glitch-overlay';
  overlay.id = 'site-glitch-overlay';

  for (let i = 0; i < 5; i++) {
    const layer = document.createElement('div');
    layer.className = 'glitch__img';
    layer.style.backgroundImage = `url(${dataUrl})`;
    overlay.appendChild(layer);
  }

  document.body.appendChild(overlay);

  // Activate animations after a micro-delay (ensures DOM paint)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });
  });

  // Remove after duration
  setTimeout(() => {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      glitchActive = false;
    }, 500);
  }, durationMs);
}
