import path from 'node:path';

export function cd (newpath) {
  try {
    process.chdir(path.resolve(process.cwd(), newpath));
  } catch(err) {
    console.error('[Error] Operation failed:', err.message)
  }
};
