# Shared – Common Utilities and Infrastructure for WebCSE

> A centralized workspace providing shared libraries, middleware, messaging configurations, and utilities that keep all WebCSE projects (CSES, SARC, Admin Portal, Auth System) speaking the same language and working together seamlessly.

---

## Overview

The Shared workspace is the toolkit that eliminates duplication across WebCSE projects. Rather than each service reimplementing authentication, file uploads, database schemas, and inter-service communication, they all draw from a single, versioned source of truth.

**Unified Capabilities:**

- Pre-configured HTTP clients with automatic credential injection
- Shared RabbitMQ messaging definitions (exchanges, queues, routing keys)
- Common middleware for authentication, file uploads, and compression
- Reusable MongoDB schemas and type definitions
- Storage helpers for cloud and local file management
- Environment and configuration utilities

This workspace ensures that a new contributor or rotating student developer can understand cross-project communication patterns in minutes rather than days.

---

## Purpose and Impact

Without Shared, each project would:

- Duplicate axios configuration and credential management
- Redefine identical user roles, event types, and award categories
- Rewrite multer, compression, and auth middleware
- Guess at RabbitMQ exchange names and routing keys
- Manage uploads inconsistently (some local, some cloud, some lost)

With Shared, the ecosystem:

- **Maintains consistency**: All projects use the same authentication checks, validation rules, and message formats
- **Speeds up development**: New services can integrate in hours, not days
- **Reduces bugs**: Breaking changes to shared patterns are detected immediately
- **Scales cleanly**: Adding a new project (like CSETimes or a mobile app) requires zero reinvention

---

## Technology Stack

- **HTTP Client**: Axios (configured with interceptors for auth)
- **Messaging**: RabbitMQ (amqplib) with typed configurations
- **File Handling**: Multer for Express uploads, Sharp for image processing, pdf-lib for PDFs
- **Authentication**: JWT (jsonwebtoken) with role-based middleware
- **Compression**: Built-in compression middleware
- **Validation**: Zod for schema definitions
- **Environment**: dotenv for configuration

---

## Prerequisites

- Node.js 18+
- RabbitMQ (if using messaging)
- MongoDB (if using shared schemas)
- Cloudinary account (optional, for cloud storage)

---

## Directory Structure

```
shared/
├── axios/
│   ├── axiosInstance.js        # Pre-configured HTTP client
│   └── ...                     # Other axios utilities
├── middlewares/
│   ├── auth.middleware.js      # JWT verification and role checks
│   ├── multer.middleware.js    # File upload handling
│   ├── compressor.middleware.js # Gzip compression
│   └── ...                     # Other middleware
├── rabbitmq/
│   ├── rabbit.setup.js         # RabbitMQ connection and channel
│   ├── event.configuration.js  # Event message definitions
│   ├── news.configuration.js   # News message definitions
│   ├── award.configurations.js # Award message definitions
│   ├── image.configuration.js  # Image message definitions
│   ├── initiative.configuration.js # Initiative message definitions
│   └── publication.configurations.js # Publication message definitions
├── schemas/
│   ├── user.schema.js          # User model and validation
│   ├── event.schema.js         # Event definitions
│   ├── ...                     # Other shared schemas
├── types/
│   ├── user.types.js           # TypeScript/JSDoc type definitions
│   ├── ...                     # Other type definitions
├── utils/
│   ├── cloudinary.js           # Cloudinary upload helper
│   ├── storage.js              # File storage abstractions
│   └── ...                     # Other utilities
├── uploads/
│   └── ...                     # Temporary upload directory
├── docker-compose.yaml         # RabbitMQ + infrastructure
├── package.json
└── README.md
```

---

## Installation

The `shared` workspace is designed to be included as a sibling folder in your repository structure. Other projects import from it directly:

```javascript
import { axiosInstance } from "shared/axios/axiosInstance.js";
import { authMiddleware } from "shared/middlewares/auth.middleware.js";
import { rabbitSetup } from "shared/rabbitmq/rabbit.setup.js";
```

### Setup

1. Ensure `shared/` is present at the repository root alongside CSES, SARC, Admin Portal, etc.
2. Each project that uses Shared should have it as a reference (not an npm dependency)
3. Configure environment variables in each project's `.env`

### Prerequisites for Services Using Shared

Create a `.env` file in the shared directory with:

```bash
NODE_ENV=development

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Database
MONGODB_URL=mongodb://localhost:27017

# Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# File uploads
MAX_FILE_SIZE=52428800  # 50MB
```

---

## Key Modules

### Axios Client (`axios/axiosInstance.js`)

Pre-configured HTTP client that automatically attaches JWT tokens and handles common errors:

```javascript
import { axiosInstance } from "shared/axios/axiosInstance.js";

// Automatically includes Authorization header and base URL
const response = await axiosInstance.get("/events");
```

**Features:**

- Automatic JWT token injection from cookies
- Centralized error handling
- Request/response interceptors
- Base URL configuration per environment

---

### Authentication Middleware (`middlewares/auth.middleware.js`)

Express middleware for verifying JWT tokens and checking user roles:

```javascript
import {
  authMiddleware,
  requireRole,
} from "shared/middlewares/auth.middleware.js";

app.get(
  "/admin/dashboard",
  authMiddleware,
  requireRole("admin"),
  (req, res) => {
    // Only authenticated admins can access
    res.json(req.user);
  }
);
```

**Features:**

- JWT verification
- Role-based access control (RBAC)
- Automatic error responses (401, 403)
- Extracts user context into `req.user`

