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


---

### 3.1) Add or Create Product
- **First Create Cetagory and copy the id**
- **Endpoint:** `POST /products`
- **Description:** Create Products Cetagory wise.
- **Authentication:** Barerare Token required.

**Success Response** (200):

```json
[
  {
  "title": "Samsung Galaxy S24",
  "description": "Latest flagship phone",
  "price": 1200,
  "stock": 50,
  "category": "cetagory id",
  "images": ["image1.jpg"]
  }
]
```

---

---

### 3.2) See product
- **Endpoint:** `GET /products`
- **Description:** Create Products Cetagory wise.
- **Authentication:** Barerare Token required.

**Success Response** (200):

```json
[
  {
        "_id": "69b3cbeb4634575f95320110",
        "title": "Samsung Galaxy S24",
        "description": "Latest flagship phone",
        "price": 1200,
        "stock": 50,
        "images": [
            "image1.jpg"
        ],
        "category": {
            "_id": "69b3ca78d5130813b99c2fdf",
            "name": "Mobile",
            "slug": "mobile"
        },
        "createdBy": "69b25577ce74c3751952ba72",
        "createdAt": "2026-03-13T08:33:47.099Z",
        "updatedAt": "2026-03-13T08:33:47.099Z",
        "__v": 0
    }
]
```

---

---

### 3.3) Update Product
- **Endpoint:** `PATCH /products/product id`
- **Description:** Update Products Id wise.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response Body**
```json
[
  {
    "price": 1500,
    "stock": 100
  }
]
```

**Response after Successfull Update**
```json
[
  {
    "_id": "69b3d299fd81efc3423866df",
    "title": "Samsung Galaxy S24 ultra",
    "description": "Latest flagship phone",
    "price": 1500,
    "stock": 100,
    "images": [
        "image1.jpg"
    ],
    "category": "69b3ca78d5130813b99c2fdf",
    "createdBy": "69b25577ce74c3751952ba72",
    "createdAt": "2026-03-13T09:02:17.218Z",
    "updatedAt": "2026-03-30T06:12:27.958Z",
    "__v": 0
  }
]
```

---

### 3.3) Delete Product
- **Endpoint:** `DELETE /products/product id`
- **Description:** Delete Products Id wise.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response**
```json
[
  {
    "message": "Product deleted successfully"
  }
]
```
---

### 3.4) Upload Product Image
- **Endpoint:** `POST /products/upload`
- **1**. First Login: Login as a admin and get token
- **2**. New Request: Open new tab on Postman
- **3**. Method & URL: POST and URL /products/upload
- **4**. Authorization: Bearer Token Admin Token
- **5**. Body: - select form-data

- **Key:** type image (Select file from Type dropdown)

- **Value:** Choose Files and Select Image

- **6**. Press Send

**Success Response** (200):

**Response**
```json
[
  {
  "imageUrl": "/uploads/image-1710321520000-123456789.png"
  }
]
```
- **1**. Copy this imageUrl
- **2**. And paste it before product creat

**Body**
```json
[
  {
  "title": "New Product with Image",
  "price": 500,
  "images": ["/uploads/image-1710321520000-123456789.png"],
  "category": "..."
  }
]
```

---

### 3.5) Filter Product
- **Endpoint:** `GET /products?search=samsung`
- **1**. Only for search Product by name wise
- **Endpoint:** `GET /products?minPrice=500&maxPrice=2000`
- **2**. Only for Product whose min and max price are between 500 and 2000
- **Endpoint:** `GET /products?category=CATEGORY_ID&page=1&limit=5`
- **3**. Only for product category wise search and pagination data and page limit for each page
- **Endpoint:** `GET /products?search=phone&minPrice=100&page=1&limit=10`
- **4**. Combine them all togather 
- **Endpoint:** `GET /products?sortBy=price&sortOrder=ase`
- **5**. Sort products by assending and decending order  

**Success Response** (200):

**Response**
```json
[
  {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "products": [
        {
            "_id": "69ca1a8c2eb1f039033d2015",
            "title": "Samsung Galaxy S24 ultra",
            "description": "Latest flagship phone",
            "price": 14000,
            "stock": 50,
            "images": [
                "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3JtMzYyLTAxYS1tb2NrdXAuanBn.jpg"
            ],
            "category": {
                "_id": "69b3ca78d5130813b99c2fdf",
                "name": "Mobile",
                "slug": "mobile"
            },
            "createdBy": "69b25577ce74c3751952ba72",
            "createdAt": "2026-03-30T06:39:08.741Z",
            "updatedAt": "2026-03-30T06:39:08.741Z",
            "__v": 0
        }
    ]
}
]
```
---


