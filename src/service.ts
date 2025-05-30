import { printTable } from 'console-table-printer';

import { verifyInput, verifyTableOptions } from './inputVerifier';

interface ParsedInput {
  data: any[];
  options?: any;
}

const parseAndValidateInput = (inp: string, tableOptions?: string): ParsedInput | null => {
  if (!verifyInput(inp)) {
    console.log(`not a valid input ${inp}`);
    return null;
  }

  if (tableOptions && !verifyTableOptions(tableOptions)) {
    console.log(`not a valid tableOptions ${tableOptions}`);
    return null;
  }

  try {
    return {
      data: JSON.parse(inp),
      options: tableOptions && JSON.parse(tableOptions)
    };
  } catch (err) {
    console.log(`not a valid input ${inp}`);
    return null;
  }
};

const printTableFromInp = (inp: string, tableOptions?: string): void | string => {
  const parsed = parseAndValidateInput(inp, tableOptions);
  if (!parsed) return;

  const { data, options } = parsed;
  if (options) {
    printTable(data, options);
  } else {
    printTable(data);
  }
};

export default printTableFromInp;
