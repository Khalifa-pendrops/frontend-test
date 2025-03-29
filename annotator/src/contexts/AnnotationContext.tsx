"use client";

import { createContext, useContext, useState } from "react";
import { Annotation } from "@/lib/types";

type AnnotationContextType = {
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, "id" | "createdAt">) => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
};

const AnnotationContext = createContext<AnnotationContextType | undefined>(
  undefined
);

export function AnnotationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = (annotation: Omit<Annotation, "id" | "createdAt">) => {
    const newAnnotation = {
      ...annotation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
    );
  };

  return (
    <AnnotationContext.Provider
      value={{ annotations, addAnnotation, removeAnnotation, updateAnnotation }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotations() {
  const context = useContext(AnnotationContext);
  if (context === undefined) {
    throw new Error("useAnnotations must be used within an AnnotationProvider");
  }
  return context;
}
