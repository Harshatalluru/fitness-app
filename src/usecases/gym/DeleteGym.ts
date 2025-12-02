import { GymRepository } from '../../domain/repositories/GymRepository';

export class DeleteGym {
  constructor(private gymRepository: GymRepository) {}

  async execute(id: string): Promise<void> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new Error('Gym not found');
    }
    await this.gymRepository.delete(id);
  }
}