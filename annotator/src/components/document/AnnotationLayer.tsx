// src/components/document/AnnotationLayer.tsx
"use client";

import { useAnnotations } from "@/contexts/AnnotationContext";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Annotation, SignatureAnnotation } from "@/lib/types";

interface AnnotationLayerProps {
  pageNumber: number;
  pageSize: { width: number; height: number };
  scale: number;
}

export default function AnnotationLayer({
  pageNumber,
  pageSize,
  scale,
}: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { annotations } = useAnnotations();

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      selection: false,
      hoverCursor: "default",
    });

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current || !pageSize) return;

    fabricRef.current.setDimensions({
      width: pageSize.width * scale,
      height: pageSize.height * scale,
    });
    fabricRef.current.setZoom(scale);
  }, [pageSize, scale]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();

    const pageAnnotations = annotations.filter(
      (ann) => ann.page === pageNumber
    );

    pageAnnotations.forEach((annotation) => {
      switch (annotation.type) {
        case "highlight":
          renderHighlight(canvas, annotation, scale);
          break;
        case "underline":
          renderUnderline(canvas, annotation, scale);
          break;
        case "signature":
          renderSignature(canvas, annotation, scale);
          break;
        // Add other annotation types...
      }
    });
  }, [annotations, pageNumber, scale]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ transform: `scale(${scale})` }}
    />
  );
}

function renderHighlight(
  canvas: fabric.Canvas,
  annotation: any,
  scale: number
) {
  annotation.rects.forEach((rect: any) => {
    const highlight = new fabric.Rect({
      left: rect.x * scale,
      top: rect.y * scale,
      width: rect.width * scale,
      height: rect.height * scale,
      fill: annotation.color || "rgba(255, 255, 0, 0.3)",
      selectable: false,
      evented: false,
    });
    canvas.add(highlight);
  });
}

function renderUnderline(
  canvas: fabric.Canvas,
  annotation: any,
  scale: number
) {
  annotation.rects.forEach((rect: any) => {
    const underline = new fabric.Line(
      [
        rect.x * scale,
        (rect.y + rect.height) * scale,
        (rect.x + rect.width) * scale,
        (rect.y + rect.height) * scale,
      ],
      {
        stroke: annotation.color || "blue",
        strokeWidth: 2,
        selectable: false,
        evented: false,
      }
    );
    canvas.add(underline);
  });
}

function renderSignature(
  canvas: fabric.Canvas,
  annotation: SignatureAnnotation,
  scale: number
) {
  fabric.Image.fromURL(annotation.imageData, (img) => {
    img.set({
      left: annotation.position.x * scale,
      top: annotation.position.y * scale,
      scaleX: (annotation.width / img.width!) * scale,
      scaleY: (annotation.height / img.height!) * scale,
      selectable: false,
      evented: false,
    });
    canvas.add(img);
  });
}
