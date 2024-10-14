import fs from 'node:fs/promises';
import path from 'node:path';
import { styleText } from 'node:util';
import { table } from '../../utils/table.js';

function formatSize(size) {
  if (size < 1024) return `${size} b`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} kb`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} mb`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} gb`;
}

function formatDate(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${mm}/${dd}/${yy} ${hh}:${min}:${ss}`;
}

/**
 * Lists the contents of a directory with various display options.
 *
 * @param {string} [directory='.'] - The directory to list. Defaults to the current directory.
 * @param {...Object} params - Optional parameters to control the display of directory contents.
 * @param {boolean} [params.R] - Recursively list subdirectories.
 * @param {boolean} [params.t] - Sort by modification time, newest first.
 * @param {boolean} [params.u] - Sort by access time, newest first.
 * @param {boolean} [params.c] - Sort by change time, newest first.
 * @param {boolean} [params.r] - Reverse the order of the sort.
 * @param {boolean} [params['full-time']] - Display full time information.
 * @param {boolean} [params.d] - List directories themselves, not their contents.
 * @param {boolean} [params.F] - Append a "/" to directory names and a "*" to executable files.
 * @param {boolean} [params.m] - Fill width with a comma-separated list of entries.
 * @param {boolean} [params['1']] - List one file per line.
 *
 * @returns {Promise<void>} A promise that resolves when the directory contents have been listed.
 */
export async function ls(directory = '.', ...params) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    let tableData = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(directory, file.name));
        return {
          Index: 0,
          Name: file.name.length > 70 ? file.name.slice(0, 67) + '...' : file.name,
          Type: file.isDirectory() ? 'Directory' : 'File',
          Size: file.isDirectory() ? '-' : formatSize(stats.size),
          FullTime: file.isDirectory() ? '-' : formatDate(stats.mtime),
        };
      })
    );

    const defaultSort = () => {
      tableData.sort((a, b) => {
        if (params.some((option) => option.r)) {
          if (a.Type === b.Type) {
            return a.Name.localeCompare(b.Name);
          }
          return a.Type === 'File' ? -1 : 1;
        } else {
          if (a.Type === b.Type) {
            return a.Name.localeCompare(b.Name);
          }
          return a.Type === 'Directory' ? -1 : 1;
        }
      });
    };

    for (const option of params) {
      if (option.R) {
        for (const file of files) {
          if (file.isDirectory()) {
            console.log(styleText('yellow', `\n${path.join(directory, file.name)}:`));
            await ls(path.join(directory, file.name), ...params);
          }
        }
      }

      if (option.d) {
        tableData = tableData.filter((file) => file.Type === 'Directory');
      }

      if (option.t) {
        tableData.sort((a, b) => new Date(b.FullTime) - new Date(a.FullTime));
      } else if (option.u) {
        tableData.sort((a, b) => new Date(b.AccessTime) - new Date(a.AccessTime));
      } else if (option.c) {
        tableData.sort((a, b) => new Date(b.ChangeTime) - new Date(a.ChangeTime));
      } else if (option.r) {
        tableData.reverse();
      } else {
        defaultSort();
      }

      if (option['full-time']) {
        tableData = tableData.map((file) => ({
          ...file,
          FullTime: file.FullTime,
        }));
      }
      if (option.F) {
        tableData = tableData.map((file) => ({
          ...file,
          Name: file.Type === 'Directory' ? `${file.Name}/` : file.Name,
        }));
      }
      if (option.m) {
        console.log(styleText('cyan', tableData.map((file) => file.Name).join(', ')), '\n');
        return;
      }
      if (option['1']) {
        console.log(styleText('cyan', tableData.map((file) => file.Name).join('\n')), '\n');
        return;
      }
    }
    if (!params.length) defaultSort();

    tableData.forEach((data, index) => (data.Index = index + 1));
    console.log(table(tableData));
  } catch (err) {
    console.error('[Error] Directory reading failed:', err.message);
  }
}
