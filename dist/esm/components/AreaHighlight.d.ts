import React, { CSSProperties, MouseEvent } from "react";
import "../style/AreaHighlight.css";
import type { LTWHP, ViewportHighlight } from "../types";
/**
 * The props type for {@link AreaHighlight}.
 *
 * @category Component Properties
 */
export interface AreaHighlightProps {
    /**
     * The highlight to be rendered as an {@link AreaHighlight}.
     */
    highlight: ViewportHighlight;
    /**
     * A callback triggered whenever the highlight area is either finished
     * being moved or resized.
     *
     * @param rect - The updated highlight area.
     */
    onChange?(rect: LTWHP): void;
    /**
     * Has the highlight been auto-scrolled into view? By default, this will render the highlight red.
     */
    isScrolledTo?: boolean;
    /**
     * react-rnd bounds on the highlight area. This is useful for preventing the user
     * moving the highlight off the viewer/page.  See [react-rnd docs](https://github.com/bokuweb/react-rnd).
     */
    bounds?: string | Element;
    /**
     * A callback triggered whenever a context menu is opened on the highlight area.
     *
     * @param event - The mouse event associated with the context menu.
     */
    onContextMenu?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Event called whenever the user tries to move or resize an {@link AreaHighlight}.
     */
    onEditStart?(): void;
    /**
     * Custom styling to be applied to the {@link AreaHighlight} component.
     */
    style?: CSSProperties;
}
/**
 * Renders a resizeable and interactive rectangular area for a highlight.
 *
 * @category Component
 */
export declare const AreaHighlight: ({ highlight, onChange, isScrolledTo, bounds, onContextMenu, onEditStart, style, }: AreaHighlightProps) => React.JSX.Element;
