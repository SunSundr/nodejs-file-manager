import { cp } from "./cp.js";
import { rm } from "./rm.js";
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
    console.log(`
    Usage: mv(oldPath, newPath)
    - oldPath: The path to the source file or directory.
    - newPath: The path to the destination directory.
    `);
  } else {
    await cp(oldPath, newPath);
    const isExist = await fileExist(newPath);
    if (isExist) await rm(oldPath);
  }
}
