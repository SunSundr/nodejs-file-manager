import fs from 'node:fs/promises';
import path from 'node:path';
import { styleText } from 'node:util';

/**
 * Adds a file with the specified name.
 * 
 * @param {string} param - The name of the file to add or '--help' to display help information.
 * @param {object} rl - The readline interface for user input.
 * @returns {Promise<void>}
 */
export async function add(param, rl) {
  const filePath = path.resolve(process.cwd(), String(param));
  if (param === '--help') {
    console.log(
      styleText('green', 'Usage: ') +
      styleText('yellow', 'add|new fileName\n') +
      styleText('cyan', '- fileName: The name of the file you want to create\n')
    );

    const answer = await rl.question('Do you want to create empty file with the name "--help"? (Yes/no): ');
    const stopOperation = /^(no|n)$/i.test(answer.trim());
    if (stopOperation) return;
  }
  try {
    await fs.writeFile(filePath, '', { flag: 'wx' });
    console.log(styleText('green', `File "${filePath}" created successfully`), '\n');
  } catch(err) {
    console.error(styleText('red', '[Error] Opreation failed:\n'), err.message, '\n');
  }
};
