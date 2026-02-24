import { describe, it, expect } from 'vitest';
import {
  isValidUuid,
  validateMultiUserId,
  validateTransferUsd,
} from './validation';

describe('isValidUuid', () => {
  it('returns true for valid UUID v4', () => {
    expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(isValidUuid('a1b2c3d4-e5f6-4178-9abc-def012345678')).toBe(true);
  });

  it('returns false for invalid UUID', () => {
    expect(isValidUuid('')).toBe(false);
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid('550e8400-e29b-41d4-a716')).toBe(false);
    expect(isValidUuid('550e8400-e29b-61d4-a716-446655440000')).toBe(false); // invalid version
  });

  it('trims whitespace', () => {
    expect(isValidUuid('  550e8400-e29b-41d4-a716-446655440000  ')).toBe(true);
  });
});

describe('validateMultiUserId', () => {
  it('returns null for valid UUID', () => {
    expect(validateMultiUserId('550e8400-e29b-41d4-a716-446655440000')).toBeNull();
  });

  it('returns error for empty string', () => {
    expect(validateMultiUserId('')).toBe('Multi user ID is required');
    expect(validateMultiUserId('   ')).toBe('Multi user ID is required');
  });

  it('returns error for invalid UUID', () => {
    expect(validateMultiUserId('invalid')).toContain('valid UUID');
  });
});

describe('validateTransferUsd', () => {
  it('returns null for valid positive number when required', () => {
    expect(validateTransferUsd('100')).toBeNull();
    expect(validateTransferUsd('99.99')).toBeNull();
    expect(validateTransferUsd('0.01')).toBeNull();
  });

  it('returns error for empty when required', () => {
    expect(validateTransferUsd('', true)).toBe('Transfer USD is required');
    expect(validateTransferUsd('   ', true)).toBe('Transfer USD is required');
  });

  it('returns null for empty when not required', () => {
    expect(validateTransferUsd('', false)).toBeNull();
  });

  it('returns error for invalid number', () => {
    expect(validateTransferUsd('abc')).toBe('Must be a valid number');
  });

  it('returns error for zero or negative', () => {
    expect(validateTransferUsd('0')).toBe('Must be greater than 0');
    expect(validateTransferUsd('-10')).toBe('Must be greater than 0');
  });
});
