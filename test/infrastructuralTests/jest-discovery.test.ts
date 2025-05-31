import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// This test is used to ensure that the Jest test discovery is working correctly.
// It is not a functional test, but a test to ensure that the Jest test discovery is working correctly.
// It is used to ensure that the Jest test discovery is working correctly.
// It is used to ensure that the Jest test discovery is working correctly.

describe('Jest Test Discovery', () => {
  it('should detect all test files correctly', () => {
    // Run Jest with --listTests flag and capture output
    const output = execSync('yarn jest --config jestconfig.json --listTests', { encoding: 'utf8' });

    // Expected test files (using relative paths)
    const expectedFiles = [
      'test/index.test.ts',
      'test/readmeExamples.test.ts',
      'src/__tests__/service.test.ts',
      'src/__tests__/inputVerifier.test.ts',
      'test/infrastructuralTests/jest-discovery.test.ts'
    ].map(file => path.join(process.cwd(), file));

    // Extract detected test files from Jest output
    const detectedFiles = output
      .split('\n')
      .filter(line => line.endsWith('.test.ts'))
      .map(line => line.trim())
      .filter(Boolean);

    // Verify each expected file exists
    expectedFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true);
    });

    // Verify each expected file is detected
    expectedFiles.forEach(expectedFile => {
      const normalizedExpectedFile = path.normalize(expectedFile);
      const found = detectedFiles.some(detectedFile => 
        path.normalize(detectedFile) === normalizedExpectedFile
      );
      expect(found).toBe(true);
    });

    // Verify no unexpected files are detected
    detectedFiles.forEach(detectedFile => {
      const normalizedDetectedFile = path.normalize(detectedFile);
      const found = expectedFiles.some(expectedFile => 
        path.normalize(expectedFile) === normalizedDetectedFile
      );
      expect(found).toBe(true);
    });

    // Verify number of test files
    expect(detectedFiles.length).toBe(expectedFiles.length);
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