import { DEFAULT_STATE } from './constants.js';
import { renderLandingPage } from './components/LandingPage.js';
import { renderNavbar } from './components/Navbar.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderSheetPreview } from './components/SheetPreview.js';
import { generateA1Pdf } from './pdfGenerator.js';

class A1App {
  constructor() {
    // Theme initialization (default dark, persists in localStorage)
    const savedTheme = localStorage.getItem('a1_theme') || 'dark';

    this.state = {
      ...DEFAULT_STATE,
      theme: savedTheme,
      mobileViewTab: 'split', // Default to split on mobile so preview is ALWAYS visible and live!
    };

    this.root = document.getElementById('app-root');
    this.toastContainer = document.getElementById('toast-root');

    this.applyTheme(savedTheme);
    this.init();
  }

  applyTheme(theme) {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('a1_theme', nextTheme);
    this.applyTheme(nextTheme);
    this.updateState({ theme: nextTheme });
    this.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  }

  init() {
    this.render();

    // Resize / orientation listener
    window.addEventListener('resize', () => {
      if (this.state.activeView === 'studio') {
        const previewEl = document.getElementById('preview-container');
        if (previewEl) {
          renderSheetPreview(previewEl, {
            state: this.state,
            onUpdateState: (partial) => this.handleSidebarUpdate(partial, false),
          });
        }
      }
    });
  }

  updateState(partialState, shouldReRenderSidebar = false) {
    this.state = { ...this.state, ...partialState };
    this.render(shouldReRenderSidebar);
  }

  handleSidebarUpdate(partial, reRenderControls = false) {
    this.state = { ...this.state, ...partial };

    // Always immediately update preview upon any action on the control panel
    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
      renderSheetPreview(previewContainer, {
        state: this.state,
        onUpdateState: (p) => this.handleSidebarUpdate(p, false),
      });
    }

