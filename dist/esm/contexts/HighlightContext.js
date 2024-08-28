import { createContext, useContext } from "react";
export const HighlightContext = createContext(undefined);
/**
 * Custom hook for providing {@link HighlightContainerUtils}. Must be used
 * within a child of {@link PdfHighlighter}.
 *
 * @category Context
 */
export const useHighlightContainerContext = () => {
    const highlightContainerUtils = useContext(HighlightContext);
    if (highlightContainerUtils === undefined) {
        throw new Error("useHighlightContainerContext must be used within a child of PdfHighlighter!");
    }
    return highlightContainerUtils;
};
//# sourceMappingURL=HighlightContext.js.map