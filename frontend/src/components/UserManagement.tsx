import React, { useState, useEffect } from 'react';
import { userApi } from '../api';
import { User } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    fitnessGoal: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString()
      };
      
      if (editingUser) {
        await userApi.update(editingUser.id, userData);
      } else {
        await userApi.create(userData);
      }
      setFormData({ name: '', email: '', dateOfBirth: '', fitnessGoal: '' });
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth.split('T')[0],
      fitnessGoal: user.fitnessGoal
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(id);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          User Management
        </h2>
        <p className="text-gray-600">Manage fitness platform users</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">{editingUser ? '✏️' : '➕'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Fitness Goal</label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Select Fitness Goal</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="strength">Strength</option>
              <option value="endurance">Endurance</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button 
            type="submit" 
            disabled={submitting}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {submitting ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <span>{editingUser ? '✓' : '➕'}</span>
            )}
            <span>{editingUser ? 'Update User' : 'Create User'}</span>
          </button>
          
          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setFormData({ name: '', email: '', dateOfBirth: '', fitnessGoal: '' });
              }}
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors shadow-lg"
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">All Users ({users.length})</h3>
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🙋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
              <p className="text-gray-500">Create your first user to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date of Birth</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fitness Goal</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => (
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
                      <td className="px-6 py-4 text-gray-600">{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.fitnessGoal.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
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