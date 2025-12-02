import React, { useState, useEffect } from 'react';
import { gymApi } from '../api';
import { Gym } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const GymManagement: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [editingGym, setEditingGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    capacity: ''
  });

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    setLoading(true);
    try {
      const response = await gymApi.getAll();
      setGyms(response.data);
    } catch (error) {
      console.error('Error loading gyms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const gymData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined
      };
      
      if (editingGym) {
        await gymApi.update(editingGym.id, gymData);
      } else {
        await gymApi.create(gymData);
      }
      setFormData({ name: '', type: '', location: '', capacity: '' });
      setEditingGym(null);
      loadGyms();
    } catch (error) {
      console.error('Error saving gym:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (gym: Gym) => {
    setEditingGym(gym);
    setFormData({
      name: gym.name,
      type: gym.type,
      location: gym.location,
      capacity: gym.capacity?.toString() || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gym?')) {
      try {
        await gymApi.delete(id);
        loadGyms();
      } catch (error) {
        console.error('Error deleting gym:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Gym Management
        </h2>
        <p className="text-gray-600">Manage fitness facilities and locations</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-xl">{editingGym ? '🏗️' : '🏋️'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{editingGym ? 'Edit Gym' : 'Add New Gym'}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Gym Name</label>
            <input
              type="text"
              placeholder="Enter gym name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Gym Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Select Type</option>
              <option value="commercial">🏢 Commercial</option>
              <option value="home">🏠 Home</option>
              <option value="community">🏘️ Community</option>
              <option value="outdoor">🌳 Outdoor</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Capacity (Optional)</label>
            <input
              type="number"
              placeholder="Enter max capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
              min="1"
            />
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button 
            type="submit" 
            disabled={submitting}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {submitting ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <span>{editingGym ? '✓' : '➕'}</span>
            )}
            <span>{editingGym ? 'Update Gym' : 'Create Gym'}</span>
          </button>
          
          {editingGym && (
            <button
              type="button"
              onClick={() => {
                setEditingGym(null);
                setFormData({ name: '', type: '', location: '', capacity: '' });
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
          <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">All Gyms ({gyms.length})</h3>
          </div>
          
          {gyms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No gyms found</h3>
              <p className="text-gray-500">Create your first gym to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Capacity</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gyms.map((gym, index) => {
                    const typeIcons = {
                      commercial: '🏢',
                      home: '🏠',
                      community: '🏘️',
                      outdoor: '🌳'
                    };
                    
                    return (
                      <tr key={gym.id} className={`hover:bg-gray-50 transition-colors animate-fade-in`} style={{animationDelay: `${index * 0.05}s`}}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold text-sm">{gym.name.charAt(0)}</span>
                            </div>
                            <span className="font-semibold text-gray-800">{gym.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span>{typeIcons[gym.type as keyof typeof typeIcons] || '🏋️'}</span>
                            <span>{gym.type}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{gym.location}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            gym.capacity 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {gym.capacity ? `${gym.capacity} people` : 'Unlimited'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(gym)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(gym.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};