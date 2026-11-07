import { Icons } from './UIComponents.js';
import { CREATOR_CREDITS } from '../constants.js';

/**
 * Reusable Creator Attribution Footer Component
 * Displays: "An idea by Tanish · Built by Purval" with clickable Instagram links.
 */
export function renderFooter(container, options = {}) {
  const { variant = 'standard', onReplayIntro = null } = options;
  const isCompact = variant === 'compact';

  if (!container) return;

  if (isCompact) {
    // Compact variant for sidebar / controls bottom
    container.innerHTML = `
      <div class="pt-5 pb-2 border-t border-[var(--border-subtle)] text-center space-y-2 select-none">
        <p class="text-xs text-[var(--text-muted)] font-medium tracking-tight">
          ${CREATOR_CREDITS.attributionText}
        </p>

        <div class="flex items-center justify-center gap-2 text-[11px]">
          <a 
            href="${CREATOR_CREDITS.tanish.instagram}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all duration-150 group touch-manipulation"
            title="Tanish on Instagram (${CREATOR_CREDITS.tanish.handle})"
          >
            <span class="text-[var(--text-dim)] group-hover:text-pink-400 transition-colors">${Icons.Instagram}</span>
            <span class="font-medium">${CREATOR_CREDITS.tanish.name}</span>
          </a>

          <a 
            href="${CREATOR_CREDITS.purval.instagram}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all duration-150 group touch-manipulation"
            title="Purval on Instagram (${CREATOR_CREDITS.purval.handle})"
          >
            <span class="text-[var(--text-dim)] group-hover:text-pink-400 transition-colors">${Icons.Instagram}</span>
            <span class="font-medium">${CREATOR_CREDITS.purval.name}</span>
          </a>

          ${onReplayIntro ? `
            <button 
              type="button" 
              class="replay-intro-btn inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)] transition touch-manipulation"
              title="Replay Cinematic Introduction"
            >
              ${Icons.Rotate} <span>Story</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  } else {
    // Full width standard variant for landing page / main pages
    container.innerHTML = `
      <footer class="w-full border-t border-[var(--border-subtle)] py-6 px-4 sm:px-6 bg-[var(--bg-secondary)]/60 text-xs transition-colors duration-200 select-none">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- App Info & Dimensions -->
          <div class="text-[var(--text-dim)] flex items-center gap-2 text-center sm:text-left">
            <span class="w-2 h-2 rounded-full bg-emerald-500/80"></span>
            <span class="font-medium text-[var(--text-muted)]">A1 Sheet Studio</span>
            <span class="text-[var(--text-dim)]">•</span>
            <span>Landscape 841 × 594 mm Presentation Engine</span>
          </div>

          <!-- Creator Attribution & Clickable Instagram Links -->
          <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span class="text-[var(--text-muted)] font-medium tracking-tight">
              ${CREATOR_CREDITS.attributionText}
            </span>

            <div class="flex items-center gap-2">
              <a 
                href="${CREATOR_CREDITS.tanish.instagram}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all duration-150 text-[11px] group touch-manipulation"
                title="Tanish on Instagram (${CREATOR_CREDITS.tanish.handle})"
              >
                <span class="text-[var(--text-dim)] group-hover:text-pink-400 transition-colors">${Icons.Instagram}</span>
                <span class="font-medium">${CREATOR_CREDITS.tanish.name}</span>
              </a>

              <a 
                href="${CREATOR_CREDITS.purval.instagram}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all duration-150 text-[11px] group touch-manipulation"
                title="Purval on Instagram (${CREATOR_CREDITS.purval.handle})"
              >
                <span class="text-[var(--text-dim)] group-hover:text-pink-400 transition-colors">${Icons.Instagram}</span>
                <span class="font-medium">${CREATOR_CREDITS.purval.name}</span>
              </a>

              ${onReplayIntro ? `
                <button 
                  type="button" 
                  class="replay-intro-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition text-[11px] touch-manipulation"
                  title="Replay Cinematic Introduction"
                >
                  ${Icons.Rotate} <span>Story</span>
                </button>
              ` : ''}
            </div>
          </div>

        </div>
      </footer>
    `;
  }

  if (onReplayIntro) {
    container.querySelectorAll('.replay-intro-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        onReplayIntro();
      });
    });
  }
}
