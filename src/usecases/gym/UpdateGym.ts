import { GymRepository } from '../../domain/repositories/GymRepository';
import { Gym, UpdateGymData } from '../../domain/entities/Gym';

export class UpdateGym {
  constructor(private gymRepository: GymRepository) {}

  async execute(id: string, data: UpdateGymData): Promise<Gym> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new Error('Gym not found');
    }
    return this.gymRepository.update(id, data);
  }
}