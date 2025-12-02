import { PrismaClient } from '@prisma/client';
import { MembershipRepository } from '../../domain/repositories/MembershipRepository';
import { Membership, MembershipWithDetails } from '../../domain/entities/Membership';

export class PrismaMembershipRepository implements MembershipRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, gymId: string): Promise<Membership> {
    return this.prisma.membership.create({
      data: { userId, gymId }
    });
  }

  async delete(userId: string, gymId: string): Promise<void> {
    await this.prisma.membership.delete({
      where: { userId_gymId: { userId, gymId } }
    });
  }

  async findByGym(gymId: string): Promise<MembershipWithDetails[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { gymId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        gym: { select: { id: true, name: true, type: true } }
      },
      orderBy: { joinedAt: 'desc' }
    });

    return memberships;
  }

  async findByUser(userId: string): Promise<MembershipWithDetails[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        gym: { select: { id: true, name: true, type: true } }
      },
      orderBy: { joinedAt: 'desc' }
    });

    return memberships;
  }

  async exists(userId: string, gymId: string): Promise<boolean> {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_gymId: { userId, gymId } }
    });
    return !!membership;
  }
}