import React, { useState, useEffect } from 'react';
import { userApi, gymApi, membershipApi } from '../api';
import { User, Gym } from '../types';

export const MembershipManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedGymId, setSelectedGymId] = useState('');
  const [userGyms, setUserGyms] = useState<Gym[]>([]);
  const [gymMembers, setGymMembers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'add' | 'userGyms' | 'gymMembers'>('add');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, gymsRes] = await Promise.all([
        userApi.getAll(),
        gymApi.getAll()
      ]);
      setUsers(usersRes.data);
      setGyms(gymsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedGymId) return;
    
    try {
      await membershipApi.addUserToGym(selectedUserId, selectedGymId);
      setSelectedUserId('');
      setSelectedGymId('');
      alert('User added to gym successfully!');
    } catch (error) {
      console.error('Error adding membership:', error);
      alert('Error adding user to gym');
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
    try {
      const response = await membershipApi.getUserGyms(userId);
      // Extract gym data from membership objects
      const gyms = response.data.map((membership) => ({
        ...membership.gym,
        location: membership.gym.location || 'N/A'
      }));
      setUserGyms(gyms);
    } catch (error) {
      console.error('Error loading user gyms:', error);
      setUserGyms([]);
    }
  };

  const loadGymMembers = async (gymId: string) => {
    try {
      const response = await membershipApi.getGymMembers(gymId);
      // Extract user data from membership objects
      const users = response.data.map((membership) => ({
        ...membership.user,
        fitnessGoal: membership.user.fitnessGoal || 'N/A',
        dateOfBirth: membership.user.dateOfBirth || '',
        createdAt: membership.user.createdAt || ''
      }));
      setGymMembers(users);
    } catch (error) {
      console.error('Error loading gym members:', error);
      setGymMembers([]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Membership Management</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setViewMode('add')}
          className={`px-4 py-2 rounded ${viewMode === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Add Membership
        </button>
        <button
          onClick={() => setViewMode('userGyms')}
          className={`px-4 py-2 rounded ${viewMode === 'userGyms' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          View User Gyms
        </button>
        <button
          onClick={() => setViewMode('gymMembers')}
          className={`px-4 py-2 rounded ${viewMode === 'gymMembers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          View Gym Members
        </button>
      </div>

      {viewMode === 'add' && (
        <form onSubmit={handleAddMembership} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add User to Gym</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <select
              value={selectedGymId}
              onChange={(e) => setSelectedGymId(e.target.value)}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select Gym</option>
              {gyms.map((gym) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name} - {gym.location}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Add Membership
          </button>
        </form>
      )}

      {viewMode === 'userGyms' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">User's Gyms</h3>
          <select
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              if (e.target.value) loadUserGyms(e.target.value);
            }}
            className="border rounded px-3 py-2 mb-4"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          
          {userGyms.length > 0 && (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gym Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userGyms.map((gym) => (
                    <tr key={gym.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{gym.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{gym.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{gym.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveMembership(selectedUserId, gym.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === 'gymMembers' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Gym Members</h3>
          <select
            value={selectedGymId}
            onChange={(e) => {
              setSelectedGymId(e.target.value);
              if (e.target.value) loadGymMembers(e.target.value);
            }}
            className="border rounded px-3 py-2 mb-4"
          >
            <option value="">Select Gym</option>
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name} - {gym.location}
              </option>
            ))}
          </select>
          
          {gymMembers.length > 0 && (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fitness Goal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gymMembers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.fitnessGoal}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveMembership(user.id, selectedGymId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};