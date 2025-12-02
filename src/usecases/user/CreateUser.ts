import { UserRepository } from '../../domain/repositories/UserRepository';
import { CreateUserData, User } from '../../domain/entities/User';

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserData): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const userData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth)
    };

    return this.userRepository.create(userData);
  }
}