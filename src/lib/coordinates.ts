import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import type { LTWHP, ViewportPosition, Scaled, ScaledPosition } from "../types";
import { PageViewport } from "pdfjs-dist";


/** @category Utilities */
export const viewportToScaled = (
  rect: LTWHP,
  viewport: PageViewport
): Scaled => {

  const {width, height, rotation} = viewport;

  if (rotation === 0) {
    return {
      x1: rect.left,
      y1: rect.top,
      x2: rect.left + rect.width,
      y2: rect.top + rect.height,
      width,
      height,
      pageNumber: rect.pageNumber,
    };
  }
  if (rotation === 90) {
    return {
      x1: width - rect.height - rect.top,
      x2: width - rect.top,
      y1: rect.left,
      y2: rect.left + rect.width,
      width,
      height,
      pageNumber: rect.pageNumber,
    };
  }
  if (rotation === 180) {
    return  {
      x1: width - rect.left - rect.width,
      x2: width - rect.left,
      y1: height - rect.top - rect.height,
      y2: height - rect.top,
      width,
      height,
      pageNumber: rect.pageNumber,
    };
  }

  if (rotation === 270) {
    return {
      x1: rect.top,
      x2: rect.top + rect.height,
      y1: height - rect.left - rect.width,
      y2: height - rect.left,
      width,
      height,
      pageNumber: rect.pageNumber,
    };
  }

  throw new Error(`Unsupported page rotation: ${rotation}`)
};

/** @category Utilities */
export const viewportPositionToScaled = (
  { boundingRect, rects }: ViewportPosition,
  viewer: PDFViewer,
): ScaledPosition => {
  const pageNumber = boundingRect.pageNumber;
  const viewport = viewer.getPageView(pageNumber - 1).viewport; // Account for 1 indexing of PDF documents
  const scale = (obj: LTWHP) => viewportToScaled(obj, viewport);

  return {
    boundingRect: scale(boundingRect),
    rects: (rects || []).map(scale),
  };
};

const pdfToViewport = (pdf: Scaled, viewport: PageViewport): LTWHP => {
  const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([
    pdf.x1,
    pdf.y1,
    pdf.x2,
    pdf.y2,
  ]);

  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),

    width: Math.abs(x2 - x1),
    height: Math.abs(y1 - y2),

    pageNumber: pdf.pageNumber,
  };
};

/** @category Utilities */
export const scaledToViewport = (
  scaled: Scaled,
  viewport: PageViewport,
  usePdfCoordinates: boolean = false,
): LTWHP => {
  const { width, height } = viewport;

  if (usePdfCoordinates) {
    return pdfToViewport(scaled, viewport);
  }

  if (scaled.x1 === undefined) {
    throw new Error("You are using old position format, please update");
  }

  const x1 = (width * scaled.x1) / scaled.width;
  const y1 = (height * scaled.y1) / scaled.height;

  const x2 = (width * scaled.x2) / scaled.width;
  const y2 = (height * scaled.y2) / scaled.height;

  const rotation = viewport.rotation;

  let rotated;
  if (rotation === 0) {
    rotated = {x1, y1, x2, y2};

  } else if (rotation === 90) {
    rotated = {
      x1: y1,
      x2: y2,
      y1: width - x2,
      y2: width - x1,
    };

  } else if (rotation === 180) {
    rotated = {
      x1: width - x2,
      x2: width - x1,
      y1: height - y2,
      y2: height - y1,
    };

  } else if (rotation === 270) {
    rotated = {
      x1: height - y2,
      x2: height - y1,
      y1: x1,
      y2: x2,
    };

  } else {
    throw new Error(`Unsupported rotation: ${rotation}`);
  }
  return {
    left: rotated.x1,
    top: rotated.y1,
    width: rotated.x2 - rotated.x1,
    height: rotated.y2 - rotated.y1,
    pageNumber: scaled.pageNumber,
  };
};

/** @category Utilities */
export const scaledPositionToViewport = (
  { boundingRect, rects, usePdfCoordinates }: ScaledPosition,
  viewer: PDFViewer,
): ViewportPosition => {
  const pageNumber = boundingRect.pageNumber;
  const viewport = viewer.getPageView(pageNumber - 1).viewport; // Account for 1 indexing of PDF documents
  const scale = (obj: Scaled) =>
    scaledToViewport(obj, viewport, usePdfCoordinates);

  return {
    boundingRect: scale(boundingRect),
    rects: (rects || []).map(scale),
  };
};
