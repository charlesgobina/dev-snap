import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Utility function to hash file content
const hashFile = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Recursive function to scan directories and collect metadata
const scanDirectory = (dir, baseDir = dir) => {
  const metadata = {};
  const entriesToIgnore = ['.git', '.devsnap', 'node_modules', '.DS_Store', '.gitignore', '.env'];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entriesToIgnore.includes(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      Object.assign(metadata, scanDirectory(fullPath, baseDir));
    } else if (entry.isFile()) {
      const stats = fs.statSync(fullPath);
      metadata[relativePath] = {
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        hash: hashFile(fullPath),
      };
    }
  }
  return metadata;
}

export {
  scanDirectory
}