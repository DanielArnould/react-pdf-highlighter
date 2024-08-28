import React, { ReactNode } from "react";
import { OnProgressParameters, type PDFDocumentProxy } from "pdfjs-dist";
import { DocumentInitParameters, TypedArray } from "pdfjs-dist/types/src/display/api";
/**
 * The props type for {@link PdfLoader}.
 *
 * @category Component Properties
 */
export interface PdfLoaderProps {
    /**
     * The document to be loaded by PDF.js.
     * If you need to pass HTTP headers, auth parameters,
     * or other pdf settings, do it through here.
     */
    document: string | URL | TypedArray | DocumentInitParameters;
    /**
     * Callback to render content before the PDF document is loaded.
     *
     * @param progress - PDF.js progress status.
     * @returns - Component to be rendered in space of the PDF document while loading.
     */
    beforeLoad?(progress: OnProgressParameters): ReactNode;
    /**
     * Component to render in the case of any PDF loading errors.
     *
     * @param error - PDF loading error.
     * @returns - Component to be rendered in space of the PDF document.
     */
    errorMessage?(error: Error): ReactNode;
    /**
     * Child components to use/render the loaded PDF document.
     *
     * @param pdfDocument - The loaded PDF document.
     * @returns - Component to render once PDF document is loaded.
     */
    children(pdfDocument: PDFDocumentProxy): ReactNode;
    /**
     * Callback triggered whenever an error occurs.
     *
     * @param error - PDF Loading error triggering the event.
     * @returns - Component to be rendered in space of the PDF document.
     */
    onError?(error: Error): void;
    /**
     * NOTE: This will be applied to all PdfLoader instances.
     * If you want to only apply a source to this instance, use the document parameters.
     */
    workerSrc?: string;
}
/**
 * A component for loading a PDF document and passing it to a child.
 *
 * @category Component
 */
export declare const PdfLoader: ({ document, beforeLoad, errorMessage, children, onError, workerSrc, }: PdfLoaderProps) => React.ReactNode;
