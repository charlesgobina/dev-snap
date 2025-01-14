import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "node:url";
import {
  scanDirectory,
  getChangedFiles,
  createArchive,
  uploadAndGenerateSignedUrl,
} from "../../utils/fileManipulationHelper.js";

// Directory for DevSnap metadata
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, "..", "..");
const DEV_SNAP_DIR = path.join(__rootDir, ".devsnap");
const METADATA_FILE = path.join(DEV_SNAP_DIR, "metadata.json");
const SNAPSHOT_ARCHIVE = path.join(DEV_SNAP_DIR, `snapshot-${Date.now()}.zip`);

// Main function for the snap command
class DevSnap {
  constructor() {
    this.devSnapDir = DEV_SNAP_DIR;
    this.metadataFile = METADATA_FILE;
    this.snapshotArchive = SNAPSHOT_ARCHIVE;
  }

  async snap() {
    console.log("Starting snapshot process...");

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

    console.log("Snapshot metadata loaded.");
    console.log(`Baseline snapshot: ${isFirstSnapshot ? "Yes" : "No"}`);
    console.log(`Files in baseline snapshot: ${Object.keys(baselineFiles).length}`);
    console.log(baselineMetadata);

    // Scan current directory
    process.chdir(__rootDir);
    console.log("Scanning root directory...");
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

    console.log("Snapshot process completed.");
  }

  async uploadFile(req, res) {

    try {
      console.log(req.body);
      const { file } = req.body;
      console.log(file);
      const { userId } = "174fb4ae-0aae-4e15-a441-d03c6f0fd0f6";
      

      await uploadAndGenerateSignedUrl(file, userId)

    } catch (e) {}
    

      res.status(200).json({ message: "File uploaded successfully" });

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
