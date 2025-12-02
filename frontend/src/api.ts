import axios from 'axios';
import { User, Gym, Membership } from './types';

const api = axios.create({
  baseURL: 'https://fitness-app-latest-ld2y.onrender.com/api',
});

// User API
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: Omit<User, 'id' | 'createdAt'>) => api.post<User>('/users', data),
  update: (id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Gym API
export const gymApi = {
  getAll: () => api.get<Gym[]>('/gyms'),
  getById: (id: string) => api.get<Gym>(`/gyms/${id}`),
  getWithAvailability: () => api.get<(Gym & { currentMembers: number; availableSpots: number })[]>('/gyms/availability'),
  create: (data: Omit<Gym, 'id' | 'createdAt'>) => api.post<Gym>('/gyms', data),
  update: (id: string, data: Partial<Omit<Gym, 'id' | 'createdAt'>>) => api.put<Gym>(`/gyms/${id}`, data),
  delete: (id: string) => api.delete(`/gyms/${id}`),
};

// Membership API
export const membershipApi = {
  addUserToGym: (userId: string, gymId: string) => api.post<Membership>('/memberships', { userId, gymId }),
  removeUserFromGym: (userId: string, gymId: string) => api.delete('/memberships', { data: { userId, gymId } }),
  getGymMembers: (gymId: string) => api.get<Array<Membership & { user: User; gym: Gym }>>(`/memberships/gym/${gymId}`),
  getUserGyms: (userId: string) => api.get<Array<Membership & { user: User; gym: Gym }>>(`/memberships/user/${userId}`),
};