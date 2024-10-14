import { Console } from 'node:console';
import { Transform } from 'node:stream';

// https://stackoverflow.com/questions/49618069/remove-index-from-console-table
export function table(input) {
  const ts = new Transform({ transform(chunk, _enc, cb) { cb(null, chunk) } })
  const logger = new Console({ stdout: ts })
  logger.table(input)
  const table = (ts.read() || '').toString()
  let result = '';
 
  const rows = table.split(/[\r\n]+/);
  rows.forEach((row, index) => {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');

    if (index === 1) {
      r = r.split('│').map(cell => {
        const trimmed = cell.trim();
        const padding = Math.max(0, (cell.length - trimmed.length) / 2);
        return ' '.repeat(Math.floor(padding)) + trimmed + ' '.repeat(Math.ceil(padding));
      }).join('│');
    }

    result += `${r}\n`;
  });

  return result.trim();
}