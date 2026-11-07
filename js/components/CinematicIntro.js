import { CREATOR_CREDITS } from '../constants.js';

/**
 * Cinematic Opening Animation Component
 * Pure Black & White minimal aesthetic matching the application design system.
 * Appears every time on visit, with bold prominent name highlights.
 */
export function playCinematicIntro(options = {}) {
  const { onComplete = () => {} } = options;

  // Accessibility check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    onComplete();
    return;
  }

  // Remove existing overlay if any
  let overlay = document.getElementById('cinematic-intro-overlay');
  if (overlay) overlay.remove();

  // Create Pure Black & White Intro Overlay
  overlay = document.createElement('div');
  overlay.id = 'cinematic-intro-overlay';
  overlay.className = 'fixed inset-0 z-[100] flex flex-col items-center justify-between text-white select-none transition-opacity duration-700 opacity-0 overflow-hidden';
  overlay.style.background = 'radial-gradient(circle at 50% 50%, #0c0c0e 0%, #000000 80%)';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Creator Introduction');

  overlay.innerHTML = `
    <!-- Top Bar: Clean Monochromatic Branding (No Skip Button) -->
    <div class="w-full max-w-5xl px-6 py-6 sm:py-8 flex items-center justify-between z-20">
      <div class="flex items-center gap-2.5 opacity-70">
        <span class="w-6 h-6 rounded bg-white text-black font-extrabold flex items-center justify-center text-xs">A1</span>
        <span class="font-mono text-[11px] tracking-widest uppercase text-zinc-400">Sheet Studio</span>
      </div>

      <div class="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
        841 × 594 mm
      </div>
    </div>

    <!-- Center Stage: Cinematic Monochromatic Typography -->
    <div class="flex-1 w-full max-w-3xl px-6 flex flex-col items-center justify-center text-center relative z-10 -mt-6">
      
      <!-- Subtle Ambient White Glow (No Blue) -->
      <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/[0.04] blur-[100px] pointer-events-none -z-10"></div>

      <!-- Scene Stage Container -->
      <div id="intro-scene-stage" class="min-h-[180px] sm:min-h-[220px] flex items-center justify-center w-full">
        <!-- Scenes are dynamically mounted with smooth fade/scale transitions -->
      </div>

    </div>

    <!-- Bottom Attribution Footnote (No Progress Bar) -->
    <div class="w-full max-w-5xl px-6 py-6 sm:py-8 flex items-center justify-between text-[11px] text-zinc-600 z-20">
      <div class="tracking-widest uppercase font-mono text-[10px]">
        Architectural Design Studio
      </div>
      <div class="font-mono text-[10px] tracking-widest uppercase">
        Vector PDF Engine
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger initial smooth fade-in
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
  });

  const stage = overlay.querySelector('#intro-scene-stage');
  let isDestroyed = false;
  let activeTimeouts = [];

  const cleanup = () => {
    if (isDestroyed) return;
    isDestroyed = true;

    activeTimeouts.forEach((t) => clearTimeout(t));
    activeTimeouts = [];

    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    overlay.style.pointerEvents = 'none';

    setTimeout(() => {
      overlay.remove();
      onComplete();
    }, 650);
  };

  // Black and White Scene Definitions with Bold Prominent Names
  const scenes = [
    // Scene 1: The Problem
    {
      html: `
        <div class="space-y-4 scene-fade-enter">
          <p class="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-zinc-500 font-mono">Origin</p>
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-300 tracking-tight leading-snug">
            Every useful tool starts with a <span class="font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">problem</span>.
          </h2>
        </div>
      `,
      duration: 1650,
    },

    // Scene 2: Tanish - Bold Prominent Standing Out Typography
    {
      html: `
        <div class="space-y-3 sm:space-y-4 scene-fade-enter">
          <p class="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-zinc-500 font-mono">Concept & Origin</p>
          <div class="space-y-1 sm:space-y-2">
            <span class="text-lg sm:text-2xl md:text-3xl font-light text-zinc-400 block tracking-normal">
              An idea sparked by
            </span>
            <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] py-1">
              Tanish
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto pt-2 font-normal leading-relaxed">
            Originator of the original problem & horizontal A1 layout
          </p>
        </div>
      `,
      duration: 1850,
    },

    // Scene 3: Purval - Bold Prominent Standing Out Typography
    {
      html: `
        <div class="space-y-3 sm:space-y-4 scene-fade-enter">
          <p class="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-zinc-500 font-mono">Development & Architecture</p>
          <div class="space-y-1 sm:space-y-2">
            <span class="text-lg sm:text-2xl md:text-3xl font-light text-zinc-400 block tracking-normal">
              A solution built by
            </span>
            <h1 class="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] py-1">
              Purval
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto pt-2 font-normal leading-relaxed">
            Developer who solved the problem and built the tool
          </p>
        </div>
      `,
      duration: 1850,
    },

    // Scene 4: Synthesis
    {
      html: `
        <div class="space-y-4 scene-fade-enter">
          <p class="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-zinc-500 font-mono">Crafted with Purpose</p>
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-light text-zinc-300 tracking-tight leading-snug">
            One problem. <span class="text-zinc-200">One solution.</span>
            <span class="block mt-2 font-extrabold text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.7)]">
              One useful tool.
            </span>
          </h2>
        </div>
      `,
      duration: 1750,
    },
  ];

  // Play scenes sequentially
  function runScene(index) {
    if (isDestroyed) return;

    if (index >= scenes.length) {
      // Scene 5: Transition smoothly into the actual application
      cleanup();
      return;
    }

    const scene = scenes[index];

    // Fade out previous scene smoothly
    const currentSceneEl = stage.firstElementChild;
    if (currentSceneEl) {
      currentSceneEl.classList.remove('scene-fade-enter');
      currentSceneEl.classList.add('scene-fade-exit');
    }

    const switchTimeout = setTimeout(() => {
      if (isDestroyed) return;

      stage.innerHTML = scene.html;

      const nextTimeout = setTimeout(() => {
        runScene(index + 1);
      }, scene.duration);

      activeTimeouts.push(nextTimeout);
    }, currentSceneEl ? 260 : 0);

    activeTimeouts.push(switchTimeout);
  }

  // Start sequence
  runScene(0);
}
