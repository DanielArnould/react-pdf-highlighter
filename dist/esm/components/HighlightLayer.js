import React from "react";
import { HighlightContext, } from "../contexts/HighlightContext";
import { scaledPositionToViewport, viewportToScaled } from "../lib/coordinates";
import screenshot from "../lib/screenshot";
const EMPTY_ID = "empty-id";
/**
 * A component responsible for managing all the highlights and ghost highlights
 * for a single page of a PDF document. It does not render each highlight
 * but it provides context for a highlight container to do so.
 * Its rendering should be controlled by a {@link PdfHighlighter}.
 *
 * @category Component
 * @internal
 */
export const HighlightLayer = ({ highlightsByPage, pageNumber, scrolledToHighlightId, viewer, highlightBindings, children, }) => {
    const currentHighlights = highlightsByPage[pageNumber] || [];
    return (React.createElement("div", null, currentHighlights.map((highlight, index) => {
        const viewportHighlight = {
            ...highlight,
            id: "id" in highlight ? highlight.id : EMPTY_ID, // Give Empty ID to GhostHighlight
            position: scaledPositionToViewport(highlight.position, viewer),
        };
        const isScrolledTo = Boolean(scrolledToHighlightId === viewportHighlight.id);
        const highlightUtils = {
            highlight: viewportHighlight,
            viewportToScaled: (rect) => {
                const viewport = viewer.getPageView((rect.pageNumber || pageNumber) - 1).viewport;
                return viewportToScaled(rect, viewport);
            },
            screenshot: (boundingRect) => screenshot(boundingRect, pageNumber, viewer),
            isScrolledTo: isScrolledTo,
            highlightBindings,
        };
        return (React.createElement(HighlightContext.Provider, { value: highlightUtils, key: index }, children));
    })));
};
//# sourceMappingURL=HighlightLayer.js.map