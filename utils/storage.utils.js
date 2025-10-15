import fs from "fs";
import path from "path";

const STORAGE_ENV_KEYS = ["FILE_STORAGE_ROOT", "PUBLICATION_STORAGE_ROOT"];

const resolveConfiguredRoot = () => {
  for (const key of STORAGE_ENV_KEYS) {
    const value = process.env[key];
    if (value && typeof value === "string" && value.trim().length > 0) {
      return path.resolve(value.trim());
    }
  }
  throw new Error(
    "FILE_STORAGE_ROOT (or PUBLICATION_STORAGE_ROOT) must be configured to use shared storage"
  );
};

let cachedStorageRoot;

export const getStorageRoot = () => {
  if (!cachedStorageRoot) {
    const root = resolveConfiguredRoot();
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }
    cachedStorageRoot = root;
  }
  return cachedStorageRoot;
};

export const resolveStoragePath = (...segments) =>
  path.resolve(getStorageRoot(), ...segments);

export const ensureStorageDirectory = (relativePath = "") => {
  const target = resolveStoragePath(relativePath);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  return target;
};

export const toStorageKey = (absolutePath) => {
  if (!absolutePath) {
    return "";
  }
  const normalized = path.resolve(absolutePath);
  const relative = path.relative(getStorageRoot(), normalized);
  if (relative.startsWith("..")) {
    return normalized;
  }
  return relative.split(path.sep).join(path.posix.sep);
};
