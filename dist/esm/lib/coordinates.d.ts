import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import type { LTWHP, ViewportPosition, Scaled, ScaledPosition } from "../types";
import { PageViewport } from "pdfjs-dist";
interface WIDTH_HEIGHT {
    width: number;
    height: number;
}
/** @category Utilities */
export declare const viewportToScaled: (rect: LTWHP, { width, height }: WIDTH_HEIGHT) => Scaled;
/** @category Utilities */
export declare const viewportPositionToScaled: ({ boundingRect, rects }: ViewportPosition, viewer: PDFViewer) => ScaledPosition;
/** @category Utilities */
export declare const scaledToViewport: (scaled: Scaled, viewport: PageViewport, usePdfCoordinates?: boolean) => LTWHP;
/** @category Utilities */
export declare const scaledPositionToViewport: ({ boundingRect, rects, usePdfCoordinates }: ScaledPosition, viewer: PDFViewer) => ViewportPosition;
export {};
