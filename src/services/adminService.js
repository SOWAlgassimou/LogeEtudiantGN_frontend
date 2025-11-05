import api from './api';

export const adminService = {
  // Statistiques
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getGraphStats: async () => {
    const response = await api.get('/admin/graph-stats');
    return response.data;
  },

  // Gestion utilisateurs
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getChambreById: async (id) => {
    const response = await api.get(`/admin/chambres/${id}`);
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Gestion chambres
  getAllChambres: async (params = {}) => {
    const response = await api.get('/admin/chambres', { params });
    return response.data;
  },

  updateChambre: async (id, data) => {
    const response = await api.put(`/admin/chambres/${id}`, data);
    return response.data;
  },

  deleteChambre: async (id) => {
    const response = await api.delete(`/admin/chambres/${id}`);
    return response.data;
  },

  // Gestion réservations
  getAllReservations: async (params = {}) => {
    const response = await api.get('/admin/reservations', { params });
    return response.data;
  },

  updateReservation: async (id, data) => {
    const response = await api.put(`/admin/reservations/${id}`, data);
    return response.data;
  },

  deleteReservation: async (id) => {
    const response = await api.delete(`/admin/reservations/${id}`);
    return response.data;
  },

  // Notifications
  sendNotification: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  }
};