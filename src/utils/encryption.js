const crypto = require("crypto");
const { config } = require("../config/env");

const ENCRYPTION_KEY = config.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

async function encrypt(text) {
  try {
    // Generate salt and initialization vector
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create key using salt
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, "sha512");

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    // Encrypt the text
    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);

    // Get auth tag
    const tag = cipher.getAuthTag();

    // Combine everything into a single buffer
    const result = Buffer.concat([salt, iv, tag, encrypted]);

    return result.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
}

async function decrypt(encryptedText) {
  try {
    // Convert base64 string to buffer
    const encrypted = Buffer.from(encryptedText, "base64");

    // Extract the pieces
    const salt = encrypted.slice(0, SALT_LENGTH);
    const iv = encrypted.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = encrypted.slice(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    );
    const content = encrypted.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    // Recreate key using salt
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, "sha512");

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    // Decrypt the content
    const decrypted = Buffer.concat([
      decipher.update(content),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed");
  }
}

module.exports = {
  encrypt,
  decrypt,
};
