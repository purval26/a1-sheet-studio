import { Icons } from './UIComponents.js';

export function renderNavbar(container, { state, onBackToLanding, onExportPdf, onApplyPreset, onToggleMobileView, onToggleTheme }) {
  const activeMobileTab = state.mobileViewTab || 'split';
  const isDark = state.theme === 'dark';

  container.innerHTML = `
    <header class="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-md sticky top-0 z-30 select-none transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        
        <!-- Left: Back & Title -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <button id="nav-back-btn" class="btn-ghost text-xs p-2 rounded-lg touch-manipulation" title="Back to Overview">
            ${Icons.ArrowLeft}
          </button>
          
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-6 h-6 rounded bg-[var(--accent)] text-[var(--accent-inverted)] font-extrabold flex items-center justify-center text-xs flex-shrink-0">A1</span>
            <span class="font-semibold text-xs sm:text-sm tracking-tight text-[var(--text-main)] truncate">
              ${state.sheetTitle ? state.sheetTitle : 'Sheet Studio'}
            </span>
          </div>
        </div>

        <!-- Center: Mobile View Switcher (Clean Minimal Text + SVG Icons, No Emojis) -->
        <div class="flex md:hidden items-center bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg p-0.5" id="mobile-view-toggle">
          <button type="button" class="px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition ${activeMobileTab === 'split' ? 'bg-[var(--bg-secondary)] text-[var(--text-main)] shadow font-semibold' : 'text-[var(--text-muted)]'}" data-tab="split">
            Split
          </button>
          <button type="button" class="px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition ${activeMobileTab === 'controls' ? 'bg-[var(--bg-secondary)] text-[var(--text-main)] shadow font-semibold' : 'text-[var(--text-muted)]'}" data-tab="controls">
            ${Icons.Sliders} Controls
          </button>
          <button type="button" class="px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition ${activeMobileTab === 'preview' ? 'bg-[var(--bg-secondary)] text-[var(--text-main)] shadow font-semibold' : 'text-[var(--text-muted)]'}" data-tab="preview">
            ${Icons.Eye} Canvas
          </button>
        </div>

        <!-- Center on Desktop: Presets -->
        <div class="hidden md:flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span class="text-[var(--text-dim)] font-medium mr-1">Presets:</span>
          <button id="preset-2x3-btn" class="btn-ghost text-xs py-1 px-2.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-main)]">
            2x3 Grid
          </button>
          <button id="preset-mosaic-btn" class="btn-ghost text-xs py-1 px-2.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-main)]">
            Mosaic Hero
          </button>
          <button id="preset-2x2-btn" class="btn-ghost text-xs py-1 px-2.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-main)]">
            2x2 Grid
          </button>
        </div>

        <!-- Right Actions: Theme Toggle & PDF Download -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <!-- Theme Toggle Button -->
          <button id="nav-theme-toggle-btn" class="btn-ghost p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] touch-manipulation" title="Toggle Light/Dark Theme">
            ${isDark ? Icons.Sun : Icons.Moon}
          </button>

          <!-- Export PDF Button -->
          <button id="nav-export-pdf-btn" class="btn-primary text-xs py-1.5 sm:py-2 px-3 sm:px-4 font-semibold shadow-md touch-manipulation flex-shrink-0 ${state.isExportingPdf ? 'opacity-70 cursor-wait' : ''}" ${state.isExportingPdf ? 'disabled' : ''}>
            ${state.isExportingPdf ? `
              <svg class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Exporting...</span>
            ` : `
              ${Icons.Download}
              <span class="hidden xs:inline">Download</span> <span class="hidden sm:inline">A1</span> PDF
            `}
          </button>
        </div>

      </div>
    </header>
  `;

  // Attach event handlers
  container.querySelector('#nav-back-btn')?.addEventListener('click', onBackToLanding);
  container.querySelector('#nav-export-pdf-btn')?.addEventListener('click', onExportPdf);
  container.querySelector('#nav-theme-toggle-btn')?.addEventListener('click', onToggleTheme);

  container.querySelector('#preset-2x3-btn')?.addEventListener('click', () => onApplyPreset('2x3'));
  container.querySelector('#preset-mosaic-btn')?.addEventListener('click', () => onApplyPreset('mosaic'));
  container.querySelector('#preset-2x2-btn')?.addEventListener('click', () => onApplyPreset('2x2'));

  container.querySelectorAll('#mobile-view-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => {
      onToggleMobileView(btn.dataset.tab);
    });
  });
}
