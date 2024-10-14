import { styleText } from 'node:util';

export function help() {
  const styleCmd = 'yellow';
  const styleArg = 'cyan';
  console.log(`
  ${styleText('green', 'FILE MANAGER COMMAND LIST')}
  ${styleText('gray', '---------------------------------------------------')}
  ${styleText(styleCmd, 'up')} - Go upper from current directory
  ${styleText(styleCmd, 'cd')} - Go to dedicated folder from current directory
  ${styleText(styleCmd, 'ls')} - Print in console list of all files and folders in current directory

  ${styleText(styleCmd, 'cat')} ${styleText(styleArg, 'path_to_file')} - Read file and print its content in console
  ${styleText(styleCmd, 'add')} ${styleText(styleArg, 'new_file_name')} - Create empty file in current working directory
  ${styleText(styleCmd, 'rn')} ${styleText(styleArg, 'path_to_file')} ${styleText(styleArg, 'new_filename')} - Rename file
  ${styleText(styleCmd, 'cp')} ${styleText(styleArg, 'path_to_file')} ${styleText(styleArg, 'path_to_new_directory')} - Copy file
  ${styleText(styleCmd, 'mv')} ${styleText(styleArg, 'path_to_file')} ${styleText(styleArg, 'path_to_new_directory')} - Move file
  ${styleText(styleCmd, 'rm')} ${styleText(styleArg, 'path_to_file')} - Delete file

  ${styleText(styleCmd, 'os')} ${styleText(styleArg, '--EOL')} - Get EOL (default system End-Of-Line) and print it to console
  ${styleText(styleCmd, 'os')} ${styleText(styleArg, '--cpus')} - Get host machine CPUs info and print it to console
  ${styleText(styleCmd, 'os')} ${styleText(styleArg, '--homedir')} - Get home directory and print it to console
  ${styleText(styleCmd, 'os')} ${styleText(styleArg, '--username')} - Get current system user name and print it to console
  ${styleText(styleCmd, 'os')} ${styleText(styleArg, '--architecture')} - Get CPU architecture for which Node.js binary has compiled and print it to console

  ${styleText(styleCmd, 'hash')} ${styleText(styleArg, 'path_to_file')} - Calculate hash for file and print it into console

  ${styleText(styleCmd, 'compress')} ${styleText(styleArg, 'path_to_file')} ${styleText(styleArg, 'path_to_destination')} - Compress file
  ${styleText(styleCmd, 'decompress')} ${styleText(styleArg, 'path_to_file')} ${styleText(styleArg, 'path_to_destination')} - Decompress file

  ${styleText('gray', '---------------------------------------------------')}
  ${styleText('gray', 'Some commands have additional optional arguments.')}
  ${styleText('gray', 'For more details on a command, type the command name followed by "--help"')}
  `);
};
