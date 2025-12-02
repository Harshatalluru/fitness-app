import React, { useState, useEffect } from 'react';
import { gymApi } from '../api';
import { Gym } from '../types';

export const GymManagement: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [editingGym, setEditingGym] = useState<Gym | null>(null);
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
    try {
      const response = await gymApi.getAll();
      setGyms(response.data);
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gym Management</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{editingGym ? 'Edit Gym' : 'Add New Gym'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Gym Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Type</option>
            <option value="commercial">Commercial</option>
            <option value="home">Home</option>
            <option value="community">Community</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Capacity (optional)"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="border rounded px-3 py-2"
            min="1"
          />
        </div>
        <div className="mt-4 space-x-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {editingGym ? 'Update' : 'Create'} Gym
          </button>
          {editingGym && (
            <button
              type="button"
              onClick={() => {
                setEditingGym(null);
                setFormData({ name: '', type: '', location: '', capacity: '' });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {gyms.map((gym) => (
              <tr key={gym.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{gym.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gym.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gym.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gym.capacity || 'Unlimited'}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(gym)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gym.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};