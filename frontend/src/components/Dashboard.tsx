import React, { useState, useEffect } from 'react';
import { userApi, gymApi } from '../api';
import { User, Gym } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGyms: 0,
    recentUsers: [] as User[],
    recentGyms: [] as Gym[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">Monitor your fitness platform performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl opacity-80">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Gyms</h3>
              <p className="text-3xl font-bold">{stats.totalGyms}</p>
            </div>
            <div className="text-4xl opacity-80">🏋️</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Active Members</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl opacity-80">✨</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Capacity</h3>
              <p className="text-3xl font-bold">85%</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Recent Users</h3>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.length > 0 ? stats.recentUsers.map((user, index) => (
              <div key={user.id} className={`flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-400 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <div>
                  <span className="font-semibold text-gray-800">{user.name}</span>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.fitnessGoal}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🙋</div>
                <p>No users yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">🏋️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Recent Gyms</h3>
          </div>
          <div className="space-y-3">
            {stats.recentGyms.length > 0 ? stats.recentGyms.map((gym, index) => (
              <div key={gym.id} className={`flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border-l-4 border-green-400 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <div>
                  <span className="font-semibold text-gray-800">{gym.name}</span>
                  <p className="text-sm text-gray-600">{gym.location || 'No location'}</p>
                </div>
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {gym.type}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🏋️</div>
                <p>No gyms yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};