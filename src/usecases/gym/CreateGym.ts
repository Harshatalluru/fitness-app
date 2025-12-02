import { GymRepository } from '../../domain/repositories/GymRepository';
import { CreateGymData, Gym } from '../../domain/entities/Gym';

export class CreateGym {
  constructor(private gymRepository: GymRepository) {}

  async execute(data: CreateGymData): Promise<Gym> {
    if (data.capacity && data.capacity <= 0) {
      throw new Error('Gym capacity must be greater than 0');
    }

    return this.gymRepository.create(data);
  }
}