### 3.6) Cart Product
- **Endpoint:** `POST /cart/add`
- **Description:** Add product to cart.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response Body**
```json
[
  {
    "productId": "69ca1a8c2eb1f039033d2015", 
    "quantity": 2
  }
]
```

**Response after Successfull Update**
```json
[
  {
    "userId": "69ca4b4c633694275fd1e96f",
    "items": [
        {
            "productId": "69ca1a8c2eb1f039033d2015",
            "quantity": 2,
            "price": 14000,
            "_id": "69cb6c4ae75dcb053d996614"
        }
    ],
    "totalPrice": 28000,
    "_id": "69cb6c4ae75dcb053d996613",
    "createdAt": "2026-03-31T06:40:10.965Z",
    "updatedAt": "2026-03-31T06:40:10.965Z",
    "__v": 0
  }
]
```

- **Endpoint:** `GET /cart`
- **Description:** Add product to cart.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response after Successfull Update**
```json
[
  {
    "_id": "69ccad82e2dddb56fa39d4a8",
    "userId": "69ca4b4c633694275fd1e96f",
    "items": [
        {
            "productId": {
                "_id": "69ca1a8c2eb1f039033d2015",
                "title": "Samsung Galaxy S24 ultra",
                "images": [
                    "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3JtMzYyLTAxYS1tb2NrdXAuanBn.jpg"
                ]
            },
            "quantity": 2,
            "price": 14000,
            "_id": "69ccad82e2dddb56fa39d4a9"
        }
    ],
    "totalPrice": 28000,
    "createdAt": "2026-04-01T05:30:42.007Z",
    "updatedAt": "2026-04-01T05:30:42.007Z",
    "__v": 0
  }
]
```

---

### 3.7) Order Product
- **Endpoint:** `POST /orders/checkout`
- **Description:** Order cart added products and clear cart.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response Body**
```json
[
  {
    "address": "Dhaka, Bangladesh"
  }
]
```

**Response after Successfull Order**
```json
[
  {
    "userId": "69ca4b4c633694275fd1e96f",
    "items": [
        {
            "productId": "69ca1a8c2eb1f039033d2015",
            "quantity": 2,
            "price": 14000,
            "_id": "69cb6c4ae75dcb053d996614"
        }
    ],
    "totalAmount": 28000,
    "status": "Pending",
    "address": "Dhaka, Bangladesh",
    "_id": "69ccac6ee2dddb56fa39d49c",
    "createdAt": "2026-04-01T05:26:06.836Z",
    "updatedAt": "2026-04-01T05:26:06.836Z",
    "__v": 0
}
]
```

---

### 3.8) Review Product
- **Endpoint:** `POST /reviews/প্রোডাক্ট-আইডি`
- **Description:** Post review about the product.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response Body**
```json
[
  {
    "rating": 4, 
    "comment": "Excellent product!"
  }
]
```

**Response after Successfull Review**
```json
[
  {
    "productId": "69ca1a8c2eb1f039033d2015",
    "userId": "69ca4b4c633694275fd1e96f",
    "rating": 4,
    "comment": "Excellent product!",
    "_id": "69ccba1637f6be851caed8b3",
    "createdAt": "2026-04-01T06:24:22.525Z",
    "updatedAt": "2026-04-01T06:24:22.525Z",
    "__v": 0
  }
]
```

- **Endpoint:** `GET /reviews/প্রোডাক্ট-আইডি`
- **Description:** Get all review about the product.
- **Authentication:** Barerare Token required.

**Success Response** (200):

**Response after Successfull Review**
```json
[
  {
        "_id": "69ccb9da5195bfbe935fc792",
        "productId": "69ca1a8c2eb1f039033d2015",
        "userId": {
            "_id": "69ca4b4c633694275fd1e96f",
            "email": "admin2@example.com"
        },
        "rating": 5,
        "comment": "Excellent product!",
        "createdAt": "2026-04-01T06:23:22.043Z",
        "updatedAt": "2026-04-01T06:23:22.043Z",
        "__v": 0
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
