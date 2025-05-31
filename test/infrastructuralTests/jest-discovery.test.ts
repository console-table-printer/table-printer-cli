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

    // Expected test files (using relative paths)
    const expectedFiles = [
      'test/readmeExamples/basicExamples.test.ts',
      'test/readmeExamples/tableOptions.test.ts',
      'test/infrastructuralTests/jest-discovery.test.ts',
      'src/inputVerifier.test.ts',
      'src/service.test.ts',
      'index.test.ts'
    ].map(file => path.join(process.cwd(), file));

    // Extract detected test files from Jest output
    const detectedFiles = output
      .split('\n')
      .filter(line => line.endsWith('.test.ts'))
      .map(line => line.trim())
      .filter(Boolean);

    console.log("detectedFiles", detectedFiles);

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
      '<rootDir>/test/**/*.test.ts',
      "<rootDir>/src/**/*.test.ts",
      "<rootDir>/index.test.ts"
    ];

    expect(testPatterns).toEqual(expectedPatterns);
  });
}); 