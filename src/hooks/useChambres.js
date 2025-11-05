import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chambreService } from '../services/chambreService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export const useChambres = (filters = {}) => {
  return useQuery({
    queryKey: ['chambres', filters],
    queryFn: () => chambreService.getAll(filters),
    staleTime: 0, // Pas de cache pour les propriétaires
    cacheTime: 0, // Pas de cache en mémoire
  });
};

export const useChambre = (id, options = {}) => {
  const { user, token } = useAuth();
  return useQuery({
    queryKey: ['chambre', id],
    queryFn: () => chambreService.getById(id),
    enabled: !!id && !!user && !!token && (options.enabled !== false),
    ...options
  });
};

export const useCreateChambre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: chambreService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['chambres']);
      toast.success('Chambre créée avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    },
  });
};

export const useUpdateChambre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => chambreService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['chambres']);
      toast.success('Chambre mise à jour');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteChambre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: chambreService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['chambres']);
      toast.success('Chambre supprimée');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    },
  });
};

export const useVilles = () => {
  return useQuery({
    queryKey: ['villes'],
    queryFn: chambreService.getVilles,
    staleTime: 60 * 60 * 1000, // 1 heure
  });
};