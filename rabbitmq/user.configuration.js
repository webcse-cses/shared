/**
 * RabbitMQ User configuration constants
 */
export const USER_EXCHANGES = {
  USER: "user_exchange",
};

export const USER_QUEUES = {
  BULK_USER_REGISTRATION: "bulk_user_registration_queue",
  USER: "user_queue",
};

export const USER_ROUTING_KEYS = {
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",
  USER_RESET: "user.reset",
  USER_RESET_PASSWORD: "user.reset.password",
  BULK_USER_REGISTER: "user.bulk.register",
  USER_PROFILE_IMAGE_UPDATED: "user.updated.profile.image",
};

// If you need a default export as well:
export default {
  USER_EXCHANGES,
  USER_QUEUES,
  USER_ROUTING_KEYS,
};
