import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BackButton from '../../components/common/BackButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatDate, formatPrice } from '../../utils/helpers';
import { Calendar, User, Building, Search, Edit, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminReservations = () => {
  const [filters, setFilters] = useState({
    search: '',
    statut: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStatut, setNewStatut] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-reservations', filters],
    queryFn: () => adminService.getAllReservations(filters)
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteReservation,
    onSuccess: () => {
      toast.success('Réservation supprimée avec succès');
      queryClient.invalidateQueries(['admin-reservations']);
      setShowDeleteModal(false);
      setSelectedReservation(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminService.updateReservation(id, data),
    onSuccess: () => {
      toast.success('Réservation mise à jour avec succès');
      queryClient.invalidateQueries(['admin-reservations']);
      setShowEditModal(false);
      setSelectedReservation(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  });

  const handleDelete = (reservation) => {
    setSelectedReservation(reservation);
    setShowDeleteModal(true);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setNewStatut(reservation.statut);
    setShowEditModal(true);
  };

  const confirmDelete = () => {
    if (selectedReservation) {
      deleteMutation.mutate(selectedReservation._id);
    }
  };

  const confirmUpdate = () => {
    if (selectedReservation && newStatut) {
      updateMutation.mutate({
        id: selectedReservation._id,
        data: { statut: newStatut }
      });
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;
  if (error) return <div className="text-center py-8 text-red-600">Erreur de chargement</div>;

  const reservations = Array.isArray(data) ? data : (data?.reservations || []);
  
  // Pagination
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = reservations.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Toutes les réservations</h1>
          <span className="text-gray-600">
            {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Filtres */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Filtres</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher étudiant, chambre..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="input pl-10"
              />
            </div>
            <select
              value={filters.statut}
              onChange={(e) => setFilters({...filters, statut: e.target.value})}
              className="input"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="confirmée">Confirmée</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune réservation enregistrée</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedReservations.map((reservation) => (
              <div key={reservation._id} className="card">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-semibold">Chambre {reservation.chambre?.numero}</span>
                    </div>
                    <p className="text-sm text-gray-600">Bloc {reservation.chambre?.bloc}</p>
                    <p className="text-sm font-medium text-primary-600">
                      {formatPrice(reservation.chambre?.prix)}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Étudiant</span>
                    </div>
                    <p className="text-sm">{reservation.etudiant?.nom}</p>
                    <p className="text-sm text-gray-600">{reservation.etudiant?.email}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">Propriétaire</p>
                    <p className="text-sm">{reservation.chambre?.proprietaire?.nom}</p>
                    <p className="text-sm text-gray-600">{reservation.chambre?.proprietaire?.email}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Date</span>
                    </div>
                    <p className="text-sm">{formatDate(reservation.date || reservation.createdAt)}</p>
                  </div>
                  
                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                      reservation.statut === 'confirmée' ? 'bg-green-100 text-green-800' :
                      reservation.statut === 'annulée' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.statut}
                    </span>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(reservation)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(reservation)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, reservations.length)} sur {reservations.length} réservations
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isCurrentPage
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer la réservation"
        message="Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
        isLoading={deleteMutation.isPending}
      />

      {/* Modal de modification */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Modifier le statut</h3>
            <select
              value={newStatut}
              onChange={(e) => setNewStatut(e.target.value)}
              className="input mb-4"
            >
              <option value="en_attente">En attente</option>
              <option value="confirmée">Confirmée</option>
              <option value="annulée">Annulée</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={confirmUpdate}
                disabled={updateMutation.isPending}
                className="btn-primary"
              >
                {updateMutation.isPending ? 'Mise à jour...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;