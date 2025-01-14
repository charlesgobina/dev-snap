import fs from "fs";
import path from "path";
import crypto from "crypto";
import archiver from "archiver";
import { bucket } from "../config/config.js";

// Utility function to hash file content
const hashFile = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

// Recursive function to scan directories and collect metadata
const scanDirectory = (dir, baseDir = dir) => {
  const metadata = {};
  const entriesToIgnore = [
    ".git",
    ".devsnap",
    "node_modules",
    ".DS_Store",
    ".gitignore",
    ".env",
  ];
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
};

// Function to identify changed or new files
const getChangedFiles = (currentMetadata, baselineMetadata) => {
  const changedFiles = [];

  for (const [file, currentDetails] of Object.entries(currentMetadata)) {
    const baselineDetails = baselineMetadata[file];

    if (!baselineDetails) {
      // New file
      changedFiles.push(file);
    } else if (currentDetails.hash !== baselineDetails.hash) {
      // Modified file
      changedFiles.push(file);
    }
  }

  return changedFiles;
};

const createArchive = (archivePath, files) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(archivePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve(archive.pointer());
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    files.forEach((file) => {
      archive.file(file, { name: file });
    });

    archive.finalize();
  });
}

async function uploadAndGenerateSignedUrl(filePath) {
  try {
    // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Initialize Firebase

    // Get file details
    const fileName = path.basename(filePath);
    const fileStats = fs.statSync(filePath);
    
    console.log('Starting upload process...');
    console.log(`File name: ${fileName}`);
    console.log(`File size: ${fileStats.size} bytes`);

    // Upload file with progress monitoring
    const uploadResponse = await bucket.upload(filePath, {
      destination: `uploads/${fileName}`,
      metadata: {
        contentType: 'application/zip',
      },
      validation: 'crc32c',
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.bytesWritten / fileStats.size) * 100;
        console.log(`Upload progress: ${Math.round(progress)}%`);
      }
    });

    console.log('Upload completed. Generating signed URL...');

    const file = uploadResponse[0];
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      fileName,
      signedUrl,
      path: `uploads/${fileName}`,
      bucketName: bucket.name,
      projectId: admin.app().options.projectId
    };

  } catch (error) {
    console.error('Detailed error information:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages based on common issues
    let errorMessage = error.message;
    if (error.code === 403) {
      errorMessage = 'Permission denied. Please check your service account permissions.';
    } else if (error.code === 404) {
      errorMessage = 'Resource not found. Please verify your bucket name and project configuration.';
    }

    return {
      success: false,
      error: errorMessage,
      details: {
        errorCode: error.code,
        errorName: error.name,
        fullMessage: error.message
      }
    };
  }
}

// const uploadAndGenerateSignedUrl = async (userId, archivePath) => {
//   try {
//     const storagePath = `snap-archives/${userId}/${archivePath}`;
//     console.log(`Uploading archive to ${storagePath}...`);

//     const file = bucket.file(archivePath);

//     // Upload file content (example content)
//     await file.save("File data goes here", {
//       contentType: "application/octet-stream",
//     });

//     console.log("File uploaded successfully.");

//     // Check if the file exists
//     const [exists] = await file.exists();
//     if (!exists) {
//       throw new Error("File does not exist in Firebase Storage.");
//     }

//     console.log("File exists. Generating signed URL...");

//     const date = new Date();
//     date.setDate(date.getDate() + 1); // Expires in 24 hours

//     const [publicUrl] = await file.getSignedUrl({
//       action: "read",
//       expires: date,
//     });

//     console.log("Generated Signed URL:", publicUrl);
//     return publicUrl;
//   } catch (error) {
//     console.error("Error:", error.message);
//     throw error;
//   }
// };

// const uploadArchive = async (archivePath, userId) => {
//   let publicUrl = "";

//   const date = new Date();

//   try {

//     const storagePath = `snap-archives/${userId}/${archivePath}`;
//     const file = bucket.file(storagePath);
//     const fileStream = file.createReadStream()
//     fileStream.on('error', (err) => {
//       console.log(err);
//     });
//     fileStream.on('finish', async () => {
//       console.log('Upload complete. Url  in 24 hours.');

//       publicUrl = await file.getSignedUrl({
//         action: 'read',
//         expires: date.setDate(date.getDate() + 1)
//       })

//     });

//     console.log(`Uploading archive to ${storagePath}...`);
//     console.log(publicUrl);

//     return publicUrl;

//   } catch (e) {
//     console.log(e);
//   }
// };

// function that returns zip file in a given directory
const zipFileFinder = (dir) => {
  const files = fs.readdirSync(dir);
  const zipFiles = files.filter((file) => path.extname(file) === ".zip");
  
  // return the first zip file found
  return path.join(dir, zipFiles[0]);
}

export { scanDirectory, getChangedFiles, createArchive, uploadAndGenerateSignedUrl, zipFileFinder };
