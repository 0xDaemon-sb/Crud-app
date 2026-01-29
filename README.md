# Crud Backend API

A complete CRUD REST API built with Node.js, Express, TypeScript, and MongoDB for the crud Backend Developer Assessment.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

## 📋 Features

- **User Management** - Complete CRUD operations with role-based access
- **Product Management** - Full product catalog with search and pagination
- **Dual Authentication** - Both JWT and session-based authentication
- **Input Validation** - Request validation using express-validator
- **Unit Tests** - Comprehensive test coverage with Jest

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd crud-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Run development server
npm run dev
```

Server runs at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middlewares/     # Auth & validation middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── types/           # TypeScript interfaces
├── utils/           # Validation rules
└── app.ts           # Express app entry
tests/
└── unit/            # Unit tests
```

## 🔐 Authentication

### JWT Authentication
```bash
# Include in request header
Authorization: Bearer <token>
```

### Session Authentication
```bash
# Use session-based login endpoint
POST /api/auth/login/session
```

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login (JWT) | ❌ |
| POST | `/api/auth/login/session` | Login (Session) | ❌ |
| POST | `/api/auth/logout` | Logout | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### User Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/:id` | Get user by ID | ✅ |
| PUT | `/api/users/:id` | Update user (full) | Owner/Admin |
| PATCH | `/api/users/:id` | Update user (partial) | Owner/Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Product Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List all products | ❌ |
| GET | `/api/products/:id` | Get product by ID | ❌ |
| POST | `/api/products` | Create product | ✅ |
| PUT | `/api/products/:id` | Update product (full) | Owner/Admin |
| PATCH | `/api/products/:id` | Update product (partial) | Owner/Admin |
| DELETE | `/api/products/:id` | Delete product | Owner/Admin |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/crud` |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `SESSION_SECRET` | Session signing key | - |

## 📮 Postman Collection

Import `postman_collection.json` to test all endpoints. The collection includes:

- Pre-configured environment variables
- Example request bodies
- Automatic token capture from login

## 📄 License

ISC
