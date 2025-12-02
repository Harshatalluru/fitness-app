export interface Membership {
  id: string;
  userId: string;
  gymId: string;
  joinedAt: Date;
}

export interface MembershipWithDetails extends Membership {
  user: {
    id: string;
    name: string;
    email: string;
  };
  gym: {
    id: string;
    name: string;
    type: string;
  };
}