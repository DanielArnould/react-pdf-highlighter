import React, { ReactNode } from "react";
import { Tip } from "../types";
/**
 * The props type for {@link MonitoredHighlightContainer}.
 *
 * @category Component Properties
 */
export interface MonitoredHighlightContainerProps {
    /**
     * A callback triggered whenever the mouse hovers over a highlight.
     */
    onMouseEnter?(): void;
    /**
     * What tip to automatically display whenever a mouse hovers over a highlight.
     * The tip will persist even as the user puts their mouse over it and not the
     * highlight, but will disappear once it no longer hovers both.
     */
    highlightTip?: Tip;
    /**
     * A callback triggered whenever the mouse completely moves out from both the
     * highlight (children) and any highlightTip.
     */
    onMouseLeave?(): void;
    /**
     * Component to monitor mouse activity over. This should be a highlight within the {@link PdfHighlighter}.
     */
    children: ReactNode;
}
/**
 * A container for a highlight component that monitors whether a mouse is over a
 * highlight and over some secondary highlight tip. It will display the tip
 * whenever the mouse is over the highlight and it will hide the tip only when
 * the mouse has left the highlight AND the tip.
 *
 * @category Component
 */
export declare const MonitoredHighlightContainer: ({ onMouseEnter, highlightTip, onMouseLeave, children, }: MonitoredHighlightContainerProps) => React.JSX.Element;
