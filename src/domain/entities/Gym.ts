export interface Gym {
  id: string;
  name: string;
  type: 'commercial' | 'home' | 'apartment';
  location?: string;
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGymData {
  name: string;
  type: 'commercial' | 'home' | 'apartment';
  location?: string;
  capacity?: number;
}

export interface UpdateGymData {
  name?: string;
  type?: 'commercial' | 'home' | 'apartment';
  location?: string;
  capacity?: number;
}

export interface GymWithAvailability extends Gym {
  availableSpots: number;
  currentMembers: number;
}