import { calculateSheetGeometry } from '../layoutCalculator.js';
import { Icons } from './UIComponents.js';

// Persistent Pan & Zoom Gesture State across re-renders
let gestureState = {
  panX: 0,
  panY: 0,
  scale: 1,
  hasInitialized: false,
  lastContainerHeight: 0,
};

export function renderSheetPreview(container, { state, onUpdateState }) {
  const geometry = calculateSheetGeometry(state);
  const showGuides = state.showGridGuides || false;

  // Compute optimal initial fit if not initialized or container size drastically changed (e.g. mobile view tab switch)
  const currentH = container ? container.clientHeight : 0;
  if (!gestureState.hasInitialized || state.zoomLevel === 1 || (gestureState.lastContainerHeight && Math.abs(gestureState.lastContainerHeight - currentH) > 100)) {
    const fitScale = computeOptimalFitScale(container);
    gestureState.scale = fitScale;
    gestureState.panX = 0;
    gestureState.panY = 0;
    gestureState.hasInitialized = true;
    gestureState.lastContainerHeight = currentH;
  }

  container.innerHTML = `
    <div class="h-full flex flex-col sheet-viewport select-none relative overflow-hidden transition-colors duration-200">
      
      <!-- Streamlined Canvas Toolbar (Removed redundant 75% and 100% buttons) -->
      <div class="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl bg-[var(--bg-secondary)]/95 border border-[var(--border-subtle)] shadow-xl backdrop-blur-md text-xs max-w-[96vw] overflow-x-auto">
        <!-- Fit Screen / Re-center Button -->
        <button id="zoom-fit-btn" class="btn-ghost text-xs px-2.5 py-1.5 rounded-lg touch-manipulation flex items-center gap-1.5 text-[var(--text-main)] font-semibold" title="Reset view and fit sheet to screen">
          ${Icons.Rotate} <span>Fit</span>
        </button>

        <div class="w-[1px] h-4 bg-[var(--border-subtle)] mx-0.5"></div>

        <!-- Zoom Controls with Numeric Percentage Badge -->
        <button id="zoom-out-btn" class="btn-ghost p-1.5 rounded-lg touch-manipulation" title="Zoom Out">
          ${Icons.ZoomOut}
        </button>
        <span id="zoom-badge" class="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-main)] min-w-[42px] text-center">
          ${Math.round(gestureState.scale * 100)}%
        </span>
        <button id="zoom-in-btn" class="btn-ghost p-1.5 rounded-lg touch-manipulation" title="Zoom In">
          ${Icons.ZoomIn}
        </button>

        <div class="w-[1px] h-4 bg-[var(--border-subtle)] mx-0.5"></div>

        <!-- Margin Guides Toggle -->
        <button id="toggle-guides-btn" class="btn-ghost text-[11px] px-2.5 py-1.5 rounded-lg touch-manipulation ${showGuides ? 'bg-[var(--bg-tertiary)] text-emerald-500 font-semibold' : 'text-[var(--text-muted)]'}" title="Toggle Margins & Dimension Guides">
          ${Icons.Maximize} <span class="hidden xs:inline">Guides</span>
        </button>
      </div>

      <!-- Free-Form Interactive Viewport: 1-finger pan & 2-finger pinch zoom -->
      <div class="flex-1 w-full h-full overflow-hidden flex items-center justify-center relative cursor-grab active:cursor-grabbing" id="sheet-gesture-viewport" style="touch-action: none;">
        
        <div id="canvas-wrapper" class="origin-center will-change-transform" style="transform: translate(${gestureState.panX}px, ${gestureState.panY}px) scale(${gestureState.scale});">
          
          <!-- Vector A1 Paper Canvas: 841 mm x 594 mm (Always White Architectural Paper) -->
          <div class="a1-sheet-canvas rounded-[2px]" style="width: 841px; height: 594px;">
            <svg viewBox="0 0 841 594" width="841" height="594" class="w-full h-full block pointer-events-none">
              <defs>
                <!-- Clipping paths for each photo cell -->
                ${geometry.cells.map((c) => `
                  <clipPath id="clip-cell-${c.index}">
                    <rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" />
                  </clipPath>
                `).join('')}
              </defs>

              <!-- Paper Sheet Background -->
              <rect x="0" y="0" width="841" height="594" fill="#ffffff" />

              ${showGuides ? `
                <!-- Binding & Outer Margins Overlay Guides -->
                <rect x="0" y="0" width="${geometry.outerBox.x}" height="594" fill="rgba(59, 130, 246, 0.08)" />
                <text x="5" y="20" font-size="7" fill="#2563eb" font-family="sans-serif">20mm Binding Margin</text>
                <line x1="${geometry.outerBox.x}" y1="0" x2="${geometry.outerBox.x}" y2="594" stroke="#3b82f6" stroke-width="0.5" stroke-dasharray="2,2" />
              ` : ''}

              <!-- 1. Outer Border Box -->
              <rect 
                x="${geometry.outerBox.x}" 
                y="${geometry.outerBox.y}" 
                width="${geometry.outerBox.width}" 
                height="${geometry.outerBox.height}" 
                fill="none" 
                stroke="#000000" 
                stroke-width="${geometry.outerBox.borderWidth}" 
              />

              <!-- 2. Photo Area Cells & Images (Grid or Mosaic) -->
              ${geometry.cells.map((cell) => {
                const photo = cell.photo;
                const fitAttr = state.fitMode === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet';
                const rotation = photo ? (photo.rotation || 0) : 0;
                const centerX = cell.x + cell.width / 2;
                const centerY = cell.y + cell.height / 2;

                return `
                  <g clip-path="url(#clip-cell-${cell.index})">
                    ${photo && photo.url ? `
                      <image 
                        href="${photo.url}" 
                        x="${cell.x}" 
                        y="${cell.y}" 
                        width="${cell.width}" 
                        height="${cell.height}" 
                        preserveAspectRatio="${fitAttr}"
                        transform="rotate(${rotation}, ${centerX}, ${centerY})"
                      />
                    ` : `
                      <!-- Clean Placeholder Cell -->
                      <rect x="${cell.x}" y="${cell.y}" width="${cell.width}" height="${cell.height}" fill="#fafafa" stroke="#e4e4e7" stroke-width="0.5" stroke-dasharray="2,2" />
                      <text x="${centerX}" y="${centerY}" font-size="8.5" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">
                        ${state.layoutType === 'mosaic' && cell.index === 0 ? 'Hero Focus Slot' : `Photo Slot #${cell.index + 1}`}
                      </text>
                    `}
                  </g>
                `;
              }).join('')}

              <!-- 3. Horizontal Title Block Separator Line -->
              <line 
                x1="${geometry.titleBlock.x}" 
                y1="${geometry.titleBlock.y}" 
                x2="${geometry.titleBlock.x + geometry.titleBlock.width}" 
                y2="${geometry.titleBlock.y}" 
                stroke="#000000" 
                stroke-width="${geometry.outerBox.borderWidth}" 
              />

              <!-- 4. Vertical Split Line Between Title and Details -->
              <line 
                x1="${geometry.titleRightBox.x}" 
                y1="${geometry.titleBlock.y}" 
                x2="${geometry.titleRightBox.x}" 
                y2="${geometry.titleBlock.y + geometry.titleBlock.height}" 
                stroke="#000000" 
                stroke-width="${geometry.outerBox.borderWidth}" 
              />

              <!-- 5. Main Title Text (Left Box) -->
              ${state.sheetTitle ? `
                <text 
                  x="${geometry.titleLeftBox.x + 15}" 
                  y="${geometry.titleLeftBox.y + (geometry.titleLeftBox.height / 2) + (Number(state.titleFontSize) * 0.35 * 0.35)}" 
                  font-family="${getSvgFontFamily(state.titleFont)}" 
                  font-size="${Number(state.titleFontSize) * 0.45}" 
                  font-weight="${state.titleBold ? 'bold' : 'normal'}"
                  font-style="${state.titleItalic ? 'italic' : 'normal'}"
                  fill="#000000" 
                  dominant-baseline="middle"
                >
                  ${escapeXml(state.sheetTitle)}
                </text>
              ` : `
                <text 
                  x="${geometry.titleLeftBox.x + 15}" 
                  y="${geometry.titleLeftBox.y + (geometry.titleLeftBox.height / 2)}" 
                  font-family="${getSvgFontFamily(state.titleFont)}" 
                  font-size="12" 
                  font-style="italic"
                  fill="#a1a1aa" 
                  dominant-baseline="middle"
                >
                  [ Sheet Title ]
                </text>
              `}

              <!-- 6. Details Text Lines (Right Box) -->
              ${state.details && state.details.length > 0 ? (
                renderSvgDetailsLines(geometry.titleRightBox, state.details, state.detailsFont, Number(state.detailsFontSize) * 0.35)
              ) : `
                <text 
                  x="${geometry.titleRightBox.x + 10}" 
                  y="${geometry.titleRightBox.y + 16}" 
                  font-family="sans-serif" 
                  font-size="7.5" 
                  font-style="italic"
                  fill="#a1a1aa" 
                >
                  [ Details Block: Name, Year, Subject, etc. ]
                </text>
              `}

            </svg>
          </div>

        </div>
      </div>

      <!-- Canvas Footer Badge -->
      <div class="p-1.5 sm:p-2 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/95 flex items-center justify-between text-[10px] sm:text-[11px] text-[var(--text-muted)] px-3 sm:px-4">
        <div class="flex items-center gap-2 sm:gap-3 truncate">
          <span>841x594 mm A1</span>
          <span>&bull;</span>
          <span>Margins: Left ${state.marginLeft}mm, Others ${state.marginTop}mm</span>
        </div>
        <div class="flex-shrink-0 text-[10px] font-mono text-[var(--text-dim)]">
          Pinch to zoom &bull; Drag to pan
        </div>
      </div>

    </div>
  `;

  // Attach Gesture Engine
  initCanvasGestureEngine(container, onUpdateState);
}

/**
 * Initializes Free-Form Pan & Pinch-to-Zoom Gesture Engine
 */
function initCanvasGestureEngine(container, onUpdateState) {
  const viewport = container.querySelector('#sheet-gesture-viewport');
  const wrapper = container.querySelector('#canvas-wrapper');
  const badge = container.querySelector('#zoom-badge');
  if (!viewport || !wrapper) return;

  const updateTransform = () => {
    wrapper.style.transform = `translate(${gestureState.panX}px, ${gestureState.panY}px) scale(${gestureState.scale})`;
    if (badge) badge.textContent = `${Math.round(gestureState.scale * 100)}%`;
  };

  // Touch Gesture Handling: 1-finger pan & 2-finger pinch-to-zoom with simultaneous midpoint pan
  let touchStartPoints = [];
  let startPanX = 0;
  let startPanY = 0;
  let startDistance = 0;
  let startScale = 1;
  let startMidX = 0;
  let startMidY = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      // 1 Finger: Free Pan
      touchStartPoints = [{ x: e.touches[0].clientX, y: e.touches[0].clientY }];
      startPanX = gestureState.panX;
      startPanY = gestureState.panY;
    } else if (e.touches.length >= 2) {
      // 2 Fingers: Pinch-to-zoom + Midpoint drag
      touchStartPoints = [
        { x: e.touches[0].clientX, y: e.touches[0].clientY },
        { x: e.touches[1].clientX, y: e.touches[1].clientY },
      ];
      startDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startScale = gestureState.scale;
      startPanX = gestureState.panX;
      startPanY = gestureState.panY;
      startMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      startMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    }
  }, { passive: false });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && touchStartPoints.length === 1) {
      // Free 1-finger Pan
      e.preventDefault();
      const dx = e.touches[0].clientX - touchStartPoints[0].x;
      const dy = e.touches[0].clientY - touchStartPoints[0].y;
      gestureState.panX = startPanX + dx;
      gestureState.panY = startPanY + dy;
      updateTransform();
    } else if (e.touches.length >= 2 && startDistance > 0) {
      // 2-finger Pinch Zoom + Simultaneous Midpoint Pan
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const currentMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const currentMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      const ratio = currentDistance / startDistance;
      gestureState.scale = Math.max(0.12, Math.min(4.0, Number((startScale * ratio).toFixed(3))));
      gestureState.panX = startPanX + (currentMidX - startMidX);
      gestureState.panY = startPanY + (currentMidY - startMidY);
      updateTransform();
    }
  }, { passive: false });

  viewport.addEventListener('touchend', (e) => {
    if (e.touches.length === 1) {
      // Seamlessly transition back to 1-finger pan if one finger is lifted
      touchStartPoints = [{ x: e.touches[0].clientX, y: e.touches[0].clientY }];
      startPanX = gestureState.panX;
      startPanY = gestureState.panY;
      startDistance = 0;
    } else if (e.touches.length === 0) {
      touchStartPoints = [];
      startDistance = 0;
    }
  });

  // Mouse Drag Handling
  let isMouseDown = false;
  let mouseStartX = 0;
  let mouseStartY = 0;

  viewport.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    mouseStartX = e.clientX - gestureState.panX;
    mouseStartY = e.clientY - gestureState.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    gestureState.panX = e.clientX - mouseStartX;
    gestureState.panY = e.clientY - mouseStartY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  // Mouse Wheel Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    gestureState.scale = Math.max(0.15, Math.min(3.5, Number((gestureState.scale + delta).toFixed(3))));
    updateTransform();
  }, { passive: false });

  // Toolbar Actions
  container.querySelector('#zoom-fit-btn')?.addEventListener('click', () => {
    const fitScale = computeOptimalFitScale(container);
    gestureState.scale = fitScale;
    gestureState.panX = 0;
    gestureState.panY = 0;
    updateTransform();
  });

  container.querySelector('#zoom-in-btn')?.addEventListener('click', () => {
    gestureState.scale = Math.min(3.5, Number((gestureState.scale + 0.15).toFixed(2)));
    updateTransform();
  });

  container.querySelector('#zoom-out-btn')?.addEventListener('click', () => {
    gestureState.scale = Math.max(0.15, Number((gestureState.scale - 0.15).toFixed(2)));
    updateTransform();
  });

  container.querySelector('#toggle-guides-btn')?.addEventListener('click', () => {
    onUpdateState({ showGridGuides: !state.showGridGuides });
  });
}

/**
 * Calculates optimal responsive scale so entire A1 sheet fits phone/tablet/desktop screen
 */
function computeOptimalFitScale(container) {
  const viewport = container ? container.querySelector('#sheet-gesture-viewport') : null;
  let availW = viewport ? viewport.clientWidth - 20 : 0;
  let availH = viewport ? viewport.clientHeight - 40 : 0;

  if (availW <= 0 || availH <= 0) {
    const isMobile = window.innerWidth < 768;
    availW = isMobile ? window.innerWidth - 20 : window.innerWidth - 420;
    availH = isMobile ? Math.max(220, window.innerHeight * 0.40) : window.innerHeight - 100;
  }

  const scaleW = Math.max(0.1, availW / 841);
  const scaleH = Math.max(0.1, availH / 594);
  const bestFit = Math.min(scaleW, scaleH);
  return Math.max(0.18, Math.min(1.8, Number(bestFit.toFixed(3))));
}

function renderSvgDetailsLines(rightBox, details, fontId, fontSizeMm) {
  if (!details || details.length === 0) return '';

  const paddingLeft = 10;
  const startY = rightBox.y + 12;
  const lineSpacing = fontSizeMm * 1.5;
  const fontFamily = getSvgFontFamily(fontId);

  return details.map((item, i) => {
    const yPos = startY + (i * lineSpacing);
    if (yPos > rightBox.y + rightBox.height - 4) return '';

    const lineText = item.isStandalone 
      ? (item.value || '') 
      : (item.label ? `${item.label}: ${item.value || ''}` : (item.value || ''));

    if (!lineText) return '';

    return `
      <text 
        x="${rightBox.x + paddingLeft}" 
        y="${yPos}" 
        font-family="${fontFamily}" 
        font-size="${fontSizeMm}" 
        fill="#000000"
      >
        ${escapeXml(lineText)}
      </text>
    `;
  }).join('');
}

function getSvgFontFamily(fontId) {
  switch (fontId) {
    case 'Helvetica':
      return "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
    case 'Courier':
      return "'Roboto Mono', 'Courier New', Courier, monospace";
    case 'Times-Roman':
    default:
      return "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
