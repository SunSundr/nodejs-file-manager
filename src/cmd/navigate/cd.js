import path from 'node:path';

export function cd(newpath) {
  try {
    process.chdir(path.resolve(process.cwd(), newpath));
    console.log();
  } catch (err) {
    console.error('[Error] Operation failed:', err.message);
  }
}
