import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Deletes a file at the specified path.
 * 
 * @param {string} fPath - The path to the file to delete or '--help' to display help information.
 * @returns {Promise<void>}
 */
export async function rm(fPath) {
  try {
    const fullPath = path.resolve(process.cwd(), fPath);
    await fs.rm(fullPath);
    console.log(`File "${path.basename(fullPath)}" has been deleted\n`);
  } catch (err) {
    if (err.code === 'ENOENT' && fPath === '--help') {
      console.log(`
      Usage: rm(filePath)
      - filePath: The path to the file you want to delete.
      `);
    } else {
      console.error(`[Error] Operation failed:`, err.message, '\n');
    }
  }
};
