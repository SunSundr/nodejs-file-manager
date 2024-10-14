import os from 'node:os';
import { styleText } from 'node:util';
import { table } from '../../utils/table.js';

/**
 * Prints operating system information to the console based on provided parameters.
 *
 * @param {...Object} params - The parameters specifying the information to retrieve.
 * @returns {Promise<void>}
 */
export const osInfo = async (...params) => {
  const numProps = params.length;
  for (let i = 0; i < numProps; i++) {
    const prop = params[i];
    const keys = Object.keys(prop);
    const key = keys.length ? keys[0].toLowerCase() : '';
    switch (key) {
      case 'eol': // Get EOL (default system End-Of-Line)
        console.log(
          styleText('yellow', 'Default system EOL(End-Of-Line):'),
          styleText('green', JSON.stringify(os.EOL)),
          '\n'
        );
        break;

      case 'cpus': // Get host machine CPUs info
        {
          const transformedData = os.cpus().map((cpu, index) => ({
            Index: index + 1,
            Model: cpu.model,
            Speed: `${cpu.speed} GHz`,
          }));
          console.log(table(transformedData), '\n');
        }
        break;

      case 'homedir': // Get home directory
      case 'h':
        console.log(
          styleText('yellow', 'Home directory path:'),
          styleText('green', os.homedir()),
          '\n'
        );
        break;

      case 'username': // Get current system user name
        console.log(
          styleText('yellow', 'System user name:'),
          styleText('green', os.userInfo().username),
          '\n'
        );
        break;

      case 'architecture': // Get CPU architecture for which Node.js binary has compiled
      case 'arch':
        {
          const processArch = process.arch;
          const osArch = os.arch();

          if (processArch === osArch) {
            console.log(
              styleText('yellow', 'CPU architecture:'),
              styleText('green', `${processArch}\n`)
            );
          } else {
            console.log(
              styleText('yellow', 'Node.js binary architecture:'),
              styleText('green', `${processArch}\n`)
            );
            console.log(
              styleText('yellow', 'Operating system architecture:'),
              styleText('green', `${osArch}\n`)
            );
          }
        }
        break;

      case '':
      case 'platform':
        console.log(
          styleText('yellow', 'Operating system platform:'),
          styleText('green', os.platform()),
          '\n'
        );
        break;

      case 'help':
        console.log(
          styleText('green', 'Usage: ') +
            styleText('yellow', 'os option\n') +
            styleText(
              'magenta',
              '- option: The information you want to retrieve. Available options are:\n'
            ) +
            styleText(
              'cyan',
              "'--eol': Get the default system End-Of-Line\n" +
                "'--cpus': Get information about the host machine's CPUs\n" +
                "'--homedir' or '-h': Get the home directory path\n" +
                "'--username': Get the current system user name\n" +
                "'--architecture' or '--arch': Get the CPU architecture for which Node.js binary has been compiled\n" +
                "'--platform' or '--' (default return): Get the operating system platform\n" +
                "'--help': Display this help message\n"
            )
        );
        break;

      default:
        console.error(styleText('red', '[Error] Unknown option:'), key, '\n');
    }
  }
};
