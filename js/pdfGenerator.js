import { calculateSheetGeometry } from './layoutCalculator.js';

/**
 * Generates and downloads a vector-sharp A1 Landscape PDF (841mm x 594mm)
 */
export async function generateA1Pdf(state) {
  if (!window.PDFLib) {
    throw new Error('PDFLib library not loaded. Please ensure libs/pdf-lib.min.js is included.');
  }

  const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
  const pdfDoc = await PDFDocument.create();

  const geometry = calculateSheetGeometry(state);
  const ptPerMm = geometry.ptPerMm; // ~2.83464567

  const pageWidthPt = geometry.sheetWidth * ptPerMm;
  const pageHeightPt = geometry.sheetHeight * ptPerMm;

  // Add landscape A1 page
  const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);

  // Coordinate helper: converts top-left mm (x, y) to PDF bottom-left coordinates in pt
  const toPdfCoords = (xMm, yMm, heightMm = 0) => {
    return {
      x: xMm * ptPerMm,
      y: pageHeightPt - (yMm + heightMm) * ptPerMm,
    };
  };

  const borderWidthPt = geometry.outerBox.borderWidth * ptPerMm;

  // 1. Draw Big Outer Box Border
  const outerBoxPos = toPdfCoords(geometry.outerBox.x, geometry.outerBox.y, geometry.outerBox.height);
  page.drawRectangle({
    x: outerBoxPos.x,
    y: outerBoxPos.y,
    width: geometry.outerBox.width * ptPerMm,
    height: geometry.outerBox.height * ptPerMm,
    borderColor: rgb(0, 0, 0),
    borderWidth: borderWidthPt,
  });

  // 2. Draw Horizontal Divider Line above Title Block
  const titleDivPos = toPdfCoords(geometry.titleBlock.x, geometry.titleBlock.y);
  page.drawLine({
    start: { x: titleDivPos.x, y: titleDivPos.y },
    end: { x: titleDivPos.x + (geometry.titleBlock.width * ptPerMm), y: titleDivPos.y },
    thickness: borderWidthPt,
    color: rgb(0, 0, 0),
  });

  // 3. Draw Vertical Divider Line between Title (Left) and Details (Right)
  const vertStart = toPdfCoords(geometry.titleRightBox.x, geometry.titleBlock.y);
  const vertEnd = toPdfCoords(geometry.titleRightBox.x, geometry.titleBlock.y + geometry.titleBlock.height);
  page.drawLine({
    start: { x: vertStart.x, y: vertStart.y },
    end: { x: vertEnd.x, y: vertEnd.y },
    thickness: borderWidthPt,
    color: rgb(0, 0, 0),
  });

  // 4. Embed and Draw Photos
  const fitMode = state.fitMode || 'cover';

  for (const cell of geometry.cells) {
    if (!cell.photo || !cell.photo.url) continue;

    try {
      const cellPos = toPdfCoords(cell.x, cell.y, cell.height);
      const targetWidthPt = cell.width * ptPerMm;
      const targetHeightPt = cell.height * ptPerMm;

      // Process image via offscreen canvas to handle formats (JPEG/PNG/WebP), rotation, and fitMode
      const processedImageData = await processImageForPdf(cell.photo, cell.width, cell.height, fitMode);

      if (processedImageData) {
        let pdfImage;
        if (processedImageData.format === 'png') {
          pdfImage = await pdfDoc.embedPng(processedImageData.bytes);
        } else {
          pdfImage = await pdfDoc.embedJpg(processedImageData.bytes);
        }

        // Draw image into the calculated cell bounding box
        page.drawImage(pdfImage, {
          x: cellPos.x + (processedImageData.drawOffsetX * ptPerMm),
          y: cellPos.y + (processedImageData.drawOffsetY * ptPerMm),
          width: processedImageData.drawWidth * ptPerMm,
          height: processedImageData.drawHeight * ptPerMm,
        });
      }
    } catch (err) {
      console.warn(`Failed to embed photo ${cell.index + 1}:`, err);
    }
  }

  // 5. Select Typography Fonts
  const getPdfFont = async (fontName, isBold) => {
    switch (fontName) {
      case 'Helvetica':
        return await pdfDoc.embedFont(isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
      case 'Courier':
        return await pdfDoc.embedFont(isBold ? StandardFonts.CourierBold : StandardFonts.Courier);
      case 'Times-Roman':
      default:
        return await pdfDoc.embedFont(isBold ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman);
    }
  };

  const titleFont = await getPdfFont(state.titleFont, state.titleBold);
  const detailsFont = await getPdfFont(state.detailsFont, false);

  // 6. Draw Main Title Text (Left Box)
  if (state.sheetTitle) {
    const titleFontSize = Number(state.titleFontSize) || 28;
    const titlePaddingLeftMm = 15;
    const titlePos = toPdfCoords(geometry.titleLeftBox.x + titlePaddingLeftMm, geometry.titleLeftBox.y);

    // Approximate vertical centering in title block
    const titleY = titlePos.y - (geometry.titleLeftBox.height * ptPerMm / 2) - (titleFontSize * 0.35);

    page.drawText(state.sheetTitle, {
      x: titlePos.x,
      y: titleY,
      size: titleFontSize,
      font: titleFont,
      color: rgb(0, 0, 0),
    });
  }

  // 7. Draw Details Text Lines (Right Box)
  if (state.details && state.details.length > 0) {
    const detailsFontSize = Number(state.detailsFontSize) || 11;
    const detailsPaddingLeftMm = 8;
    const detailsPaddingTopMm = 8;
    const rightBoxPos = toPdfCoords(geometry.titleRightBox.x + detailsPaddingLeftMm, geometry.titleRightBox.y + detailsPaddingTopMm);

    const lineSpacingPt = detailsFontSize * 1.5;
    let currentY = rightBoxPos.y - detailsFontSize;

    for (const item of state.details) {
      const lineText = item.isStandalone 
        ? (item.value || '') 
        : (item.label ? `${item.label}: ${item.value || ''}` : (item.value || ''));

      if (lineText.trim()) {
        page.drawText(lineText, {
          x: rightBoxPos.x,
          y: currentY,
          size: detailsFontSize,
          font: detailsFont,
          color: rgb(0, 0, 0),
        });
        currentY -= lineSpacingPt;
      }
    }
  }

  // 8. Generate and download PDF
  const pdfBytes = await pdfDoc.save();
  downloadBlob(pdfBytes, 'A1_Presentation_Sheet.pdf', 'application/pdf');
}

