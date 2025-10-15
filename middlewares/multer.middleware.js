import path from "path";
import multer from "multer";

import { ensureStorageDirectory } from "../utils/storage.utils.js";

const resolveSubfolder = (mimetype) => {
  if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimetype === "application/vnd.ms-excel"
  ) {
    return "excel";
  }
  if (mimetype && mimetype.startsWith("image/")) {
    return "images";
  }
  if (mimetype === "application/pdf") {
    return "pdf";
  }
  return "others";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = resolveSubfolder(file.mimetype);
    file.storageSubdir = subfolder;
    const targetDirectory = ensureStorageDirectory(subfolder);
    cb(null, targetDirectory);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname}`;
    const subdir =
      typeof file.storageSubdir === "string" ? file.storageSubdir : "";
    const storageKey = subdir
      ? path.posix.join(subdir.split(path.sep).join(path.posix.sep), safeName)
      : safeName;
    file.storageKey = storageKey;
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
});
