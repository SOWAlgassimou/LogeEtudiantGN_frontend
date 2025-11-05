import api from './api';

export const messageService = {
  // Récupérer les conversations
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    console.log('Backend conversations response:', response);
    console.log('Backend conversations data:', response.data);
    return response.data;
  },

  // Récupérer les utilisateurs contactables
  getContactableUsers: async () => {
    const response = await api.get('/messages/contactable-users');
    return response.data;
  },

  // Récupérer les messages d'une conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/conversation/${conversationId}`);
    return response.data;
  },

  // Envoyer un message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', {
      destinataire: messageData.destinataire,
      texte: messageData.texte
    });
    return response.data;
  },

  // Créer une nouvelle conversation
  createConversation: async (participantId) => {
    const response = await api.post('/messages/conversation', { destinataire: participantId });
    return response.data;
  },

  // Marquer les messages comme lus
  markAsRead: async (conversationId) => {
    const response = await api.put(`/messages/conversation/${conversationId}/read`);
    return response.data;
  }
};