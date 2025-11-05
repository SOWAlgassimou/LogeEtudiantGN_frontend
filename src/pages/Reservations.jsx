import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import BackButton from '../components/common/BackButton';
import { formatDate, formatPrice } from '../utils/helpers';
import { RESERVATION_STATUS } from '../utils/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Reservations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const canCancelReservation = (reservation) => {
    if (reservation.statut === RESERVATION_STATUS.EN_ATTENTE) return true;
    if (reservation.statut === RESERVATION_STATUS.CONFIRMEE) {
      const reservationDate = new Date(reservation.createdAt || reservation.date);
      const now = new Date();
      const hoursDiff = (now - reservationDate) / (1000 * 60 * 60);
      return hoursDiff < 24; // 24h pour annuler après réservation
    }
    return false;
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await reservationService.cancel(selectedReservation._id);
      queryClient.invalidateQueries(['my-reservations']);
      toast.success('Réservation annulée avec succès');
      setShowModal(false);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Réservation déjà supprimée');
        queryClient.invalidateQueries(['my-reservations']);
        setShowModal(false);
      } else {
        toast.error('Erreur lors de l\'annulation');
      }
    }
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: reservationService.getMyReservations
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;
  if (error) return <div className="text-center py-8 text-red-600">Erreur de chargement</div>;

  const allReservations = data?.reservations || data || [];
  const reservations = allReservations.filter(reservation => 
    reservation.etudiant?._id === user?.id || reservation.etudiant === user?.id
  );
  
  // Pagination
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = reservations.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case RESERVATION_STATUS.CONFIRMEE:
        return 'bg-green-100 text-green-800';
      case RESERVATION_STATUS.EN_ATTENTE:
        return 'bg-yellow-100 text-yellow-800';
      case RESERVATION_STATUS.ANNULEE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes réservations</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos réservations de chambres
          </p>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune réservation trouvée</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedReservations.map((reservation) => (
              <div key={reservation._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-lg font-semibold">
                        Chambre {reservation.chambre?.numero || 'N/A'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.statut)}`}>
                        {reservation.statut}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Bloc:</span> {reservation.chambre?.bloc || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Prix:</span> {formatPrice(reservation.chambre?.prix || 0)}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(reservation.date)}
                      </div>
                    </div>
                  </div>

                  {canCancelReservation(reservation) && (
                    <button 
                      onClick={() => handleCancelClick(reservation)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Annuler
                    </button>
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
      </div>
      
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmer l'annulation"
        message={`Êtes-vous sûr de vouloir annuler votre réservation pour la chambre ${selectedReservation?.chambre?.numero} ?`}
        confirmText="Oui, annuler"
        cancelText="Non, garder"
      />
    </div>
  );
};

export default Reservations;