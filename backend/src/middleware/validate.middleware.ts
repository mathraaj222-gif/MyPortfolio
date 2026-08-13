/**
 * URL Validation Utilities
 *
 * Enforces that image/file fields only ever contain proper HTTP(S) URLs.
 * Rejects base64 data URIs (data:...) which bloat the database and
 * cause 413 errors when transmitted over the network.
 */

/**
 * Returns true if the value is a valid http/https URL.
 * Empty strings and null/undefined are allowed (optional fields).
 */
export function isValidUrl(value: unknown): boolean {
  if (!value || value === '') return true; // optional fields are fine
  if (typeof value !== 'string') return false;
  if (value.startsWith('data:')) return false; // reject base64 data URIs
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns true if every item in an array is a valid URL.
 * An empty array is valid.
 */
export function isValidUrlArray(values: unknown): boolean {
  if (!Array.isArray(values)) return true; // let other validators handle type errors
  return values.every((v) => isValidUrl(v));
}

/**
 * Builds a consistent 400 validation error response payload.
 */
export function urlValidationError(fieldName: string): { success: false; message: string } {
  return {
    success: false,
    message: `Validation Error: '${fieldName}' must be a valid https:// URL. Base64 data and local file paths are not accepted. Host your file externally (e.g. Imgur, Google Drive, S3) and paste the URL.`,
  };
}
