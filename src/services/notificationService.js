import api from './api';

export const notificationService = {
  // Récupérer mes notifications
  getMyNotifications: async (params = {}) => {
    // Filtrer seulement les paramètres valides
    const validParams = {};
    if (params.unreadOnly) validParams.unreadOnly = params.unreadOnly;
    if (params.type) validParams.type = params.type;
    
    const queryParams = new URLSearchParams(validParams).toString();
    const response = await api.get(`/notifications/me${queryParams ? `?${queryParams}` : ''}`);
    console.log('Backend notifications response:', response);
    console.log('Backend notifications data:', response.data);
    return response.data;
  },

  // Créer une notification (admin seulement)
  createNotification: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  // Marquer comme lue
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Marquer toutes comme lues
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Supprimer une notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Récupérer tous les utilisateurs (pour admin)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
};