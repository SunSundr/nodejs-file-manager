import { createReadStream, createWriteStream, unlink } from 'node:fs';
import { createBrotliDecompress, createBrotliCompress } from 'node:zlib';
import path from 'node:path';
import { styleText } from 'node:util';

/**
 * Compresses or decompresses a file using Brotli algorithm.
 * 
 * @param {string} fPath - The path to the source file.
 * @param {string} newPath - The path to the destination directory.
 * @param {string} [ext='br'] - The extension to use for the compressed file.
 * @param {string} [operationType='compress'] - The operation type: 'compress' or 'decompress'.
 * @returns {Promise<void>}
 */
export async function brotli(fPath, newPath, ext = 'br', operationType = 'compress') {
  const isCompress = operationType === 'compress';
  if (!newPath && fPath === '--help') {
    if (isCompress) {
      console.log(
        styleText('green', 'Usage: ') +
        styleText('yellow', 'compress fPath newPath ext = "br"\n') +
        styleText('cyan', '- fPath: The path to the source file\n') +
        styleText('cyan', '- newPath: The path to the destination directory\n') +
        styleText('cyan', '- ext: (Optional) The extension to use for the compressed file. Default is "br"\n')
      );
    } else {
      console.log(
        styleText('green', 'Usage: ') +
        styleText('yellow', 'decompress fPath newPath\n') +
        styleText('cyan', '- fPath: The path to the source file\n') +
        styleText('cyan', '- newPath: The path to the destination directory\n')
      );
    }
    return;
  }
  const srcPath = path.resolve(process.cwd(), String(fPath));
  const origfName = path.basename(srcPath);
  const newFileName = isCompress ? `${origfName}.${ext}` : path.parse(origfName).name;
  const destPath = path.resolve(path.resolve(process.cwd(), String(newPath)), newFileName);

  try {
    await new Promise((resolve, reject) => {
      const rfile = createReadStream(srcPath);
      const brFile = createWriteStream(destPath, { flags: 'wx' });
      const brotliFunc = isCompress ? createBrotliCompress() : createBrotliDecompress();
      const errorHand = (err) => {
        try {
          brFile.destroy();
          if (!isCompress) unlink(destPath, () => {});
        } finally {
          reject(err);
        }
      }

      rfile.pipe(brotliFunc).pipe(brFile);

      brotliFunc.on('error', errorHand);
      brFile.on('error', errorHand);
      rfile.on('error', errorHand);
      rfile.on('end', resolve);
    });
    console.log(styleText('green', `File "${srcPath}" has been ${operationType}ed to "${destPath}"`), '\n');
  } catch (err) {
    console.error(styleText('red', '[Error] Operation failed:'), err ? err.message : 'unknown error', '\n');
  }
};
