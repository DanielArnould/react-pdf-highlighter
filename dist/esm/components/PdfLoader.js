import React, { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument, } from "pdfjs-dist";
import { version } from "pdfjs-dist";
const DEFAULT_BEFORE_LOAD = (progress) => (React.createElement("div", { style: { color: "black" } },
    "Loading ",
    Math.floor((progress.loaded / progress.total) * 100),
    "%"));
const DEFAULT_ERROR_MESSAGE = (error) => (React.createElement("div", { style: { color: "black" } }, error.message));
const DEFAULT_ON_ERROR = (error) => {
    throw new Error(`Error loading PDF document: ${error.message}!`);
};
const DEFAULT_WORKER_SRC = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
/**
 * A component for loading a PDF document and passing it to a child.
 *
 * @category Component
 */
export const PdfLoader = ({ document, beforeLoad = DEFAULT_BEFORE_LOAD, errorMessage = DEFAULT_ERROR_MESSAGE, children, onError = DEFAULT_ON_ERROR, workerSrc = DEFAULT_WORKER_SRC, }) => {
    const pdfLoadingTaskRef = useRef(null);
    const pdfDocumentRef = useRef(null);
    const [error, setError] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(null);
    // Intitialise document
    useEffect(() => {
        GlobalWorkerOptions.workerSrc = workerSrc;
        pdfLoadingTaskRef.current = getDocument(document);
        pdfLoadingTaskRef.current.onProgress = (progress) => {
            setLoadingProgress(progress.loaded > progress.total ? null : progress);
        };
        pdfLoadingTaskRef.current.promise
            .then((pdfDocument) => {
            pdfDocumentRef.current = pdfDocument;
        })
            .catch((error) => {
            if (error.message != "Worker was destroyed") {
                setError(error);
                onError(error);
            }
        })
            .finally(() => {
            setLoadingProgress(null);
        });
        return () => {
            if (pdfLoadingTaskRef.current) {
                pdfLoadingTaskRef.current.destroy();
            }
            if (pdfDocumentRef.current) {
                pdfDocumentRef.current.destroy();
            }
        };
    }, [document]);
    return error
        ? errorMessage(error)
        : loadingProgress
            ? beforeLoad(loadingProgress)
            : pdfDocumentRef.current && children(pdfDocumentRef.current);
};
//# sourceMappingURL=PdfLoader.js.map