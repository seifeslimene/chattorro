import crypto from "crypto";

const SALT_LEN = 16;
const KEY_LEN = 64;

export function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LEN);
  const hash = crypto.scryptSync(password, salt, KEY_LEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string" || !stored.includes(":")) {
    return false;
  }
  const colon = stored.indexOf(":");
  const saltHex = stored.slice(0, colon);
  const hashHex = stored.slice(colon + 1);
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const hash = Buffer.from(hashHex, "hex");
  const verifyHash = crypto.scryptSync(password, salt, KEY_LEN);
  if (verifyHash.length !== hash.length) return false;
  return crypto.timingSafeEqual(hash, verifyHash);
}
