import path from 'node:path';
import { styleText } from 'node:util';

/**
 * Changes the current working directory to the specified path.
 *
 * @param {string} newpath - The path to change the current working directory to.
 * @returns {void}
 * @description Prints an error message to stderr if the operation fails.
 */
export function cd(newpath) {
  try {
    process.chdir(path.resolve(process.cwd(), newpath));
    console.log();
  } catch (err) {
    console.error(styleText('red', '[Error] Operation failed:'), err.message, '\n');
  }
}
