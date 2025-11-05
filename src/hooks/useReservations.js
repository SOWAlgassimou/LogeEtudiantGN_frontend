import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';

export const useReservations = (filters = {}) => {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => reservationService.getAll(filters),
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reservationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['my-reservations']);
      queryClient.invalidateQueries(['chambres']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la réservation');
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reservationService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['my-reservations']);
      queryClient.invalidateQueries(['chambres']);
      toast.success('Réservation annulée');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'annulation');
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reservationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['proprietaire-reservations']);
      toast.success('Réservation supprimée');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    },
  });
};