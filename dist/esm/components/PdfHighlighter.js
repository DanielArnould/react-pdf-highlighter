import "pdfjs-dist/web/pdf_viewer.css";
import "../style/PdfHighlighter.css";
import "../style/pdf_viewer.css";
import debounce from "lodash.debounce";
import React, { useLayoutEffect, useRef, useState, } from "react";
import { createRoot } from "react-dom/client";
import { PdfHighlighterContext, } from "../contexts/PdfHighlighterContext";
import { scaledToViewport, viewportPositionToScaled } from "../lib/coordinates";
import getBoundingRect from "../lib/get-bounding-rect";
import getClientRects from "../lib/get-client-rects";
import groupHighlightsByPage from "../lib/group-highlights-by-page";
import { asElement, findOrCreateContainerLayer, getPagesFromRange, getWindow, isHTMLElement, } from "../lib/pdfjs-dom";
import { HighlightLayer } from "./HighlightLayer";
import { MouseSelection } from "./MouseSelection";
import { TipContainer } from "./TipContainer";
let EventBus, PDFLinkService, PDFViewer;
(async () => {
    // Due to breaking changes in PDF.js 4.0.189. See issue #17228
    const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
    EventBus = pdfjs.EventBus;
    PDFLinkService = pdfjs.PDFLinkService;
    PDFViewer = pdfjs.PDFViewer;
})();
const SCROLL_MARGIN = 10;
const DEFAULT_SCALE_VALUE = "auto";
const DEFAULT_TEXT_SELECTION_COLOR = "rgba(153,193,218,255)";
const findOrCreateHighlightLayer = (textLayer) => {
    return findOrCreateContainerLayer(textLayer, "PdfHighlighter__highlight-layer");
};
const disableTextSelection = (viewer, flag) => {
    viewer.viewer?.classList.toggle("PdfHighlighter--disable-selection", flag);
};
/**
 * This is a large-scale PDF viewer component designed to facilitate
 * highlighting. It should be used as a child to a {@link PdfLoader} to ensure
 * proper document loading. This does not itself render any highlights, but
 * instead its child should be the container component for each individual
 * highlight. This component will be provided appropriate HighlightContext for
 * rendering.
 *
 * @category Component
 */
