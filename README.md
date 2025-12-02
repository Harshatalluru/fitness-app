# Fitness Platform - Full Stack Application

A comprehensive fitness platform with REST API backend and React frontend for managing gyms, users, and memberships. Built with clean architecture principles and modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Backend Documentation](#backend-documentation)
- [Frontend Documentation](#frontend-documentation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This fitness platform provides a complete solution for managing fitness facilities, users, and memberships. The application follows clean architecture principles with clear separation between domain logic, use cases, and infrastructure concerns.

### Key Capabilities
- **User Management**: Complete CRUD operations with unique email validation
- **Gym Management**: Facility management with capacity constraints
- **Membership System**: Many-to-many relationships with business rule validation
- **Real-time Updates**: Live capacity tracking and availability monitoring
- **Responsive UI**: Modern React interface with Tailwind CSS

## ✨ Features

### Backend Features
- RESTful API with Express.js and TypeScript
- Clean Architecture with Domain-Driven Design
- PostgreSQL database with Prisma ORM
- Comprehensive validation and error handling
- Swagger API documentation
- Docker containerization
- Unit and integration testing

### Frontend Features
- Modern React 18 with TypeScript
- Responsive design with Tailwind CSS
- Real-time data updates
- Component-based architecture
- Type-safe API integration
- Vite for fast development

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Development**: Hot Module Replacement

### DevOps & Tools
- **Database**: PostgreSQL 15
- **Container**: Docker & Docker Compose
- **Version Control**: Git
- **Package Manager**: npm

## 🏗 Architecture

### Backend Architecture (Clean Architecture)

```
src/
├── domain/           # Business entities and repository interfaces
│   ├── entities/     # Core business objects (User, Gym, Membership)
│   └── repositories/ # Repository interfaces
├── usecases/         # Application business logic
│   ├── user/         # User-related use cases
│   ├── gym/          # Gym-related use cases
│   └── membership/   # Membership-related use cases
├── infrastructure/   # External concerns (database, APIs)
│   └── database/     # Prisma repository implementations
├── interfaces/       # Controllers and routes
│   ├── controllers/  # HTTP request handlers
│   └── routes/       # Express route definitions
└── __tests__/        # Test files
```

### Frontend Architecture

```
frontend/src/
├── components/       # React components
│   ├── Dashboard.tsx
│   ├── UserManagement.tsx
│   ├── GymManagement.tsx
│   └── MembershipManagement.tsx
├── api.ts           # API client configuration
├── types.ts         # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 15 or higher
- Docker (optional but recommended)
- Git

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**:
```bash
git clone <repository-url>
cd fitness-app
```

2. **Start with Docker Compose**:
```bash
docker-compose up --build
```

3. **Access the applications**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

### Option 2: Local Development Setup

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd fitness-app

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. **Setup PostgreSQL database**:
```bash
# Option A: Using Docker
docker run --name postgres-fitness \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=fitness_platform \
  -p 5432:5432 -d postgres:15-alpine

# Option B: Use existing PostgreSQL installation
# Create database: fitness_platform
```

3. **Configure environment variables**:
```bash
# Copy and edit .env file
cp .env.example .env

# Edit DATABASE_URL in .env:
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitness_platform"
```

4. **Setup database schema**:
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data (optional)
npm run db:seed
```

5. **Start development servers**:
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

6. **Access the applications**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

## 🔧 Backend Documentation

### Project Structure

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts          # User entity with business rules
│   │   ├── Gym.ts           # Gym entity with capacity logic
│   │   └── Membership.ts    # Membership entity
│   └── repositories/
│       ├── UserRepository.ts      # User repository interface
│       ├── GymRepository.ts       # Gym repository interface
│       └── MembershipRepository.ts # Membership repository interface
├── usecases/
│   ├── user/
│   │   ├── CreateUser.ts    # Create user use case
│   │   ├── GetUsers.ts      # Get users use case
│   │   ├── UpdateUser.ts    # Update user use case
│   │   └── DeleteUser.ts    # Delete user use case
│   ├── gym/
│   │   ├── CreateGym.ts     # Create gym use case
│   │   ├── GetGyms.ts       # Get gyms use case
│   │   ├── UpdateGym.ts     # Update gym use case
│   │   └── DeleteGym.ts     # Delete gym use case
│   └── membership/
│       └── ManageMembership.ts # Membership management
├── infrastructure/
│   └── database/
│       ├── PrismaUserRepository.ts      # User repository implementation
│       ├── PrismaGymRepository.ts       # Gym repository implementation
│       └── PrismaMembershipRepository.ts # Membership repository implementation
├── interfaces/
│   ├── controllers/
│   │   ├── UserController.ts      # User HTTP handlers
│   │   ├── GymController.ts       # Gym HTTP handlers
│   │   └── MembershipController.ts # Membership HTTP handlers
│   └── routes/
│       ├── userRoutes.ts          # User route definitions
│       ├── gymRoutes.ts           # Gym route definitions
│       ├── membershipRoutes.ts    # Membership route definitions
│       └── validation.ts          # Request validation schemas
├── app.ts           # Express app configuration
├── index.ts         # Application entry point
└── swagger.ts       # API documentation setup
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fitness_platform"

# Server
PORT=3000
NODE_ENV=development

# Docker (if using Docker Compose)
POSTGRES_PASSWORD=secure_password_123
```

### Business Rules

1. **User Management**:
   - Email addresses must be unique
   - Date of birth is required
   - Fitness goals are categorized (strength, cardio, flexibility, etc.)

2. **Gym Management**:
   - Gyms can have optional capacity limits
   - Types include: commercial, home, outdoor, specialized
   - Location is optional but recommended

3. **Membership System**:
   - Users cannot join the same gym twice
   - Capacity validation prevents overbooking
   - Cascade deletion maintains data integrity

## 🎨 Frontend Documentation

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Main dashboard component
│   │   ├── UserManagement.tsx      # User CRUD operations
│   │   ├── GymManagement.tsx       # Gym CRUD operations
│   │   └── MembershipManagement.tsx # Membership operations
│   ├── api.ts                      # Axios API client
│   ├── types.ts                    # TypeScript interfaces
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

### Available Scripts

```bash
cd frontend

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Component Overview

#### Dashboard.tsx
- Main application layout
- Navigation between different sections
- Real-time statistics display

#### UserManagement.tsx
- User creation form with validation
- Edit and delete operations
- Membership status display

#### GymManagement.tsx
- Gym creation and editing
- Capacity management
- Availability tracking
- Member count display

#### MembershipManagement.tsx
- Add/remove user-gym relationships
- Membership history
- Capacity validation

### Styling

The frontend uses Tailwind CSS for styling with a modern, responsive design:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B'
      }
    }
  },
  plugins: []
}
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### Authentication
Currently, the API doesn't require authentication. In production, implement JWT tokens.

