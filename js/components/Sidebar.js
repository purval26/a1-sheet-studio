import { Icons, createSliderControl, createSegmentedControl } from './UIComponents.js';
import { AVAILABLE_FONTS, DETAIL_PRESETS, MOSAIC_TEMPLATES } from '../constants.js';

export function renderSidebar(container, { state, onUpdateState }) {
  const activeTab = container.dataset.activeTab || 'layout';

  container.innerHTML = `
    <div class="flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] w-full select-none transition-colors duration-200 min-h-full">
      
      <!-- Top Segmented Tabs -->
      <div class="p-2 sm:p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] md:sticky md:top-0 z-10 backdrop-blur-md">
        <div class="segmented-control" id="sidebar-tabs">
          <button type="button" class="segmented-item text-xs py-2 ${activeTab === 'layout' ? 'active' : ''} touch-manipulation" data-tab="layout">
            Layout & Margins
          </button>
          <button type="button" class="segmented-item text-xs py-2 ${activeTab === 'typography' ? 'active' : ''} touch-manipulation" data-tab="typography">
            Title & Details
          </button>
          <button type="button" class="segmented-item text-xs py-2 ${activeTab === 'photos' ? 'active' : ''} touch-manipulation" data-tab="photos">
            Photos & Grid
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="p-3.5 sm:p-5 space-y-6 pb-24 md:pb-8 flex-1" id="sidebar-tab-content">
        <!-- Content will be injected below based on activeTab -->
      </div>

    </div>
  `;

  // Attach tab switching logic
  const tabsContainer = container.querySelector('#sidebar-tabs');
  tabsContainer.querySelectorAll('.segmented-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      container.dataset.activeTab = tab;
      tabsContainer.querySelectorAll('.segmented-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderTabContent(container.querySelector('#sidebar-tab-content'), tab, state, onUpdateState);
    });
  });

  renderTabContent(container.querySelector('#sidebar-tab-content'), activeTab, state, onUpdateState);
}

function renderTabContent(contentEl, tab, state, onUpdateState) {
  contentEl.innerHTML = '';

  if (tab === 'layout') {
    renderLayoutTab(contentEl, state, onUpdateState);
  } else if (tab === 'typography') {
    renderTypographyTab(contentEl, state, onUpdateState);
  } else if (tab === 'photos') {
    renderPhotosTab(contentEl, state, onUpdateState);
  }
}

/**
 * Tab 1: Layout & Margins Controls
 */
function renderLayoutTab(container, state, onUpdateState) {
  const section = document.createElement('div');
  section.className = 'space-y-6';

  section.innerHTML = `
    <!-- Sheet Format Info -->
    <div class="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-xs space-y-1">
      <div class="flex items-center justify-between text-[var(--text-main)] font-medium">
        <span>A1 Paper (Horizontal / Landscape)</span>
        <span class="font-mono text-[11px] text-[var(--text-muted)]">841 x 594 mm</span>
      </div>
      <p class="text-[11px] text-[var(--text-dim)]">Left 20mm margin is reserved for pin-ups & binding.</p>
    </div>

    <!-- Outer Margins -->
    <div class="space-y-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Outer Box & Margins</h3>
      <div id="slider-margin-left"></div>
      <div id="slider-margin-other"></div>
      <div id="slider-border-width"></div>
    </div>

    <!-- Bottom Title Block -->
    <div class="pt-3 border-t border-[var(--border-subtle)] space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Bottom Title Block</h3>
        <span class="text-[10px] text-[var(--text-dim)] font-mono">${state.titleBlockHeight} mm Height</span>
      </div>
      <div id="slider-title-height"></div>
      <div id="slider-split-ratio"></div>
      <p class="text-[11px] text-[var(--text-dim)]">
        Left title width: ${state.splitRatio}% &bull; Right details width: ${100 - state.splitRatio}%.
      </p>
    </div>
  `;

  container.appendChild(section);

  // Mount Sliders
  section.querySelector('#slider-margin-left').appendChild(
    createSliderControl({
      id: 'margin-left',
      label: 'Left Binding Margin (Default: 20 mm)',
      value: state.marginLeft,
      min: 10,
      max: 40,
      step: 1,
      unit: 'mm',
      onChange: (val) => onUpdateState({ marginLeft: val }),
    })
  );

  section.querySelector('#slider-margin-other').appendChild(
    createSliderControl({
      id: 'margin-other',
      label: 'Top / Right / Bottom Margin (Default: 10 mm)',
      value: state.marginTop,
      min: 5,
      max: 25,
      step: 1,
      unit: 'mm',
      onChange: (val) => onUpdateState({ marginTop: val, marginRight: val, marginBottom: val }),
    })
  );

  section.querySelector('#slider-border-width').appendChild(
    createSliderControl({
      id: 'border-width',
      label: 'Border & Divider Thickness',
      value: state.borderWidth,
      min: 0.5,
      max: 4.0,
      step: 0.25,
      unit: 'mm',
      onChange: (val) => onUpdateState({ borderWidth: val }),
    })
  );

  section.querySelector('#slider-title-height').appendChild(
    createSliderControl({
      id: 'title-height',
      label: 'Bottom Box Height (Default: 50 mm / 5 cm)',
      value: state.titleBlockHeight,
      min: 25,
      max: 80,
      step: 1,
      unit: 'mm',
      onChange: (val) => onUpdateState({ titleBlockHeight: val }),
    })
  );

  section.querySelector('#slider-split-ratio').appendChild(
    createSliderControl({
      id: 'split-ratio',
      label: 'Title Block Split Ratio (% Left)',
      value: state.splitRatio,
      min: 40,
      max: 85,
      step: 1,
      unit: '%',
      onChange: (val) => onUpdateState({ splitRatio: val }),
    })
  );
}