    // If controls themselves need refreshing (e.g. preset applied or row added)
    if (reRenderControls) {
      const sidebarContainer = document.getElementById('sidebar-container');
      if (sidebarContainer) {
        renderSidebar(sidebarContainer, {
          state: this.state,
          onUpdateState: (p, r) => this.handleSidebarUpdate(p, r),
        });
      }
    }
  }

  render(reRenderSidebar = false) {
    if (this.state.activeView === 'landing') {
      this.renderLandingView();
    } else {
      this.renderStudioView(reRenderSidebar);
    }
  }

  renderLandingView() {
    this.root.innerHTML = `<div id="landing-container"></div>`;
    renderLandingPage(this.root.querySelector('#landing-container'), {
      theme: this.state.theme,
      onOpenStudio: () => {
        this.updateState({ activeView: 'studio', mobileViewTab: 'split' });
      },
      onToggleTheme: () => this.toggleTheme(),
    });
  }

  renderStudioView(reRenderSidebar) {
    const isMobile = window.innerWidth < 768;
    const mobileTab = this.state.mobileViewTab || 'split';

    let editorLayout = document.getElementById('studio-layout-root');
    if (!editorLayout) {
      this.root.innerHTML = `
        <div id="studio-layout-root" class="min-h-screen md:h-screen flex flex-col bg-[var(--bg-primary)] md:overflow-hidden text-[var(--text-main)] transition-colors duration-200">
          <div id="navbar-container" class="sticky top-0 z-30 flex-shrink-0"></div>
          <div id="studio-workspace" class="flex-1 flex flex-col md:flex-row md:overflow-hidden relative">
            <div id="preview-container" class="relative transition-all duration-150"></div>
            <div id="sidebar-container" class="relative transition-all duration-150 flex flex-col"></div>
          </div>
        </div>
      `;
      editorLayout = document.getElementById('studio-layout-root');
      reRenderSidebar = true;
    }

    const previewEl = document.getElementById('preview-container');
    const sidebarEl = document.getElementById('sidebar-container');

    // Layout configuration based on device and active mobile tab
    if (previewEl && sidebarEl) {
      if (isMobile) {
        if (mobileTab === 'preview') {
          // Full preview on mobile
          previewEl.className = 'w-full h-[calc(100dvh-3.5rem)] flex flex-col flex-1 overflow-hidden';
          sidebarEl.className = 'w-full h-0 hidden';
        } else if (mobileTab === 'controls') {
          // Full controls on mobile (natural document page scroll)
          previewEl.className = 'w-full h-0 hidden';
          sidebarEl.className = 'w-full flex-1 flex flex-col overflow-visible pb-24';
        } else {
          // Split view on mobile:
          // Preview is sticky below navbar so user sees live updates while tweaking controls!
          // Controls flow underneath with natural document scroll (browser header collapses!)
          previewEl.className = 'w-full h-[36vh] min-h-[220px] max-h-[320px] flex flex-col sticky top-14 z-20 border-b border-[var(--border-subtle)] shadow-md bg-[var(--bg-primary)] flex-shrink-0';
          sidebarEl.className = 'w-full flex-1 flex flex-col overflow-visible pb-24';
        }
      } else {
        // Desktop / Landscape tablet: Sidebar on Left (380px), Preview on Right (flex-1)
        sidebarEl.className = 'w-96 min-w-[360px] max-w-[420px] h-full flex flex-col border-r border-[var(--border-subtle)] order-1 overflow-y-auto custom-scrollbar flex-shrink-0';
        previewEl.className = 'flex-1 h-full flex flex-col order-2 overflow-hidden';
      }
    }

    // Render Navbar
    renderNavbar(document.getElementById('navbar-container'), {
      state: this.state,
      onBackToLanding: () => this.updateState({ activeView: 'landing' }),
      onExportPdf: () => this.handleExportPdf(),
      onApplyPreset: (presetId) => this.handleApplyPreset(presetId),
      onToggleMobileView: (tab) => {
        this.state.mobileViewTab = tab;
        this.renderStudioView(false);
      },
      onToggleTheme: () => this.toggleTheme(),
    });

    // Render Sidebar (controls)
    if (reRenderSidebar || !sidebarEl.hasChildNodes() || mobileTab === 'controls' || mobileTab === 'split') {
      renderSidebar(sidebarEl, {
        state: this.state,
        onUpdateState: (partial, reRenderControls) => this.handleSidebarUpdate(partial, reRenderControls),
      });
    }

    // Render Sheet Preview (canvas)
    renderSheetPreview(previewEl, {
      state: this.state,
      onUpdateState: (partial) => this.handleSidebarUpdate(partial, false),
    });
  }

  async handleExportPdf() {
    this.updateState({ isExportingPdf: true });
    this.showToast('Generating vector-sharp A1 PDF (841x594 mm)...', 'info');

    try {
      await generateA1Pdf(this.state);
      this.showToast('A1 PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF Generation failed:', err);
      this.showToast('Export failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      this.updateState({ isExportingPdf: false });
    }
  }

  handleApplyPreset(presetId) {
    if (presetId === 'mosaic') {
      this.handleSidebarUpdate({
        layoutType: 'mosaic',
        mosaicTemplate: 'hero-left',
        photoGap: 10,
        photoPadding: 10,
        titleBlockHeight: 50,
        splitRatio: 72,
      }, true);
      this.showToast('Applied Mosaic Hero Layout', 'info');
    } else if (presetId === '2x3') {
      this.handleSidebarUpdate({
        layoutType: 'grid',
        gridMode: 'manual',
        gridRows: 2,
        gridCols: 3,
        photoGap: 10,
        photoPadding: 10,
        titleBlockHeight: 50,
        splitRatio: 72,
      }, true);
      this.showToast('Applied 2x3 Grid (6 Photos)', 'info');
    } else if (presetId === '2x2') {
      this.handleSidebarUpdate({
        layoutType: 'grid',
        gridMode: 'manual',
        gridRows: 2,
        gridCols: 2,
        photoGap: 12,
        photoPadding: 12,
        titleBlockHeight: 50,
        splitRatio: 70,
      }, true);
      this.showToast('Applied 2x2 Grid (4 Photos)', 'info');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-950 border-emerald-800 text-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
      error: 'bg-red-950 border-red-800 text-red-200',
      info: 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-main)] shadow-xl',
    };

    toast.className = `flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs shadow-2xl transition-all duration-200 transform translate-y-2 opacity-0 ${colors[type] || colors.info}`;
    toast.innerHTML = `<span>${message}</span>`;

    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.a1App = new A1App();
});
