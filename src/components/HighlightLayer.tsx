import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import React, { ReactNode } from "react";
import {
  HighlightContainerUtils,
  HighlightContext,
} from "../contexts/HighlightContext";
import { scaledPositionToViewport, viewportToScaled } from "../lib/coordinates";
import screenshot from "../lib/screenshot";
import {
  GhostHighlight,
  Highlight,
  HighlightBindings,
  LTWH,
  LTWHP,
  ViewportHighlight,
} from "../types";

const EMPTY_ID = "empty-id";

/**
 * The props type for {@link HighlightLayer}.
 *
 * @category Component Properties
 * @internal
 */
export interface HighlightLayerProps {
  /**
   * Highlights and GhostHighlights organised by page number.
   */
  highlightsByPage: { [pageNumber: number]: Array<Highlight | GhostHighlight> };

  /**
   * The page number of the PDF document to highlight (1 indexed).
   */
  pageNumber: number;

  /**
   * ID of the highlight that the parent PDF Highlighter is trying to autoscroll to.
   */
  scrolledToHighlightId?: string | null;

  /**
   * The PDFViewer instance containing the HighlightLayer
   */
  viewer: PDFViewer;

  /**
   * Group of DOM refs for all the highlights on this layer.
   */
  highlightBindings: HighlightBindings;

  /**
   * The Highlight container that should be used to render highlights for this layer.
   * It will be given appropriate context for a single highlight, allowing it to render
   * a single {@link TextHighlight}, {@link AreaHighlight}, etc., in the correct place.
   */
  children: ReactNode;
}

/**
 * A component responsible for managing all the highlights and ghost highlights
 * for a single page of a PDF document. It does not render each highlight
 * but it provides context for a highlight container to do so.
 * Its rendering should be controlled by a {@link PdfHighlighter}.
 *
 * @category Component
 * @internal
 */
export const HighlightLayer = ({
  highlightsByPage,
  pageNumber,
  scrolledToHighlightId,
  viewer,
  highlightBindings,
  children,
}: HighlightLayerProps) => {
  const currentHighlights = highlightsByPage[pageNumber] || [];

  return (
    <div>
      {currentHighlights.map((highlight, index) => {
        const viewportHighlight: ViewportHighlight = {
          ...highlight,
          id: "id" in highlight ? highlight.id : EMPTY_ID, // Give Empty ID to GhostHighlight
          position: scaledPositionToViewport(highlight.position, viewer),
        };

        const isScrolledTo = Boolean(
          scrolledToHighlightId === viewportHighlight.id,
        );

        const highlightUtils: HighlightContainerUtils = {
          highlight: viewportHighlight,
          viewportToScaled: (rect: LTWHP) => {
            const viewport = viewer.getPageView(
              (rect.pageNumber || pageNumber) - 1, // Convert to 0 index
            ).viewport;

            return viewportToScaled(rect, viewport);
          },
          screenshot: (boundingRect: LTWH) =>
            screenshot(boundingRect, pageNumber, viewer),
          isScrolledTo: isScrolledTo,
          highlightBindings,
        };

        return (
          <HighlightContext.Provider value={highlightUtils} key={`${viewportHighlight.id}-${index}`}>
            {children}
          </HighlightContext.Provider>
        );
      })}
    </div>
  );
};
