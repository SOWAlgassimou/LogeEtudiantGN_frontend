import api from './api';

export const authService = {
  register: async (userData) => {
    if (userData instanceof FormData) {
      // Si c'est déjà FormData (avec photo)
      const response = await api.post('/auth/register', userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      // Si c'est un objet (sans photo)
      const response = await api.post('/auth/register', userData);
      return response.data;
    }
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  }
};