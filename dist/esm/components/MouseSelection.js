import React, { useEffect, useRef, useState } from "react";
import { asElement, getPageFromElement, isHTMLElement } from "../lib/pdfjs-dom";
import "../style/MouseSelection.css";
import { viewportPositionToScaled } from "../lib/coordinates";
import screenshot from "../lib/screenshot";
const getBoundingRect = (start, end) => {
    return {
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    };
};
const getContainerCoords = (container, pageX, pageY) => {
    const containerBoundingRect = container.getBoundingClientRect();
    return {
        x: pageX - containerBoundingRect.left + container.scrollLeft,
        y: pageY - containerBoundingRect.top + container.scrollTop - window.scrollY,
    };
};
/**
 * A component that enables the creation of rectangular and interactive mouse
 * selections within a given container. NOTE: This does not disable selection in
 * whatever container the component is placed in. That must be handled through
 * the component's events.
 *
 * @category Component
 * @internal
 */
export const MouseSelection = ({ viewer, onSelection, onReset, onDragStart, enableAreaSelection, onChange, style, }) => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [locked, setLocked] = useState(false);
    const rootRef = useRef(null);
    // Needed in order to grab the page info of a mouse selection
    const startTargetRef = useRef(null);
    const reset = () => {
        onReset && onReset();
        setStart(null);
        setEnd(null);
        setLocked(false);
    };
    // Register event listeners onChange
    useEffect(() => {
        onChange && onChange(Boolean(start && end));
        if (!rootRef.current)
            return;
        // Should be the PdfHighlighter
        const container = asElement(rootRef.current.parentElement);
        const handleMouseUp = (event) => {
            if (!start || !end || !startTargetRef.current)
                return;
            const boundingRect = getBoundingRect(start, end);
            // Check if the bounding rectangle has a minimum width and height
            // to prevent recording selections with 0 area
            const shouldEnd = boundingRect.width >= 1 && boundingRect.height >= 1;
            if (!container.contains(asElement(event.target)) || !shouldEnd) {
                reset();
                return;
            }
            setLocked(true);
            const page = getPageFromElement(startTargetRef.current);
            if (!page)
                return;
            const pageBoundingRect = {
                ...boundingRect,
                top: boundingRect.top - page.node.offsetTop,
                left: boundingRect.left - page.node.offsetLeft,
                pageNumber: page.number,
            };
            const viewportPosition = {
                boundingRect: pageBoundingRect,
                rects: [],
            };
            const scaledPosition = viewportPositionToScaled(viewportPosition, viewer);
            const image = screenshot(pageBoundingRect, pageBoundingRect.pageNumber, viewer);
            onSelection &&
                onSelection(viewportPosition, scaledPosition, image, reset, event);
        };
        const handleMouseMove = (event) => {
            if (!rootRef.current || !start || locked)
                return;
            setEnd(getContainerCoords(container, event.pageX, event.pageY));
        };
        const handleMouseDown = (event) => {
            const shouldStart = (event) => enableAreaSelection(event) &&
                isHTMLElement(event.target) &&
                Boolean(asElement(event.target).closest(".page"));
            // If the user clicks anywhere outside a tip, reset the selection
            const shouldReset = (event) => start &&
                !asElement(event.target).closest(".PdfHighlighter__tip-container");
            if (!shouldStart(event)) {
                if (shouldReset(event))
                    reset();
                return;
            }
            startTargetRef.current = asElement(event.target);
            onDragStart && onDragStart(event);
            setStart(getContainerCoords(container, event.pageX, event.pageY));
            setEnd(null);
            setLocked(false);
        };
        /**
         * Although we register the event listeners on the PdfHighlighter component, we encapsulate
         * them in this separate component to enhance maintainability and prevent unnecessary
         * rerenders of the PdfHighlighter itself. While synthetic events on PdfHighlighter would
         * be preferable, we need to register "mouseup" on the entire document anyway. Therefore,
         * we can't avoid using useEffect. We must re-register all events on state changes, as
         * custom event listeners may otherwise receive stale state.
         */
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [start, end]);
    return (React.createElement("div", { className: "MouseSelection-container", ref: rootRef }, start && end && (React.createElement("div", { className: "MouseSelection", style: { ...getBoundingRect(start, end), ...style } }))));
};
//# sourceMappingURL=MouseSelection.js.map