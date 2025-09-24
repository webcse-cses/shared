export const IMAGE_EXCHANGES = {
  IMAGES: "image_exchange",
};

export const IMAGE_QUEUES = {
  IMAGE: "images_queue",
};

export const IMAGE_ROUTING_KEYS = {
  CATEGORY_CREATED: "category.created",
  CATEGORY_DELETED: "category.deleted",
  CATEGORY_UPLOAD: "category.upload",
  IMAGE_UPLOAD: "image.upload",
};

// If you need a default export as well:
export default {
  IMAGE_EXCHANGES,
  IMAGE_QUEUES,
  IMAGE_ROUTING_KEYS,
};
