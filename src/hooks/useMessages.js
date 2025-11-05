import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/messageService';
import { toast } from 'react-toastify';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    enabled: !!localStorage.getItem('token'), // Seulement si connecté
  });
};

export const useContactableUsers = () => {
  return useQuery({
    queryKey: ['contactable-users'],
    queryFn: messageService.getContactableUsers,
  });
};

export const useMessages = (conversationId) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (data) => {
      // Rafraîchir les conversations pour afficher la nouvelle conversation
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['messages']);
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'envoi du message');
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['contactable-users']);
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la conversation');
    },
  });
};