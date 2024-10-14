import crypto from 'crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spinner } from '../../utils/spinner.js';

/**
 * Calculates the hash of a file using the specified algorithm.
 * 
 * @param {string} fPath - The path to the file.
 * @param {string} [param] - The hashing algorithm to use (default is 'sha256'). If 'help', displays help information.
 * @returns {Promise<void>}
 */
export async function hash(fPath, param = undefined) {
  if (param === 'help') {
    console.log(`
      Usage: hash(filePath, algorithm)
      - filePath: The path to the file you want to hash.
      - algorithm: (Optional) The hashing algorithm to use (e.g., 'sha256', 'md5'). Default is 'sha256'.
    `);
    return;
  }
  if (!fPath) {
    console.error('[Error] Operation failed: Specify the path to the file or use --help');
    return;
  }
  const algorithm = param.toUpperCase() || 'SHA256';
  const filePath = path.resolve(process.cwd(), fPath);
  try {
    const hash = crypto.createHash(algorithm.toLowerCase());
    const stream = fs.createReadStream(filePath);
    const stopProgress = spinner();

    stream.on('data', (chunk) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      const result = hash.digest('hex');
      stopProgress();
      console.log(`${algorithm} hash for file "${path.basename(filePath)}":`);
      console.log(result, '\n');
    });

    stream.on('error', (err) => {
      console.error(`[Error] Calculation ${algorithm} hash for file "${path.basename(filePath)}" failed:\n`, err.message,'\n');
    });
  } catch(err) {
    console.error(`[Error] Operation failed:`, err.message);
  }
};