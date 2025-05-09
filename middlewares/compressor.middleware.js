import sharp from "sharp";
import fs from "fs";
import path from "path";

/**
 * Middleware to compress files based on their type
 * Currently supports image compression with sharp
 * Can be extended for other file types in the future
 */
export const compressFile = async (filePath) => {
  if (!filePath) return null;

  try {
    const fileExt = path.extname(filePath).toLowerCase();

    // Get file stats before compression
    const beforeStats = fs.statSync(filePath);
    const beforeSize = beforeStats.size;

    // Image compression (jpg, jpeg, png, webp)
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(fileExt)) {
      const compressedFilePath = filePath.replace(
        fileExt,
        `-compressed${fileExt}`
      );

      await sharp(filePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .png({ quality: 80, compressionLevel: 9 })
        .webp({ quality: 80 })
        .toFile(compressedFilePath);

      // Replace original file with compressed version
      fs.unlinkSync(filePath);
      fs.renameSync(compressedFilePath, filePath);

      // Get file stats after compression
      const afterStats = fs.statSync(filePath);
      console.log(
        `Image compressed: ${beforeSize} bytes → ${
          afterStats.size
        } bytes (${Math.round((afterStats.size / beforeSize) * 100)}%)`
      );
    }
    // PDF compression can be added here in the future
    // else if (fileExt === '.pdf') {
    //   // PDF compression logic
    // }
    // Add more file type handlers as needed

    return filePath;
  } catch (error) {
    console.error("Error compressing file:", error);
    return filePath; // Return original file path if compression fails
  }
};

/**
 * Middleware to handle file compression after upload
 * To be used after multer middleware has processed the file
 */
export const compressionMiddleware = async (req, res, next) => {
  try {
    // Handle single file upload
    if (req.file && req.file.path) {
      req.file.path = await compressFile(req.file.path);
    }

    // Handle multiple files upload
    if (req.files) {
      // If it's an array of files
      if (Array.isArray(req.files)) {
        for (let i = 0; i < req.files.length; i++) {
          req.files[i].path = await compressFile(req.files[i].path);
        }
      }
      // If it's an object with file fields
      else {
        for (const field in req.files) {
          const files = req.files[field];
          for (let i = 0; i < files.length; i++) {
            files[i].path = await compressFile(files[i].path);
          }
        }
      }
    }
    console.log("Compression middleware completed");
    
    next();
  } catch (error) {
    console.error("Error in compression middleware:", error);
    next(error);
  }
};
