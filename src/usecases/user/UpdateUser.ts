import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, UpdateUserData } from '../../domain/entities/User';

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }
    
    return this.userRepository.update(id, data);
  }
}