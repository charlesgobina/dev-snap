import { uploadAndGenerateSignedUrl, zipFileFinder } from "./utils/fileManipulationHelper.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";


// Directory for DevSnap metadata
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname);
const DEV_SNAP_DIR = path.join(__rootDir, ".devsnap");


const zipFile = zipFileFinder(DEV_SNAP_DIR);

console.log(`Zip file found: ${zipFile}`);

// Upload the archive to Firebase Storage
const userId = "test-user";
uploadAndGenerateSignedUrl(zipFile, userId).then((url) => {
  console.log(`Archive uploaded to ${url}`);
}).catch((e) => {
  console.error(e);
});