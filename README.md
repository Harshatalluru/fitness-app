# Fitness Platform API

A REST API for managing gyms and users at a fitness platform, built with clean architecture principles.

## Features

- **User Management**: CRUD operations for users with unique email validation
- **Gym Management**: CRUD operations for gyms with capacity constraints
- **Membership System**: Many-to-many relationships between users and gyms
- **Business Logic**: Capacity validation and availability tracking
- **Clean Architecture**: Separation of concerns with domain, use cases, and infrastructure layers

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest with Supertest
- **Deployment**: Docker

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Gyms
- `POST /api/gyms` - Create a new gym
- `GET /api/gyms` - Get all gyms
- `GET /api/gyms/:id` - Get gym by ID
- `GET /api/gyms/availability` - Get gyms sorted by available spots

### Memberships
- `POST /api/memberships` - Add user to gym
- `DELETE /api/memberships` - Remove user from gym
- `GET /api/memberships/gym/:gymId` - Get all members of a gym
- `GET /api/memberships/user/:userId` - Get all gyms for a user

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Local Development

1. **Clone and install dependencies**:
```bash
npm install
cd frontend && npm install && cd ..
```

2. **Setup database**:
```bash
# Start PostgreSQL locally or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fitness_platform -p 5432:5432 -d postgres:15-alpine

# Run migrations
npm run db:migrate
```

3. **Start development servers**:
```bash
# Backend API
npm run dev

# Frontend (in another terminal)
cd frontend && npm run dev
```

4. **Access the application**:
- API: http://localhost:3000
- Frontend: http://localhost:5173
- API Documentation: http://localhost:3000/api-docs

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch
```

## API Examples

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "dateOfBirth": "1990-01-01",
    "fitnessGoal": "strength"
  }'
```

### Create Gym
```bash
curl -X POST http://localhost:3000/api/gyms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PowerHouse Gym",
    "type": "commercial",
    "location": "Downtown",
    "capacity": 100
  }'
```

### Add User to Gym
```bash
curl -X POST http://localhost:3000/api/memberships \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "gymId": "gym_id_here"
  }'
```

## Architecture Decisions

### Clean Architecture
- **Domain Layer**: Entities and repository interfaces
- **Use Cases Layer**: Business logic and application rules
- **Infrastructure Layer**: Database implementations and external services
- **Interface Layer**: Controllers, routes, and validation

### Design Patterns
- **Repository Pattern**: Abstracts data access logic
- **Dependency Injection**: Enables testability and flexibility
- **Single Responsibility**: Each class has one reason to change

### Business Rules
- Users must have unique emails
- Gyms can have optional capacity limits
- Users cannot join the same gym twice
- Capacity validation prevents overbooking

## Trade-offs and Improvements

### Current Trade-offs
- Simple validation (could use more sophisticated schema validation)
- Basic error handling (could implement custom error types)
- No authentication/authorization (would add JWT in production)

### Future Improvements
- Add caching layer (Redis)
- Implement event sourcing for audit trails
- Add rate limiting and API versioning
- Implement soft deletes
- Add comprehensive logging and monitoring