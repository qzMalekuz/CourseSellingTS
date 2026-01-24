# Course Selling Platform

A TypeScript-based course selling platform built with Express, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: Zod

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

### Courses (`/courses`)
- `POST /courses` - Create course (Instructor only)
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course details (Instructor only)
- `PATCH /courses/:id` - Update course (Instructor only)
- `DELETE /courses/:id` - Delete course (Instructor only)

### Lessons & Purchases
Reserved for future implementation.

## Getting Started

### Prerequisites
- Bun runtime
- PostgreSQL database

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up `.env` file:
   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   SALT_ROUNDS=10
   DATABASE_URL=postgresql://user:password@localhost:5432/course_selling
   ```

3. Run migrations:
   ```bash
   bun prisma migrate dev
   ```

4. Start server:
   ```bash
   bun run src/index.ts
   ```

## Authentication

Include JWT token in headers:
```
Authorization: Bearer <token>
```

## Database Models

- **User** - Stores user information (STUDENT/INSTRUCTOR roles)
- **Course** - Course details created by instructors
- **Lesson** - Lessons within courses
- **Purchase** - Course purchases by students
