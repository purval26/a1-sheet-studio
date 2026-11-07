/**
 * Cinematic Opening Animation Component
 * Pure Monochromatic Black & White.
 * - No top or bottom extra text (center content only).
 * - Plays on every visit with prominent, bold name highlights.
 * - Ends with the iconic A1 logo appearing in center and morphing smoothly into the navbar logo.
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

  // Create Pure Black Intro Overlay with ONLY Center Content
  overlay = document.createElement('div');
  overlay.id = 'cinematic-intro-overlay';
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center text-white select-none transition-opacity duration-500 opacity-0 overflow-hidden bg-black';
  overlay.style.background = '#000000';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Creator Introduction');

  overlay.innerHTML = `
    <!-- Center Stage: Pure Monochromatic Content Only (No Top or Bottom Text) -->
    <div class="relative w-full max-w-3xl px-6 flex flex-col items-center justify-center text-center">
      
      <!-- Subtle Ambient White Glow -->
      <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/[0.03] blur-[120px] pointer-events-none -z-10"></div>

      <!-- Scene Stage Container -->
      <div id="intro-scene-stage" class="min-h-[220px] sm:min-h-[260px] flex items-center justify-center w-full">
        <!-- Scenes are dynamically mounted -->
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
    }, 500);
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

    // Scene 2: Tanish - Bold Prominent Typography
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

    // Scene 3: Purval - Bold Prominent Typography
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
      // Final Scene: Reveal A1 Logo & Morph into Navbar Logo!
      triggerA1LogoMorph();
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

  /**
   * Final Cinematic Transition:
   * 1. A1 logo appears in center of screen with scale & soft glow.
   * 2. Smoothly morphs/translates into the exact position & scale of the navbar logo.
   * 3. Overlay fades out into the page.
   */
  function triggerA1LogoMorph() {
    if (isDestroyed) return;

    // Fade out the last text scene
    const currentSceneEl = stage.firstElementChild;
    if (currentSceneEl) {
      currentSceneEl.classList.remove('scene-fade-enter');
      currentSceneEl.classList.add('scene-fade-exit');
    }

    setTimeout(() => {
      if (isDestroyed) return;

      // 1. Mount the central A1 Logo
      stage.innerHTML = `
        <div id="intro-morph-logo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-black font-extrabold flex items-center justify-center text-2xl sm:text-3xl shadow-2xl tracking-tight select-none will-change-transform z-50 opacity-0 scale-75 drop-shadow-[0_0_40px_rgba(255,255,255,0.7)]">
          A1
        </div>
      `;

      const morphLogo = stage.querySelector('#intro-morph-logo');
      if (!morphLogo) {
        cleanup();
        return;
      }

      // Smoothly appear in center
      morphLogo.style.transition = 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => {
        morphLogo.classList.remove('opacity-0', 'scale-75');
        morphLogo.classList.add('opacity-100', 'scale-100');
      });

      // 2. Pause momentarily (~450ms), then morph to target navbar logo
      const morphTimeout = setTimeout(() => {
        if (isDestroyed) return;

        const targetLogo = document.getElementById('nav-brand-logo');
        if (!targetLogo) {
          cleanup();
          return;
        }

        // Measure source and target rectangles
        const targetRect = targetLogo.getBoundingClientRect();
        const morphRect = morphLogo.getBoundingClientRect();

        const deltaX = targetRect.left - morphRect.left;
        const deltaY = targetRect.top - morphRect.top;
        const scaleX = targetRect.width / morphRect.width;
        const scaleY = targetRect.height / morphRect.height;
        const targetBorderRadius = window.getComputedStyle(targetLogo).borderRadius || '8px';

        // Set transform-origin to top-left for pixel-perfect scale & translation matching
        morphLogo.style.transformOrigin = '0 0';

        // Temporarily hide the real target logo underneath during the morph flight
        targetLogo.style.opacity = '0';

        // Animate the logo from center to the navbar logo coordinates
        morphLogo.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.75s ease, box-shadow 0.75s ease, filter 0.5s ease';
        morphLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
        morphLogo.style.borderRadius = targetBorderRadius;
        morphLogo.style.boxShadow = 'none';
        morphLogo.style.filter = 'none';

        // Simultaneously fade out the black background overlay to reveal the page
        overlay.style.transition = 'opacity 0.65s ease-out';
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        overlay.style.pointerEvents = 'none';

        // When morph finishes, make the real navbar logo visible and unmount overlay
        setTimeout(() => {
          targetLogo.style.opacity = '1';
          overlay.remove();
          onComplete();
        }, 760);

      }, 550);

      activeTimeouts.push(morphTimeout);
    }, currentSceneEl ? 260 : 0);
  }

  // Start sequence
  runScene(0);
}
