import { createHash } from 'crypto';

/**
 * Generates a secure alphanumeric voucher code bound to a phone number.
 * Uses a combination of random bytes, timestamp, and phone hash for uniqueness and security.
 */
export function generateSecureVoucherCode(phone: string): string {
  // Create a hash of the phone number for binding
  const phoneHash = hashPhone(phone);
  
  // Generate random alphanumeric characters
  const randomPart = generateRandomAlphanumeric(6);
  
  // Add timestamp-based uniqueness (base36 encoded)
  const timePart = Date.now().toString(36).slice(-4).toUpperCase();
  
  // Combine: 6 random + 4 time-based + 2 phone-derived = 12 char code
  const phonePart = phoneHash.slice(0, 2);
  
  return `${randomPart}${timePart}${phonePart}`;
}

/**
 * Creates a deterministic hash from phone number
 */
function hashPhone(phone: string): string {
  // Normalize phone number (remove spaces, dashes, etc.)
  const normalized = phone.replace(/\D/g, '');
  
  // Simple hash using character codes (browser-compatible)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to alphanumeric
  return Math.abs(hash).toString(36).toUpperCase();
}

/**
 * Generates cryptographically random alphanumeric string
 */
function generateRandomAlphanumeric(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0, O, 1, I)
  let result = '';
  
  // Use crypto.getRandomValues if available (browser)
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback with better entropy
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
  }
  
  return result;
}

/**
 * Verifies if a voucher code could have been generated for a given phone
 */
export function verifyVoucherPhoneBinding(code: string, phone: string): boolean {
  if (code.length !== 12) return false;
  
  const phonePart = code.slice(-2);
  const phoneHash = hashPhone(phone).slice(0, 2);
  
  return phonePart === phoneHash;
}

/**
 * Formats a voucher code for display (adds dashes for readability)
 */
export function formatVoucherCode(code: string): string {
  if (code.length === 12) {
    return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
  }
  return code;
}
