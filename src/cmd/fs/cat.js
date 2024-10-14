import fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { fileExist } from '../../utils/fileExist.js';

/**
 * Reads and prints the content of a file.
 *
 * @param {string} param - The path to the file or '--help' to display help information.
 * @returns {Promise<void>}
 */
export async function cat(param, rl) {
  if (!param) {
    console.error(styleText('red', `[Error] Opreation failed: `), 'Invalid input');
    return;
  }
  const filePath = path.resolve(process.cwd(), String(param));
  const isExist = await fileExist(filePath);
  const helpParams = ['help', '-help', '--help'];
  if (helpParams.includes(param)) {
    if (!isExist) {
      console.log(
        styleText('green', 'Usage: ') +
          styleText('yellow', 'cat|read filePath\n') +
          styleText('cyan', '- filePath: The path to the file you want to read\n')
      );
      return;
    }
  }
  if (!isExist) {
    console.error(styleText('red', `[Error] Opreation failed: `), `File "${filePath}" does not exist.\n`);
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
        process.stdout.write(
          styleText('green', `Reading the file "${path.basename(filePath)}"... \nContent:\n\n`)
        );
      });

      stream.on('data', (chunk) => {
        if (isStopped) {
          stream.destroy();
          process.stdout.write('...\n' + styleText('red', '[Stopped]') + '\n');
          resolve();
        } else {
          process.stdout.write(styleText('cyan', chunk.toString()));
        }
      });

      stream.on('end', () => {
        process.stdout.write('\n\n');
        resolve();
      });

      stream.on('error', reject);
    });
  } catch (err) {
    process.stderr.write(
      styleText('red', `[Error] Reading file "${path.basename(filePath)}":`) + `\n${err.message}\n`
    );
  } finally {
    rl.removeAllListeners('SIGINT');
  }
}
