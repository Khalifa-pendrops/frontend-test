"use client";

import { createContext, useContext, useState } from "react";
import { Annotation } from "@/lib/types";

type HistoryState = {
  past: Annotation[][];
  present: Annotation[];
  future: Annotation[][];
};

type AnnotationHistoryContextType = {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  updatePresent: (annotations: Annotation[]) => void;
};

const AnnotationHistoryContext = createContext<
  AnnotationHistoryContextType | undefined
>(undefined);

export function AnnotationHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = () => {
    if (!canUndo) return;

    const [newPresent, ...newPast] = history.past;
    setHistory({
      past: newPast,
      present: newPresent,
      future: [history.present, ...history.future],
    });
    return newPresent;
  };

  const redo = () => {
    if (!canRedo) return;

    const [newPresent, ...newFuture] = history.future;
    setHistory({
      past: [history.present, ...history.past],
      present: newPresent,
      future: newFuture,
    });
    return newPresent;
  };

  const updatePresent = (annotations: Annotation[]) => {
    setHistory({
      past: [history.present, ...history.past.slice(0, 49)], 
      present: annotations,
      future: [],
    });
  };

  return (
    <AnnotationHistoryContext.Provider
      value={{ canUndo, canRedo, undo, redo, updatePresent }}
    >
      {children}
    </AnnotationHistoryContext.Provider>
  );
}

export function useAnnotationHistory() {
  const context = useContext(AnnotationHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useAnnotationHistory must be used within an AnnotationHistoryProvider"
    );
  }
  return context;
}