---

### File Upload Middleware (`middlewares/multer.middleware.js`)

Configured multer instance for handling file uploads:

```javascript
import { uploadMiddleware } from "shared/middlewares/multer.middleware.js";

app.post("/upload", uploadMiddleware.single("file"), (req, res) => {
  console.log(req.file); // Contains file path, size, mimetype
  res.json({ path: req.file.path });
});
```

**Features:**

- File size limits
- Allowed MIME types validation
- Temporary storage directory
- Error handling for invalid files

---

### RabbitMQ Setup (`rabbitmq/rabbit.setup.js`)

Centralized RabbitMQ connection management:

```javascript
import { rabbitSetup } from "shared/rabbitmq/rabbit.setup.js";

const channel = await rabbitSetup.getChannel();
await channel.assertExchange("events", "topic", { durable: true });
```

**Features:**

- Connection pooling and reconnection logic
- Channel management
- Error handling and logging
- Health checks

---

### Message Configurations

Pre-defined RabbitMQ exchanges, queues, and routing keys for each domain:

**Event Messages (`rabbitmq/event.configuration.js`):**

```javascript
export const eventConfig = {
  exchange: "admin-events",
  routingKey: "events.created", // or 'events.updated', 'events.deleted'
  queue: "cses-events-queue",
};
```

**News Messages (`rabbitmq/news.configuration.js`):**

```javascript
export const newsConfig = {
  exchange: "admin-news",
  routingKey: "news.published",
  queue: "cses-news-queue",
};
```

Similar configurations exist for Awards, Initiatives, Publications, and Images.

---

### Storage Helpers (`utils/storage.js`)

Abstractions for file storage (local disk or Cloudinary):

```javascript
import { storageHelper } from "shared/utils/storage.js";

// Upload to cloud
const result = await storageHelper.upload(file, "publications");

// Delete from cloud
await storageHelper.delete(publicId);
```

---

## Usage Examples

### Using Shared in a New Project

1. Import the modules you need:

```javascript
import { axiosInstance } from "shared/axios/axiosInstance.js";
import {
  authMiddleware,
  requireRole,
} from "shared/middlewares/auth.middleware.js";
import { uploadMiddleware } from "shared/middlewares/multer.middleware.js";
```

2. Apply middleware:

```javascript
app.use(authMiddleware); // Protect all routes
app.get("/protected", (req, res) => {
  res.json({ user: req.user });
});
```

3. Publish RabbitMQ messages:

```javascript
import { rabbitSetup } from "shared/rabbitmq/rabbit.setup.js";
import { eventConfig } from "shared/rabbitmq/event.configuration.js";

const channel = await rabbitSetup.getChannel();
await channel.publish(
  eventConfig.exchange,
  eventConfig.routingKey,
  Buffer.from(JSON.stringify({ id: 1, title: "Event Name" }))
);
```

4. Consume messages:

```javascript
const queue = await channel.assertQueue(eventConfig.queue, { durable: true });
await channel.bindQueue(
  queue.queue,
  eventConfig.exchange,
  eventConfig.routingKey
);

channel.consume(queue.queue, (msg) => {
  const event = JSON.parse(msg.content.toString());
  // Handle event
  channel.ack(msg);
});
```

---

## Environment Variables

All services using Shared should define these in their `.env`:

| Variable                | Description                          | Required |
| ----------------------- | ------------------------------------ | -------- |
| `NODE_ENV`              | Environment (development/production) | Yes      |
| `RABBITMQ_URL`          | RabbitMQ connection URL              | Yes      |
| `MONGODB_URL`           | MongoDB connection string            | Yes      |
| `JWT_SECRET`            | Secret for signing JWT tokens        | Yes      |
| `JWT_EXPIRY`            | Token expiry (e.g., "7d")            | Yes      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                | No       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                   | No       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                | No       |
| `MAX_FILE_SIZE`         | Max upload size in bytes             | No       |

---

## Docker

Start RabbitMQ and other dependencies locally:

```bash
docker-compose up -d
```

This sets up:

- RabbitMQ on port 5672 with management UI on 15672
- Optional MongoDB and Redis

---

## Scripts

```bash
# Currently no build or test scripts defined
# Run within consuming projects instead

# For example, from CSES or Admin Portal:
npm start  # Starts the service (which uses shared modules)
```

---

## Best Practices for Contributors

1. **Keep it modular**: Each utility should do one thing well
2. **Document with examples**: Include usage examples in comments
3. **Validate inputs**: Use Zod schemas for request validation
4. **Test locally**: Verify shared modules work before committing
5. **Version carefully**: Breaking changes to Shared affect all projects
6. **Use TypeScript/JSDoc**: Add type hints for clarity
7. **Update documentation**: Keep this README in sync with code changes

---

## Related Projects

- **CSES** (`/CSES`): Uses Shared for messaging, auth, and axios
- **SARC** (`/SARC`): Uses Shared for auth, uploads, and messaging
- **Admin Portal** (`/admin-portal-cses`): Uses Shared for all middleware and RabbitMQ
- **Auth System** (`/auth`): Uses Shared for JWT and user schemas

---

## Contributing

The Shared workspace is fundamental to WebCSE's architecture. Any changes should:

1. Be backward-compatible when possible
2. Include updates to this README
3. Be tested in at least one consuming project
4. Include clear commit messages explaining the "why"

For questions or proposed changes, contact the WebCSE team maintainers.

---

## License

This project is maintained by the Computer Science and Engineering Society, IIT (ISM) Dhanbad. All rights reserved.
