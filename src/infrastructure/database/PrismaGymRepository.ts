import { PrismaClient } from '@prisma/client';
import { GymRepository } from '../../domain/repositories/GymRepository';
import { Gym, CreateGymData, UpdateGymData, GymWithAvailability } from '../../domain/entities/Gym';

export class PrismaGymRepository implements GymRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateGymData): Promise<Gym> {
    const gym = await this.prisma.gym.create({ data });
    return gym as Gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await this.prisma.gym.findUnique({ where: { id } });
    return gym as Gym | null;
  }

  async findAll(): Promise<Gym[]> {
    const gyms = await this.prisma.gym.findMany({ orderBy: { createdAt: 'desc' } });
    return gyms as Gym[];
  }

  async update(id: string, data: UpdateGymData): Promise<Gym> {
    const gym = await this.prisma.gym.update({ where: { id }, data });
    return gym as Gym;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.gym.delete({ where: { id } });
  }

  async findWithAvailability(): Promise<GymWithAvailability[]> {
    const gyms = await this.prisma.gym.findMany({
      include: { _count: { select: { memberships: true } } }
    });

    return gyms
      .map(gym => ({
        ...gym,
        currentMembers: gym._count.memberships,
        availableSpots: gym.capacity ? gym.capacity - gym._count.memberships : Infinity
      } as GymWithAvailability))
      .sort((a, b) => {
        if (a.availableSpots === Infinity && b.availableSpots === Infinity) return 0;
        if (a.availableSpots === Infinity) return -1;
        if (b.availableSpots === Infinity) return 1;
        return b.availableSpots - a.availableSpots;
      });
  }

  async getMemberCount(gymId: string): Promise<number> {
    return this.prisma.membership.count({ where: { gymId } });
  }
}