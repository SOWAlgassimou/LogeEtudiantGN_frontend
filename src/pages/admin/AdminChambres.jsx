import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BackButton from '../../components/common/BackButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Building, User, Calendar, Search, Edit, Trash2, Filter, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { VILLES_UNIVERSITAIRES } from '../../utils/constants';

const AdminChambres = () => {
  const [filters, setFilters] = useState({
    search: '',
    ville: '',
    bloc: '',
    disponible: '',
    prixMin: '',
    prixMax: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chambreToDelete, setChambreToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-chambres', filters],
    queryFn: () => adminService.getAllChambres(filters)
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteChambre,
    onSuccess: () => {
      toast.success('Chambre supprimée avec succès');
      queryClient.invalidateQueries(['admin-chambres']);
      setShowDeleteModal(false);
      setChambreToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  });

  const handleDelete = (chambre) => {
    setChambreToDelete(chambre);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (chambreToDelete) {
      deleteMutation.mutate(chambreToDelete._id);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;
  if (error) return <div className="text-center py-8 text-red-600">Erreur de chargement</div>;

  const chambres = Array.isArray(data) ? data : (data?.chambres || []);
  
  // Pagination
  const totalPages = Math.ceil(chambres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChambres = chambres.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Gestion des chambres</h1>
                <p className="text-green-100 mt-1">Administration des logements</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{chambres.length}</p>
              <p className="text-green-100 text-sm">chambre{chambres.length > 1 ? 's' : ''} au total</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="input pl-10"
              />
            </div>
            <select
              value={filters.ville}
              onChange={(e) => setFilters({...filters, ville: e.target.value})}
              className="input"
            >
              <option value="">Toutes les villes</option>
              {VILLES_UNIVERSITAIRES.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
            <select
              value={filters.bloc}
              onChange={(e) => setFilters({...filters, bloc: e.target.value})}
              className="input"
            >
              <option value="">Tous les blocs</option>
              <option value="A">Bloc A</option>
              <option value="B">Bloc B</option>
              <option value="C">Bloc C</option>
              <option value="D">Bloc D</option>
              <option value="E">Bloc E</option>
              <option value="F">Bloc F</option>
              <option value="G">Bloc G</option>
              <option value="H">Bloc H</option>
              <option value="I">Bloc I</option>
              <option value="J">Bloc J</option>
            </select>
            <select
              value={filters.disponible}
              onChange={(e) => setFilters({...filters, disponible: e.target.value})}
              className="input"
            >
              <option value="">Toutes les chambres</option>
              <option value="true">Disponibles</option>
              <option value="false">Occupées</option>
            </select>
            <input
              type="number"
              placeholder="Prix min"
              value={filters.prixMin}
              onChange={(e) => setFilters({...filters, prixMin: e.target.value})}
              className="input"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={filters.prixMax}
              onChange={(e) => setFilters({...filters, prixMax: e.target.value})}
              className="input"
            />
          </div>
        </div>

        {chambres.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune chambre enregistrée</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedChambres.map((chambre) => (
              <div key={chambre._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {chambre.image && (
                  <img
                    src={`http://localhost:5000${chambre.image}?t=${Date.now()}`}
                    alt={`Chambre ${chambre.numero}`}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYW1icmU8L3RleHQ+PC9zdmc+';
                    }}
                  />
                )}
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">Chambre {chambre.numero}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {chambre.disponible ? '✓ Disponible' : '✗ Occupée'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{chambre.ville || 'Ville non renseignée'}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      <span>Bloc {chambre.bloc}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{chambre.proprietaire?.nom || 'Propriétaire inconnu'}</span>
                    </div>
                    
                    {chambre.createdAt && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Créée le {formatDate(chambre.createdAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{formatPrice(chambre.prix)}</p>
                      <p className="text-sm text-gray-500">par mois</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `/admin/chambres/${chambre._id}/edit`}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-xl transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(chambre)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer la chambre"
        message={`Êtes-vous sûr de vouloir supprimer la chambre ${chambreToDelete?.numero} ? Cette action est irréversible.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminChambres;