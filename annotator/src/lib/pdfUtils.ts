import { PDFDocument, rgb } from "pdf-lib";

export async function exportPdfWithAnnotations(
  originalPdf: ArrayBuffer,
  annotations: any[]
): Promise<Blob> {
  // Load the existing PDF
  const pdfDoc = await PDFDocument.load(originalPdf);
  const pages = pdfDoc.getPages();

  // Process each annotation
  for (const annotation of annotations) {
    const page = pages[annotation.page - 1];
    const { width, height } = page.getSize();

    switch (annotation.type) {
      case "highlight":
        await addHighlightToPage(page, annotation, width, height);
        break;
      case "underline":
        await addUnderlineToPage(page, annotation, width, height);
        break;
      case "signature":
        await addSignatureToPage(page, annotation, width, height);
        break;
      // Add other annotation types...
    }
  }

  // Save and return the modified PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

async function addHighlightToPage(
  page: any,
  annotation: any,
  pageWidth: number,
  pageHeight: number
) {
  const { rects, color } = annotation;
  const rgbColor = hexToRgb(color || "#FFFF00");

  rects.forEach((rect: any) => {
    page.drawRectangle({
      x: rect.x * pageWidth,
      y: pageHeight - (rect.y + rect.height) * pageHeight,
      width: rect.width * pageWidth,
      height: rect.height * pageHeight,
      color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      opacity: 0.3,
    });
  });
}

async function addUnderlineToPage(
  page: any,
  annotation: any,
  pageWidth: number,
  pageHeight: number
) {
  const { rects, color } = annotation;
  const rgbColor = hexToRgb(color || "#0000FF");

  rects.forEach((rect: any) => {
    page.drawLine({
      start: {
        x: rect.x * pageWidth,
        y: pageHeight - (rect.y + rect.height) * pageHeight,
      },
      end: {
        x: (rect.x + rect.width) * pageWidth,
        y: pageHeight - (rect.y + rect.height) * pageHeight,
      },
      thickness: 1,
      color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
    });
  });
}

async function addSignatureToPage(
  page: any,
  annotation: any,
  pageWidth: number,
  pageHeight: number
) {
  const { imageData, position, width, height } = annotation;

  // Convert data URL to Uint8Array
  const imageBytes = Uint8Array.from(atob(imageData.split(",")[1]), (c) =>
    c.charCodeAt(0)
  );

  // Embed the image
  const image = await page.doc.embedPng(imageBytes);

  // Draw the image
  page.drawImage(image, {
    x: position.x * pageWidth,
    y: pageHeight - (position.y + height) * pageHeight,
    width: width * pageWidth,
    height: height * pageHeight,
  });
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 1, g: 1, b: 0 };
}
