import { Command } from 'commander';
import * as fs from 'fs';
import { runCLI } from '../../index';
import printTableFromInp from '../../src/service';

// Mock dependencies
jest.mock('fs');
jest.mock('../../src/service');
jest.mock('commander', () => {
  const mockCommand = {
    option: jest.fn().mockReturnThis(),
    parse: jest.fn().mockReturnThis(),
    opts: jest.fn().mockReturnValue({}),
  };
  return { Command: jest.fn(() => mockCommand) };
});

describe('CLI', () => {
  let mockConsoleLog: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.log
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    // Reset mocks
    (fs.readFileSync as jest.Mock).mockReset();
    (printTableFromInp as jest.Mock).mockReset();
    
    // Reset Commander mock
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle input option', () => {
    const input = '[{"id":1,"name":"John"}]';
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({ input });
    
    runCLI(['node', 'index.js', '-i', input]);

    expect(mockConsoleLog).toHaveBeenCalledWith('program.input', input);
    expect(printTableFromInp).toHaveBeenCalledWith(input, undefined);
  });

  it('should handle input with table options', () => {
    const input = '[{"id":1,"name":"John"}]';
    const tableOptions = '{"title":"Test"}';
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({ input, tableOptions });
    
    runCLI(['node', 'index.js', '-i', input, '-t', tableOptions]);

    expect(mockConsoleLog).toHaveBeenCalledWith('program.input', input);
    expect(printTableFromInp).toHaveBeenCalledWith(input, tableOptions);
  });

  it('should handle stdin option', () => {
    const input = '[{"id":1,"name":"John"}]';
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({ stdin: true });
    (fs.readFileSync as jest.Mock).mockReturnValue({ toString: () => input });
    
    runCLI(['node', 'index.js', '-s']);

    expect(fs.readFileSync).toHaveBeenCalledWith(0);
    expect(printTableFromInp).toHaveBeenCalledWith(input, undefined);
  });

  it('should show error when no input option is provided', () => {
    runCLI(['node', 'index.js']);
    expect(mockConsoleLog).toHaveBeenCalledWith('Error: Cant detect input option');
  });
}); 