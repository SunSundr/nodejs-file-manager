# File Manager

## Description
This project is a file manager implemented using Node.js. It allows performing basic file and directory operations through a command-line interface (CLI).

The project was completed as part of the [RS School](https://rs.school/) [NodeJS 2024 Q3 course](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/file-manager/assignment.md).

## Features
- Navigation through the file system
- Copying, moving, deleting, and renaming files and directories
- Retrieving system information
- Calculating file hashes
- Compressing and decompressing files

## Technical Requirements
- Use 22.x.x version (22.9.0 or upper) of Node.js.
- No external dependencies

## Usage

1. Clone this repo 

```https://github.com/SunSundr/nodejs-file-manager```
(switch branch to 'develop')

3. Start the program by running:

```npm run start -- --username=your_username```
or run npm-script `start` is defined in `package.json`

4. Type --help to see command list

5. To exit the programm you are to type .exit or press Ctrl+C

## Command list

### Basic operations with files

Read file and print it's content in console (should be done using Readable stream):

```cat path_to_file```

Create empty file in current working directory:

```add new_file_name```

Rename file:

```rn path_to_file new_filename```

Copy file:

```cp path_to_file path_to_new_directory```

Move file:

```mv path_to_file path_to_new_directory```

Delete file:

```rm path_to_file```

### Operating system info (prints following information in console)

Get EOL (default system End-Of-Line) and print it to console

```os --EOL```

Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console

```os --cpus```

Get home directory and print it to console

```os --homedir```

Get current system user name and print it to console

```os --username```

Get CPU architecture for which Node.js binary has compiled and print it to console

```os --architecture```

### Hash calculation
Calculate hash for file and print it into console

```hash path_to_file```

### Compress and decompress operations

Compress file

```compress path_to_file path_to_destination```

Decompress file 

```decompress path_to_file path_to_destination```
