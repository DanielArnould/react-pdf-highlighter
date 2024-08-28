import "pdfjs-dist/web/pdf_viewer.css";
import "../style/PdfHighlighter.css";
import "../style/pdf_viewer.css";
import { PDFDocumentProxy } from "pdfjs-dist";
import React, { CSSProperties, ReactNode } from "react";
import { PdfHighlighterUtils } from "../contexts/PdfHighlighterContext";
import { GhostHighlight, Highlight, PdfScaleValue, PdfSelection } from "../types";
/**
 * The props type for {@link PdfHighlighter}.
 *
 * @category Component Properties
 */
export interface PdfHighlighterProps {
    /**
     * Array of all highlights to be organised and fed through to the child
     * highlight container.
     */
    highlights: Array<Highlight>;
    /**
     * Event is called only once whenever the user changes scroll after
     * the autoscroll function, scrollToHighlight, has been called.
     */
    onScrollAway?(): void;
    /**
     * What scale to render the PDF at inside the viewer.
     */
    pdfScaleValue?: PdfScaleValue;
    /**
     * Callback triggered whenever a user finishes making a mouse selection or has
     * selected text.
     *
     * @param PdfSelection - Content and positioning of the selection. NOTE:
     * `makeGhostHighlight` will not work if the selection disappears.
     */
    onSelection?(PdfSelection: PdfSelection): void;
    /**
     * Callback triggered whenever a ghost (non-permanent) highlight is created.
     *
     * @param ghostHighlight - Ghost Highlight that has been created.
     */
    onCreateGhostHighlight?(ghostHighlight: GhostHighlight): void;
    /**
     * Callback triggered whenever a ghost (non-permanent) highlight is removed.
     *
     * @param ghostHighlight - Ghost Highlight that has been removed.
     */
    onRemoveGhostHighlight?(ghostHighlight: GhostHighlight): void;
    /**
     * Optional element that can be displayed as a tip whenever a user makes a
     * selection.
     */
    selectionTip?: ReactNode;
    /**
     * Condition to check before any mouse selection starts.
     *
     * @param event - mouse event associated with the new selection.
     * @returns - `True` if mouse selection should start.
     */
    enableAreaSelection?(event: MouseEvent): boolean;
    /**
     * Optional CSS styling for the rectangular mouse selection.
     */
    mouseSelectionStyle?: CSSProperties;
    /**
     * PDF document to view and overlay highlights.
     */
    pdfDocument: PDFDocumentProxy;
    /**
     * This should be a highlight container/renderer of some sorts. It will be
     * given appropriate context for a single highlight which it can then use to
     * render a TextHighlight, AreaHighlight, etc. in the correct place.
     */
    children: ReactNode;
    /**
     * Coloring for unhighlighted, selected text.
     */
    textSelectionColor?: string;
    /**
     * Creates a reference to the PdfHighlighterContext above the component.
     *
     * @param pdfHighlighterUtils - various useful tools with a PdfHighlighter.
     * See {@link PdfHighlighterContext} for more description.
     */
    utilsRef(pdfHighlighterUtils: PdfHighlighterUtils): void;
    /**
     * Style properties for the PdfHighlighter (scrollbar, background, etc.), NOT
     * the PDF.js viewer it encloses. If you want to edit the latter, use the
     * other style props like `textSelectionColor` or overwrite pdf_viewer.css
     */
    style?: CSSProperties;
}
/**
 * This is a large-scale PDF viewer component designed to facilitate
 * highlighting. It should be used as a child to a {@link PdfLoader} to ensure
 * proper document loading. This does not itself render any highlights, but
 * instead its child should be the container component for each individual
 * highlight. This component will be provided appropriate HighlightContext for
 * rendering.
 *
 * @category Component
 */
export declare const PdfHighlighter: ({ highlights, onScrollAway, pdfScaleValue, onSelection: onSelectionFinished, onCreateGhostHighlight, onRemoveGhostHighlight, selectionTip, enableAreaSelection, mouseSelectionStyle, pdfDocument, children, textSelectionColor, utilsRef, style, }: PdfHighlighterProps) => React.JSX.Element;
