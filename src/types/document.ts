export type DocumentType =
  | "PASSPORT"
  | "VISA"
  | "DRIVING_LICENCE"
  | "NATIONAL_ID"
  | "OTHER";

export interface OCRFieldResult {
  field: string;
  value: string;
  confidence: number;
  boundingBox?: [number, number, number, number]; // [x1, y1, x2, y2]
}

export interface MRZParsedResult {
  rawLines: string[];
  documentCode: string;
  issuingState: string;
  documentNumber: string;
  documentNumberCheckDigit: string;
  documentNumberValid: boolean;
  nationality: string;
  dateOfBirth: string; // YYMMDD
  dateOfBirthCheckDigit: string;
  dateOfBirthValid: boolean;
  sex: string;
  expirationDate: string; // YYMMDD
  expirationDateCheckDigit: string;
  expirationDateValid: boolean;
  personalNumber?: string;
  compositeCheckDigit: string;
  compositeValid: boolean;
}

export interface DocumentCapture {
  id: string;
  captureType: "DOCUMENT_FRONT" | "DOCUMENT_BACK" | "LIVE_FACE";
  storageKey: string;
  mimeType: string;
  width: number;
  height: number;
  qualityScore?: number;
  capturedAt: string;
}

export interface DocumentInfo {
  id: string;
  type: DocumentType;
  issuingCountry?: string;
  documentNumber?: string;
  holderFullName?: string;
  dateOfBirth?: string;
  expiryDate?: string;
  nationality?: string;
  captures?: DocumentCapture[];
  ocrResults?: Record<string, OCRFieldResult>;
  mrzResults?: MRZParsedResult;
}
