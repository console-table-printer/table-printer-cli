import { execSync } from 'child_process';
import * as path from 'path';

// This test is used to ensure that the Jest test discovery is working correctly.
// It is not a functional test, but a test to ensure that the Jest test discovery is working correctly.
// It is used to ensure that the Jest test discovery is working correctly.
// It is used to ensure that the Jest test discovery is working correctly.

describe('Jest Test Discovery', () => {
  it('should detect all test files correctly', () => {
    // Run Jest with --listTests flag and capture output
    const output = execSync('yarn test --listTests', { encoding: 'utf8' });

    // Expected test files (using relative paths)
    const expectedFiles = [
      'test/index.test.ts',
      'test/readmeExamples.test.ts',
      'src/__tests__/service.test.ts',
      'src/__tests__/inputVerifier.test.ts',
      'test/jest-discovery.test.ts'
    ].map(file => path.join(process.cwd(), file));

    // Extract detected test files from Jest output
    const detectedFiles = output
      .split('\n')
      .filter(line => line.includes('.test.ts'))
      .map(line => line.trim())
      .filter(Boolean);

    // Verify number of test files
    expect(detectedFiles.length).toBe(expectedFiles.length);

    // Verify each expected file is detected
    expectedFiles.forEach(expectedFile => {
      expect(detectedFiles).toContain(expectedFile);
    });

    // Verify no unexpected files are detected
    detectedFiles.forEach(detectedFile => {
      expect(expectedFiles).toContain(detectedFile);
    });
  });

  it('should match test patterns in jest config', () => {
    // Get test patterns from jest config
    const jestConfig = require('../jestconfig.json');
    const testPatterns = jestConfig.testMatch;

    // Expected patterns
    const expectedPatterns = [
      '<rootDir>/src/**/*.test.ts',
      '<rootDir>/test/**/*.test.ts'
    ];

    expect(testPatterns).toEqual(expectedPatterns);
  });
}); 