export const PdfHighlighter = ({ highlights, onScrollAway, pdfScaleValue = DEFAULT_SCALE_VALUE, onSelection: onSelectionFinished, onCreateGhostHighlight, onRemoveGhostHighlight, selectionTip, enableAreaSelection, mouseSelectionStyle, pdfDocument, children, textSelectionColor = DEFAULT_TEXT_SELECTION_COLOR, utilsRef, style, }) => {
    // State
    const [tip, setTip] = useState(null);
    const [isViewerReady, setIsViewerReady] = useState(false);
    // Refs
    const containerNodeRef = useRef(null);
    const highlightBindingsRef = useRef({});
    const ghostHighlightRef = useRef(null);
    const selectionRef = useRef(null);
    const scrolledToHighlightIdRef = useRef(null);
    const isAreaSelectionInProgressRef = useRef(false);
    const isEditInProgressRef = useRef(false);
    const updateTipPositionRef = useRef(() => { });
    const eventBusRef = useRef(new EventBus());
    const linkServiceRef = useRef(new PDFLinkService({
        eventBus: eventBusRef.current,
        externalLinkTarget: 2,
    }));
    const resizeObserverRef = useRef(null);
    const viewerRef = useRef(null);
    // Initialise PDF Viewer
    useLayoutEffect(() => {
        if (!containerNodeRef.current)
            return;
        const debouncedDocumentInit = debounce(() => {
            viewerRef.current =
                viewerRef.current ||
                    new PDFViewer({
                        container: containerNodeRef.current,
                        eventBus: eventBusRef.current,
                        textLayerMode: 2,
                        removePageBorders: true,
                        linkService: linkServiceRef.current,
                    });
            viewerRef.current.setDocument(pdfDocument);
            linkServiceRef.current.setDocument(pdfDocument);
            linkServiceRef.current.setViewer(viewerRef.current);
            setIsViewerReady(true);
        }, 100);
        debouncedDocumentInit();
        return () => {
            debouncedDocumentInit.cancel();
        };
    }, [document]);
    // Initialise viewer event listeners
    useLayoutEffect(() => {
        if (!containerNodeRef.current)
            return;
        resizeObserverRef.current = new ResizeObserver(handleScaleValue);
        resizeObserverRef.current.observe(containerNodeRef.current);
        const doc = containerNodeRef.current.ownerDocument;
        eventBusRef.current.on("textlayerrendered", renderHighlightLayers);
        eventBusRef.current.on("pagesinit", handleScaleValue);
        doc.addEventListener("keydown", handleKeyDown);
        renderHighlightLayers();
        return () => {
            eventBusRef.current.off("pagesinit", handleScaleValue);
            eventBusRef.current.off("textlayerrendered", renderHighlightLayers);
            doc.removeEventListener("keydown", handleKeyDown);
            resizeObserverRef.current?.disconnect();
        };
    }, [selectionTip, highlights, onSelectionFinished]);
    // Event listeners
    const handleScroll = () => {
        onScrollAway && onScrollAway();
        scrolledToHighlightIdRef.current = null;
        renderHighlightLayers();
    };
    const handleMouseUp = () => {
        const container = containerNodeRef.current;
        const selection = getWindow(container).getSelection();
        if (!container || !selection || selection.isCollapsed || !viewerRef.current)
            return;
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        // Check the selected text is in the document, not the tip
        if (!range || !container.contains(range.commonAncestorContainer))
            return;
        const pages = getPagesFromRange(range);
        if (!pages || pages.length === 0)
            return;
        const rects = getClientRects(range, pages);
        if (rects.length === 0)
            return;
        const viewportPosition = {
            boundingRect: getBoundingRect(rects),
            rects,
        };
        const scaledPosition = viewportPositionToScaled(viewportPosition, viewerRef.current);
        const content = {
            text: selection.toString().split("\n").join(" "), // Make all line breaks spaces
        };
        selectionRef.current = {
            content,
            type: "text",
            position: scaledPosition,
            makeGhostHighlight: () => {
                ghostHighlightRef.current = {
                    content: content,
                    type: "text",
                    position: scaledPosition,
                };
                onCreateGhostHighlight &&
                    onCreateGhostHighlight(ghostHighlightRef.current);
                clearTextSelection();
                renderHighlightLayers();
                return ghostHighlightRef.current;
            },
        };
        onSelectionFinished && onSelectionFinished(selectionRef.current);
        selectionTip &&
            setTip({ position: viewportPosition, content: selectionTip });
    };
    const handleMouseDown = (event) => {
        if (!isHTMLElement(event.target) ||
            asElement(event.target).closest(".PdfHighlighter__tip-container") // Ignore selections on tip container
        ) {
            return;
        }
        setTip(null);
        clearTextSelection(); // TODO: Check if clearing text selection only if not clicking on tip breaks anything.
        removeGhostHighlight();
        toggleEditInProgress(false);
    };
    const handleKeyDown = (event) => {
        if (event.code === "Escape") {
            clearTextSelection();
            removeGhostHighlight();
            setTip(null);
        }
    };
    const handleScaleValue = () => {
        if (viewerRef.current) {
            viewerRef.current.currentScaleValue = pdfScaleValue.toString();
        }
    };
    // Render Highlight layers
    const renderHighlightLayer = (highlightBindings, pageNumber) => {
        if (!viewerRef.current)
            return;
        highlightBindings.reactRoot.render(React.createElement(PdfHighlighterContext.Provider, { value: pdfHighlighterUtils },
            React.createElement(HighlightLayer, { highlightsByPage: groupHighlightsByPage([
                    ...highlights,
                    ghostHighlightRef.current,
                ]), pageNumber: pageNumber, scrolledToHighlightId: scrolledToHighlightIdRef.current, viewer: viewerRef.current, highlightBindings: highlightBindings, children: children })));
    };
    const renderHighlightLayers = () => {
        if (!viewerRef.current)
            return;
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
            const highlightBindings = highlightBindingsRef.current[pageNumber];
            // Need to check if container is still attached to the DOM as PDF.js can unload pages.
            if (highlightBindings?.container?.isConnected) {
                renderHighlightLayer(highlightBindings, pageNumber);
            }
            else {
                const { textLayer } = viewerRef.current.getPageView(pageNumber - 1) || {};
                if (!textLayer)
                    continue; // Viewer hasn't rendered page yet
                // textLayer.div for version >=3.0 and textLayer.textLayerDiv otherwise.
                const highlightLayer = findOrCreateHighlightLayer(textLayer.div);
                if (highlightLayer) {
                    const reactRoot = createRoot(highlightLayer);
                    highlightBindingsRef.current[pageNumber] = {
                        reactRoot,
                        container: highlightLayer,
                        textLayer: textLayer.div, // textLayer.div for version >=3.0 and textLayer.textLayerDiv otherwise.
                    };
                    renderHighlightLayer(highlightBindingsRef.current[pageNumber], pageNumber);
                }
            }
        }
    };
    // Utils
    const isEditingOrHighlighting = () => {
        return (Boolean(selectionRef.current) ||
            Boolean(ghostHighlightRef.current) ||
            isAreaSelectionInProgressRef.current ||
            isEditInProgressRef.current);
    };
    const toggleEditInProgress = (flag) => {
        if (flag !== undefined) {
            isEditInProgressRef.current = flag;
        }
        else {
            isEditInProgressRef.current = !isEditInProgressRef.current;
        }
        // Disable text selection
        if (viewerRef.current)
            viewerRef.current.viewer?.classList.toggle("PdfHighlighter--disable-selection", isEditInProgressRef.current);
    };
    const removeGhostHighlight = () => {
        if (onRemoveGhostHighlight && ghostHighlightRef.current)
            onRemoveGhostHighlight(ghostHighlightRef.current);
        ghostHighlightRef.current = null;
        renderHighlightLayers();
    };
    const clearTextSelection = () => {
        selectionRef.current = null;
        const container = containerNodeRef.current;
        const selection = getWindow(container).getSelection();
        if (!container || !selection)
            return;
        selection.removeAllRanges();
    };
    const scrollToHighlight = (highlight) => {
        const { boundingRect, usePdfCoordinates } = highlight.position;
        const pageNumber = boundingRect.pageNumber;
        // Remove scroll listener in case user auto-scrolls in succession.
        viewerRef.current.container.removeEventListener("scroll", handleScroll);
        const pageViewport = viewerRef.current.getPageView(pageNumber - 1).viewport;
        viewerRef.current.scrollPageIntoView({
            pageNumber,
            destArray: [
                null, // null since we pass pageNumber already as an arg
                { name: "XYZ" },
                ...pageViewport.convertToPdfPoint(0, // Default x coord
                scaledToViewport(boundingRect, pageViewport, usePdfCoordinates).top -
                    SCROLL_MARGIN),
                0, // Default z coord
            ],
        });
        scrolledToHighlightIdRef.current = highlight.id;
        renderHighlightLayers();
        // wait for scrolling to finish
        setTimeout(() => {
            viewerRef.current.container.addEventListener("scroll", handleScroll, {
                once: true,
            });
        }, 100);
    };
    const pdfHighlighterUtils = {
        isEditingOrHighlighting,
        getCurrentSelection: () => selectionRef.current,
        getGhostHighlight: () => ghostHighlightRef.current,
        removeGhostHighlight,
        toggleEditInProgress,
        isEditInProgress: () => isEditInProgressRef.current,
        isSelectionInProgress: () => Boolean(selectionRef.current) || isAreaSelectionInProgressRef.current,
        scrollToHighlight,
        getViewer: () => viewerRef.current,
        getTip: () => tip,
        setTip,
        updateTipPosition: updateTipPositionRef.current,
    };
    utilsRef(pdfHighlighterUtils);
    return (React.createElement(PdfHighlighterContext.Provider, { value: pdfHighlighterUtils },
        React.createElement("div", { ref: containerNodeRef, className: "PdfHighlighter", onPointerDown: handleMouseDown, onPointerUp: handleMouseUp, style: style },
            React.createElement("div", { className: "pdfViewer" }),
            React.createElement("style", null, `
          .textLayer ::selection {
            background: ${textSelectionColor};
          }
        `),
            isViewerReady && (React.createElement(TipContainer, { viewer: viewerRef.current, updateTipPositionRef: updateTipPositionRef })),
            isViewerReady && enableAreaSelection && (React.createElement(MouseSelection, { viewer: viewerRef.current, onChange: (isVisible) => (isAreaSelectionInProgressRef.current = isVisible), enableAreaSelection: enableAreaSelection, style: mouseSelectionStyle, onDragStart: () => disableTextSelection(viewerRef.current, true), onReset: () => {
                    selectionRef.current = null;
                    disableTextSelection(viewerRef.current, false);
                }, onSelection: (viewportPosition, scaledPosition, image, resetSelection) => {
                    selectionRef.current = {
                        content: { image },
                        type: "area",
                        position: scaledPosition,
                        makeGhostHighlight: () => {
                            ghostHighlightRef.current = {
                                position: scaledPosition,
                                type: "area",
                                content: { image },
                            };
                            onCreateGhostHighlight &&
                                onCreateGhostHighlight(ghostHighlightRef.current);
                            resetSelection();
                            renderHighlightLayers();
                            return ghostHighlightRef.current;
                        },
                    };
                    onSelectionFinished && onSelectionFinished(selectionRef.current);
                    selectionTip &&
                        setTip({ position: viewportPosition, content: selectionTip });
                } })))));
};
//# sourceMappingURL=PdfHighlighter.js.map