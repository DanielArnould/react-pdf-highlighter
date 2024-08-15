import { Page } from "../types";

export const getDocument = (elm: any): Document =>
  (elm || {}).ownerDocument || document;

export const getWindow = (elm: any): typeof window =>
  (getDocument(elm) || {}).defaultView || window;

export const isHTMLElement = (elm: any) =>
  elm instanceof HTMLElement || elm instanceof getWindow(elm).HTMLElement;

export const isHTMLCanvasElement = (elm: any) =>
  elm instanceof HTMLCanvasElement ||
  elm instanceof getWindow(elm).HTMLCanvasElement;

export const asElement = (x: any): HTMLElement => x;

export const getPageFromElement = (target: HTMLElement): Page | null => {
  const node = asElement(target.closest(".page"));

  if (!node || !isHTMLElement(node)) {
    return null;
  }

  const number = Number(asElement(node).dataset.pageNumber);

  return { node, number } as Page;
};

export const getPagesFromRange = (range: Range): Page[] => {
  const startParentElement = range.startContainer.parentElement;
  const endParentElement = range.endContainer.parentElement;

  if (!isHTMLElement(startParentElement) || !isHTMLElement(endParentElement)) {
    return [] as Page[];
  }

  const startPage = getPageFromElement(asElement(startParentElement));
  const endPage = getPageFromElement(asElement(endParentElement));

  if (!startPage?.number || !endPage?.number) {
    return [] as Page[];
  }

  if (startPage.number === endPage.number) {
    return [startPage] as Page[];
  }

  if (startPage.number === endPage.number - 1) {
    return [startPage, endPage] as Page[];
  }

  const pages: Page[] = [];

  let currentPageNumber = startPage.number;

  const document = startPage.node.ownerDocument;

  while (currentPageNumber <= endPage.number) {
    const currentPage = getPageFromElement(
      document.querySelector(
        `[data-page-number='${currentPageNumber}'`,
      ) as HTMLElement,
    );
    if (currentPage) {
      pages.push(currentPage);
    }
    currentPageNumber++;
  }

  return pages as Page[];
};


/**
 * Create a container element we can use for highlights.
 * The original textLayer will be rotated by CSS to match
 * the rotation of individual PDF pages - this is not desired.
 * To keep our highlights independent of text rotation
 * we add a dedicated div to hold our annotations as a sibling.
 * The main styling is copied over, but we omit the
 * `data-main-rotation` attribute to keep our container div
 * from being rotated.
 *
 * @param container The original textLayer div from PDF.js
 */
export const findOrCreateContainerLayer = (
  container: HTMLElement,
  className: string,
) => {
  // Grab the parent - same div that hold the textLayer
  let pageDiv = container.parentElement;
  if (pageDiv === null) {
    return null;
  }

  const doc = getDocument(container);
  let layer = pageDiv.querySelector(`.${className}`);

  // TODO: There used to be concern about z-indexing
  //       here when adding to textLayer div, still relevant?
  if (!layer) {
    layer = doc.createElement("div");
    // Add the PDF.js textLayer class to get styled similarly
    layer.className = `${className} textLayer`;

    // TODO: Is this needed or purely for rotation?
    //layer.style.cssText = container.style.cssText;

    pageDiv.appendChild(layer);
  }

  return layer;
};
