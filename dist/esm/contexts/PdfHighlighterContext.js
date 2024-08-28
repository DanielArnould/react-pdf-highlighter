import { createContext, useContext } from "react";
export const PdfHighlighterContext = createContext(undefined);
/**
 * Custom hook for providing {@link PdfHighlighterUtils}. Must be used
 * within a child of {@link PdfHighlighter}.
 *
 * @category Context
 */
export const usePdfHighlighterContext = () => {
    const pdfHighlighterUtils = useContext(PdfHighlighterContext);
    if (pdfHighlighterUtils === undefined) {
        throw new Error("usePdfHighlighterContext must be used within PdfHighlighter!");
    }
    return pdfHighlighterUtils;
};
//# sourceMappingURL=PdfHighlighterContext.js.map