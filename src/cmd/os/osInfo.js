import os from 'node:os';
import { table } from '../../utils/table.js';

// Operating system info (prints following information in console)
export const osInfo = async (...params) => {
  const numProps = params.length;
  for (let i = 0; i < numProps; i++) {
    const prop = params[i];
    const key = Object.keys(prop)[0].toLowerCase();
    switch (key) {
      case 'eol': // Get EOL (default system End-Of-Line)
        console.log('Default system EOL(End-Of-Line):', JSON.stringify(os.EOL));
        break;

      case 'cpus': // Get host machine CPUs info
      case 'cpu':
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

      default:
        console.error('Unknown option');
    }
  }
};