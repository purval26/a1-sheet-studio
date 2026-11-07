import { CREATOR_CREDITS } from '../constants.js';
import { Icons } from './UIComponents.js';

/**
 * Cinematic Opening Animation Component
 * A full-viewport introductory sequence communicating creator contributions.
 * Appears only on first visit (tracked in localStorage), with Skip available after credits appear.
 */
export function playCinematicIntro(options = {}) {
  const { force = false, onComplete = () => {} } = options;

  // 1. Check if user already saw the intro
  const hasSeen = localStorage.getItem(CREATOR_CREDITS.storageKey);
  if (hasSeen === 'true' && !force) {
    onComplete();
    return;
  }

  // 2. Accessibility: Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && !force) {
    try {
      localStorage.setItem(CREATOR_CREDITS.storageKey, 'true');
    } catch (_) {}
    onComplete();
    return;
  }

  // 3. Create Intro Overlay Element
  let overlay = document.getElementById('cinematic-intro-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'cinematic-intro-overlay';
  overlay.className = 'fixed inset-0 z-[100] flex flex-col items-center justify-between text-white select-none transition-opacity duration-700 opacity-0 overflow-hidden';
  overlay.style.background = 'radial-gradient(circle at 50% 45%, #070e24 0%, #03060f 65%, #010206 100%)';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Creator Introduction');

  overlay.innerHTML = `
    <!-- Top Bar: Subtle Branding & Skip Action -->
    <div class="w-full max-w-5xl px-6 py-6 sm:py-8 flex items-center justify-between z-20">
      <div class="flex items-center gap-2.5 opacity-60">
        <span class="w-6 h-6 rounded bg-white text-black font-extrabold flex items-center justify-center text-xs">A1</span>
        <span class="font-mono text-[11px] tracking-widest uppercase text-zinc-400">Sheet Studio</span>
      </div>

      <!-- Skip Button: Hidden until creator credits appear in Scene 3 -->
      <button 
        id="intro-skip-btn" 
        type="button" 
        class="text-xs px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/25 text-zinc-300 hover:text-white transition-all duration-300 backdrop-blur-md opacity-0 pointer-events-none touch-manipulation flex items-center gap-1.5"
        title="Skip intro to Studio"
      >
        <span>Skip</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/></svg>
      </button>
    </div>

    <!-- Center Stage: Cinematic Text Display -->
    <div class="flex-1 w-full max-w-3xl px-6 flex flex-col items-center justify-center text-center relative z-10 -mt-8">
      
      <!-- Ambient Backlight Glow -->
      <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-600/10 blur-[90px] pointer-events-none -z-10"></div>

      <!-- Scene Stage Container -->
      <div id="intro-scene-stage" class="min-h-[140px] sm:min-h-[160px] flex items-center justify-center w-full">
        <!-- Scenes are dynamically mounted with smooth fade/scale transitions -->
      </div>

    </div>

    <!-- Bottom Attribution Footnote -->
    <div class="w-full max-w-5xl px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 z-20 gap-2">
      <div class="tracking-wide">
        Architectural Sheet Design Engine
      </div>
      <div id="intro-progress-bar-container" class="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div id="intro-progress-bar" class="h-full bg-blue-400 transition-all duration-100 ease-linear w-0"></div>
      </div>
      <div class="font-mono text-[10px] text-zinc-500">
        841 × 594 mm
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger initial fade-in
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
  });

  const stage = overlay.querySelector('#intro-scene-stage');
  const skipBtn = overlay.querySelector('#intro-skip-btn');
  const progressBar = overlay.querySelector('#intro-progress-bar');

  let isDestroyed = false;
  let activeTimeouts = [];

  const cleanup = () => {
    if (isDestroyed) return;
    isDestroyed = true;

    activeTimeouts.forEach((t) => clearTimeout(t));
    activeTimeouts = [];

    try {
      localStorage.setItem(CREATOR_CREDITS.storageKey, 'true');
    } catch (_) {}

    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    overlay.style.pointerEvents = 'none';

    setTimeout(() => {
      overlay.remove();
      onComplete();
    }, 700);
  };

  skipBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cleanup();
  });

  // Scene Definition List
  const scenes = [
    // Scene 1: The Problem
    {
      html: `
        <div class="space-y-3 scene-fade-enter">
          <p class="text-xs uppercase tracking-[0.25em] text-blue-400 font-mono font-medium">Origin</p>
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-100 tracking-tight leading-snug">
            Every useful tool starts with a <span class="font-semibold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">problem</span>.
          </h2>
        </div>
      `,
      duration: 1800,
    },

    // Scene 2: Tanish (Idea & Originator)
    {
      html: `
        <div class="space-y-3 scene-fade-enter">
          <p class="text-xs uppercase tracking-[0.25em] text-blue-400 font-mono font-medium">Concept & Vision</p>
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-200 tracking-tight leading-snug">
            An idea sparked by <span class="font-semibold text-white drop-shadow-[0_0_30px_rgba(96,165,250,0.6)]">Tanish</span>.
          </h2>
          <p class="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto pt-1 font-normal">
            Originator of the original problem and horizontal A1 layout concept
          </p>
        </div>
      `,
      duration: 1800,
    },

    // Scene 3: Purval (Developer & Solution) - Enables Skip button!
    {
      html: `
        <div class="space-y-3 scene-fade-enter">
          <p class="text-xs uppercase tracking-[0.25em] text-blue-400 font-mono font-medium">Architecture & Code</p>
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-200 tracking-tight leading-snug">
            A solution built by <span class="font-semibold text-white drop-shadow-[0_0_30px_rgba(96,165,250,0.6)]">Purval</span>.
          </h2>
          <p class="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto pt-1 font-normal">
            Developer who engineered the vector PDF engine, collage math, and studio UI
          </p>
        </div>
      `,
      duration: 1800,
      onEnter: () => {
        // Both credits are now visible! Reveal Skip button smoothly
        if (skipBtn) {
          skipBtn.classList.remove('opacity-0', 'pointer-events-none');
          skipBtn.classList.add('opacity-100', 'pointer-events-auto');
        }
      },
    },

    // Scene 4: Synthesis
    {
      html: `
        <div class="space-y-3 sm:space-y-4 scene-fade-enter">
          <p class="text-xs uppercase tracking-[0.25em] text-blue-400 font-mono font-medium">Crafted with Purpose</p>
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-300 tracking-tight leading-snug">
            One problem. <span class="text-zinc-200">One solution.</span>
            <span class="block mt-1 sm:mt-2 font-semibold text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]">
              One useful tool.
            </span>
          </h2>
        </div>
      `,
      duration: 1900,
    },
  ];

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
  let elapsedTime = 0;

  // Run progress bar animation
  const startTime = Date.now();
  const progressInterval = setInterval(() => {
    if (isDestroyed) {
      clearInterval(progressInterval);
      return;
    }
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, (elapsed / totalDuration) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (elapsed >= totalDuration) {
      clearInterval(progressInterval);
    }
  }, 50);

  // Play scenes in sequence
  function runScene(index) {
    if (isDestroyed) return;

    if (index >= scenes.length) {
      // Scene 5: Transition smoothly into the actual application
      cleanup();
      return;
    }

    const scene = scenes[index];

    // Fade out previous scene if any
    const currentSceneEl = stage.firstElementChild;
    if (currentSceneEl) {
      currentSceneEl.classList.remove('scene-fade-enter');
      currentSceneEl.classList.add('scene-fade-exit');
    }

    const switchTimeout = setTimeout(() => {
      if (isDestroyed) return;

      stage.innerHTML = scene.html;
      if (scene.onEnter) scene.onEnter();

      // Schedule next scene transition
      const nextTimeout = setTimeout(() => {
        runScene(index + 1);
      }, scene.duration);

      activeTimeouts.push(nextTimeout);
    }, currentSceneEl ? 280 : 0);

    activeTimeouts.push(switchTimeout);
  }

  // Start sequence
  runScene(0);
}
