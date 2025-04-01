/**
 * RabbitMQ User configuration constants
 */
export const INITIATIVE_EXCHANGES = {
    INITIATIVE: "initiative_exchange",
  };
  
  export const INITIATIVE_QUEUES = {
    INITIATIVE: "initiative_queue",
  };
  
  export const INITIATIVE_ROUTING_KEYS = {
    INITIATIVE_CREATED: "initiative.created",
    INITIATIVE_UPDATED: "initiative.updated",
    INITIATIVE_DELETED: "initiative.deleted",
  };
  
  // If you need a default export as well:
  export default {
    INITIATIVE_EXCHANGES,
    INITIATIVE_QUEUES,
    INITIATIVE_ROUTING_KEYS,
  };
  