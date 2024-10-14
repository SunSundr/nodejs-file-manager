import os from 'node:os';
import { table } from '../../utils/table.js';

// Operating system info (prints following information in console)
export const osInfo = async (...params) => {
  const numProps = params.length;
  for (let i = 0; i < numProps; i++) {
    const prop = params[i];
    const keys = Object.keys(prop);
    const key = keys.length ? keys[0].toLowerCase() : '';
    switch (key) {
      case 'eol': // Get EOL (default system End-Of-Line)
        console.log('Default system EOL(End-Of-Line):', JSON.stringify(os.EOL));
        break;

      case 'cpus': // Get host machine CPUs info
        {
          const transformedData = os.cpus().map((cpu, index) => ({
            Index: index + 1,
            Model: cpu.model,
            Speed: `${cpu.speed} GHz`
          }));
          console.log(table(transformedData));
        }
        break;

      case 'homedir': // Get home directory
      case 'h':
        console.log('Home directory path:', os.homedir());
        break;

      case 'username': // Get current system user name
        console.log('System user name:', os.userInfo().username);
        break;
    
      case 'architecture': // Get CPU architecture for which Node.js binary has compiled
      case 'arch':
        {
          const processArch = process.arch;
          const osArch = os.arch();

          if (processArch === osArch) {
            console.log(`CPU architecture: ${processArch}`);
          } else {
            console.log(`Node.js binary architecture: ${processArch}`);
            console.log(`Operating system architecture: ${osArch}`);
          }
        }
        break;

      case '':
      case 'platform':
        console.log('Operating system platform:', os.platform());
        break;

      case 'help':
        console.log(`
        Usage: os (option)
        - option: The information you want to retrieve. Available options are:
        '--eol': Get the default system End-Of-Line.
        '--cpus': Get information about the host machine's CPUs.
        '--homedir' or '-h': Get the home directory path.
        '--username': Get the current system user name.
        '--architecture' or '--arch': Get the CPU architecture for which Node.js binary has been compiled.
        '--platform' or '--' (default return): Get the operating system platform.
        '--help': Display this help message.
        `);
        break;

      default:
        console.error('[Error] Unknown option');
    }
  }
};