import * as crypto from "crypto";

export class CryptographicEngine {
  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly IV_LENGTH = 12;

  /**
   * Encrypts a plaintext string data structure using secure AES-256-GCM configurations
   */
  public static encrypt(plainText: string, secretKeyHex: string): { encryptedData: string; iv: string; authTag: string } {
    const key = Buffer.from(secretKeyHex, "hex");
    const iv = crypto.randomBytes(this.IV_LENGTH);
    
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag().toString("hex");

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      authTag: authTag
    };
  }

  /**
   * Decrypts ciphertext chunks, verifying data integrity via GCM auth tags
   */
  public static decrypt(encryptedData: string, ivHex: string, authTagHex: string, secretKeyHex: string): string {
    const key = Buffer.from(secretKeyHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  }
}