import crypto from "node:crypto";
import { requiredEnv } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const keyB64 = requiredEnv("ENCRYPTION_KEY");
  const key = Buffer.from(keyB64, "base64");

  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be base64-encoded 32 bytes.");
  }

  return key;
}

export function encryptSecret(secret: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptSecret(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(":");

  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Encrypted secret payload is malformed.");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
