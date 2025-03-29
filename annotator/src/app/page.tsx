"use client";

import PDFViewer from "../components/document/PDFViewer";
import Toolbar from "@/components/ui/Toolbar";
import FileUpload from "@/components/ui/FileUpload";
import { useState } from "react";
import { AnnotationType } from "@/lib/types";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null);

  return (
    <main className="flex flex-col h-screen">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onFileUpload={setPdfFile}
        annotations={annotations}
        pdfFile={pdfFile}
      />
      <div className="flex flex-1 overflow-hidden">
        {!pdfFile ? (
          <div className="flex items-center justify-center h-full w-full p-4">
            <FileUpload onFileAccepted={setPdfFile} />
          </div>
        ) : (
          <PDFViewer
            file={pdfFile}
            annotations={annotations}
            onAnnotationsChange={setAnnotations}
            activeTool={activeTool}
          />
        )}
      </div>
    </main>
  );
}
