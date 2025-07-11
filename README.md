# 🛒 E-Procurement API (NestJS)

This is the backend API for an electronic procurement (e-procurement) system, built with [NestJS](https://nestjs.com/).  
It provides RESTful endpoints for managing users, vendors, products, and authentication. The system is designed with a modular architecture, secure JWT-based authentication, and modern TypeScript best practices.

Main features include:
- User registration and login with JWT
- Vendor management linked to user identity
- Product management scoped by vendor
- Scalable and maintainable module structure using NestJS


---

## 🚀 Tech Stack

- **Backend Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** JWT & Passport
- **Validation:** class-validator & class-transformer
- **Hashing:** bcrypt
- **Utilities:** lodash, multer (optional for file upload)
- **Linting & Formatting:** ESLint & Prettier
- **Database:** PostgreSQL / MySQL (via Prisma)

---

## 📁 Project Structure

```
e-procurement-be/
├── src/
│   ├── auth/              # Authentication and authorization
│   ├── product/       # Product modules
│   ├── vendor/       # Vendor modules
│   ├── common/            # Reusable decorators, filters, interceptors
│   ├── jwt.config         # JWT configuration loaded from environment variables
│   └── main.ts            # Entry point
├── prisma/                # Prisma schema & migration files
├── .env                   # Environment variables
├── package.json           # Project metadata & dependencies
├── tsconfig*.json         # TypeScript configuration
└── README.md              # Project documentation
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clonehttps://github.com/Alif04/e-procurement-be.git
cd e-procurement-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file at the root level:

```env
DATABASE_URL=mysql://user:password@localhost:5432/yourdb
USER_SECRET=your_jwt_secret
USER_EXPIRED='1h' //example
PORT=3000
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 6. Start the Application

- Development:
  ```bash
  npm run start:dev
  ```
- Production:
  ```bash
  npm run build
  npm run start:prod
  ```

---

## 🔐 Authentication

Authentication is handled via [JWT (JSON Web Tokens)](https://jwt.io/). After successful login, users will receive a token.

**Use token in headers for protected routes:**

```http
Authorization: Bearer <token>
```

---

## 📦 Available NPM Scripts

| Script        | Description                         |
|---------------|-------------------------------------|
| `start`       | Start the app                       |
| `start:dev`   | Start with hot reload (dev mode)    |
| `start:prod`  | Start in production mode            |
| `build`       | Compile the TypeScript code         |
| `lint`        | Lint project files with ESLint      |
| `format`      | Format code using Prettier          |

---

## 📮 API Overview

| Method | Endpoint           | Description                                        |
|--------|--------------------|----------------------------------------------------|
| POST   | /auth/login        | Login user                                         |
| POST   | /auth/register     | Register new user                                  |
| POST   | /vendor            | Create a vendor using authenticated user's ID     |
| GET    | /vendor            | Get all vendors (admin only or filtered by user)  |
| GET    | /vendor/:id        | Get vendor details by ID                           |
| PUT    | /vendor/:id        | Update vendor information                          |
| DELETE | /vendor/:id        | Delete vendor                                      |
| POST   | /product           | Create a product (uses vendor ID from token)       |
| GET    | /product           | List all products                                  |
| GET    | /product/:id       | Get product details by ID                          |
| PUT    | /product/:id       | Update product by ID                               |
| DELETE | /product/:id       | Delete product by ID                               |

---

## 📌 Environment Variables

You need the following variables in your `.env` file:

| Variable         | Required | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| `DATABASE_URL`   | ✅        | Prisma-supported DB connection URI                                          |
| `USER_SECRET`    | ✅        | Secret key used to sign JWT tokens                                         |
| `USER_EXPIRED`   | ✅        | JWT expiration duration (e.g., `1d`, `12h`, `30m`)                          |
| `PORT`           | ❌        | Port number the app listens on (default: 3000)                              |

---

### 🔒 About `USER_EXPIRED`

This sets how long a token is valid after login.

✅ Supported formats:
- `60` → 60 seconds
- `10m` → 10 minutes
- `2h` → 2 hours
- `7d` → 7 days

---

## 🧑‍💻 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork this repo
2. Create a new branch (`git checkout -b feature-xyz`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> Developed with using NestJS, Prisma, and TypeScript.
