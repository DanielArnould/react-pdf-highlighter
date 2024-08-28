import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import React, { MutableRefObject } from "react";
/**
 * The props type for {@link TipContainer}.
 *
 * @category Component Properties
 * @internal
 */
export interface TipContainerProps {
    /**
     * The PDFViewer instance containing the HighlightLayer
     */
    viewer: PDFViewer;
    /**
     * Reference to the callback to update the tip's position.This should be
     * managed by the PdfHighlighter.
     */
    updateTipPositionRef: MutableRefObject<() => void>;
}
/**
 * A component that manages rendering and placement of a tip around a highlight.
 * It does not automatically update the tip's position if it resizes.
 *
 * @category Component
 * @internal
 */
export declare const TipContainer: ({ viewer, updateTipPositionRef, }: TipContainerProps) => React.JSX.Element | null;
