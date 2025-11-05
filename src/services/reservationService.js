import api from './api';

export const reservationService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) params.append(key, filters[key]);
    });
    const response = await api.get(`/reservations?${params}`);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  create: async (chambreId) => {
    const response = await api.post('/reservations', { chambre: chambreId });
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },

  // Propriétaire
  getProprietaireReservations: async () => {
    const response = await api.get('/proprietaire/reservations');
    return response.data;
  },

  updateStatus: async (id, statut) => {
    const response = await api.put(`/proprietaire/reservations/${id}`, { statut });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  }
};