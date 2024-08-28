import { ReactNode } from "react";
import { Root } from "react-dom/client";
/**
 * A rectangle as measured by the viewport.
 *
 * @category Type
 */
export type LTWH = {
    /** The x coordinate of the top-left of the rectangle. */
    left: number;
    /** The y coordinate of the top-left of the rectangle. */
    top: number;
    /** Width of the rectangle, relative to top left of the viewport. */
    width: number;
    /** Height of the rectangle, relative to top left of the viewport. */
    height: number;
};
/** @category Type */
export type LTWHP = LTWH & {
    /** 1-Indexed page number */
    pageNumber: number;
};
/**
 * "scaled" means that data structure stores (0, 1) coordinates.
 *  for clarity reasons I decided not to store actual (0, 1) coordinates but
 *  provide width and height, so user can compute ratio himself if needed
 *
 * @category Type
 * @author Artem Tyurin <artem.tyurin@gmail.com>
 */
export type Scaled = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    /** 1-Indexed page number */
    pageNumber: number;
};
/**
 * Position of a Highlight relative to the viewport.
 *
 * @category Type
 */
export type ViewportPosition = {
    /** Bounding rectangle for the entire highlight. */
    boundingRect: LTWHP;
    /** For text highlights, the rectangular highlights for each block of text. */
    rects: Array<LTWHP>;
};
/**
 * Position of a Highlight with normalised coordinates.
 *
 * @category Type
 */
export type ScaledPosition = {
    /** Bounding rectangle for the entire highlight. */
    boundingRect: Scaled;
    /** For text highlights, the rectangular highlights for each block of text. */
    rects: Array<Scaled>;
    /** Rarely applicable property of whether coordinates should be in PDF coordinate space.  */
    usePdfCoordinates?: boolean;
};
/**
 * The content of a highlight
 *
 * @category Type
 */
export type Content = {
    text?: string;
    image?: string;
};
/**
 * What type the highlight is. This is the ideal way to determine whether to
 * render it in an AreaHighlight or TextHighlight.
 *
 * @category Type
 */
export type HighlightType = "text" | "area";
/**
 * This represents a selected (text/mouse) area that has been turned into a
 * highlight. If you are storing highlights, they should be stored as this type.
 *
 * @category Type
 */
export interface Highlight {
    id: string;
    /**
     * This property is planned to be non-optional in future.
     */
    type?: HighlightType;
    /**
     * @deprecated If you want your highlight to store content after being a
     * GhostHighlight, you should create your own interface extended off this. If
     * you are currently using this property to determine what kind of highlight
     * to render, please use {@link type}.
     */
    content?: Content;
    position: ScaledPosition;
}
/**
 * This represents a temporary highlight and is ideal as an intermediary between
 * a selection and a highlight.
 *
 * @category Type
 */
export interface GhostHighlight extends Required<Omit<Highlight, "id">> {
    content: Content;
}
/**
 * This represents a rendered highlight, with its position defined by the page
 * viewport.
 *
 * @category Type
 */
export type ViewportHighlight<T extends Highlight = Highlight> = Omit<T, "position"> & {
    position: ViewportPosition;
};
/**
 * An area or text selection in a PDF Document.
 *
 * @category Type
 */
export type PdfSelection = GhostHighlight & {
    /** Convert the current selection into a temporary highlight */
    makeGhostHighlight(): GhostHighlight;
};
/**
 * A PDF.js page representation. This is the reference type for every page in the PdfHighlighter.
 *
 * @category Type
 */
export type Page = {
    node: HTMLElement;
    /** 1-Index page number */
    number: number;
};
/**
 * All the DOM refs for a group of highlights on one page
 *
 * @category Type
 */
export type HighlightBindings = {
    reactRoot: Root;
    container: Element;
    textLayer: HTMLElement;
};
/**
 * A popup that can be viewed inside a PdfHighlighter.
 *
 * @category Type
 */
export type Tip = {
    position: ViewportPosition;
    content: ReactNode;
};
/**
 * The accepted scale values by the PDF.js viewer.
 * Numeric entries accept floats, e.g. 1.2 = 120%
 *
 * @category Type
 */
export type PdfScaleValue = "page-actual" | "page-width" | "page-height" | "page-fit" | "auto" | number;
