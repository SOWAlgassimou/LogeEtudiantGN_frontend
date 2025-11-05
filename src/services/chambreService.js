import api from './api';

export const chambreService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) params.append(key, filters[key]);
    });
    const response = await api.get(`/chambres?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/chambres/${id}`);
    return response.data;
  },

  create: async (chambreData) => {
    const config = chambreData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await api.post('/chambres', chambreData, config);
    return response.data;
  },

  update: async (id, chambreData) => {
    const config = chambreData instanceof FormData ? 
      { headers: { 'Content-Type': 'multipart/form-data' } } : 
      {};
    const response = await api.put(`/chambres/${id}`, chambreData, config);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/chambres/${id}`);
    return response.data;
  },

  getVilles: async () => {
    const response = await api.get('/chambres/villes');
    return response.data;
  }
};