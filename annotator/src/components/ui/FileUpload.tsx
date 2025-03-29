// src/components/ui/FileUpload.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
}

export default function FileUpload({ onFileAccepted }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }

      setIsLoading(true);
      onFileAccepted(file);
      setIsLoading(false);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
      ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
      ${isLoading ? "opacity-70" : ""}
    `}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <p>Loading PDF...</p>
      ) : (
        <>
          <p className="mb-2">
            {isDragActive
              ? "Drop the PDF here"
              : "Drag & drop a PDF here, or click to select"}
          </p>
          <p className="text-sm text-gray-500">Only PDF files are accepted</p>
        </>
      )}
    </div>
  );
}
