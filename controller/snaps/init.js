
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { scanDirectory } from '../../utils/fileManipulationHelper.js';


// Directory for DevSnap metadata
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, '..', '..');
const DEV_SNAP_DIR = path.join(__rootDir, '.devsnap');
const METADATA_FILE = path.join(DEV_SNAP_DIR, 'metadata.json');


// Main function to initialize DevSnap
class DevSnapInit {
  static init() {
    console.log('Initializing DevSnap...');

    // Check if already initialized
    if (fs.existsSync(DEV_SNAP_DIR)) {
      console.log('DevSnap is already initialized.');
      return;
    }


    // Create metadata directory
    fs.mkdirSync(DEV_SNAP_DIR);

    // change directory to project root
    process.chdir(__rootDir);

    // Scan project directory
    console.log('Creating baseline snapshot...');
    const metadata = scanDirectory(process.cwd());

    const currentMetadata = {
      isFirstSnapshot: true,
      files: metadata,
    };

    console.log('Files scanned:', Object.keys(currentMetadata.files).length);

    // Save metadata to file
    fs.writeFileSync(METADATA_FILE, JSON.stringify(currentMetadata, null, 2));
    console.log(`Metadata saved to ${METADATA_FILE}`);

    console.log('DevSnap initialized successfully!');
  }
}

export default DevSnapInit;