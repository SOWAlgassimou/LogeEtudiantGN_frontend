import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChambres, useDeleteChambre } from '../hooks/useChambres';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const ProprietaireChambres = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useChambres({ proprietaire: user?.id });
  
  // Forcer le rechargement à chaque visite
  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const chambres = data?.chambres || [];
  const deleteChambre = useDeleteChambre();

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      try {
        await deleteChambre.mutateAsync(id);
        toast.success('Chambre supprimée');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (chambre) => {
    navigate(`/chambres/${chambre._id}/edit`, { state: { chambre } });
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;

  // Double sécurité : filtrage côté frontend aussi
  const mesChambres = chambres.filter(chambre => {
    return chambre.proprietaire === user?.id || chambre.proprietaire?._id === user?.id;
  });
  
  // Pagination
  const totalPages = Math.ceil(mesChambres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChambres = mesChambres.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes chambres</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => refetch()}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Actualiser</span>
            </button>
            <Link to="/chambres/create" className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter une chambre</span>
            </Link>
          </div>
        </div>

        {mesChambres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune chambre ajoutée</p>
            <Link to="/chambres/create" className="btn-primary">
              Ajouter votre première chambre
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedChambres.map((chambre) => (
              <div key={chambre._id} className="card">
                {chambre.image ? (
                  <img
                    src={getImageUrl(chambre.image)}
                    alt={`Chambre ${chambre.numero}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYW1icmU8L3RleHQ+PC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Aucune image</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Chambre {chambre.numero}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {chambre.disponible ? 'Disponible' : 'Occupée'}
                    </span>
                  </div>
                  
                  <div className="text-gray-600 space-y-1">
                    <p className="font-medium">{chambre.ville || 'Ville non renseignée'}</p>
                    <p className="text-sm">Bloc {chambre.bloc}</p>
                  </div>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(chambre.prix)}</p>
                  
                  <div className="flex space-x-2 pt-4">
                    <button 
                      onClick={() => handleEdit(chambre)}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modifier</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(chambre._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-700">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, mesChambres.length)} sur {mesChambres.length} chambres
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
    </div>
  );
};

export default ProprietaireChambres;