import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// This test is used to ensure that the Jest test discovery is working correctly.
// It is not a functional test, but a test to ensure that the Jest test discovery is working correctly.
// It is used to ensure that the Jest test discovery is working correctly.
// It is used to ensure that the Jest test discovery is working correctly.


// Why this test is needed:
// - Because in ci/cd it could be that the jest is not detecting all the tests properly, 
//   although in local all the tests are detected properly.
// - Also to make sure the test detection regex is working correctly.
describe('Jest Test Discovery', () => {
  it('should detect all test files correctly', () => {
    // Run Jest with --listTests flag and capture output
    const output = execSync('yarn jest --config jestconfig.json --listTests', { encoding: 'utf8' });

    // Extract detected test files from Jest output
    const detectedFiles = output
      .split('\n')
      .filter(line => line.endsWith('.test.ts'))
      .map(line => line.trim())
      .filter(Boolean);

    // Get all test files by walking the directories
    const findTestFiles = (dir: string): string[] => {
      const files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
          files.push(...findTestFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
          files.push(fullPath);
        }
      }
      
      return files;
    };

    const rootDir = process.cwd();
    const actualTestFiles = [
      ...findTestFiles(path.join(rootDir, 'src')),
      ...findTestFiles(path.join(rootDir, 'test'))
    ].map(file => path.normalize(file));

    // Sort both arrays for consistent comparison
    const sortedDetected = detectedFiles.map(file => path.normalize(file)).sort();
    const sortedActual = actualTestFiles.sort();

    // Compare arrays with detailed error message
    expect(sortedDetected).toEqual(sortedActual);

    if (sortedDetected.length !== sortedActual.length) {
      console.log('Test file count mismatch:');
      console.log('Detected files:', sortedDetected.length);
      console.log('Actual files:', sortedActual.length);
      
      const missingFiles = sortedActual.filter(file => !sortedDetected.includes(file));
      const extraFiles = sortedDetected.filter(file => !sortedActual.includes(file));
      
      if (missingFiles.length > 0) {
        console.log('Missing files:', missingFiles);
      }
      if (extraFiles.length > 0) {
        console.log('Extra files:', extraFiles);
      }
    }
  });

  it('should match test patterns in jest config', () => {
    // Get test patterns from jest config
    const configPath = path.join(process.cwd(), 'jestconfig.json');
    const jestConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const testPatterns = jestConfig.testMatch;

    // Expected patterns
    const expectedPatterns = [
      '<rootDir>/src/**/*.test.ts',
      '<rootDir>/test/**/*.test.ts'
    ];

    expect(testPatterns).toEqual(expectedPatterns);
  });
}); 