import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import type { LTWH } from "../types";
declare const screenshot: (position: LTWH, pageNumber: number, viewer: PDFViewer) => string;
export default screenshot;
