import React, { useRef } from "react";
import { usePdfHighlighterContext } from "../contexts/PdfHighlighterContext";
import { MouseMonitor } from "./MouseMonitor";
/**
 * A container for a highlight component that monitors whether a mouse is over a
 * highlight and over some secondary highlight tip. It will display the tip
 * whenever the mouse is over the highlight and it will hide the tip only when
 * the mouse has left the highlight AND the tip.
 *
 * @category Component
 */
export const MonitoredHighlightContainer = ({ onMouseEnter, highlightTip, onMouseLeave, children, }) => {
    const mouseInRef = useRef(false); // Whether the mouse is over the child (highlight)
    const { setTip, isEditingOrHighlighting } = usePdfHighlighterContext();
    return (React.createElement("div", { onMouseEnter: () => {
            mouseInRef.current = true;
            onMouseEnter && onMouseEnter();
            if (isEditingOrHighlighting())
                return;
            if (highlightTip) {
                // MouseMonitor the highlightTip to prevent it from disappearing if the mouse is over it and not the highlight.
                const monitoredHighlightTip = (React.createElement(MouseMonitor, { onMoveAway: () => {
                        // The event will keep triggering if the mouse is not on the highlightTip,
                        // but don't do anything if the mouse is over the highlight.
                        if (mouseInRef.current) {
                            return;
                        }
                        setTip(null);
                        onMouseLeave && onMouseLeave();
                    }, paddingX: 60, paddingY: 30 }, highlightTip.content));
                setTip({
                    position: highlightTip.position,
                    content: monitoredHighlightTip,
                });
            }
        }, onMouseLeave: () => {
            mouseInRef.current = false;
            // Trigger onMouseLeave if no highlightTip exists
            !highlightTip && onMouseLeave && onMouseLeave();
        } }, children));
};
//# sourceMappingURL=MonitoredHighlightContainer.js.map