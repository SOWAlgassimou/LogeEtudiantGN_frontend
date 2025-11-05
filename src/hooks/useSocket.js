import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import socketService from '../services/socketService';
import { useAuth } from '../contexts/AuthContext';
import { FEATURES } from '../config/features';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !user || !FEATURES.SOCKET_ENABLED) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Connexion Socket
    socketService.connect(token);
    socketService.joinUserRoom(user.id);

    // Écouter les nouveaux messages
    socketService.onNewMessage((data) => {
      try {
        const senderName = data?.expediteur?.nom || 'Utilisateur inconnu';
        toast.info(`Nouveau message de ${senderName}`);
        queryClient.invalidateQueries(['conversations']);
        queryClient.invalidateQueries(['messages']);
      } catch (error) {
        console.warn('Error handling newMessage:', error);
      }
    });

    // Écouter les nouvelles notifications
    socketService.onNewNotification((data) => {
      try {
        const title = data?.title || 'Nouvelle notification';
        toast.info(title);
        queryClient.invalidateQueries(['notifications']);
      } catch (error) {
        console.warn('Error handling newNotification:', error);
      }
    });

    // Écouter les nouvelles réservations (pour propriétaires)
    if (user.role === 'proprietaire') {
      socketService.onNewReservation((data) => {
        try {
          const chambreNum = data?.chambre?.numero || 'N/A';
          toast.success(`Nouvelle réservation pour la chambre ${chambreNum}`);
          queryClient.invalidateQueries(['proprietaire-reservations']);
        } catch (error) {
          console.warn('Error handling newReservation:', error);
        }
      });
    }

    // Écouter les mises à jour de réservation (pour étudiants)
    if (user.role === 'etudiant') {
      socketService.onReservationUpdate((data) => {
        console.log('📋 Réservation mise à jour:', data);
        const message = data.statut === 'confirmée' 
          ? '✅ Votre réservation a été confirmée !' 
          : '❌ Votre réservation a été annulée';
        toast.success(message);
        queryClient.invalidateQueries(['reservations']);
      });
    }

    // Nettoyage à la déconnexion
    return () => {
      socketService.off('new_message');
      socketService.off('new_notification');
      socketService.off('new_reservation');
      socketService.off('reservation_updated');
      socketService.disconnect();
    };
  }, [isAuthenticated, user, queryClient]);

  return socketService;
};