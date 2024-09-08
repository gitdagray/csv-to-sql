import * as fs from "node:fs/promises";

export async function createDirectoryIfNotExists(dir: string) {
  try {
    await fs.access(dir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dir, { recursive: true });
  }
}