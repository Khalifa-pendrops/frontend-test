"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useRef } from "react";
import { AnnotationType } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { useAnnotations } from "@/contexts/AnnotationContext";
// import { useRef, useState } from "@/contexts/AnnotationContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  annotations: string[];
  onAnnotationsChange?: Dispatch<SetStateAction<string[]>>;
  activeTool?: AnnotationType | null;
}

export default function PDFViewer({
  file,
  annotations,
  onAnnotationsChange,
  activeTool,
}: PDFViewerProps) {
  const [selection, setSelection] = useState<DOMRect | null>(null);
  const pageRefs = useRef<Record<number, HTMLElement>>({});
  const [zoom, setZoom] = useState(1);

  const handleTextSelection = (pageNumber: number) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const pageElement = pageRefs.current[pageNumber];
    const pageRect = pageElement.getBoundingClientRect();

    // Convert to relative coordinates
    const relativeRect = {
      x: (rect.left - pageRect.left) / pageRect.width,
      y: (rect.top - pageRect.top) / pageRect.height,
      width: rect.width / pageRect.width,
      height: rect.height / pageRect.height,
    };

    setSelection(relativeRect);
    selection.removeAllRanges();
  };

  const addTextAnnotation = (
    type: "highlight" | "underline",
    color: string
  ) => {
    if (!selection) return;

    const newAnnotation = {
      id: crypto.randomUUID(),
      type,
      page: currentPage,
      rects: [selection],
      color,
      content: window.getSelection()?.toString() || "",
      createdAt: new Date().toISOString(),
    };

    onAnnotationsChange?.([...annotations, newAnnotation]);
    setSelection(null);
  };

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageDimension, setPageDimension] = useState<
    Record<number, { width: number; height: number }>
  >({});

  // const { annotations } = useAnnotations();
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onPageLoadSuccess(pageNumber: number) {
    return (page: any) => {
      const { width, height } = page.getViewport({ scale: 1 });
      setPageDimension((prev) => ({
        ...prev,
        [pageNumber]: { width, height },
      }));
    };
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto">
      <div
        className="relative"
        onMouseUp={() => handleTextSelection(curentPage)}
      >
        {file ? (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading PDF...</div>}
          >
            {/* {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          ))} */}

            {Array.from({ length: numPages || 0 }, (_, index) => (
              <div key={`page-${index + 1}`} className="relative">
                <Page
                  pageNumber={index + 1}
                  width={containerRef.current?.clientWidth}
                  onLoadSuccess={onPageLoadSuccess(index + 1)}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                {pageDimension[index + 1] && (
                  <AnnotationLayer
                    pageNumber={index + 1}
                    pageSize={pageDimension[index + 1]}
                    scale={
                      containerRef.current
                        ? containerRef.current.clientWidth /
                          pageDimension[index + 1].width
                        : 1
                    }
                  />
                )}
              </div>
            ))}
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Upload a PDF to begin</p>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span>{(zoom * 100).toFixed(0)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>

        {selection && (
          <AnnotationCreationMenu
            onHighlight={() => addTextAnnotation("highlight", "#FFFF000")}
            onUnderline={() => addTextAnnotation("underline", "#0000ff")}
            onCancel={() => setSelection(null)}
          />
        )}
      </div>
    </div>
  );
}
