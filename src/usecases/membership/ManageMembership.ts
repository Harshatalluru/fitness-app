import { MembershipRepository } from '../../domain/repositories/MembershipRepository';
import { GymRepository } from '../../domain/repositories/GymRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Membership, MembershipWithDetails } from '../../domain/entities/Membership';

export class ManageMembership {
  constructor(
    private membershipRepository: MembershipRepository,
    private gymRepository: GymRepository,
    private userRepository: UserRepository
  ) {}

  async addUserToGym(userId: string, gymId: string): Promise<Membership> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const gym = await this.gymRepository.findById(gymId);
    if (!gym) {
      throw new Error('Gym not found');
    }

    const membershipExists = await this.membershipRepository.exists(userId, gymId);
    if (membershipExists) {
      throw new Error('User is already a member of this gym');
    }

    if (gym.capacity) {
      const currentMembers = await this.gymRepository.getMemberCount(gymId);
      if (currentMembers >= gym.capacity) {
        throw new Error('Gym has reached maximum capacity');
      }
    }

    return this.membershipRepository.create(userId, gymId);
  }

  async removeUserFromGym(userId: string, gymId: string): Promise<void> {
    const membershipExists = await this.membershipRepository.exists(userId, gymId);
    if (!membershipExists) {
      throw new Error('Membership not found');
    }

    return this.membershipRepository.delete(userId, gymId);
  }

  async getGymMembers(gymId: string): Promise<MembershipWithDetails[]> {
    const gym = await this.gymRepository.findById(gymId);
    if (!gym) {
      throw new Error('Gym not found');
    }

    return this.membershipRepository.findByGym(gymId);
  }

  async getUserGyms(userId: string): Promise<MembershipWithDetails[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.membershipRepository.findByUser(userId);
  }
}