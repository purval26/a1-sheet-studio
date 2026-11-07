import { Icons } from './UIComponents.js';

export function renderLandingPage(container, { onOpenStudio, onToggleTheme, theme }) {
  const isDark = theme === 'dark';

  container.innerHTML = `
    <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col justify-between selection:bg-zinc-500 selection:text-white transition-colors duration-200">
      
      <!-- Top Navigation -->
      <header class="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 backdrop-blur-md sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent)] text-[var(--accent-inverted)] font-extrabold flex items-center justify-center text-xs sm:text-sm shadow-sm">
              A1
            </div>
            <div>
              <span class="font-semibold text-sm sm:text-base tracking-tight text-[var(--text-main)]">A1 Studio</span>
              <span class="hidden sm:inline-block text-[11px] text-[var(--text-muted)] ml-2 px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
                Landscape 841×594 mm
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Theme Toggle Button -->
            <button id="landing-theme-toggle-btn" class="btn-ghost p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] touch-manipulation" title="Toggle Light/Dark Theme">
              ${isDark ? Icons.Sun : Icons.Moon}
            </button>

            <!-- Direct Launch Button -->
            <button id="hero-launch-top-btn" class="btn-primary text-xs py-1.5 px-3.5 sm:px-4 touch-manipulation">
              Open Studio
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex-1 flex flex-col justify-center">
        <div class="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Professional Architectural Presentation Engine
          </div>

          <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.15]">
            Precision A1 Presentation Sheets.
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-zinc-600 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500 block sm:inline">
              Print-Ready Vector PDF.
            </span>
          </h1>

          <p class="text-xs sm:text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto font-normal px-2">
            Compose architectural presentation boards with standard 2cm binding margins, customizable 5cm dual title blocks, uniform-gap photo grids, dynamic mosaics, and direct vector PDF export.
          </p>

          <div class="flex items-center justify-center pt-2">
            <button id="hero-launch-main-btn" class="btn-primary py-3 px-8 text-sm font-semibold tracking-wide shadow-lg shadow-black/10 dark:shadow-white/10 touch-manipulation">
              Launch Sheet Studio
            </button>
          </div>
        </div>

        <!-- Miniature Interactive Preview Mockup -->
        <div class="mt-8 sm:mt-14 max-w-3xl mx-auto w-full">
          <div class="relative group cursor-pointer p-2 sm:p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl transition hover:border-[var(--border-active)]" id="preview-mockup-card">
            <div class="absolute -top-3 right-4 sm:right-6 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)] shadow">
              Interactive Sheet Canvas (Tap to Launch)
            </div>

            <!-- Scaled A1 Preview Representation -->
            <div class="w-full aspect-[841/594] bg-white rounded-lg shadow-inner overflow-hidden p-[2.5%] relative flex flex-col justify-between select-none">
              <!-- Asymmetric Outer Margin Box: 20mm left (2.4%), 10mm others (1.2%) -->
              <div class="w-full h-full border-[1.5px] border-black flex flex-col justify-between p-[1.5%] pl-[2.8%]">
                
                <!-- Mosaic Style Representation -->
                <div class="flex gap-[1.5%] w-full flex-1">
                  <!-- Hero Cell -->
                  <div class="w-[54%] h-full bg-zinc-100 border border-dashed border-zinc-300 rounded-[2px] flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                    Hero Photo (Mosaic Feature)
                  </div>
                  <!-- Right Sub-cells -->
                  <div class="w-[46%] h-full flex flex-col gap-[2%] justify-between">
                    <div class="flex-1 bg-zinc-100 border border-dashed border-zinc-300 rounded-[2px] flex items-center justify-center text-[9px] text-zinc-400 font-mono">Photo 2</div>
                    <div class="flex-1 bg-zinc-100 border border-dashed border-zinc-300 rounded-[2px] flex items-center justify-center text-[9px] text-zinc-400 font-mono">Photo 3</div>
                  </div>
                </div>

                <!-- Bottom 5cm Title Block -->
                <div class="w-full h-[12%] border-t-[1.5px] border-black flex mt-[1.5%]">
                  <div class="w-[72%] pr-3 flex items-center">
                    <span class="font-serif text-[1.4vw] leading-tight font-medium text-black tracking-normal truncate">
                      [Your Project Title]
                    </span>
                  </div>

                  <div class="w-[28%] border-l-[1.5px] border-black pl-2 sm:pl-3 flex flex-col justify-center text-[0.65vw] font-serif text-black leading-tight space-y-[2px]">
                    <div>Name: [Student Name]</div>
                    <div>Year: [Academic Year]</div>
                    <div>Subject: [Course Code]</div>
                    <div>[Faculty / Institution Name]</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-16">
          <div class="p-4 sm:p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div class="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-main)]">
              ${Icons.Layers}
            </div>
            <h3 class="font-semibold text-xs sm:text-sm text-[var(--text-main)]">Standard A1 Landscape</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">
              True 841 × 594 mm dimensions with 2 cm left margin for binding and 1 cm outer border.
            </p>
          </div>

          <div class="p-4 sm:p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div class="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-main)]">
              ${Icons.Type}
            </div>
            <h3 class="font-semibold text-xs sm:text-sm text-[var(--text-main)]">Dual Title Block</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">
              5 cm bottom block split into large project title and dynamic metadata fields (<span class="font-mono text-[10px] text-[var(--text-main)]">[Label]: [Value]</span>).
            </p>
          </div>

          <div class="p-4 sm:p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div class="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-main)]">
              ${Icons.Mosaic}
            </div>
            <h3 class="font-semibold text-xs sm:text-sm text-[var(--text-main)]">Grid & Mosaic Collage</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">
              Standard rows × cols or dynamic architectural mosaic layouts (Hero Left, Hero Top, Asymmetric).
            </p>
          </div>

          <div class="p-4 sm:p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div class="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-main)]">
              ${Icons.Download}
            </div>
            <h3 class="font-semibold text-xs sm:text-sm text-[var(--text-main)]">Vector Sharp PDF</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">
              Direct vector generation via <code class="text-[11px] text-[var(--text-main)]">pdf-lib</code>. Crisp borders and native full-resolution images.
            </p>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-t border-[var(--border-subtle)] py-5 text-center text-xs text-[var(--text-dim)]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>A1 Landscape Architectural Sheet Studio</span>
          <span>Professional Print-Ready Vector Presentation Engine</span>
        </div>
      </footer>
    </div>
  `;

  // Attach event listeners
  const launchBtns = [
    container.querySelector('#hero-launch-main-btn'),
    container.querySelector('#hero-launch-top-btn'),
    container.querySelector('#preview-mockup-card'),
  ];
  launchBtns.forEach((btn) => {
    if (btn) btn.addEventListener('click', onOpenStudio);
  });

  container.querySelector('#landing-theme-toggle-btn')?.addEventListener('click', onToggleTheme);
}
