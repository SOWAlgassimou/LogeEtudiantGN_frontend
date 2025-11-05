import api from './api';

export const userService = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userId, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key]) formData.append(key, userData[key]);
    });
    const response = await api.put(`/users/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Alias pour compatibilité
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key]) formData.append(key, userData[key]);
    });
    const response = await api.put(`/users/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  changePassword: async (userId, passwords) => {
    const response = await api.put(`/users/${userId}/password`, passwords);
    return response.data;
  },

  addToFavorites: async (chambreId) => {
    const response = await api.post('/users/favoris', { chambreId });
    return response.data;
  },

  removeFromFavorites: async (chambreId) => {
    const response = await api.delete('/users/favoris', { data: { chambreId } });
    return response.data;
  }
};