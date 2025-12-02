import { Membership, MembershipWithDetails } from '../entities/Membership';

export interface MembershipRepository {
  create(userId: string, gymId: string): Promise<Membership>;
  delete(userId: string, gymId: string): Promise<void>;
  findByGym(gymId: string): Promise<MembershipWithDetails[]>;
  findByUser(userId: string): Promise<MembershipWithDetails[]>;
  exists(userId: string, gymId: string): Promise<boolean>;
}