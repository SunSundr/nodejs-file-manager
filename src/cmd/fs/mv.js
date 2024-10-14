import { styleText } from 'node:util';
import path from 'node:path';
import { cp } from './cp.js';
import { rm } from './rm.js';
import { fileExist } from '../../utils/fileExist.js';

/**
 * Moves a file or directory from oldPath to newPath.
 *
 * @param {string} oldPath - The path to the source file or directory.
 * @param {string} newPath - The path to the destination directory or '--help' to display help information.
 * @returns {Promise<void>}
 */
export async function mv(oldPath, newPath) {
  if (!newPath && oldPath === '--help') {
    console.log(
      styleText('green', 'Usage: ') +
        styleText('yellow', 'mv|move oldPath newPath\n') +
        styleText('cyan', '- oldPath: The path to the source file or directory\n') +
        styleText('cyan', '- newPath: The path to the destination directory\n')
    );
  } else {
    await cp(oldPath, newPath, true);
    const isExist = await fileExist(newPath);
    if (isExist) {
      await rm(oldPath, true);
      console.log(
        styleText(
          'green',
          `"${path.basename(oldPath)}" - has been moved to "${path.dirname(newPath)}"`
        ),
        '\n'
      );
    }
  }
}
