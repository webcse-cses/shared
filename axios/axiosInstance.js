import axios from "axios";

// Helper function to get environment variables that works in both Node.js and Vite
export const getEnv = (key, defaultValue) => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  } else if (typeof process !== "undefined" && process.env) {
    try {
      if (!globalThis.__dotenvLoaded) {
        import("dotenv").then((dotenv) => dotenv.config());
        globalThis.__dotenvLoaded = true;
      }
    } catch (err) {
      console.warn("Error loading dotenv:", err);
    }
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

// Get the base URL for each service from environment variables
const ADMIN_SERVICE_URI = getEnv(
  "VITE_APP_ADMIN_SERVICE_URI",
  "REACT_APP_ADMIN_SERVICE_URI"
);
const AUTH_SERVICE_URI = getEnv(
  "VITE_APP_AUTH_SERVICE_URI",
  "REACT_APP_AUTH_SERVICE_URI"
);
const BUFFERED_READER_SERVICE_URI = getEnv(
  "VITE_APP_BUFFERED_READER_SERVICE_URI",
  "REACT_APP_BUFFERED_READER_SERVICE_URI"
);
const CSES_SERVICE_URI = getEnv(
  "VITE_APP_CSES_SERVICE_URI",
  "REACT_APP_CSES_SERVICE_URI"
);
const SARC_SERVICE_URI = getEnv(
  "VITE_APP_SARC_SERVICE_URI",
  "REACT_APP_SARC_SERVICE_URI"
);

const AI_ML_SERVICE_URI = getEnv(
  "VITE_APP_AI_ML_SERVICE_URI",
  "REACT_APP_AI_ML_SERVICE_URI"
);

// Create Axios instances for each service
const adminAPI = axios.create({
  baseURL: ADMIN_SERVICE_URI,
  timeout: 20000, // 20 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

const authAPI = axios.create({
  baseURL: AUTH_SERVICE_URI,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const bufferedReaderAPI = axios.create({
  baseURL: BUFFERED_READER_SERVICE_URI,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const csesAPI = axios.create({
  baseURL: CSES_SERVICE_URI,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const sarcAPI = axios.create({
  baseURL: SARC_SERVICE_URI,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

const aiMlAPI = axios.create({
  baseURL: AI_ML_SERVICE_URI,
  timeout: 120000, // 2 minutes timeout for AI/ML tasks
  headers: {
    "Content-Type": "application/json",
  },
});

// Get storage based on environment
const getStorage = () => {
  // Browser environment
  if (typeof localStorage !== "undefined") {
    return {
      getItem: (key) => {
        // Try to get token with the exact key or fallback to admin_auth_token
        if (key === "token") {
          return (
            localStorage.getItem(key) ||
            localStorage.getItem("admin_auth_token")
          );
        }
        return localStorage.getItem(key);
      },
      removeItem: (key) => localStorage.removeItem(key),
    };
  }
  // Node.js environment
  return {
    getItem: () => null,
    removeItem: () => {},
  };
};

// Interceptor for handling requests
const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      // Get token from storage if exists
      const storage = getStorage();
      const token = storage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Add this to the request interceptor in axiosInstance.js

      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Setup interceptors for all instances
setupInterceptors(adminAPI);
setupInterceptors(authAPI);
setupInterceptors(bufferedReaderAPI);
setupInterceptors(csesAPI);
setupInterceptors(sarcAPI);
setupInterceptors(aiMlAPI);

export { adminAPI, authAPI, bufferedReaderAPI, csesAPI, sarcAPI, aiMlAPI };
