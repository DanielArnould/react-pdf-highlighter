import { GhostHighlight, Highlight } from "../types";
type GroupedHighlights = {
    [pageNumber: number]: Array<Highlight | GhostHighlight>;
};
declare const groupHighlightsByPage: (highlights: Array<Highlight | GhostHighlight | null>) => GroupedHighlights;
export default groupHighlightsByPage;
