import { memo, useState, useMemo } from 'react';
import { useChambres, useVilles } from '../../hooks/useChambres';
import { useCreateReservation } from '../../hooks/useReservations';
import ChambreCard from './ChambreCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmModal from '../common/ConfirmModal';
import { debounce } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ChambreList = memo(() => {
  const [filters, setFilters] = useState({
    disponible: true,
    ville: '',
    bloc: '',
    prixMin: '',
    prixMax: ''
  });
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedChambre, setSelectedChambre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data, isLoading, error } = useChambres(filters);
  const { data: villes } = useVilles();
  const createReservation = useCreateReservation();

  const handleReservationClick = (chambreId) => {
    const chambre = chambres.find(c => c._id === chambreId);
    setSelectedChambre(chambre);
    setShowReserveModal(true);
  };

  const handleConfirmReservation = async () => {
    try {
      await createReservation.mutateAsync(selectedChambre._id);
      toast.success('Chambre réservée avec succès !');
      setShowReserveModal(false);
    } catch (error) {
      toast.error('Erreur lors de la réservation');
    }
  };

  const debouncedSetFilters = useMemo(
    () => debounce((newFilters) => setFilters(newFilters), 300),
    []
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    debouncedSetFilters(newFilters);
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;
  if (error) return <div className="text-center py-8 text-red-600">Erreur de chargement</div>;

  const chambres = data?.chambres || [];
  
  // Pagination
  const totalPages = Math.ceil(chambres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChambres = chambres.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <select
              value={filters.ville}
              onChange={(e) => handleFilterChange('ville', e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les villes</option>
              {(villes?.villes || VILLES_UNIVERSITAIRES).map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disponibilité
            </label>
            <select
              value={filters.disponible}
              onChange={(e) => handleFilterChange('disponible', e.target.value === 'true')}
              className="input-field"
            >
              <option value={true}>Disponible</option>
              <option value={false}>Occupée</option>
              <option value="">Toutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bloc
            </label>
            <input
              type="text"
              value={filters.bloc}
              onChange={(e) => handleFilterChange('bloc', e.target.value)}
              placeholder="Ex: A, B, C..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix min
            </label>
            <input
              type="number"
              value={filters.prixMin}
              onChange={(e) => handleFilterChange('prixMin', e.target.value)}
              placeholder="0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix max
            </label>
            <input
              type="number"
              value={filters.prixMax}
              onChange={(e) => handleFilterChange('prixMax', e.target.value)}
              placeholder="1000000"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Chambres disponibles
          </h2>
          <span className="text-gray-600">
            {chambres.length} chambre{chambres.length > 1 ? 's' : ''} trouvée{chambres.length > 1 ? 's' : ''}
          </span>
        </div>

        {chambres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune chambre trouvée avec ces critères</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedChambres.map((chambre) => (
                <ChambreCard 
                  key={chambre._id} 
                  chambre={chambre} 
                  onReserve={handleReservationClick}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-700">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, chambres.length)} sur {chambres.length} chambres
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
      
      <ConfirmModal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        onConfirm={handleConfirmReservation}
        title="Confirmer la réservation"
        message={`Voulez-vous réserver la chambre ${selectedChambre?.numero} du bloc ${selectedChambre?.bloc} ?`}
        confirmText="Oui, réserver"
        cancelText="Annuler"
      />
    </div>
  );
});

ChambreList.displayName = 'ChambreList';

export default ChambreList;