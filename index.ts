#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

import printTableFromInp from './src/service';

// Read package.json to get version
let packageVersion = '0.0.0-dev'; // More descriptive default version
try {
  // Try to read from dist's parent directory first (for global installs)
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageVersion = packageJson.version;
} catch (error) {
  try {
    // Fallback to current directory (for development)
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageVersion = packageJson.version;
  } catch (error) {
    // More descriptive warning message
    console.warn('Warning: Could not find package.json in either dist parent directory or current directory. Using default version.');
  }
}

export function runCLI(argv: string[] = process.argv) {
  const program = new Command();

  program
    .version(packageVersion, '-v, --version', 'output the current version')
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
