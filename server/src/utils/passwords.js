import { promisify } from "util";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";

const scryptAsync = promisify(scrypt);

// create a salted hash of the user’s password
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return salt + ':' + derivedKey.toString('hex');
}

// extracts the salt and verifies that the submitted password’s hash matches the saved password’s hash
export async function verifyPassword(password, hash) {
  const [salt, key] = hash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  // use timingSafeEqual to help protect against timing attacks when comparing the two hashes
  return timingSafeEqual(keyBuffer, derivedKey);
}