/**
 * Tab 2: Title & Details Controls (Fixed Multi-Field Addition)
 */
function renderTypographyTab(container, state, onUpdateState) {
  const section = document.createElement('div');
  section.className = 'space-y-6';

  section.innerHTML = `
    <!-- Left Title Box -->
    <div class="space-y-3.5">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Left Box: Sheet Title</h3>
        <span class="text-[10px] text-[var(--text-dim)] font-mono">Primary Title</span>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs text-[var(--text-muted)] font-medium">Sheet Title</label>
        <input type="text" id="title-text-input" class="minimal-input text-sm py-2.5" value="${escapeHtml(state.sheetTitle)}" placeholder="Enter project / exercise title...">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <label class="text-xs text-[var(--text-muted)] font-medium">Font Family</label>
          <select id="title-font-select" class="minimal-select text-xs py-2">
            ${AVAILABLE_FONTS.map(f => `<option value="${f.id}" ${f.id === state.titleFont ? 'selected' : ''}>${f.name}</option>`).join('')}
          </select>
        </div>
        <div id="title-size-slider-slot"></div>
      </div>
    </div>

    <!-- Right Details Box -->
    <div class="pt-4 border-t border-[var(--border-subtle)] space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Right Box: Details</h3>
          <p class="text-[11px] text-[var(--text-dim)]">Rendered as [Label]: [Value] or standalone lines.</p>
        </div>
        <button id="add-detail-btn" class="btn-ghost text-xs py-1.5 px-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-main)] touch-manipulation">
          ${Icons.Plus} Add Field
        </button>
      </div>

      <!-- Quick Add Preset Chips -->
      <div class="space-y-1.5">
        <span class="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-mono">Quick Starters:</span>
        <div class="flex flex-wrap gap-1.5" id="detail-preset-chips">
          ${DETAIL_PRESETS.map((p, i) => `
            <button type="button" class="quick-preset-chip text-[11px] px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] transition touch-manipulation" data-index="${i}">
              + ${p.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Details List Container -->
      <div id="details-list" class="space-y-2.5">
        <!-- Injected dynamically -->
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div class="space-y-1.5">
          <label class="text-xs text-[var(--text-muted)] font-medium">Details Font</label>
          <select id="details-font-select" class="minimal-select text-xs py-2">
            ${AVAILABLE_FONTS.map(f => `<option value="${f.id}" ${f.id === state.detailsFont ? 'selected' : ''}>${f.name}</option>`).join('')}
          </select>
        </div>
        <div id="details-size-slider-slot"></div>
      </div>
    </div>
  `;

  container.appendChild(section);

  // Sliders
  section.querySelector('#title-size-slider-slot').appendChild(
    createSliderControl({
      id: 'title-font-size',
      label: 'Title Size',
      value: state.titleFontSize,
      min: 16,
      max: 48,
      step: 1,
      unit: 'pt',
      onChange: (val) => onUpdateState({ titleFontSize: val }),
    })
  );

  section.querySelector('#details-size-slider-slot').appendChild(
    createSliderControl({
      id: 'details-font-size',
      label: 'Details Size',
      value: state.detailsFontSize,
      min: 8,
      max: 18,
      step: 1,
      unit: 'pt',
      onChange: (val) => onUpdateState({ detailsFontSize: val }),
    })
  );

  // Inputs
  const titleInput = section.querySelector('#title-text-input');
  titleInput.addEventListener('input', (e) => onUpdateState({ sheetTitle: e.target.value }));

  section.querySelector('#title-font-select').addEventListener('change', (e) => onUpdateState({ titleFont: e.target.value }));
  section.querySelector('#details-font-select').addEventListener('change', (e) => onUpdateState({ detailsFont: e.target.value }));

  // Helper to re-render detail rows without stale closure
  const refreshDetailRows = () => {
    renderDetailRows(
      section.querySelector('#details-list'), 
      state.details, 
      (newDetails) => {
        state.details = newDetails;
        onUpdateState({ details: newDetails });
        refreshDetailRows();
      },
      (liveDetails) => {
        state.details = liveDetails;
        onUpdateState({ details: liveDetails });
      }
    );
  };

  refreshDetailRows();

  // Add field button: appends new field safely
  section.querySelector('#add-detail-btn').addEventListener('click', () => {
    state.details = [
      ...(state.details || []),
      { id: 'det-' + Date.now() + '-' + Math.random(), label: 'Label', value: '', isStandalone: false },
    ];
    onUpdateState({ details: state.details });
    refreshDetailRows();
  });

  // Quick preset chips click: appends starter field safely
  section.querySelectorAll('.quick-preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const preset = DETAIL_PRESETS[Number(chip.dataset.index)];
      state.details = [
        ...(state.details || []),
        { id: 'det-' + Date.now() + '-' + Math.random(), label: preset.isStandalone ? '' : preset.label, value: '', isStandalone: !!preset.isStandalone },
      ];
      onUpdateState({ details: state.details });
      refreshDetailRows();
    });
  });
}

function renderDetailRows(listEl, details, onStructuralChange, onLiveInputChange) {
  listEl.innerHTML = '';

  if (!details || details.length === 0) {
    listEl.innerHTML = `
      <div class="text-center py-4 px-3 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 text-xs text-[var(--text-dim)]">
        No details added yet. Click <strong>+ Add Field</strong> or use quick starters above.
      </div>
    `;
    return;
  }

  details.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-2';

    row.innerHTML = `
      <div class="flex items-center gap-2">
        ${!item.isStandalone ? `
          <input type="text" class="minimal-input w-28 text-xs py-2 label-input" placeholder="Label" value="${escapeHtml(item.label || '')}">
          <span class="text-[var(--text-dim)] font-mono">:</span>
        ` : ''}
        <input type="text" class="minimal-input flex-1 text-xs py-2 value-input" placeholder="${item.isStandalone ? 'Full Line (e.g. University / Institution)' : 'Value'}" value="${escapeHtml(item.value || '')}">
        <button type="button" class="btn-ghost p-2 text-[var(--text-dim)] hover:text-red-400 delete-btn touch-manipulation" title="Remove">
          ${Icons.Trash}
        </button>
      </div>

      <div class="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-0.5">
        <label class="flex items-center gap-1.5 cursor-pointer touch-manipulation">
          <input type="checkbox" class="rounded bg-[var(--bg-input)] border-[var(--border-subtle)] standalone-check accent-current w-3.5 h-3.5" ${item.isStandalone ? 'checked' : ''}>
          <span>Full-width line (no label prefix)</span>
        </label>
        
        <div class="flex items-center gap-1">
          <button type="button" class="btn-ghost p-1 text-[var(--text-dim)] hover:text-[var(--text-main)] move-up-btn touch-manipulation ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}" title="Move Up" ${index === 0 ? 'disabled' : ''}>
            ${Icons.ArrowUp}
          </button>
          <button type="button" class="btn-ghost p-1 text-[var(--text-dim)] hover:text-[var(--text-main)] move-down-btn touch-manipulation ${index === details.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" title="Move Down" ${index === details.length - 1 ? 'disabled' : ''}>
            ${Icons.ArrowDown}
          </button>
          <span class="text-[10px] text-[var(--text-dim)] font-mono ml-1">#${index + 1}</span>
        </div>
      </div>
    `;

    const labelInput = row.querySelector('.label-input');
    const valueInput = row.querySelector('.value-input');
    const standaloneCheck = row.querySelector('.standalone-check');
    const deleteBtn = row.querySelector('.delete-btn');
    const moveUpBtn = row.querySelector('.move-up-btn');
    const moveDownBtn = row.querySelector('.move-down-btn');

    if (labelInput) {
      labelInput.addEventListener('input', (e) => {
        details[index].label = e.target.value;
        onLiveInputChange([...details]);
      });
    }

    if (valueInput) {
      valueInput.addEventListener('input', (e) => {
        details[index].value = e.target.value;
        onLiveInputChange([...details]);
      });
    }

    standaloneCheck.addEventListener('change', (e) => {
      details[index].isStandalone = e.target.checked;
      onStructuralChange([...details]);
    });

    deleteBtn.addEventListener('click', () => {
      const filtered = details.filter((_, i) => i !== index);
      onStructuralChange(filtered);
    });

    moveUpBtn?.addEventListener('click', () => {
      if (index > 0) {
        const next = [...details];
        const temp = next[index - 1];
        next[index - 1] = next[index];
        next[index] = temp;
        onStructuralChange(next);
      }
    });

    moveDownBtn?.addEventListener('click', () => {
      if (index < details.length - 1) {
        const next = [...details];
        const temp = next[index + 1];
        next[index + 1] = next[index];
        next[index] = temp;
        onStructuralChange(next);
      }
    });

    listEl.appendChild(row);
  });
}

/**
 * Tab 3: Photos & Collage Controls (With Reorder Support)
 */
function renderPhotosTab(container, state, onUpdateState) {
  const section = document.createElement('div');
  section.className = 'space-y-6';

  const isMosaic = state.layoutType === 'mosaic';

  section.innerHTML = `
    <!-- Dropzone -->
    <div class="space-y-2">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Add Photos</h3>
      <div id="photo-dropzone" class="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--border-active)] rounded-2xl p-6 text-center cursor-pointer bg-[var(--bg-tertiary)]/40 hover:bg-[var(--bg-tertiary)] transition space-y-2.5 touch-manipulation">
        <div class="w-11 h-11 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-main)] mx-auto shadow-inner border border-[var(--border-subtle)]">
          ${Icons.Upload}
        </div>
        <div>
          <span class="text-xs sm:text-sm font-medium text-[var(--text-main)] block">Tap to select or drop photos</span>
          <p class="text-[11px] text-[var(--text-dim)] mt-0.5">High-res JPG, PNG, WebP supported</p>
        </div>
        <input type="file" id="photo-file-input" multiple accept="image/*" class="hidden">
      </div>
    </div>

    <!-- Layout Type Selector: Grid vs Mosaic -->
    <div class="pt-2 border-t border-[var(--border-subtle)] space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Collage Arrangement</h3>
        <span class="text-[10px] text-[var(--text-muted)] font-mono bg-[var(--bg-tertiary)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
          ${(state.photos || []).length} Photos
        </span>
      </div>

      <!-- Segmented: Grid vs Mosaic -->
      <div class="space-y-2">
        <label class="text-xs text-[var(--text-muted)] font-medium">Layout Style</label>
        <div id="layout-type-slot"></div>
      </div>

      <!-- Mosaic Specific Options -->
      <div id="mosaic-options" class="space-y-3 ${isMosaic ? '' : 'hidden'}">
        <label class="text-xs text-[var(--text-muted)] font-medium">Mosaic Template</label>
        <select id="mosaic-template-select" class="minimal-select text-xs py-2">
          ${MOSAIC_TEMPLATES.map(t => `<option value="${t.id}" ${t.id === state.mosaicTemplate ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
        <p class="text-[11px] text-[var(--text-dim)]">
          Slot #1 is the prominent Hero photo. Use the up/down arrows below to move any photo into Slot #1.
        </p>
      </div>

      <!-- Regular Grid Specific Options -->
      <div id="grid-options" class="space-y-4 ${isMosaic ? 'hidden' : ''}">
        <div class="space-y-2">
          <label class="text-xs text-[var(--text-muted)] font-medium">Grid Calculation Mode</label>
          <div id="grid-mode-control-slot"></div>
        </div>

        <div id="manual-grid-controls" class="space-y-4 ${state.gridMode === 'auto' ? 'hidden' : ''}">
          <div id="slider-rows-slot"></div>
          <div id="slider-cols-slot"></div>
        </div>
      </div>

      <!-- Common Spacing & Fit Controls -->
      <div class="space-y-2 pt-1">
        <label class="text-xs text-[var(--text-muted)] font-medium">Photo Fitting Mode</label>
        <div id="fit-mode-control-slot"></div>
      </div>

      <div id="slider-gap-slot"></div>
      <div id="slider-padding-slot"></div>
    </div>

    <!-- Photo Gallery with Reorder Buttons -->
    <div class="pt-2 border-t border-[var(--border-subtle)] space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Reorder & Manage Photos</h3>
        ${(state.photos || []).length > 0 ? `
          <button id="clear-all-photos-btn" class="btn-ghost text-[11px] text-[var(--text-dim)] hover:text-red-400 touch-manipulation">
            Clear All
          </button>
        ` : ''}
      </div>

      <div id="photos-thumbnail-gallery" class="space-y-2">
        <!-- Injected below -->
      </div>
    </div>
  `;

  container.appendChild(section);

  // Dropzone
  const dropzone = section.querySelector('#photo-dropzone');
  const fileInput = section.querySelector('#photo-file-input');

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-zinc-400', 'bg-[var(--bg-tertiary)]');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-zinc-400', 'bg-[var(--bg-tertiary)]');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-zinc-400', 'bg-[var(--bg-tertiary)]');
    if (e.dataTransfer.files) handleFilesUpload(e.dataTransfer.files, state, onUpdateState);
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files) handleFilesUpload(e.target.files, state, onUpdateState);
  });

  // Layout Type Switcher (Grid vs Mosaic)
  section.querySelector('#layout-type-slot').appendChild(
    createSegmentedControl({
      items: [
        { label: 'Uniform Grid', value: 'grid' },
        { label: 'Mosaic (Hero Feature)', value: 'mosaic' },
      ],
      activeValue: state.layoutType || 'grid',
      onChange: (val) => {
        onUpdateState({ layoutType: val });
        section.querySelector('#mosaic-options')?.classList.toggle('hidden', val !== 'mosaic');
        section.querySelector('#grid-options')?.classList.toggle('hidden', val === 'mosaic');
      },
    })
  );

  // Mosaic Template Select
  section.querySelector('#mosaic-template-select')?.addEventListener('change', (e) => {
    onUpdateState({ mosaicTemplate: e.target.value });
  });

  // Grid Mode Switcher (Manual vs Auto)
  section.querySelector('#grid-mode-control-slot').appendChild(
    createSegmentedControl({
      items: [
        { label: 'Manual (Rows x Cols)', value: 'manual' },
        { label: 'Auto (Best Fit)', value: 'auto' },
      ],
      activeValue: state.gridMode,
      onChange: (val) => {
        onUpdateState({ gridMode: val });
        section.querySelector('#manual-grid-controls')?.classList.toggle('hidden', val === 'auto');
      },
    })
  );

  // Fit Mode (Cover vs Contain)
  section.querySelector('#fit-mode-control-slot').appendChild(
    createSegmentedControl({
      items: [
        { label: 'Fill / Crop (Uniform Cells)', value: 'cover' },
        { label: 'Fit / Letterbox (No Crop)', value: 'contain' },
      ],
      activeValue: state.fitMode,
      onChange: (val) => onUpdateState({ fitMode: val }),
    })
  );

  // Sliders
  section.querySelector('#slider-rows-slot').appendChild(
    createSliderControl({
      id: 'grid-rows',
      label: 'Grid Rows',
      value: state.gridRows,
      min: 1,
      max: 6,
      step: 1,
      unit: 'rows',
      onChange: (val) => onUpdateState({ gridRows: val }),
    })
  );

  section.querySelector('#slider-cols-slot').appendChild(
    createSliderControl({
      id: 'grid-cols',
      label: 'Grid Columns',
      value: state.gridCols,
      min: 1,
      max: 8,
      step: 1,
      unit: 'cols',
      onChange: (val) => onUpdateState({ gridCols: val }),
    })
  );

  section.querySelector('#slider-gap-slot').appendChild(
    createSliderControl({
      id: 'photo-gap',
      label: 'Spacing Between Photos',
      value: state.photoGap,
      min: 2,
      max: 30,
      step: 1,
      unit: 'mm',
      onChange: (val) => onUpdateState({ photoGap: val }),
    })
  );

  section.querySelector('#slider-padding-slot').appendChild(
    createSliderControl({
      id: 'photo-padding',
      label: 'Spacing from Outer Border',
      value: state.photoPadding,
      min: 2,
      max: 30,
      step: 1,
      unit: 'mm',
      onChange: (val) => onUpdateState({ photoPadding: val }),
    })
  );

  // Refresh Photo Thumbnails with Reordering
  const refreshPhotos = () => {
    renderPhotoThumbnails(section.querySelector('#photos-thumbnail-gallery'), state.photos || [], (updatedPhotos) => {
      state.photos = updatedPhotos;
      onUpdateState({ photos: updatedPhotos });
      refreshPhotos();
    });
  };

  refreshPhotos();

  section.querySelector('#clear-all-photos-btn')?.addEventListener('click', () => {
    if (confirm('Remove all photos from the sheet?')) {
      state.photos = [];
      onUpdateState({ photos: [] });
      refreshPhotos();
    }
  });
}

