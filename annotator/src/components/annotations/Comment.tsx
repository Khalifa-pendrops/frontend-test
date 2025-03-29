"use client";

import { useState } from "react";

export default function Comment({
  annotation,
  onUpdate,
  onDelete,
}: {
  annotation: CommentAnnotation;
  onUpdate: (text: string) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(!annotation.text);
  const [text, setText] = useState(annotation.text);

  return (
    <div
      className="absolute bg-yellow-100 p-2 rounded shadow-sm border border-yellow-300"
      style={{
        left: `${annotation.position.x * 100}%`,
        top: `${annotation.position.y * 100}%`,
      }}
    >
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-1 mb-2"
          />
          <div className="flex justify-between">
            <button
              onClick={() => {
                onUpdate(text || "");
                setIsEditing(false);
              }}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={onDelete}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2">{text}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-gray-200 px-2 py-1 rounded"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
