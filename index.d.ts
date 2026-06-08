import type { AxiosInstance } from 'axios';

// ─── Axios ───────────────────────────────────────────────────────────────────

export declare function getEnv(key: string, defaultValue?: string): string;
export declare const adminAPI: AxiosInstance;
export declare const authAPI: AxiosInstance;
export declare const bufferedReaderAPI: AxiosInstance;
export declare const csesAPI: AxiosInstance;
export declare const sarcAPI: AxiosInstance;
export declare const aiMlAPI: AxiosInstance;

// ─── Auth middleware ──────────────────────────────────────────────────────────

export declare function configureAuth(config?: Record<string, unknown>): Record<string, unknown>;
export declare function generateToken(userId: string, roles: string[], additionalData?: Record<string, unknown>): string;
export declare function verifyToken(token: string): Record<string, unknown> | null;
export declare function authenticate(req: any, res: any, next: any): void;
export declare function requireRole(requiredRoles: string | string[]): (req: any, res: any, next: any) => void;

// ─── Compression middleware ───────────────────────────────────────────────────

export declare function compressFile(filePath: string): Promise<string | null>;
export declare function compressionMiddleware(req: any, res: any, next: any): Promise<void>;

// ─── Multer middleware ────────────────────────────────────────────────────────

export declare const upload: any;

// ─── Storage utils ────────────────────────────────────────────────────────────

export declare function getStorageRoot(): string;
export declare function resolveStoragePath(...segments: string[]): string;
export declare function ensureStorageDirectory(relativePath?: string): string;
export declare function toStorageKey(absolutePath: string): string;

// ─── RabbitMQ client ──────────────────────────────────────────────────────────

export declare class RabbitMQClient {
  connection: unknown;
  channel: unknown;
  connect(url?: string): Promise<unknown>;
  createQueue(name: string, options?: Record<string, unknown>): Promise<unknown>;
  createExchange(name: string, type?: string, options?: Record<string, unknown>): Promise<{ name: string; type: string }>;
  bindQueueToExchange(queueName: string, exchangeName: string, routingKey: string): Promise<void>;
  publishToExchange(exchangeName: string, routingKey: string, message: unknown): Promise<boolean>;
  sendToQueue(queueName: string, message: unknown): Promise<boolean>;
  consumeFromQueue(queueName: string, callback: (content: unknown, message: unknown) => Promise<void>): Promise<unknown>;
  closeConnection(): Promise<void>;
}

// ─── RabbitMQ configurations ──────────────────────────────────────────────────

export declare const AWARD_EXCHANGES: { AWARDS: string };
export declare const AWARD_QUEUES: { AWARDS: string };
export declare const AWARD_ROUTING_KEYS: { AWARD_CREATED: string; AWARD_UPDATED: string; AWARD_DELETED: string };

export declare const EVENT_EXCHANGES: { EVENTS: string };
export declare const EVENT_QUEUES: { EVENT: string };
export declare const EVENT_ROUTING_KEYS: { EVENT_CREATED: string; EVENT_UPDATED: string; EVENT_DELETED: string };

export declare const IMAGE_EXCHANGES: { IMAGES: string };
export declare const IMAGE_QUEUES: { IMAGE: string };
export declare const IMAGE_ROUTING_KEYS: { CATEGORY_CREATED: string; CATEGORY_DELETED: string; CATEGORY_UPLOAD: string; IMAGE_UPLOAD: string };

export declare const INITIATIVE_EXCHANGES: { INITIATIVE: string };
export declare const INITIATIVE_QUEUES: { INITIATIVE: string };
export declare const INITIATIVE_ROUTING_KEYS: { INITIATIVE_CREATED: string; INITIATIVE_UPDATED: string; INITIATIVE_DELETED: string };

export declare const NEWS_EXCHANGES: { NEWS: string };
export declare const NEWS_QUEUES: { NEWS: string };
export declare const NEWS_ROUTING_KEYS: { NEWS_CREATED: string; NEWS_UPDATED: string; NEWS_DELETED: string };

export declare const PUBLICATION_EXCHANGES: { PUBLICATIONS: string };
export declare const PUBLICATION_QUEUES: { PUBLICATIONS: string };
export declare const PUBLICATION_ROUTING_KEYS: { PUBLICATION_RESULT: string };

export declare const SIG_EXCHANGES: { SIG: string };
export declare const SIG_QUEUES: { PROJECT: string };
export declare const SIG_ROUTING_KEYS: { PROJECT_CREATED: string; PROJECT_UPDATED: string; PROJECT_DELETED: string };

export declare const USER_EXCHANGES: { USER: string };
export declare const USER_QUEUES: { BULK_USER_REGISTRATION: string; USER: string };
export declare const USER_ROUTING_KEYS: {
  USER_CREATED: string;
  USER_UPDATED: string;
  USER_DELETED: string;
  USER_RESET: string;
  USER_RESET_PASSWORD: string;
  BULK_USER_REGISTER: string;
  USER_PROFILE_IMAGE_UPDATED: string;
};

// ─── Types ────────────────────────────────────────────────────────────────────

export declare const AwardType: { COMPANY: string; ALUMNI: string };

export declare const EventTypes: {
  HACKATHON: string;
  CULTURAL: string;
  CONFERENCE: string;
  CONTESTS: string;
  OTHER: string;
};

export declare const NewsType: {
  ACHIEVEMENT: string;
  SEMINAR: string;
};

export declare const ReferralStatus: { PENDING: string; ACTIVE: string; REJECTED: string; EXPIRED: string };
export declare const ReferralMode: { REMOTE: string; HYBRID: string; ONSITE: string };

export declare const UserType: { ADMIN: string; PROFESSOR: string; ALUMNI: string; STUDENT: string };
export declare const DegreeType: { BTECH: string; MTech: string; PhD: string; Other: string };
export declare const SIGType: { AI: string; SYSTEMS: string; THEORY: string; SECURITY: string };
export declare const RoleType: { LIFETIME_MEMBER: string; ANNUAL_MEMBER: string; MEMBER: string; SECRETARY: string };
