import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Euro } from 'lucide-react';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';

const ChambreCard = memo(({ chambre, onFavoriteToggle, onReserve }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isFavorite = user?.favoris?.includes(chambre._id);

  const handleFavoriteToggle = useCallback(async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }

    try {
      if (isFavorite) {
        await userService.removeFromFavorites(chambre._id);
        toast.success('Retiré des favoris');
      } else {
        await userService.addToFavorites(chambre._id);
        toast.success('Ajouté aux favoris');
      }
      onFavoriteToggle?.(chambre._id, !isFavorite);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  }, [chambre._id, isFavorite, isAuthenticated, onFavoriteToggle]);

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="relative">
        {chambre.image ? (
          <img
            src={`http://localhost:5000${chambre.image}`}
            alt={`Chambre ${chambre.numero}`}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYW1icmU8L3RleHQ+PC9zdmc+';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-500">Aucune image</span>
          </div>
        )}
        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          } hover:scale-110 transition-transform`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
          chambre.disponible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {chambre.disponible ? 'Disponible' : 'Occupée'}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Chambre {chambre.numero}
          </h3>
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(chambre.prix)}
          </span>
        </div>

        <div className="space-y-1 mb-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{chambre.ville || 'Ville non renseignée'}</span>
          </div>
          <div className="text-gray-500 text-sm ml-5">
            Bloc {chambre.bloc}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(`/chambres/${chambre._id}`, { state: { chambre } })}
            className="btn-primary text-sm"
          >
            Voir détails
          </button>
          
          {chambre.disponible && user?.role === 'etudiant' && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onReserve?.(chambre._id);
              }}
              className="btn-secondary text-sm"
            >
              Réserver
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ChambreCard.displayName = 'ChambreCard';

export default ChambreCard;