/**
 * Prepares image for PDF embedding: handles rotation, high-resolution rendering, and crop/contain
 */
async function processImageForPdf(photo, cellWidthMm, cellHeightMm, fitMode) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const rotation = (photo.rotation || 0) % 360;
        const isRotated90or270 = rotation === 90 || rotation === 270;

        const srcWidth = isRotated90or270 ? img.height : img.width;
        const srcHeight = isRotated90or270 ? img.width : img.height;

        const cellAspect = cellWidthMm / cellHeightMm;
        const srcAspect = srcWidth / srcHeight;

        // Render at high resolution (target 200 - 300 DPI equivalent for print)
        const scaleFactor = 3; // high-DPI rasterization
        const canvasW = Math.round(cellWidthMm * scaleFactor * 2.8346);
        const canvasH = Math.round(cellHeightMm * scaleFactor * 2.8346);

        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasW, canvasH);

        let drawW = canvasW;
        let drawH = canvasH;
        let drawX = 0;
        let drawY = 0;

        if (fitMode === 'cover') {
          // Fill cell uniformly, crop overflow
          if (srcAspect > cellAspect) {
            // Source is wider than cell: crop left & right
            drawH = canvasH;
            drawW = canvasH * srcAspect;
            drawX = (canvasW - drawW) / 2;
          } else {
            // Source is taller than cell: crop top & bottom
            drawW = canvasW;
            drawH = canvasW / srcAspect;
            drawY = (canvasH - drawH) / 2;
          }
        } else {
          // Contain: letterbox inside cell without cropping
          if (srcAspect > cellAspect) {
            drawW = canvasW;
            drawH = canvasW / srcAspect;
            drawY = (canvasH - drawH) / 2;
          } else {
            drawH = canvasH;
            drawW = canvasH * srcAspect;
            drawX = (canvasW - drawW) / 2;
          }
        }

        // Apply rotation if needed
        ctx.save();
        ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const imgDrawW = isRotated90or270 ? drawH : drawW;
        const imgDrawH = isRotated90or270 ? drawW : drawH;
        ctx.drawImage(img, -imgDrawW / 2, -imgDrawH / 2, imgDrawW, imgDrawH);
        ctx.restore();

        // Convert canvas to JPEG blob
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            const isolatedBytes = new Uint8Array(arrayBuffer.slice(0));
            resolve({
              format: 'jpg',
              bytes: isolatedBytes,
              drawOffsetX: 0,
              drawOffsetY: 0,
              drawWidth: cellWidthMm,
              drawHeight: cellHeightMm,
            });
          };
          reader.readAsArrayBuffer(blob);
        }, 'image/jpeg', 0.95);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = (err) => reject(err);
    img.src = photo.url;
  });
}

/**
 * Triggers direct browser download for Uint8Array or Blob
 */
function downloadBlob(data, filename, mimeType) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
