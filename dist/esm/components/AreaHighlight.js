import React from "react";
import { getPageFromElement } from "../lib/pdfjs-dom";
import "../style/AreaHighlight.css";
import { Rnd } from "react-rnd";
/**
 * Renders a resizeable and interactive rectangular area for a highlight.
 *
 * @category Component
 */
export const AreaHighlight = ({ highlight, onChange, isScrolledTo, bounds, onContextMenu, onEditStart, style, }) => {
    const highlightClass = isScrolledTo ? "AreaHighlight--scrolledTo" : "";
    // Generate key based on position. This forces a remount (and a defaultpos update)
    // whenever highlight position changes (e.g., when updated, scale changes, etc.)
    // We don't use position as state because when updating Rnd this would happen and cause flickering:
    // User moves Rnd -> Rnd records new pos -> Rnd jumps back -> highlight updates -> Rnd re-renders at new pos
    const key = `${highlight.position.boundingRect.width}${highlight.position.boundingRect.height}${highlight.position.boundingRect.left}${highlight.position.boundingRect.top}`;
    return (React.createElement("div", { className: `AreaHighlight ${highlightClass}`, onContextMenu: onContextMenu },
        React.createElement(Rnd, { className: "AreaHighlight__part", onDragStop: (_, data) => {
                const boundingRect = {
                    ...highlight.position.boundingRect,
                    top: data.y,
                    left: data.x,
                };
                onChange && onChange(boundingRect);
            }, onResizeStop: (_mouseEvent, _direction, ref, _delta, position) => {
                const boundingRect = {
                    top: position.y,
                    left: position.x,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    pageNumber: getPageFromElement(ref)?.number || -1,
                };
                onChange && onChange(boundingRect);
            }, onDragStart: onEditStart, onResizeStart: onEditStart, default: {
                x: highlight.position.boundingRect.left,
                y: highlight.position.boundingRect.top,
                width: highlight.position.boundingRect.width,
                height: highlight.position.boundingRect.height,
            }, key: key, bounds: bounds, 
            // Prevevent any event clicks as clicking is already used for movement
            onClick: (event) => {
                event.stopPropagation();
                event.preventDefault();
            }, style: style })));
};
//# sourceMappingURL=AreaHighlight.js.map