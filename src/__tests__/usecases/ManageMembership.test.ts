import { ManageMembership } from '../../usecases/membership/ManageMembership';
import { MembershipRepository } from '../../domain/repositories/MembershipRepository';
import { GymRepository } from '../../domain/repositories/GymRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';

describe('ManageMembership', () => {
  let manageMembership: ManageMembership;
  let mockMembershipRepository: jest.Mocked<MembershipRepository>;
  let mockGymRepository: jest.Mocked<GymRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockMembershipRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findByGym: jest.fn(),
      findByUser: jest.fn(),
      exists: jest.fn(),
    };
    mockGymRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithAvailability: jest.fn(),
      getMemberCount: jest.fn(),
    };
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    manageMembership = new ManageMembership(mockMembershipRepository, mockGymRepository, mockUserRepository);
  });

  it('should add user to gym when capacity allows', async () => {
    const userId = 'user1';
    const gymId = 'gym1';
    const gym = { id: gymId, name: 'Test Gym', type: 'commercial' as const, capacity: 10, createdAt: new Date(), updatedAt: new Date() };
    const user = { id: userId, name: 'John', email: 'john@test.com', dateOfBirth: new Date(), fitnessGoal: 'strength', createdAt: new Date(), updatedAt: new Date() };
    const membership = { id: 'mem1', userId, gymId, joinedAt: new Date() };

    mockUserRepository.findById.mockResolvedValue(user);
    mockGymRepository.findById.mockResolvedValue(gym);
    mockMembershipRepository.exists.mockResolvedValue(false);
    mockGymRepository.getMemberCount.mockResolvedValue(5);
    mockMembershipRepository.create.mockResolvedValue(membership);

    const result = await manageMembership.addUserToGym(userId, gymId);

    expect(result).toEqual(membership);
    expect(mockMembershipRepository.create).toHaveBeenCalledWith(userId, gymId);
  });

  it('should throw error when gym is at capacity', async () => {
    const userId = 'user1';
    const gymId = 'gym1';
    const gym = { id: gymId, name: 'Test Gym', type: 'commercial' as const, capacity: 5, createdAt: new Date(), updatedAt: new Date() };
    const user = { id: userId, name: 'John', email: 'john@test.com', dateOfBirth: new Date(), fitnessGoal: 'strength', createdAt: new Date(), updatedAt: new Date() };

    mockUserRepository.findById.mockResolvedValue(user);
    mockGymRepository.findById.mockResolvedValue(gym);
    mockMembershipRepository.exists.mockResolvedValue(false);
    mockGymRepository.getMemberCount.mockResolvedValue(5);

    await expect(manageMembership.addUserToGym(userId, gymId)).rejects.toThrow('Gym has reached maximum capacity');
    expect(mockMembershipRepository.create).not.toHaveBeenCalled();
  });
});