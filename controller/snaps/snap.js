import fs from "fs";
import path from "path";
import archiver from "archiver";
import { AuthManager } from "../../services/authmanager.js";
import app from "../../config/config.js";
import ora from "ora";
import chalk from "chalk";
import { fileURLToPath } from "node:url";
import {
  scanDirectory,
  getChangedFiles,
  createArchive,
  uploadAndGenerateSignedUrl,
  zipFileFinder,
} from "../../utils/fileManipulationHelper.js";

import { 
  getStorage, 
  ref, 
  uploadBytes,
  getDownloadURL 
} from 'firebase/storage';


// Directory for DevSnap metadata
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, "..", "..");
const DEV_SNAP_DIR = path.join(__rootDir, ".devsnap");
const METADATA_FILE = path.join(DEV_SNAP_DIR, "metadata.json");
const SNAPSHOT_ARCHIVE = path.join(DEV_SNAP_DIR, `snapshot-${Date.now()}.zip`);
const storage = getStorage(app);

// Main function for the snap command
class DevSnap {
  constructor() {
    this.devSnapDir = DEV_SNAP_DIR;
    this.metadataFile = METADATA_FILE;
    this.snapshotArchive = SNAPSHOT_ARCHIVE;
    this.authManager = new AuthManager();
  }

  async snap() {
    const snapperSpinner = ora('Snapping project...').start();

    // Check if DevSnap is initialized
    if (!fs.existsSync(this.metadataFile)) {
      console.error(
        "Error: DevSnap has not been initialized. Run `devsnap init` first."
      );
      process.exit(1);
    }

    // Load baseline metadata
    const baselineMetadata = JSON.parse(
      fs.readFileSync(this.metadataFile, "utf8")
    );
    const { isFirstSnapshot, files: baselineFiles } = baselineMetadata;

    console.log(`Baseline snapshot: ${isFirstSnapshot ? "Yes" : "No"}`);
    console.log(`Files in baseline snapshot: ${Object.keys(baselineFiles).length}`);

    // Scan current directory
    process.chdir(__rootDir);
    // snapperSpinner.text(chalk.gray("Scanning project directory..."))

    const currentMetadata = scanDirectory(process.cwd());

    // Identify changed files
    console.log("Identifying changes...");

    // Determine files to archive
    let filesToArchive = [];
    if (isFirstSnapshot) {
      console.log("First snapshot detected. Archiving all files...");
      filesToArchive = Object.keys(currentMetadata); // Archive all files
    } else {
      console.log("Identifying changes...");
      filesToArchive = getChangedFiles(currentMetadata, baselineFiles);
    }

    if (filesToArchive.length === 0) {
      console.log("No changes detected. Snapshot not created.");
      return;
    }

    console.log(`Changes detected in ${filesToArchive.length} file(s):`);
    filesToArchive.forEach((file) => console.log(`- ${file}`));

    // Create a zip archive for changed files
    await createArchive(this.snapshotArchive, filesToArchive);

    // Save updated metadata
    console.log("Updating metadata...");
    baselineMetadata.isFirstSnapshot = false;
    baselineMetadata.files = currentMetadata;
    fs.writeFileSync(
      this.metadataFile,
      JSON.stringify(baselineMetadata, null, 2)
    );

    snapperSpinner.succeed(chalk.green("Snapping completed"));

    const fileUploadSpinner = ora("Saving snap...").start();
    await this.uploadSnap();
    fileUploadSpinner.stop();
  }

  async uploadSnap() {

    const filepath = zipFileFinder(DEV_SNAP_DIR);
    const currentUser = await this.authManager.getCurrentUser();

    console.log(currentUser);

    if (!currentUser) {
      console.log(chalk.red('Please login first!'));
      return;
    }

    const spinner = ora('Uploading file...').start();

    try {
      // Read file
      const file = fs.readFileSync(filepath);
      const filename = filepath.split('/').pop();

      // Create storage reference
      const storageRef = ref(storage, `uploads/${currentUser.uid}/${filename}`);

      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef, {
        token: {
          expires
        }
      });

      spinner.succeed(chalk.green('File uploaded successfully!'));
      console.log(chalk.blue('Download URL:'), downloadURL);
    } catch (error) {
      spinner.fail(chalk.red(`Upload failed: ${error.message}`));
    }

  }

}

// let devSnap = new DevSnap();
// devSnap
//   .snap()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//     process.exit(1);
//   });

export default DevSnap;
