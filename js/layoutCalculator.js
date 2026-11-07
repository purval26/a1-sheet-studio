import { SHEET_CONFIG } from './constants.js';

/**
 * Calculates millimeter geometry for all components on the A1 sheet
 */
export function calculateSheetGeometry(state) {
  const sheetWidth = SHEET_CONFIG.WIDTH_MM; // 841 mm
  const sheetHeight = SHEET_CONFIG.HEIGHT_MM; // 594 mm

  const marginLeft = Number(state.marginLeft) || 20;
  const marginTop = Number(state.marginTop) || 10;
  const marginRight = Number(state.marginRight) || 10;
  const marginBottom = Number(state.marginBottom) || 10;
  const borderWidth = Number(state.borderWidth) || 1.5;
  const titleBlockHeight = Number(state.titleBlockHeight) || 50;
  const splitRatio = Number(state.splitRatio) || 72;

  // Outer border box inside margins
  const outerBox = {
    x: marginLeft,
    y: marginTop,
    width: Math.max(10, sheetWidth - marginLeft - marginRight),
    height: Math.max(10, sheetHeight - marginTop - marginBottom),
    borderWidth,
  };

  // Title Block at the bottom of the outer box
  const titleBlock = {
    x: outerBox.x,
    y: outerBox.y + outerBox.height - titleBlockHeight,
    width: outerBox.width,
    height: titleBlockHeight,
    borderWidth,
  };

  // Title Block left & right cells
  const titleLeftWidth = titleBlock.width * (splitRatio / 100);
  const titleRightWidth = titleBlock.width - titleLeftWidth;

  const titleLeftBox = {
    x: titleBlock.x,
    y: titleBlock.y,
    width: titleLeftWidth,
    height: titleBlock.height,
  };

  const titleRightBox = {
    x: titleBlock.x + titleLeftWidth,
    y: titleBlock.y,
    width: titleRightWidth,
    height: titleBlock.height,
  };

  // Photo Area above the title block
  const photoArea = {
    x: outerBox.x,
    y: outerBox.y,
    width: outerBox.width,
    height: Math.max(0, outerBox.height - titleBlockHeight),
  };

  const photoPadding = Number(state.photoPadding) || 10;
  const photoGap = Number(state.photoGap) || 10;
  const photos = state.photos || [];

  let cells = [];
  let rows = Number(state.gridRows) || 2;
  let cols = Number(state.gridCols) || 3;

  if (state.layoutType === 'mosaic') {
    // Generate Mosaic Cells
    cells = calculateMosaicCells(photoArea, photos, photoPadding, photoGap, state.mosaicTemplate || 'hero-left');
    rows = 'Mosaic';
    cols = state.mosaicTemplate;
  } else {
    // Generate Regular Grid Cells
    if (state.gridMode === 'auto') {
      const autoGrid = calculateOptimalGrid(photos.length);
      rows = autoGrid.rows;
      cols = autoGrid.cols;
    }

    const contentWidth = Math.max(0, photoArea.width - (2 * photoPadding));
    const contentHeight = Math.max(0, photoArea.height - (2 * photoPadding));

    const totalGapsX = Math.max(0, (cols - 1)) * photoGap;
    const totalGapsY = Math.max(0, (rows - 1)) * photoGap;

    const cellWidth = cols > 0 ? Math.max(10, (contentWidth - totalGapsX) / cols) : 0;
    const cellHeight = rows > 0 ? Math.max(10, (contentHeight - totalGapsY) / rows) : 0;

    const maxSlots = Math.max(photos.length, rows * cols);

    for (let index = 0; index < maxSlots; index++) {
      const r = Math.floor(index / cols);
      const c = index % cols;

      const cellX = photoArea.x + photoPadding + c * (cellWidth + photoGap);
      const cellY = photoArea.y + photoPadding + r * (cellHeight + photoGap);

      cells.push({
        index,
        row: r,
        col: c,
        x: cellX,
        y: cellY,
        width: cellWidth,
        height: cellHeight,
        photo: photos[index] || null,
      });
    }
  }

  return {
    sheetWidth,
    sheetHeight,
    outerBox,
    titleBlock,
    titleLeftBox,
    titleRightBox,
    photoArea,
    rows,
    cols,
    cells,
    ptPerMm: SHEET_CONFIG.PT_PER_MM,
  };
}

/**
 * Calculates geometric cells for various architectural mosaic configurations
 */