### Users Endpoints

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-01",
  "fitnessGoal": "strength"
}
```

#### Get All Users
```http
GET /api/users
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Smith",
  "fitnessGoal": "cardio"
}
```

#### Delete User
```http
DELETE /api/users/:id
```

### Gyms Endpoints

#### Create Gym
```http
POST /api/gyms
Content-Type: application/json

{
  "name": "PowerHouse Gym",
  "type": "commercial",
  "location": "Downtown",
  "capacity": 100
}
```

#### Get All Gyms
```http
GET /api/gyms
```

#### Get Gym by ID
```http
GET /api/gyms/:id
```

#### Get Gyms by Availability
```http
GET /api/gyms/availability
```

#### Update Gym
```http
PUT /api/gyms/:id
Content-Type: application/json

{
  "name": "Updated Gym Name",
  "capacity": 150
}
```

#### Delete Gym
```http
DELETE /api/gyms/:id
```

### Memberships Endpoints

#### Add User to Gym
```http
POST /api/memberships
Content-Type: application/json

{
  "userId": "user_id_here",
  "gymId": "gym_id_here"
}
```

#### Remove User from Gym
```http
DELETE /api/memberships
Content-Type: application/json

{
  "userId": "user_id_here",
  "gymId": "gym_id_here"
}
```

#### Get Gym Members
```http
GET /api/memberships/gym/:gymId
```

#### Get User Memberships
```http
GET /api/memberships/user/:userId
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    "id": "clq1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "details": {}
  }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🧪 Testing

### Backend Testing

#### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- CreateUser.test.ts
```

#### Test Structure
```
src/__tests__/
├── usecases/
│   ├── CreateUser.test.ts
│   └── ManageMembership.test.ts
└── integration/
    └── api.test.ts
```

#### Example Test
```typescript
// CreateUser.test.ts
describe('CreateUser', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: new Date('1990-01-01'),
      fitnessGoal: 'strength'
    };
    
    const user = await createUser.execute(userData);
    expect(user.email).toBe('john@example.com');
  });
});
```

### Frontend Testing

Currently, frontend testing is not implemented. Recommended additions:

```bash
# Install testing dependencies
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## 🚢 Deployment

### Docker Deployment (Recommended)

#### Production Build
```bash
# Build the application
docker build -t fitness-app .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### Environment Configuration
```yaml
# docker-compose.prod.yml
services:
  app:
    image: fitness-app:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/fitness_platform
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=fitness_platform
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Manual Deployment

#### Backend Deployment
```bash
# Build the application
npm run build

# Set production environment variables
export DATABASE_URL="your_production_database_url"
export NODE_ENV=production

# Start the application
npm start
```

#### Frontend Deployment
```bash
cd frontend

# Build for production
npm run build

# Deploy dist/ folder to your static hosting service
# (Netlify, Vercel, AWS S3,Render, etc.)
```

### Performance Optimization (Need to implement)

#### Backend
- Implement database indexing
- Add Redis caching layer
- Use connection pooling
- Implement rate limiting
- Add request compression

#### Frontend
- Implement code splitting
- Add lazy loading
- Optimize bundle size
- Use React.memo for expensive components
- Implement virtual scrolling for large lists

### Security Considerations

#### Current Implementation
- Input validation with express-validator
- CORS configuration
- Helmet for security headers
- Environment variable protection

#### Production Recommendations
- Implement JWT authentication
- Add rate limiting
- Use HTTPS only
- Implement API versioning
- Add request logging
- Use secrets management
- Implement RBAC (Role-Based Access Control)

### Monitoring and Logging

#### Recommended Tools
- **Logging**: Winston or Pino
- **Monitoring**: New Relic or DataDog
- **Error Tracking**: Sentry
- **Performance**: Lighthouse CI
- **Database**: PostgreSQL logs and pg_stat_statements
