import React, { useEffect, useRef } from "react";
/**
 * A component that monitors mouse movements over a child and invisible padded area.
 *
 * @category Component
 * @internal
 */
export const MouseMonitor = ({ onMoveAway, paddingX, paddingY, children, }) => {
    const containerRef = useRef(null);
    const onMouseMove = (event) => {
        if (!containerRef.current)
            return;
        const { clientX, clientY } = event;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const inBoundsX = clientX > left - paddingX && clientX < left + width + paddingX;
        const inBoundsY = clientY > top - paddingY && clientY < top + height + paddingY;
        if (!(inBoundsX && inBoundsY)) {
            onMoveAway();
        }
    };
    useEffect(() => {
        // TODO: Maybe optimise or throttle?
        document.addEventListener("mousemove", onMouseMove);
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, []);
    return React.createElement("div", { ref: containerRef }, children);
};
//# sourceMappingURL=MouseMonitor.js.map