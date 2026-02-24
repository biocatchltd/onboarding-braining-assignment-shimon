/** UUID v4 regex (RFC 4122) */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Checks if a string is a valid UUID.
 * @param value - String to validate
 * @returns true if valid UUID
 */
export const isValidUuid = (value: string): boolean =>
  UUID_REGEX.test(value.trim());

/**
 * Validates multi-user ID (must be non-empty UUID).
 * @param value - Input value
 * @returns Error message or null if valid
 */
export const validateMultiUserId = (value: string): string | null => {
  if (!value.trim()) return 'Multi user ID is required';
  if (!isValidUuid(value.trim()))
    return 'Must be a valid UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)';
  return null;
};

/**
 * Validates transfer USD amount.
 * @param value - Input value
 * @param required - Whether the field is required (true for create, false for edit)
 * @returns Error message or null if valid
 */
export const validateTransferUsd = (
  value: string,
  required = true
): string | null => {
  if (!value.trim()) return required ? 'Transfer USD is required' : null;
  const numericValue = parseFloat(value);
  if (Number.isNaN(numericValue)) return 'Must be a valid number';
  if (numericValue <= 0) return 'Must be greater than 0';
  return null;
};
