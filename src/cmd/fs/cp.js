import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { spinner } from '../../utils/spinner.js';

/**
 * Copies a file or directory to a new location.
 *
 * @param {string} path - The path to the source file or directory.
 * @param {string} newPath - The path to the destination directory.
 * @param {boolean} [silent=false] - No output to console.
 * @returns {Promise<void>}
 */
export async function cp(oldPath, newPath, silent = false) {
  const srcPath = path.resolve(process.cwd(), String(oldPath));
  const destPath = path.resolve(process.cwd(), String(newPath));
  const stopProgress = spinner();
  try {
    const writePath = path.resolve(destPath, path.basename(srcPath));
    const stats = await fs.stat(srcPath);
    if (stats.isDirectory()) {
      await fs.cp(srcPath, writePath, { recursive: true, errorOnExist: true });
      stopProgress();
      if (!silent)
        console.log(
          styleText('green', `Directory "${srcPath}" has been copied to "${writePath}"`),
          '\n'
        );
    } else {
      try {
        await fs.access(writePath);
        stopProgress();
        console.error(styleText('red', `[Error] File "${writePath}" already exists`), '\n');
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
      if (!silent)
        console.log(
          styleText('green', `File "${srcPath}" has been copied to "${writePath}"`),
          '\n'
        );
    }
  } catch (err) {
    stopProgress();
    if (err.code === 'ENOENT' && oldPath === '--help') {
      console.log(
        styleText('green', 'Usage: ') +
          styleText('yellow', 'cp|copy oldPath newPath\n') +
          styleText('cyan', '- oldPath: The path to the source file or directory\n') +
          styleText('cyan', '- newPath: The path to the destination directory\n')
      );
    } else {
      console.error(styleText('red', `[Error] Operation failed:`), err.message, '\n');
    }
  }
}
