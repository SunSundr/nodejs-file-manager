import os from 'node:os';
import readline from 'node:readline/promises';
import path from 'node:path';
import * as CMD from '../cmd/collection.js';
import { fileExist } from '../utils/fileExist.js';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

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
      if (typeof parsedArg === 'object' || parsedArg.length) args.push(parsedArg);
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
  const propMatch = typeof str === 'string' ? str.match(/^--?(\w+)(?:=(.*))?/) : null;
  if (!propMatch) return [{}, ''];

  const [, key, value] = propMatch;
  const lastStr = str.slice(propMatch[0].length);

  const parsedValue = value ? (subParse ? parsePath(value)[0] : value) : true;
  return [{ [key]: parsedValue }, lastStr];
}


async function parseInput(input, rl) {
  const [cmd, str] = getCommand(input);
  let result;

  switch (cmd) {
    case 'copy':
      result = parseArgs(str, 2, parsePath);
      break;
    case 'os':
      result = parseArgs(str, 1, parseProps);
      await CMD.osInfo(...result);
      break;
    case 'hash':
      result = parseArgs(str, 1, parsePath);
      {
        if (result[0]) {
          const isExist = await fileExist(result[0]);
          if (!isExist ) {
            const option = parseProps(result[1] ? result[1] : result[0])[0];
            if (!isEmpty(option)) result = ['', option];
          }
        }
        await CMD.hash(...result.map((data) => typeof data === 'object' ? Object.keys(data)[0] : data));
      }
      break;

    case 'cat':
      result = parseArgs(str, 1, parsePath);
      await CMD.cat(result[0], rl);
      break;

    case 'add':
      result = parseArgs(str, 1, parsePath);
      await CMD.add(result[0], rl);
      break;

    case 'rn':
      result = parseArgs(str, 2, parsePath);
      await CMD.rn(...result);
      break;

    case 'cp':
      result = parseArgs(str, 2, parsePath);
      await CMD.cp(...result);
      break;

    case 'up':
      CMD.cd('..');
      break;
    case 'cd':
      result = parseArgs(str, 1, parsePath);
      {
        let dir = result[0];
        if (dir === '~' || !dir) dir = os.homedir();
        CMD.cd(dir);
      }
      break;
    case 'ls':
      result = parseArgs(str, 1, parsePath);
      {
        let dir;
        if (typeof result[0] === 'string') {
          if (result[0].startsWith('-')) {
            result[0] = parseProps(result[0])[0];
          } else {
            dir = result[0];
            result.shift();
          }
        } else {
          dir = path.resolve(process.cwd());
        }
        await CMD.ls(dir, ...result);
      }
      break;
    default:
      console.error('Unknown command:', cmd);
  }

  return [cmd, result];
}

//------------------------------------------------
export default class App {
  constructor() {
    this.eol = os.EOL;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.rl.on('line', async (line) => {
      try {
        parseInput(line, this.rl).finally(() => {
          this.printPrompt();
        });
      } catch(err) {
        console.error(err.message);
        this.printPrompt();
      }
    });
    this.rl.on('close', () => {
      console.log(`Thank you for using File Manager, ${this.options.username}, goodbye!`);
    });
  }

  printPrompt() {
    this.rl.output.write(`You are currently in: ${process.cwd()}${this.eol}`);
    this.rl.prompt();
  }
  
  start() {
    const args = process.argv;
    this.options = { username: os.userInfo().username };
    for (let i = 2, argsLen = args.length; i < argsLen; i++) {
      this.options = { ...this.options, ...parseProps(args[i], false)[0] };
    }
    console.log(`Welcome to the File Manager, ${this.options.username}!`);
    console.log('-'.repeat(70));
    process.chdir(os.homedir());
    this.printPrompt();
  }
}
