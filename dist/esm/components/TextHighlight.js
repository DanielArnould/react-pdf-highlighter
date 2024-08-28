import React from "react";
import "../style/TextHighlight.css";
/**
 * A component for displaying a highlighted text area.
 *
 * @category Component
 */
export const TextHighlight = ({ highlight, onClick, onMouseOver, onMouseOut, isScrolledTo, onContextMenu, style, }) => {
    const highlightClass = isScrolledTo ? "TextHighlight--scrolledTo" : "";
    const { rects } = highlight.position;
    return (React.createElement("div", { className: `TextHighlight ${highlightClass}`, onContextMenu: onContextMenu },
        React.createElement("div", { className: "TextHighlight__parts" }, rects.map((rect, index) => (React.createElement("div", { onMouseOver: onMouseOver, onMouseOut: onMouseOut, onClick: onClick, key: index, style: { ...rect, ...style }, className: `TextHighlight__part` }))))));
};
//# sourceMappingURL=TextHighlight.js.map