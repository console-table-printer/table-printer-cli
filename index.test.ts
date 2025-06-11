import { Command } from 'commander';
import * as fs from 'fs';
import { runCLI } from './index';
import printTableFromInp from './src/service';

// Mock dependencies
jest.mock('./src/service');
jest.mock('commander', () => {
  const mockCommand = {
    option: jest.fn().mockReturnThis(),
    version: jest.fn().mockReturnThis(),
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
    (printTableFromInp as jest.Mock).mockReset();
    
    // Reset Commander mock
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({});
    (mockCommand.version as jest.Mock).mockReset();
    (mockCommand.option as jest.Mock).mockReset();
    (mockCommand.parse as jest.Mock).mockReset();

    // Set up default mock returns
    (mockCommand.version as jest.Mock).mockReturnValue(mockCommand);
    (mockCommand.option as jest.Mock).mockReturnValue(mockCommand);
    (mockCommand.parse as jest.Mock).mockReturnValue(mockCommand);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should configure version command with package version', () => {
    const mockCommand = new Command();
    runCLI(['node', 'index.js']);
    
    expect(mockCommand.version).toHaveBeenCalledWith(
      expect.any(String),
      '-v, --version',
      'output the current version'
    );
  });

  it('should handle input option', () => {
    const input = '[{"id":1,"name":"John"}]';
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({ input });
    
    runCLI(['node', 'index.js', '-i', input]);

    expect(printTableFromInp).toHaveBeenCalledWith(input, undefined);
  });

  it('should handle input with table options', () => {
    const input = '[{"id":1,"name":"John"}]';
    const tableOptions = '{"title":"Test"}';
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({ input, tableOptions });
    
    runCLI(['node', 'index.js', '-i', input, '-t', tableOptions]);

    expect(printTableFromInp).toHaveBeenCalledWith(input, tableOptions);
  });

  it('should handle stdin option', () => {
    const input = '[{"id":1,"name":"John"}]';
    const mockCommand = new Command();
    (mockCommand.opts as jest.Mock).mockReturnValue({ stdin: true });
    
    // Mock fs.readFileSync only for this test
    const mockReadFileSync = jest.spyOn(fs, 'readFileSync')
      .mockReturnValue(Buffer.from(input));
    
    runCLI(['node', 'index.js', '-s']);

    expect(mockReadFileSync).toHaveBeenCalledWith(0);
    expect(printTableFromInp).toHaveBeenCalledWith(input, undefined);
    
    mockReadFileSync.mockRestore();
  });

  it('should show error when no input option is provided', () => {
    runCLI(['node', 'index.js']);
    expect(mockConsoleLog).toHaveBeenCalledWith('Error: Cant detect input option');
  });
}); 