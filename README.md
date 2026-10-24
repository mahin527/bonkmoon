# BonkMoon

> A secure, production-ready Express.js backend for financial/accounting applications, built with Node.js, Express, and MongoDB.

## Overview

BonkMoon is a modular REST API starter that implements core banking/finance concepts — user authentication with JWT, multi-currency account management, and double-entry accounting fundamentals. The codebase follows clean architecture with separation of concerns across controllers, services, routes, models, and middlewares.

```
bonkmoon/
├── src/
│   ├── config/        # Database & environment configuration
│   ├── controllers/   # Request handling & response formatting
│   ├── middlewares/   # Error handling & auth guards
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic & third-party integrations
│   └── utils/         # Shared helpers (e.g., asyncHandler)
├── server.js          # Application entry point
└── package.json
```

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing, HTTP-only secure cookies
- **Account Management**: Multi-currency accounts (BDT default) with ACTIVE / FROZEN / CLOSED status lifecycle
- **Security by default**: Helmet security headers, CORS, request body size limits, email validation, password strength rules
- **Graceful shutdown**: Handles `SIGINT`/`SIGTERM` to finish in-flight requests before closing the DB connection
- **Validation**: Mongoose schema validation at the model layer

## Tech Stack

| Layer     | Technology                                         |
| --------- | -------------------------------------------------- |
| Runtime   | Node.js (CommonJS)                                 |
| Framework | Express 5                                          |
| Database  | MongoDB + Mongoose                                 |
| Auth      | JSON Web Tokens, bcryptjs                          |
| Security  | helmet, cors, cookie-parser                        |
| Utilities | morgan (logging), nodemailer (transactional email) |

## Installation & Setup

1. Clone the repository and install dependencies:

    ```bash
    pnpm install
    ```

2. Create a `.env` file in the root:

    ```env
    MONGODB_URI=mongodb://localhost:27017/bonkmoon
    JWT_SECRET=your-super-secret-key-change-in-production
    NODE_ENV=development
    PORT=3006
    ```

3. Start the development server:

    ```bash
    pnpm dev
    ```

The server starts on port `3006` (or the `PORT` env variable) and exposes a `/health` endpoint for liveness checks.

## Available Endpoints

| Method | Path                 | Description                        |
| ------ | -------------------- | ---------------------------------- |
| `GET`  | `/health`            | Health check                       |
| `POST` | `/api/auth/register` | Register a new user                |
| `POST` | `/api/auth/login`    | Authenticate and receive a JWT     |
| `POST` | `/api/account/*`     | Account operations (auth required) |

## Implementation Roadmap

The following items are planned to harden the application for production:

| #   | Area           | Task                                                                                                 | Priority |
| --- | -------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| 1   | Validation     | Add Zod schemas — never write `req.body` directly to the database (prevents mass assignment attacks) | High     |
| 2   | Authentication | Add protected route middleware; enforce JWT verification on sensitive endpoints                      | High     |
| 3   | Rate Limiting  | Integrate `express-rate-limit` to throttle login/API requests                                        | High     |
| 4   | Logging        | Replace console logging with Pino for structured, performance-friendly logs                          | Medium   |
| 5   | Testing        | Write API integration tests with Vitest + Supertest                                                  | High     |
| 6   | Config         | Validate required environment variables at application startup                                       | Medium   |
| 7   | Performance    | Add Mongoose indexes on frequently queried fields (user, status)                                     | Low      |

## License

ISC
