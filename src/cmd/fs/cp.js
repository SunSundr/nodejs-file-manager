import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { spinner } from '../../utils/spinner.js';

/**
 * Copies a file or directory to a new location.
 * 
 * @param {string} path - The path to the source file or directory.
 * @param {string} newPath - The path to the destination directory.
 * @returns {Promise<void>}
 */
export const cp = async (oldPath, newPath) => {
  const srcPath = path.resolve(process.cwd(), String(oldPath));
  const destPath = path.resolve(process.cwd(), String(newPath));
  const stopProgress = spinner();
  try {   
    const writePath = path.resolve(destPath, path.basename(srcPath));
    const stats = await fs.stat(srcPath);
    if (stats.isDirectory()) {
      await fs.cp(srcPath, writePath, { recursive: true, errorOnExist: true });
      stopProgress();
      console.log(`Directory "${srcPath}" has been copied to "${writePath}"`);
    } else {
      try {
        await fs.access(writePath);
        stopProgress();
        console.error(`[Error] File "${writePath}" already exists`);
        return;
      } catch (err) {
        // nothing
      }

      await new Promise((resolve, reject) => {
        const file = createReadStream(srcPath);
        const copy = createWriteStream(writePath, { flags: 'wx' });

        file.pipe(copy);

        file.on('error', reject);
        file.on('end', resolve);
        copy.on('error', reject);
      });
      stopProgress();
      console.log(`File "${srcPath}" has been copied to "${writePath}"`);
    }
  } catch (err) {
    stopProgress();
    if (err.code === 'ENOENT' && oldPath === '--help') {
      console.log(`
      Usage: cp(oldPath, newPath)
      - oldPath: The path to the source file or directory.
      - newPath: The path to the destination directory.
      `);
    } else {
      console.error(`[Error] Operation failed:`, err.message);
    }
  }
};
