"use client";

export default function AnnotationCreationMenu({
  onHighlight,
  onUnderline,
  onCancel,
}: {
  onHighlight: () => void;
  onUnderline: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute bg-white shadow-lg rounded-md p-2 flex gap-2 z-10">
      <button
        onClick={onHighlight}
        className="p-2 bg-yellow-200 rounded hover:bg-yellow-300"
        title="Highlight"
      >
        🖍
      </button>
      <button
        onClick={onUnderline}
        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
        title="Underline"
      >
        U̲
      </button>
      <button
        onClick={onCancel}
        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
        title="Cancel"
      >
        ✕
      </button>
    </div>
  );
}
