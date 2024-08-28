import React, { CSSProperties } from "react";
import "../style/MouseSelection.css";
import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import type { ScaledPosition, ViewportPosition } from "../types";
/**
 * The props type for {@link MouseSelection}.
 *
 * @category Component Properties
 * @internal
 */
export interface MouseSelectionProps {
    /**
     * The PDFViewer instance containing this MouseSelection.
     */
    viewer: PDFViewer;
    /**
     * Callback triggered whenever the user stops dragging their mouse and a valid
     * mouse selection is made. In general, this will only be called if a mouse
     * selection is rendered.
     *
     * @param viewportPosition - viewport position of the mouse selection.
     * @param scaledPosition - scaled position of the mouse selection.
     * @param image - PNG screenshot of the mouse selection.
     * @param resetSelection - Callback to reset the current selection.
     * @param event - Mouse event associated with ending the selection.
     */
    onSelection?(viewportPosition: ViewportPosition, scaledPosition: ScaledPosition, image: string, resetSelection: () => void, event: MouseEvent): void;
    /**
     * Callback triggered whenever the current mouse selection is reset.
     * This includes when dragging ends but the selection is invalid.
     */
    onReset?(): void;
    /**
     * Callback triggered whenever a new valid mouse selection begins.
     *
     * @param event - mouse event associated with the new selection.
     */
    onDragStart?(event: MouseEvent): void;
    /**
     * Condition to check before any mouse selection starts.
     *
     * @param event - mouse event associated with the new selection.
     * @returns - `True` if mouse selection should start.
     */
    enableAreaSelection(event: MouseEvent): boolean;
    /**
     * Callback whenever the mouse selection area changes.
     *
     * @param isVisible - Whether the mouse selection is rendered (i.e., non-zero area)
     */
    onChange?(isVisible: boolean): void;
    /**
     * Optional style props for the mouse selection rectangle.
     */
    style?: CSSProperties;
}
/**
 * A component that enables the creation of rectangular and interactive mouse
 * selections within a given container. NOTE: This does not disable selection in
 * whatever container the component is placed in. That must be handled through
 * the component's events.
 *
 * @category Component
 * @internal
 */
export declare const MouseSelection: ({ viewer, onSelection, onReset, onDragStart, enableAreaSelection, onChange, style, }: MouseSelectionProps) => React.JSX.Element;
