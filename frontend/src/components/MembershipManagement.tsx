import React, { useState, useEffect } from 'react';
import { userApi, gymApi, membershipApi } from '../api';
import { User, Gym, MembershipWithGym, MembershipWithUser } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const MembershipManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedGymId, setSelectedGymId] = useState('');
  const [userGyms, setUserGyms] = useState<Gym[]>([]);
  const [gymMembers, setGymMembers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'add' | 'userGyms' | 'gymMembers'>('add');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, gymsRes] = await Promise.all([
        userApi.getAll(),
        gymApi.getAll()
      ]);
      setUsers(usersRes.data);
      setGyms(gymsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedGymId) return;
    
    setSubmitting(true);
    try {
      await membershipApi.addUserToGym(selectedUserId, selectedGymId);
      setSelectedUserId('');
      setSelectedGymId('');
    } catch (error) {
      console.error('Error adding membership:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMembership = async (userId: string, gymId: string) => {
    if (confirm('Are you sure you want to remove this membership?')) {
      try {
        await membershipApi.removeUserFromGym(userId, gymId);
        if (viewMode === 'userGyms') {
          loadUserGyms(selectedUserId);
        } else if (viewMode === 'gymMembers') {
          loadGymMembers(selectedGymId);
        }
      } catch (error) {
        console.error('Error removing membership:', error);
      }
    }
  };

  const loadUserGyms = async (userId: string) => {
    setLoadingData(true);
    try {
      const response = await membershipApi.getUserGyms(userId);
      const gyms = response.data.map((membership: MembershipWithGym) => ({
        ...membership.gym,
        location: membership.gym.location || 'N/A'
      }));
      setUserGyms(gyms);
    } catch (error) {
      console.error('Error loading user gyms:', error);
      setUserGyms([]);
    } finally {
      setLoadingData(false);
    }
  };

  const loadGymMembers = async (gymId: string) => {
    setLoadingData(true);
    try {
      const response = await membershipApi.getGymMembers(gymId);
      const users = response.data.map((membership: MembershipWithUser) => ({
        ...membership.user,
        fitnessGoal: membership.user.fitnessGoal || 'N/A',
        dateOfBirth: membership.user.dateOfBirth || '',
        createdAt: membership.user.createdAt || ''
      }));
      setGymMembers(users);
    } catch (error) {
      console.error('Error loading gym members:', error);
      setGymMembers([]);
    } finally {
      setLoadingData(false);
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
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Membership Management
        </h2>
        <p className="text-gray-600">Manage user-gym relationships and memberships</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { key: 'add', label: 'Add Membership', icon: '➕' },
          { key: 'userGyms', label: 'User Gyms', icon: '👥' },
          { key: 'gymMembers', label: 'Gym Members', icon: '🏋️' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key as typeof viewMode)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              viewMode === key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {viewMode === 'add' && (
        <form onSubmit={handleAddMembership} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">➕</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Add User to Gym</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Gym</label>
              <select
                value={selectedGymId}
                onChange={(e) => setSelectedGymId(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Choose a gym...</option>
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name} - {gym.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={submitting}
            className="mt-8 flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {submitting ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <span>➕</span>
            )}
            <span>Add Membership</span>
          </button>
        </form>
      )}

      {viewMode === 'userGyms' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">User's Gyms</h3>
          </div>
          
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                if (e.target.value) loadUserGyms(e.target.value);
              }}
              className="w-full md:w-1/2 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          {loadingData ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : userGyms.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-bold text-gray-800">Memberships ({userGyms.length})</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Gym Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userGyms.map((gym, index) => (
                      <tr key={gym.id} className={`hover:bg-gray-50 transition-colors animate-fade-in`} style={{animationDelay: `${index * 0.05}s`}}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold text-sm">{gym.name.charAt(0)}</span>
                            </div>
                            <span className="font-semibold text-gray-800">{gym.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{gym.location}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {gym.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemoveMembership(selectedUserId, gym.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                          >
                            <span>🗑️</span>
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedUserId ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏋️</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No gym memberships</h4>
              <p className="text-gray-500">This user hasn't joined any gyms yet.</p>
            </div>
          ) : null}
        </div>
      )}

      {viewMode === 'gymMembers' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">🏋️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Gym Members</h3>
          </div>
          
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Gym</label>
            <select
              value={selectedGymId}
              onChange={(e) => {
                setSelectedGymId(e.target.value);
                if (e.target.value) loadGymMembers(e.target.value);
              }}
              className="w-full md:w-1/2 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="">Choose a gym...</option>
              {gyms.map((gym) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name} - {gym.location}
                </option>
              ))}
            </select>
          </div>
          
          {loadingData ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : gymMembers.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-b border-gray-200">
                <h4 className="font-bold text-gray-800">Members ({gymMembers.length})</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fitness Goal</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {gymMembers.map((user, index) => (
                      <tr key={user.id} className={`hover:bg-gray-50 transition-colors animate-fade-in`} style={{animationDelay: `${index * 0.05}s`}}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{user.name.charAt(0)}</span>
                            </div>
                            <span className="font-semibold text-gray-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.fitnessGoal.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemoveMembership(user.id, selectedGymId)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                          >
                            <span>🗑️</span>
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedGymId ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No members found</h4>
              <p className="text-gray-500">This gym doesn't have any members yet.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};