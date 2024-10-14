import fs from 'node:fs/promises';
import path from 'node:path';
import { styleText } from 'node:util';

/**
 * Deletes a file at the specified path.
 *
 * @param {string} fPath - The path to the file to delete or '--help' to display help information.
 * @param {boolean} [silent=false] - No output to console.
 * @returns {Promise<void>}
 */
export async function rm(fPath, silent = false) {
  try {
    const fullPath = path.resolve(process.cwd(), fPath);
    await fs.rm(fullPath);
    if (!silent) console.log(`"${path.basename(fullPath)}" - has been deleted\n`);
  } catch (err) {
    if (err.code === 'ENOENT' && fPath === '--help') {
      console.log(
        styleText('green', 'Usage: ') +
          styleText('yellow', 'rm|del|delete|remove filePath\n') +
          styleText('cyan', '- filePath: The path to the file you want to delete\n')
      );
    } else {
      console.error(`[Error] Operation failed:`, err.message, '\n');
    }
  }
}
