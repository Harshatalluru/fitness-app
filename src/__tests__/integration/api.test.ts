import request from 'supertest';
import { createApp } from '../../app';

// Mock Prisma for integration tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn().mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com', dateOfBirth: new Date('1990-01-01'), fitnessGoal: 'strength', createdAt: new Date(), updatedAt: new Date() }),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null)
    },
    gym: {
      create: jest.fn().mockResolvedValue({ id: '1', name: 'Test Gym', type: 'commercial', location: 'Test Location', capacity: 50, createdAt: new Date(), updatedAt: new Date() }),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null)
    },
    $disconnect: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('API Integration Tests', () => {
  let app: any;
  let prisma: any;

  beforeAll(() => {
    const appInstance = createApp();
    app = appInstance.app;
    prisma = appInstance.prisma;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Users API', () => {
    it('should create a user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        dateOfBirth: '1990-01-01',
        fitnessGoal: 'strength'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it('should get all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Gyms API', () => {
    it('should create a gym', async () => {
      const gymData = {
        name: 'Test Gym',
        type: 'commercial',
        location: 'Test Location',
        capacity: 50
      };

      const response = await request(app)
        .post('/api/gyms')
        .send(gymData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(gymData.name);
      expect(response.body.type).toBe(gymData.type);
    });

    it('should get gyms with availability', async () => {
      const response = await request(app).get('/api/gyms/availability');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});