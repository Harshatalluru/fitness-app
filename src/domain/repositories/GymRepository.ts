import { Gym, CreateGymData, UpdateGymData, GymWithAvailability } from '../entities/Gym';

export interface GymRepository {
  create(data: CreateGymData): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  findAll(): Promise<Gym[]>;
  update(id: string, data: UpdateGymData): Promise<Gym>;
  delete(id: string): Promise<void>;
  findWithAvailability(): Promise<GymWithAvailability[]>;
  getMemberCount(gymId: string): Promise<number>;
}