function handleFilesUpload(files, state, onUpdateState) {
  const newPhotos = [...(state.photos || [])];
  const fileArray = Array.from(files);

  let processed = 0;
  fileArray.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPhotos.push({
        id: 'user-photo-' + Date.now() + '-' + i,
        url: e.target.result,
        name: file.name,
        rotation: 0,
      });
      processed++;
      if (processed === fileArray.length) {
        state.photos = newPhotos;
        onUpdateState({ photos: newPhotos }, true);
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Renders photos with reordering (Move Up / Down), rotate, and delete
 */
function renderPhotoThumbnails(container, photos, onUpdate) {
  container.innerHTML = '';

  if (photos.length === 0) {
    container.innerHTML = `
      <div class="text-xs text-[var(--text-dim)] text-center py-5 border border-dashed border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-tertiary)]/30">
        No photos uploaded yet.<br>Tap the box above to add photos.
      </div>
    `;
    return;
  }

  photos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]';

    item.innerHTML = `
      <div class="w-12 h-12 rounded-lg bg-black/10 dark:bg-black/50 overflow-hidden relative border border-[var(--border-subtle)] flex-shrink-0">
        <img src="${photo.url}" class="w-full h-full object-cover" style="transform: rotate(${photo.rotation || 0}deg);">
        <span class="absolute bottom-0.5 right-0.5 text-[9px] font-mono bg-black/80 px-1 rounded text-white">#${index + 1}</span>
      </div>

      <div class="flex-1 min-w-0 text-xs">
        <div class="font-medium text-[var(--text-main)] truncate">${escapeHtml(photo.name || 'Photo ' + (index + 1))}</div>
        <div class="text-[10px] text-[var(--text-dim)]">Slot #${index + 1} &bull; ${photo.rotation || 0} deg</div>
      </div>

      <div class="flex items-center gap-0.5 flex-shrink-0">
        <!-- Reorder Buttons -->
        <button type="button" class="btn-ghost p-1.5 move-up-btn touch-manipulation ${index === 0 ? 'opacity-25 cursor-not-allowed' : ''}" title="Move earlier in slot order" ${index === 0 ? 'disabled' : ''}>
          ${Icons.ArrowUp}
        </button>
        <button type="button" class="btn-ghost p-1.5 move-down-btn touch-manipulation ${index === photos.length - 1 ? 'opacity-25 cursor-not-allowed' : ''}" title="Move later in slot order" ${index === photos.length - 1 ? 'disabled' : ''}>
          ${Icons.ArrowDown}
        </button>
        
        <button type="button" class="btn-ghost p-1.5 rotate-btn touch-manipulation" title="Rotate 90 deg">
          ${Icons.RotateCw}
        </button>
        <button type="button" class="btn-ghost p-1.5 text-[var(--text-dim)] hover:text-red-400 delete-btn touch-manipulation" title="Remove">
          ${Icons.Trash}
        </button>
      </div>
    `;

    // Move Up
    item.querySelector('.move-up-btn')?.addEventListener('click', () => {
      if (index > 0) {
        const next = [...photos];
        const temp = next[index];
        next[index] = next[index - 1];
        next[index - 1] = temp;
        onUpdate(next);
      }
    });

    // Move Down
    item.querySelector('.move-down-btn')?.addEventListener('click', () => {
      if (index < photos.length - 1) {
        const next = [...photos];
        const temp = next[index];
        next[index] = next[index + 1];
        next[index + 1] = temp;
        onUpdate(next);
      }
    });

    // Rotate 90 deg
    item.querySelector('.rotate-btn')?.addEventListener('click', () => {
      photos[index].rotation = ((photos[index].rotation || 0) + 90) % 360;
      onUpdate([...photos]);
    });

    // Remove
    item.querySelector('.delete-btn')?.addEventListener('click', () => {
      const filtered = photos.filter((_, i) => i !== index);
      onUpdate(filtered);
    });

    container.appendChild(item);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
