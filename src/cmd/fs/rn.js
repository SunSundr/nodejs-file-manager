import fs from 'node:fs/promises';
import path from 'node:path';
import { fileExist } from '../../utils/fileExist.js';

/**
 * Renames a file from oldName to newName.
 * 
 * @param {string} oldNameOrParam - The current name of the file or '--help' to display help information.
 * @param {string} newName - The new name for the file.
 * @returns {Promise<void>}
 */
export const rn = async (oldNameOrParam, newName) => {
  let isExist;
  const oldFile = path.resolve(process.cwd(), String(oldNameOrParam));
  isExist = await fileExist(oldFile);
  if (!isExist) {
    if (oldNameOrParam === '--help') {
      console.log(`
      Usage: rn(oldName, newName)
      - oldName: The current name of the file you want to rename.
      - newName: The new name for the file.
      `);
    } else {
      console.error(`[Error] File "${oldNameOrParam}" does not exist\n`);
    }
    return;
  }
  const newFile = path.resolve(process.cwd(), String(newName));
  isExist = await fileExist(newFile);
  if (isExist) {
    console.error(`[Error] File "${newName}" already exists\n`);
    return;
  }
  try {
    await fs.rename(oldFile, newFile);
    console.log(
      `File "${path.basename(oldFile)}" has been renamed to "${path.basename(newFile)}"\n`
    );
  } catch(err) {
    console.error(`[Error] Operation failed:`, err.message, '\n');
  }
};