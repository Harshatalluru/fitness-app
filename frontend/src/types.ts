export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  fitnessGoal: string;
  createdAt: string;
}

export interface Gym {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity?: number;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  gymId: string;
  joinedAt: string;
}

export interface MembershipWithGym extends Membership {
  gym: Gym;
}

export interface MembershipWithUser extends Membership {
  user: User;
}