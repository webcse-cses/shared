// Resources that can appear on the left side of a `resource:action` permission string.
export const Resource = {
  USER: "user",
  MEMBER_ROLE: "member-role",
  PERMISSION: "permission",
  EVENT: "event",
  NEWS: "news",
  AWARD: "award",
  INITIATIVE: "initiative",
  SIG: "sig",
  REFERRAL: "referral",
  PUBLICATION: "publication",
  IMAGE: "image",
  ACHIEVEMENT: "achievement",
  SEMINAR: "seminar",
  COMMENT: "comment",
  LIKE: "like",
  AUDIT_LOG: "audit-log",
};

// CRUD actions that can appear on the right side of a `resource:action` permission string.
export const Action = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

// Matches any resource or any action in a permission string.
export const WILDCARD = "*";

// Grants every action on every resource.
export const FULL_ACCESS = `${WILDCARD}:${WILDCARD}`;

export const buildPermission = (resource, action) => `${resource}:${action}`;
