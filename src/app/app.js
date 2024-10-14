import os from 'node:os';
import readline from 'node:readline/promises';
import { readFile } from "node:fs/promises";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseInput } from './parser.js';

const bannerFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'banner.txt');

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
      console.log(`...\nThank you for using File Manager, ${this.options.username}, goodbye!\n`);
    });
  }

  printPrompt() {
    this.rl.output.write(`You are currently in: ${process.cwd()}${this.eol}`);
    this.rl.prompt();
  }
  
  async start() {
    const args = process.argv;
    this.options = { username: os.userInfo().username };
    for (let i = 2, argsLen = args.length; i < argsLen; i++) {
      this.options = { ...this.options, ...parseProps(args[i], false)[0] };
    }
    const banner = await readFile(bannerFile, 'utf8');
    console.log(banner, '\n');
    console.log(`Welcome to the File Manager, ${this.options.username}!`);
    console.log('-'.repeat(70));
    process.chdir(os.homedir());
    this.printPrompt();
  }
}
