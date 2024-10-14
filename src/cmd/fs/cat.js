import fs from 'node:fs';
import path from 'node:path';
import { fileExist } from '../../utils/fileExist.js';

/**
 * Reads and prints the content of a file.
 * 
 * @param {string} param - The path to the file or '--help' to display help information.
 * @returns {Promise<void>}
 */
export async function cat(param, rl) {
  const filePath = path.resolve(process.cwd(), String(param));
  const isExist = await fileExist(filePath);
  if (param === 'help') {
    if (!isExist) {
      console.log(`
      Usage: cat(filePath)
      - filePath: The path to the file you want to read.
      `);
      return;
    }
  }
  if (!isExist) {
    console.error(`[Error] File "${filePath}" does not exist.`);
    return;
  }
  let isStopped = false;
  rl.removeAllListeners('SIGINT');
  rl.on('SIGINT', () => {
    isStopped = true;
  });
  try {
    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

      stream.on('open', () => {
        process.stdout.write(`Reading the file "${path.basename(filePath)}"... | content:\n`);
      });
    
      stream.on('data', (chunk) => {
        if (isStopped) {
          stream.destroy();
          process.stdout.write('...\n[Stopped]\n');
          resolve();
        } else {
          process.stdout.write(chunk.toString());
        }
      });

      stream.on('end', () => {
        process.stdout.write('\n');
        resolve();
      });

      stream.on('error', reject);
    });
  } catch (err) {
    process.stderr.write(`[Error] Reading file "${path.basename(filePath)}":\n${err.message}\n`);
  } finally {
    rl.removeAllListeners('SIGINT');
  }
};
