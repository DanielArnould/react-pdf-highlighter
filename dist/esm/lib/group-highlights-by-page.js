const groupHighlightsByPage = (highlights) => highlights.reduce((acc, highlight) => {
    if (!highlight) {
        return acc;
    }
    const pageNumbers = [
        highlight.position.boundingRect.pageNumber,
        ...highlight.position.rects.map((rect) => rect.pageNumber || 0),
    ];
    pageNumbers.forEach((pageNumber) => {
        acc[pageNumber] ||= [];
        const pageSpecificHighlight = {
            ...highlight,
            position: {
                ...highlight.position,
                rects: highlight.position.rects.filter((rect) => pageNumber === rect.pageNumber),
            },
        };
        acc[pageNumber].push(pageSpecificHighlight);
    });
    return acc;
}, {});
export default groupHighlightsByPage;
//# sourceMappingURL=group-highlights-by-page.js.map