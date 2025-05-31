import * as fs from 'fs';
import * as path from 'path';

// Why this test is needed:
// - To ensure that the dist folder contains only the compiled source files.
// - Often I accidentally put the tests file in it
describe('Dist Folder Contents', () => {
  // Get path to dist folder
  const distPath = path.join(process.cwd(), 'dist');

  beforeAll(() => {
    // Ensure dist folder exists by running tsc
    if (!fs.existsSync(distPath)) {
      require('child_process').execSync('yarn tsc', { stdio: 'inherit' });
    }
  });

  it('should not contain any test files', () => {
    // Helper function to recursively check for test files
    function findTestFiles(dir: string): string[] {
      const testFiles: string[] = [];
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively check subdirectories
          testFiles.push(...findTestFiles(fullPath));
        } else if (item.endsWith('.test.js') || item.endsWith('.test.d.ts')) {
          // Found a test file
          testFiles.push(fullPath);
        }
      }
      
      return testFiles;
    }

    // Find any test files in dist
    const testFiles = findTestFiles(distPath);

    // Log found test files for debugging
    if (testFiles.length > 0) {
      console.log('Found test files in dist:', testFiles);
    }

    // Verify no test files exist in dist
    expect(testFiles).toHaveLength(0);
  });

  it('should contain only compiled source files', () => {
    const allowedExtensions = new Set(['.js', '.d.ts', '.js.map', '.d.ts.map']);
    const invalidFiles: string[] = [];

    function validateFiles(dir: string): void {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively check subdirectories
          validateFiles(fullPath);
        } else {
          // Get the full extension (.d.ts or .js or .js.map etc)
          let fullExt = '';
          if (item.endsWith('.d.ts')) fullExt = '.d.ts';
          else if (item.endsWith('.d.ts.map')) fullExt = '.d.ts.map';
          else if (item.endsWith('.js.map')) fullExt = '.js.map';
          else fullExt = path.extname(item);
            
          if (!allowedExtensions.has(fullExt)) {
            invalidFiles.push(`${fullPath} (extension: ${fullExt})`);
          }
        }
      }
    }

    validateFiles(distPath);

    if (invalidFiles.length > 0) {
      console.log('Found files with invalid extensions:', invalidFiles);
    }

    expect(invalidFiles).toHaveLength(0);
  });
}); 