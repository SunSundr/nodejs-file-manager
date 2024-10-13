import os from 'node:os';
import readline from 'node:readline/promises';


function getCommand(input) {
  console.log(input);
  const [cmd, ...args] = input.trim().split(' ');
  console.log(args.join(' '));
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
      args.push(parsedArg);
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


function parseProps(str) {
  const propMatch = str.match(/^--?(\w+)(?:=(.*))?/);
  if (!propMatch) {
    throw new Error('Invalid property format');
  }

  const [, key, value] = propMatch;
  if (value) {
    const [parsedValue, rest] = parsePath(value);
    return [{ [key]: parsedValue }, str.slice(propMatch[0].length)];
  }

  return [{ [key]: true }, str.slice(propMatch[0].length)];
}

export default class App {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.rl.on('line', async (line) => {
      try {
          console.log('>', this.parseInput(line));
      } catch(err) {
          console.error(err.message);
      }
    });
  }
  

  parseInput(input) {
    const [cmd, str] = getCommand(input);
    let result;
  
    switch (cmd) {
      case 'copy':
        result = parseArgs(str, 2, parsePath);
        break;
      case 'os':
        result = parseArgs(str, 1, parseProps);
        break;
      case 'view':
        result = parseArgs(str, 1, parsePath, 1, parseProps);
        break;
      default:
        throw new Error('Unknown command');
    }
  
    return [cmd, result];
  }
  

  start() {
    process.chdir(os.homedir());
  }
}
