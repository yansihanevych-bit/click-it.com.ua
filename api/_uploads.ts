/**
 * Shared rules for optional attachments in the contact form (used by the form UI and the API).
 * Files starting with "_" inside /api are not deployed as functions.
 */
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_FILES = 5;

/** Allowed extensions → content type sent to Vercel Blob (explicit, so the server can allowlist it). */
export const FILE_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
  txt: 'text/plain',
  pages: 'application/vnd.apple.pages',
  key: 'application/vnd.apple.keynote',
  numbers: 'application/vnd.apple.numbers',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  csv: 'text/csv',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  psd: 'image/vnd.adobe.photoshop',
  ai: 'application/postscript',
  fig: 'application/octet-stream',
};

export const fileExt = (name: string) => (name.split('.').pop() || '').toLowerCase();

export const BUDGETS = ['500-1000', '1500-2000', '2500-5000', '5000+'] as const;
export type Budget = (typeof BUDGETS)[number];
export const BUDGET_LABELS: Record<Budget, string> = {
  '500-1000': '500 – 1000 USD',
  '1500-2000': '1500 – 2000 USD',
  '2500-5000': '2500 – 5000 USD',
  '5000+': '5000+ USD',
};

/** Public Vercel Blob URLs only (the form never sends anything else). */
export const BLOB_URL_RE = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>]+$/i;
