import { CreateUser } from '../../usecases/user/CreateUser';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { CreateUserData } from '../../domain/entities/User';

describe('CreateUser', () => {
  let createUser: CreateUser;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createUser = new CreateUser(mockUserRepository);
  });

  it('should create a user when email is unique', async () => {
    const userData: CreateUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: new Date('1990-01-01'),
      fitnessGoal: 'strength'
    };

    const expectedUser = { 
      ...userData, 
      id: '1', 
      createdAt: new Date(), 
      updatedAt: new Date(),
      dateOfBirth: new Date('1990-01-01')
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(expectedUser);

    const result = await createUser.execute(userData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(expectedUser);
  });

  it('should throw error when email already exists', async () => {
    const userData: CreateUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: new Date('1990-01-01'),
      fitnessGoal: 'strength'
    };

    const existingUser = { 
      ...userData, 
      id: '1', 
      createdAt: new Date(), 
      updatedAt: new Date(),
      dateOfBirth: new Date('1990-01-01')
    };
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUser.execute(userData)).rejects.toThrow('User with this email already exists');
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});