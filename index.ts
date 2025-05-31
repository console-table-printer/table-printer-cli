#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';

import printTableFromInp from './src/service';

export function runCLI(argv: string[] = process.argv) {
  const program = new Command();

  program
    .option('-i, --input <value>', 'input string')
    .option('-s, --stdin', 'read input from stdin')
    .option('-t, --tableOptions <value>', 'table options in JSON format')
    .parse(argv);

  const options = program.opts();

  if (options.input) {
    printTableFromInp(options.input, options.tableOptions);
  } else if (options.stdin) {
    printTableFromInp(fs.readFileSync(0).toString(), options.tableOptions);
  } else {
    console.log('Error: Cant detect input option');
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  runCLI();
}
