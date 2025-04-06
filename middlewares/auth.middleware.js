import jwt from "jsonwebtoken";

const defaultConfig = {
  secretKey: process.env.JWT_SECRET || "secret1234",
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  storageType: "local", // Default storage type
  tokenPrefix: "Bearer", // Default token prefix in Authorization header
  errorMessages: {
    authRequired: "Authentication required",
    invalidToken: "Invalid or expired token",
    forbidden: "Insufficient permissions to access this resource",
    authFailed: "Authentication failed",
  },
};

// Current configuration - can be customized by services
let authConfig = { ...defaultConfig };

/**
 * Configure auth middleware settings
 * @param {Object} config - Custom configuration options
 */
export const configureAuth = (config = {}) => {
  authConfig = { ...defaultConfig, ...config };
  return authConfig;
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {Array} roles - User roles
 * @param {Object} additionalData - Additional data to include in token
 * @returns {string} JWT token
 */
export const generateToken = (userId, roles, additionalData = {}) => {
  return jwt.sign({ userId, roles, ...additionalData }, authConfig.secretKey, {
    expiresIn: authConfig.expiresIn,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.secretKey);
  } catch (error) {
    return null;
  }
};

/**
 * Authentication middleware
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    

    if (!authHeader || !authHeader.startsWith(`${authConfig.tokenPrefix} `)) {
      return res
        .status(401)
        .json({ error: authConfig.errorMessages.authRequired });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);


    if (!decoded) {
      return res
        .status(401)
        .json({ error: authConfig.errorMessages.invalidToken });
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: authConfig.errorMessages.authFailed });
  }
};

/**
 * Role-based authorization middleware
 * @param {string|Array} requiredRoles - Required role(s) to access the resource
 */
export const requireRole = (requiredRoles) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: authConfig.errorMessages.authRequired });
  }

  // Convert single role to array if needed
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // Check if user has at least one of the required roles
  const hasRequiredRole = roles.some((role) =>
    req.user.userType.includes(role)
  );

  if (!hasRequiredRole) {
    return res.status(403).json({ error: authConfig.errorMessages.forbidden });
  }

  next();
};

// Export available user types for convenience
