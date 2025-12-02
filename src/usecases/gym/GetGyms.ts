import { GymRepository } from '../../domain/repositories/GymRepository';
import { Gym, GymWithAvailability } from '../../domain/entities/Gym';

export class GetGyms {
  constructor(private gymRepository: GymRepository) {}

  async execute(): Promise<Gym[]> {
    return this.gymRepository.findAll();
  }

  async executeById(id: string): Promise<Gym> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new Error('Gym not found');
    }
    return gym;
  }

  async executeWithAvailability(): Promise<GymWithAvailability[]> {
    return this.gymRepository.findWithAvailability();
  }
}