export type AnnotationType =
  | "highlight"
  | "underline"
  | "comment"
  | "signature";

// export interface Annotation {
//   id: string;
//   type: AnnotationType;
//   page: number;
//   createdAt: string;
// }

// src/lib/types.ts
export interface CommentAnnotation extends BaseAnnotation {
  type: 'comment';
  position: { x: number; y: number };
  text: string;
  resolved?: boolean;
}

export interface BaseAnnotation {
  id: string;
  type: AnnotationType | "highlight" | "underline" | "comment" | "signature";
  page: number;
  createdAt: string;
}

export interface HighlightAnnotation extends BaseAnnotation {
  type: "highlight";
  content: string;
  rects: Array<{ x: number; y: number; width: number; height: number }>;
  color: string;
}

export interface UnderlineAnnotation extends BaseAnnotation {
  type: "underline";
  content: string;
  rects: Array<{ x: number; y: number; width: number; height: number }>;
  color: string;
}

export interface CommentAnnotation extends BaseAnnotation {
  type: "comment";
  content: string;
  position: { x: number; y: number };
  text: string;
}

export interface SignatureAnnotation extends BaseAnnotation {
  type: "signature";
  position: { x: number; y: number };
  imageData: string;
  width: number;
  height: number;
}

export type Annotation =
  | HighlightAnnotation
  | UnderlineAnnotation
  | CommentAnnotation
  | SignatureAnnotation;
