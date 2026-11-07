import { Icons } from './UIComponents.js';
import { CREATOR_CREDITS } from '../constants.js';

/**
 * Reusable Creator Attribution Footer Component
 * Monochromatic text line with inline Instagram links and icons before names:
 * "An idea by [IG] Tanish · Built by [IG] Purval"
 * Dimensions and extra buttons removed.
 */
export function renderFooter(container, options = {}) {
  const { variant = 'standard' } = options;
  const isCompact = variant === 'compact';

  if (!container) return;

  const attributionHtml = `
    <span>An idea by</span>
    <a 
      href="${CREATOR_CREDITS.tanish.instagram}" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="inline-flex items-center gap-1 font-semibold text-[var(--text-main)] hover:underline decoration-zinc-500 underline-offset-4 transition-colors group mx-1"
      title="Tanish on Instagram (${CREATOR_CREDITS.tanish.handle})"
    >
      <span class="text-[var(--text-dim)] group-hover:text-[var(--text-main)] transition-colors">${Icons.Instagram}</span>
      <span>${CREATOR_CREDITS.tanish.name}</span>
    </a>
    <span class="mx-1 text-[var(--text-dim)]">·</span>
    <span>Built by</span>
    <a 
      href="${CREATOR_CREDITS.purval.instagram}" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="inline-flex items-center gap-1 font-semibold text-[var(--text-main)] hover:underline decoration-zinc-500 underline-offset-4 transition-colors group mx-1"
      title="Purval on Instagram (${CREATOR_CREDITS.purval.handle})"
    >
      <span class="text-[var(--text-dim)] group-hover:text-[var(--text-main)] transition-colors">${Icons.Instagram}</span>
      <span>${CREATOR_CREDITS.purval.name}</span>
    </a>
  `;

  if (isCompact) {
    // Compact variant for sidebar controls bottom
    container.innerHTML = `
      <div class="pt-5 pb-2 border-t border-[var(--border-subtle)] text-center select-none">
        <p class="text-xs text-[var(--text-muted)] tracking-tight flex items-center justify-center flex-wrap">
          ${attributionHtml}
        </p>
      </div>
    `;
  } else {
    // Standard full-width variant for landing page
    container.innerHTML = `
      <footer class="w-full border-t border-[var(--border-subtle)] py-6 px-4 sm:px-6 bg-[var(--bg-secondary)]/60 text-xs transition-colors duration-200 select-none">
        <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <!-- Minimal App Brand (Dimensions Removed) -->
          <div class="text-[var(--text-dim)] flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[var(--accent)] opacity-80"></span>
            <span class="font-medium text-[var(--text-muted)]">A1 Sheet Studio</span>
          </div>

          <!-- Attribution Line with Inline Instagram Links and Icons -->
          <div class="text-xs text-[var(--text-muted)] tracking-tight flex items-center justify-center sm:justify-end flex-wrap">
            ${attributionHtml}
          </div>

        </div>
      </footer>
    `;
  }
}
