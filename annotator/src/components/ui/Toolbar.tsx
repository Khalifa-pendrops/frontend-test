// src/components/ui/Toolbar.tsx
"use client";

import { useState } from "react";
import { AnnotationType } from "@/lib/types";
import { toast } from "react-hot-toast";
import { useAnnotationHistory } from "@/contexts/AnnotationHistoryContext";

interface ToolbarProps {
  activeTool: AnnotationType | null;
  setActiveTool: (tool: AnnotationType | null) => void;
  onFileUpload?: (file: File | null) => void;
  annotations?: string[];
  annotationsLoading?: boolean;
  pdfFile: File | null;
}

type Tool = {
  id: AnnotationType;
  name: string;
  icon: string;
  color?: string;
};

const tools: Tool[] = [
  { id: "highlight", name: "Highlight", icon: "🖍", color: "yellow" },
  { id: "underline", name: "Underline", icon: "U̲", color: "blue" },
  { id: "comment", name: "Comment", icon: "💬" },
  { id: "signature", name: "Signature", icon: "✍️" },
];

// const { canUndo, canRedo, undo, redo } = useAnnotationHistory();

export default function Toolbar({
  activeTool,
  setActiveTool,
  onFileUpload,
  annotations,
  pdfFile,
}: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FFFF00");

  const { canUndo, canRedo, undo, redo } = useAnnotationHistory();

  const handleExport = async () => {
    if (!pdfFile) {
      toast.error("No document to export");
      return;
    }

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      // Add your export logic here
      toast.success("Document exported successfully");
    } catch (error) {
      toast.error("Failed to export document", error.message);
    }
  };

  return (
    <div className="flex items-center p-2 bg-gray-100 border-b">
      <div className="flex space-x-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(activeTool === tool.id ? null : tool.id);
              if (tool.color) setShowColorPicker(activeTool === tool.id);
            }}
            className={`p-2 rounded ${
              activeTool === tool.id ? "bg-blue-400" : "hover:bg-gray-500"
            }`}
            title={tool.name}
          >
            {tool.icon}
          </button>
        ))}
      </div>
      {showColorPicker && (
        <div className="ml-4 flex items-center">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      )}

      <div className="flex gap-2 ml-4">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded ${
            canUndo
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400"
          }`}
          title="Undo"
        >
          ⎌
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded ${
            canRedo
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400"
          }`}
          title="Redo"
        >
          ⎌
        </button>
      </div>
      {/* // Add to your Toolbar component */}
      <button
        // onClick={async () => {
        //   if (!pdfFile) {
        //     toast.error("No document to export");
        //     return;
        //   }

        //   const arrayBuffer = await pdfFile.arrayBuffer();
        //   const blob = await exportPdfWithAnnotations(arrayBuffer, annotations);

        //   // Create download link
        //   const url = URL.createObjectURL(blob);
        //   const a = document.createElement("a");
        //   a.href = url;
        //   a.download = `annotated_${pdfFile.name}`;
        //   document.body.appendChild(a);
        //   a.click();
        //   document.body.removeChild(a);
        //   URL.revokeObjectURL(url);

        //   toast.success("Document exported successfully");
        // }}
        onClick={handleExport}
        className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export PDF
      </button>
    </div>
  );
}
