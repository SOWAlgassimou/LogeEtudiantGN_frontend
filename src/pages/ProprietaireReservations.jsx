import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatDate, formatPrice } from '../utils/helpers';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ProprietaireReservations = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const itemsPerPage = 6;
  
  const { data, isLoading } = useQuery({
    queryKey: ['proprietaire-reservations'],
    queryFn: reservationService.getProprietaireReservations
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;

  const reservations = data || [];
  
  // Pagination
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = reservations.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusUpdate = async () => {
    try {
      await reservationService.updateStatus(selectedReservation._id, 'confirmée');
      queryClient.invalidateQueries(['proprietaire-reservations']);
      toast.success('Réservation confirmée avec succès');
      setShowConfirmModal(false);
      setSelectedReservation(null);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    try {
      await reservationService.delete(selectedReservation._id);
      queryClient.invalidateQueries(['proprietaire-reservations']);
      toast.success('Réservation supprimée');
      setShowDeleteModal(false);
      setSelectedReservation(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openConfirmModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowConfirmModal(true);
  };

  const openDeleteModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Réservations reçues</h1>

        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune réservation reçue</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedReservations.map((reservation) => (
              <div key={reservation._id} className="card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold">Chambre {reservation.chambre?.numero}</h3>
                    <p className="text-gray-600">Bloc {reservation.chambre?.bloc}</p>
                    <p className="font-bold text-primary-600">{formatPrice(reservation.chambre?.prix)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Étudiant</h4>
                    <p className="text-gray-600">{reservation.etudiant?.nom}</p>
                    <p className="text-gray-600">{reservation.etudiant?.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date de réservation</p>
                    <p>{formatDate(reservation.date)}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      reservation.statut === 'confirmée' ? 'bg-green-100 text-green-800' :
                      reservation.statut === 'annulée' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.statut}
                    </span>
                  </div>
                  
                  {(reservation.statut === 'en attente' || reservation.statut === 'En attente') && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openConfirmModal(reservation)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Confirmer</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(reservation)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
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
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          page === currentPage
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
        
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedReservation(null);
          }}
          onConfirm={handleStatusUpdate}
          title="Confirmer la réservation"
          message={`Êtes-vous sûr de vouloir confirmer la réservation de ${selectedReservation?.etudiant?.nom} pour la chambre ${selectedReservation?.chambre?.numero} ?`}
          confirmText="Confirmer"
          cancelText="Annuler"
          confirmButtonClass="bg-green-500 hover:bg-green-600"
        />
        
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedReservation(null);
          }}
          onConfirm={handleDelete}
          title="Supprimer la réservation"
          message={`Êtes-vous sûr de vouloir supprimer la réservation de ${selectedReservation?.etudiant?.nom} pour la chambre ${selectedReservation?.chambre?.numero} ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
        />
      </div>
    </div>
  );
};

export default ProprietaireReservations;