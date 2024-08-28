/// <reference types="react" />
import { Highlight, HighlightBindings, LTWH, LTWHP, Scaled, ViewportHighlight } from "../types";
/**
 * A set of utilities for rendering highlights. Designed to be used within a
 * highlight container.
 *
 * @category Context
 */
export type HighlightContainerUtils<T extends Highlight = Highlight> = {
    /**
     * The highlight being rendered at this component.
     */
    highlight: ViewportHighlight<T>;
    /**
     * Convert a Viewport rectangle to a scaled rectangle. Can be used
     * for storing and updating area selection highlights, for example.
     *
     * @returns - Scaled/display agnostic rectangle.
     */
    viewportToScaled(rect: LTWHP): Scaled;
    /**
     *  Capture a PNG data url of a viewport rectangle.
     *
     * @returns - PNG data url. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
     */
    screenshot(position: LTWH): string;
    /**
     * Whether the highlight has been autoscrolled to.
     */
    isScrolledTo: boolean;
    /**
     * All the DOM refs for the highlights shared on the same page
     * as `highlight`
     */
    highlightBindings: HighlightBindings;
};
export declare const HighlightContext: import("react").Context<HighlightContainerUtils<Highlight> | undefined>;
/**
 * Custom hook for providing {@link HighlightContainerUtils}. Must be used
 * within a child of {@link PdfHighlighter}.
 *
 * @category Context
 */
export declare const useHighlightContainerContext: <T extends Highlight = Highlight>() => HighlightContainerUtils<T>;