function calculateMosaicCells(photoArea, photos, padding, gap, template) {
  const contentWidth = Math.max(0, photoArea.width - (2 * padding));
  const contentHeight = Math.max(0, photoArea.height - (2 * padding));
  const startX = photoArea.x + padding;
  const startY = photoArea.y + padding;

  const cells = [];
  const count = Math.max(photos.length, 3);

  if (template === 'hero-left') {
    // 1 Big Hero on Left (~55% width), Stacked photos on Right
    const heroWidth = (contentWidth - gap) * 0.54;
    const rightWidth = contentWidth - heroWidth - gap;

    cells.push({
      index: 0,
      x: startX,
      y: startY,
      width: heroWidth,
      height: contentHeight,
      photo: photos[0] || null,
    });

    const subCount = Math.max(2, Math.min(5, count - 1));
    const subHeight = (contentHeight - (subCount - 1) * gap) / subCount;

    for (let i = 0; i < subCount; i++) {
      cells.push({
        index: i + 1,
        x: startX + heroWidth + gap,
        y: startY + i * (subHeight + gap),
        width: rightWidth,
        height: subHeight,
        photo: photos[i + 1] || null,
      });
    }
  } else if (template === 'hero-right') {
    // Stacked photos on Left, 1 Big Hero on Right (~55% width)
    const heroWidth = (contentWidth - gap) * 0.54;
    const leftWidth = contentWidth - heroWidth - gap;

    const subCount = Math.max(2, Math.min(5, count - 1));
    const subHeight = (contentHeight - (subCount - 1) * gap) / subCount;

    for (let i = 0; i < subCount; i++) {
      cells.push({
        index: i,
        x: startX,
        y: startY + i * (subHeight + gap),
        width: leftWidth,
        height: subHeight,
        photo: photos[i] || null,
      });
    }

    cells.push({
      index: subCount,
      x: startX + leftWidth + gap,
      y: startY,
      width: heroWidth,
      height: contentHeight,
      photo: photos[subCount] || null,
    });
  } else if (template === 'hero-top') {
    // Wide Panoramic on Top (~55% height), Multi-column on Bottom
    const heroHeight = (contentHeight - gap) * 0.54;
    const bottomHeight = contentHeight - heroHeight - gap;

    cells.push({
      index: 0,
      x: startX,
      y: startY,
      width: contentWidth,
      height: heroHeight,
      photo: photos[0] || null,
    });

    const subCols = Math.max(2, Math.min(5, count - 1));
    const subWidth = (contentWidth - (subCols - 1) * gap) / subCols;

    for (let i = 0; i < subCols; i++) {
      cells.push({
        index: i + 1,
        x: startX + i * (subWidth + gap),
        y: startY + heroHeight + gap,
        width: subWidth,
        height: bottomHeight,
        photo: photos[i + 1] || null,
      });
    }
  } else if (template === 'asymmetric-5') {
    // 1 Hero on Left (50%), 2x2 Grid on Right
    const leftWidth = (contentWidth - gap) * 0.48;
    const rightWidth = contentWidth - leftWidth - gap;

    // Hero cell
    cells.push({
      index: 0,
      x: startX,
      y: startY,
      width: leftWidth,
      height: contentHeight,
      photo: photos[0] || null,
    });

    const subW = (rightWidth - gap) / 2;
    const subH = (contentHeight - gap) / 2;

    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const subIndex = 1 + (r * 2 + c);
        cells.push({
          index: subIndex,
          x: startX + leftWidth + gap + c * (subW + gap),
          y: startY + r * (subH + gap),
          width: subW,
          height: subH,
          photo: photos[subIndex] || null,
        });
      }
    }
  } else {
    // Asymmetric-4 (Quad Balance)
    const halfW = (contentWidth - gap) / 2;
    const heroH = (contentHeight - gap) * 0.62;
    const subH = contentHeight - heroH - gap;

    // Cell 1: Large Top Left
    cells.push({ index: 0, x: startX, y: startY, width: halfW, height: heroH, photo: photos[0] || null });
    // Cell 2: Small Bottom Left
    cells.push({ index: 1, x: startX, y: startY + heroH + gap, width: halfW, height: subH, photo: photos[1] || null });
    // Cell 3: Small Top Right
    cells.push({ index: 2, x: startX + halfW + gap, y: startY, width: halfW, height: subH, photo: photos[2] || null });
    // Cell 4: Large Bottom Right
    cells.push({ index: 3, x: startX + halfW + gap, y: startY + subH + gap, width: halfW, height: heroH, photo: photos[3] || null });
  }

  return cells;
}

/**
 * Calculates optimal grid rows & columns based on item count
 */
export function calculateOptimalGrid(count) {
  if (count <= 1) return { rows: 1, cols: 1 };
  if (count === 2) return { rows: 1, cols: 2 };
  if (count === 3) return { rows: 1, cols: 3 };
  if (count === 4) return { rows: 2, cols: 2 };
  if (count <= 6) return { rows: 2, cols: 3 };
  if (count <= 8) return { rows: 2, cols: 4 };
  if (count === 9) return { rows: 3, cols: 3 };
  if (count <= 12) return { rows: 3, cols: 4 };
  if (count <= 16) return { rows: 4, cols: 4 };

  const cols = Math.ceil(Math.sqrt(count * 1.4));
  const rows = Math.ceil(count / cols);
  return { rows, cols };
}
