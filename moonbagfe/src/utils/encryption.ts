// Note: In a production environment, use a more secure encryption method
// and potentially consider using a secure enclave or HSM

// const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || "your-encryption-key";

export function encryptPrivateKey(privateKey: string): string {
  // This is a simplified example. In production, use proper encryption
  return btoa(privateKey); // Base64 encoding for example purposes
}

export function decryptPrivateKey(encryptedKey: string): string {
  // This is a simplified example. In production, use proper decryption
  return atob(encryptedKey); // Base64 decoding for example purposes
}
