import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getMyNotifications(params),
    enabled: !!localStorage.getItem('token'),
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.createNotification,
    onSuccess: () => {
      // Rafraîchir immédiatement les notifications
      queryClient.invalidateQueries(['notifications']);
      toast.success('Notification envoyée');
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi');
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      // Forcer le rechargement immédiat
      queryClient.invalidateQueries(['notifications']);
      // Attendre un peu puis forcer le rechargement
      setTimeout(() => {
        queryClient.refetchQueries(['notifications']);
      }, 100);
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      toast.success('Toutes les notifications marquées comme lues');
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      setTimeout(() => {
        queryClient.refetchQueries(['notifications']);
      }, 100);
      toast.success('Notification supprimée');
    },
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: notificationService.getAllUsers,
    enabled: !!localStorage.getItem('token'),
  });
};