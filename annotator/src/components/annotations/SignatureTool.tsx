"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

export default function SignatureTool({
  pageNumber,
  pageDimensions,
  onSave,
  onClose,
}: {
  pageNumber: number;
  pageDimensions: { width: number; height: number };
  onSave: (signature: SignatureAnnotation) => void;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [size, setSize] = useState({ width: 0.2, height: 0.1 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: pageDimensions.width * size.width,
      height: pageDimensions.height * size.height,
      backgroundColor: "#f8fafc",
    });

    canvas.freeDrawingBrush.color = "#000000";
    canvas.freeDrawingBrush.width = 2;

    setFabricCanvas(canvas);

    return () => canvas.dispose();
  }, [pageDimensions, size]);

  const handleSave = () => {
    if (!fabricCanvas) return;

    const dataUrl = fabricCanvas.toDataURL({ format: "png", quality: 1 });
    onSave({
      id: crypto.randomUUID(),
      type: "signature",
      page: pageNumber,
      position,
      imageData: dataUrl,
      width: size.width,
      height: size.height,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-2xl">
        <h3 className="text-lg font-bold mb-4">Add Signature</h3>
        <div className="mb-4">
          <label className="block mb-2">Position:</label>
          <div className="flex gap-4">
            <div>
              <label>X:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={position.x}
                onChange={(e) =>
                  setPosition({ ...position, x: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <label>Y:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={position.y}
                onChange={(e) =>
                  setPosition({ ...position, y: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} className="border rounded-md mb-4" />
        <div className="flex justify-between">
          <button
            onClick={() => fabricCanvas?.clear()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
