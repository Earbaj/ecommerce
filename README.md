# Ecommerce API (NestJS)

> A small NestJS-based backend API for user authentication and category management.

---

## 🚀 Quick Start

### 1) Install

```bash
npm install
```

### 2) Setup environment variables

Copy the example env file and adjust values as needed:

```bash
cp example.env .env
```

> ✅ Required variables:
> - `MONGODB_URI` (e.g., `mongodb://localhost:27017/ecommerce_db`)
> - `JWT_SECRET` (used to sign access tokens)
> - `PORT` (optional, defaults to `3000`)

### 3) Run the server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000`

---

## 📚 API Documentation (Swagger)

Once the server is running, open the Swagger UI:

- **URL:** `http://localhost:3000/api`

This UI shows all available routes, request/response schemas, and lets you try the endpoints directly.

---

## 🧠 Architecture Overview

This project is built with **NestJS** and uses **MongoDB** (via Mongoose). It includes:

- JWT-based authentication (`/auth/signup`, `/auth/login`, `/auth/profile`)
- Protected category creation endpoint (requires `Authorization: Bearer <token>`)
- Category listing endpoint that returns categories as a tree

---

## 🔐 Authentication Endpoints

### 1) Signup

- **Endpoint:** `POST /auth/signup`
- **Description:** Registers a new user and stores a hashed password.

**Request Body** (JSON):

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (201/200):

```json
{
  "message": "User registered successfully",
  "data": {
    "_id": "<userId>",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>",
    "__v": 0
  }
}
```

> ⚠️ If the email already exists, the API returns **400 Bad Request** with message `Email already exists`.

---

### 2) Login

- **Endpoint:** `POST /auth/login`
- **Description:** Logs in a user and returns a JWT access token.

**Request Body** (JSON):

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200):

```json
{
  "message": "Successfully loged in ",
  "access_token": "<jwt_token>",
  "data": {
    "id": "<userId>",
    "email": "user@example.com",
    "role": "user"
  }
}
```

> ⚠️ If credentials are invalid, the API returns **401 Unauthorized** with message `Invalid credentials`.

---

### 3) Profile (Protected)

- **Endpoint:** `GET /auth/profile`
- **Description:** Returns the current authenticated user info.
- **Headers:** `Authorization: Bearer <jwt_token>`

**Success Response** (200):

```json
{
  "message": "This is a protected route",
  "user": {
    "userId": "<userId>",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## 🏷️ Categories Endpoints

### 1) Create Category (Protected)

- **Endpoint:** `POST /categories`
- **Description:** Creates a new category. Requires a valid JWT.
- **Headers:** `Authorization: Bearer <jwt_token>`

**Request Body** (JSON):

```json
{
  "name": "Electronics",
  "parentId": "<optional-mongo-id>"
}
```

**Notes:**
- `name` is required and must be non-empty.
- `parentId` is optional; if provided it must be a valid MongoDB ObjectId.
- If a category with the same slug already exists, the request returns **400 Bad Request**.

**Success Response** (201/200):

```json
{
  "_id": "<categoryId>",
  "name": "Electronics",
  "slug": "electronics",
  "parentId": null,
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>",
  "__v": 0
}
```

---

### 2) List Categories

- **Endpoint:** `GET /categories`
- **Description:** Returns all categories structured as a tree.
- **Authentication:** Not required.

**Success Response** (200):

```json
[
  {
    "_id": "<parentId>",
    "name": "Electronics",
    "slug": "electronics",
    "children": [
      {
        "_id": "<childId>",
        "name": "Mobile Phones",
        "slug": "mobile-phones",
        "children": []
      }
    ]
  }
]
```

---

## 🧩 Project Structure

- `src/` – main source code
  - `auth/` – authentication module (signup/login/jwt)
  - `categories/` – category module + DTOs + schemas
  - `user/` – user schema + module (currently minimal)
  - `main.ts` – application bootstrap + Swagger setup

---

## 🧪 Tests

Run unit and e2e tests via:

```bash
npm run test
npm run test:e2e
```

---

## 🔧 Notes / TODOs

- `user` module is empty and can be extended for user management (update profile, roles, etc.).
- Category creation is protected by JWT, but role-based access control (admin-only) is not implemented yet.
- `JWT_EXPIRES_IN` is present in `example.env` but not currently used by the app.

---

## 📌 Useful Commands

- `npm run start:dev` – run in watch mode
- `npm run lint` – run ESLint
- `npm run format` – format code with Prettier

---

## License

This project is currently unlicensed.
