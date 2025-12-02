import React, { useState, useEffect } from 'react';
import { userApi, gymApi } from '../api';
import { User, Gym } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGyms: 0,
    recentUsers: [] as User[],
    recentGyms: [] as Gym[]
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersRes, gymsRes] = await Promise.all([
        userApi.getAll(),
        gymApi.getAll()
      ]);
      
      setStats({
        totalUsers: usersRes.data.length,
        totalGyms: gymsRes.data.length,
        recentUsers: usersRes.data.slice(0, 5),
        recentGyms: gymsRes.data.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Gyms</h3>
          <p className="text-3xl font-bold">{stats.totalGyms}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-2">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Gyms</h3>
          <div className="space-y-2">
            {stats.recentGyms.map((gym) => (
              <div key={gym.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{gym.name}</span>
                <span className="text-sm text-gray-600">{gym.location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};