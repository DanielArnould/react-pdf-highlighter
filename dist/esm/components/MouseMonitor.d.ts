import React, { ReactNode } from "react";
/**
 * The props type for {@link MouseMonitor}.
 *
 * @category Component Properties
 * @internal
 */
export interface MouseMonitorProps {
    /**
     * Callback triggered whenever the mouse moves not within the bounds of the
     * child component. This will keep triggering as long as the component is
     * rendered.
     */
    onMoveAway(): void;
    /**
     * X padding in pixels for the container to monitor mouse activity in.
     */
    paddingX: number;
    /**
     * Y padding in pixels for the container to monitor mouse activity in.
     */
    paddingY: number;
    /**
     * Component over which mouse activity is monitored.
     */
    children: ReactNode;
}
/**
 * A component that monitors mouse movements over a child and invisible padded area.
 *
 * @category Component
 * @internal
 */
export declare const MouseMonitor: ({ onMoveAway, paddingX, paddingY, children, }: MouseMonitorProps) => React.JSX.Element;
