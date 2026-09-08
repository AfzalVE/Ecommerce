import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'scratch' || file === 'brain') continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, fileList);
    } else if (filePath.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const jsFiles = walk('./');
const regex = /from\s+['"]([^'"]+)['"]/g;
const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const resolvedPath = path.resolve(path.dirname(file), importPath);
      const dir = path.dirname(resolvedPath);
      const base = path.basename(resolvedPath);
      if (fs.existsSync(dir)) {
        const actualFiles = fs.readdirSync(dir);
        if (!actualFiles.includes(base)) {
          const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === base.toLowerCase());
          if (caseInsensitiveMatch) {
            console.log(`[CASE MISMATCH] File: ${file} | Import: ${importPath} | Actual: ${caseInsensitiveMatch}`);
          } else {
            console.log(`[MISSING FILE] File: ${file} | Import: ${importPath}`);
          }
        }
      } else {
        console.log(`[MISSING DIR] File: ${file} | Import: ${importPath}`);
      }
    }
  }
});
console.log("Check complete.");
