import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
import { specs } from './swagger';

import { PrismaUserRepository } from './infrastructure/database/PrismaUserRepository';
import { PrismaGymRepository } from './infrastructure/database/PrismaGymRepository';
import { PrismaMembershipRepository } from './infrastructure/database/PrismaMembershipRepository';

import { CreateUser } from './usecases/user/CreateUser';
import { GetUsers } from './usecases/user/GetUsers';
import { DeleteUser } from './usecases/user/DeleteUser';
import { UpdateUser } from './usecases/user/UpdateUser';
import { CreateGym } from './usecases/gym/CreateGym';
import { GetGyms } from './usecases/gym/GetGyms';
import { DeleteGym } from './usecases/gym/DeleteGym';
import { UpdateGym } from './usecases/gym/UpdateGym';
import { ManageMembership } from './usecases/membership/ManageMembership';

import { UserController } from './interfaces/controllers/UserController';
import { GymController } from './interfaces/controllers/GymController';
import { MembershipController } from './interfaces/controllers/MembershipController';

import { createUserRoutes } from './interfaces/routes/userRoutes';
import { createGymRoutes } from './interfaces/routes/gymRoutes';
import { createMembershipRoutes } from './interfaces/routes/membershipRoutes';

export function createApp() {
  const app = express();
  const prisma = new PrismaClient();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Repositories
  const userRepository = new PrismaUserRepository(prisma);
  const gymRepository = new PrismaGymRepository(prisma);
  const membershipRepository = new PrismaMembershipRepository(prisma);

  // Use Cases
  const createUser = new CreateUser(userRepository);
  const getUsers = new GetUsers(userRepository);
  const deleteUser = new DeleteUser(userRepository);
  const updateUser = new UpdateUser(userRepository);
  const createGym = new CreateGym(gymRepository);
  const getGyms = new GetGyms(gymRepository);
  const deleteGym = new DeleteGym(gymRepository);
  const updateGym = new UpdateGym(gymRepository);
  const manageMembership = new ManageMembership(membershipRepository, gymRepository, userRepository);

  // Controllers
  const userController = new UserController(createUser, getUsers, deleteUser, updateUser);
  const gymController = new GymController(createGym, getGyms, deleteGym, updateGym);
  const membershipController = new MembershipController(manageMembership);

  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Routes
  app.use('/api/users', createUserRoutes(userController));
  app.use('/api/gyms', createGymRoutes(gymController));
  app.use('/api/memberships', createMembershipRoutes(membershipController));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  return { app, prisma };
}