import { hasPermission } from "../utils/permission.utils.js";

const AUTH_REQUIRED_MESSAGE = "Authentication required";
const FORBIDDEN_MESSAGE = "Insufficient permissions to access this resource";

/**
 * Permission-based authorization middleware. Checks `req.user.permissions`
 * (decoded from the JWT) against a required `resource:action` permission,
 * honouring `*` wildcards on either segment.
 * @param {string} requiredPermission - e.g. "user:update"
 */
export const requirePermission = (requiredPermission) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: AUTH_REQUIRED_MESSAGE });
  }

  if (!hasPermission(req.user.permissions, requiredPermission)) {
    return res.status(403).json({ error: FORBIDDEN_MESSAGE });
  }

  next();
};
