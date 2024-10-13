import os from 'node:os';
import readline from 'node:readline/promises';
import path from 'node:path';
import * as CMD from '../cmd/collection.js'


function getCommand(input) {
  const [cmd, ...args] = input.trim().split(' ');
  return [cmd, args.join(' ')];
}

function parseArgs(str, ...numAndParsers) {
  const args = [];
  let remainingStr = str;

  for (let i = 0; i < numAndParsers.length; i += 2) {
    const numArgs = numAndParsers[i];
    const parser = numAndParsers[i + 1];

    for (let j = 0; j < numArgs; j++) {
      const [parsedArg, rest] = parser(remainingStr);
      if (parsedArg.length) args.push(parsedArg);
      remainingStr = rest.trim();
    }
  }

  const optionalArgs = [];
  while (remainingStr) {
    const [parsedArg, rest] = parseProps(remainingStr);
    optionalArgs.push(parsedArg);
    remainingStr = rest.trim();
  }

  return [...args, ...optionalArgs];
}

function parsePath(str) {
  const doubleQuoteMatch = str.match(/^"([^"]*)"/);
  if (doubleQuoteMatch) {
    return [doubleQuoteMatch[1], str.slice(doubleQuoteMatch[0].length)];
  }

  const singleQuoteMatch = str.match(/^\s'([^']*)'\s/);
  if (singleQuoteMatch) {
    return [singleQuoteMatch[1], str.slice(singleQuoteMatch[0].length)];
  }

  const [arg, ...rest] = str.split(' ');
  return [arg, rest.join(' ')];
}


function parseProps(str, subParse = true) {
  const propMatch = str.match(/^--?(\w+)(?:=(.*))?/);
  if (!propMatch) return [{}, ''];

  const [, key, value] = propMatch;
  const lastStr = str.slice(propMatch[0].length);

  const parsedValue = value ? (subParse ? parsePath(value)[0] : value) : true;
  return [{ [key]: parsedValue }, lastStr];
}


function parseInput(input, rl) {
  const [cmd, str] = getCommand(input);
  let result;

  switch (cmd) {
    case 'copy':
      result = parseArgs(str, 2, parsePath);
      break;
    case 'os':
      result = parseArgs(str, 1, parseProps);
      CMD.osInfo(result);
      break;
    case 'ls':
      result = parseArgs(str, 1, parsePath);
      {
        let dir;
        if (typeof result[0] === 'string') {
          dir = result[0];
          result.shift();
        } else {
          dir = path.resolve(process.cwd());
        }
        CMD.ls(dir, result);
      }
      break;
    case 'view':
      result = parseArgs(str, 1, parsePath, 1, parseProps);
      break;
    default:
      throw new Error('Unknown command');
  }

  return [cmd, result];
}

//------------------------------------------------
export default class App {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.rl.on('line', async (line) => {
      try {
        console.log('>', parseInput(line, this.rl));
      } catch(err) {
        console.error(err.message);
      }
    });
    this.rl.on('close', () => {
      console.log(`Thank you for using File Manager, ${this.options.username}, goodbye!`);
    });
  }
  
  start() {
    const args = process.argv;
    this.options = { username: os.userInfo().username };
    for (let i = 2, argsLen = args.length; i < argsLen; i++) {
      this.options = { ...this.options, ...parseProps(args[i], false)[0] };
    }
    console.log(`Welcome to the File Manager, ${this.options.username}!`);
   
    process.chdir(os.homedir());
  }
}
