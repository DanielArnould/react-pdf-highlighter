import React, { CSSProperties, MouseEvent } from "react";
import "../style/TextHighlight.css";
import type { ViewportHighlight } from "../types";
/**
 * The props type for {@link TextHighlight}.
 *
 * @category Component Properties
 */
export interface TextHighlightProps {
    /**
     * Highlight to render over text.
     */
    highlight: ViewportHighlight;
    /**
     * Callback triggered whenever the user clicks on the part of a highlight.
     *
     * @param event - Mouse event associated with click.
     */
    onClick?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Callback triggered whenever the user enters the area of a text highlight.
     *
     * @param event - Mouse event associated with movement.
     */
    onMouseOver?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Callback triggered whenever the user leaves  the area of a text highlight.
     *
     * @param event - Mouse event associated with movement.
     */
    onMouseOut?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Indicates whether the component is autoscrolled into view, affecting
     * default theming.
     */
    isScrolledTo: boolean;
    /**
     * Callback triggered whenever the user tries to open context menu on highlight.
     *
     * @param event - Mouse event associated with click.
     */
    onContextMenu?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Optional CSS styling applied to each TextHighlight part.
     */
    style?: CSSProperties;
}
/**
 * A component for displaying a highlighted text area.
 *
 * @category Component
 */
export declare const TextHighlight: ({ highlight, onClick, onMouseOver, onMouseOut, isScrolledTo, onContextMenu, style, }: TextHighlightProps) => React.JSX.Element;
