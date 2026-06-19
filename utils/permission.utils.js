import { WILDCARD } from "../types/permission.type.js";

/**
 * Checks whether a single granted permission string satisfies a required one.
 * Either segment of the granted permission may be `*` to wildcard-match.
 */
export const matchesPermission = (grantedPermission, requiredPermission) => {
  const [grantedResource, grantedAction] = grantedPermission.split(":");
  const [requiredResource, requiredAction] = requiredPermission.split(":");

  const resourceMatches =
    grantedResource === WILDCARD || grantedResource === requiredResource;
  const actionMatches =
    grantedAction === WILDCARD || grantedAction === requiredAction;

  return resourceMatches && actionMatches;
};

/**
 * Checks whether a user's permission set satisfies a required `resource:action` permission.
 * @param {string[]} userPermissions
 * @param {string} requiredPermission
 */
export const hasPermission = (userPermissions, requiredPermission) =>
  Array.isArray(userPermissions) &&
  userPermissions.some((granted) =>
    matchesPermission(granted, requiredPermission)
  );
