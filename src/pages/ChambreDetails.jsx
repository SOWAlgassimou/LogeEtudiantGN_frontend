import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useChambre } from '../hooks/useChambres';
import { useCreateReservation } from '../hooks/useReservations';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { MapPin, Euro, Calendar, User } from 'lucide-react';

const ChambreDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Utiliser les données passées via l'état ou faire un appel API
  const chambreFromState = location.state?.chambre;
  const { data: chambreFromAPI, isLoading } = useChambre(id, { enabled: !chambreFromState && !!id });
  const chambre = chambreFromState || chambreFromAPI;
  
  const createReservation = useCreateReservation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleReservation = async () => {
    try {
      await createReservation.mutateAsync(id);
      setShowConfirmModal(false);
      navigate('/reservations');
    } catch (error) {
      console.error(error);
    }
  };

  if (!chambre && isLoading) return <LoadingSpinner size="lg" className="py-8" />;
  if (!chambre && !isLoading) return <div className="text-center py-8">Chambre non trouvée</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton customPath="/chambres" label="Retour aux chambres" />

        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={getImageUrl(chambre.image)}
                alt={`Chambre ${chambre.numero}`}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Chambre {chambre.numero}
                </h1>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {chambre.disponible ? 'Disponible' : 'Occupée'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-lg font-semibold">{chambre.ville || 'Ville non renseignée'}</span>
                    <span className="text-gray-600 ml-2">- Bloc {chambre.bloc}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Euro className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(chambre.prix)}
                  </span>
                </div>

                {chambre.proprietaire && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>Propriétaire: {chambre.proprietaire.nom}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>Ajoutée le {new Date(chambre.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {chambre.disponible && user?.role === 'etudiant' && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={createReservation.isLoading}
                  className="w-full btn-primary text-lg py-3"
                >
                  {createReservation.isLoading ? 'Réservation...' : 'Réserver cette chambre'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleReservation}
        title="Confirmer la réservation"
        message={`Voulez-vous réserver la chambre ${chambre?.numero} du bloc ${chambre?.bloc} ?`}
        confirmText="Oui, réserver"
        cancelText="Annuler"
      />
    </div>
  );
};

export default ChambreDetails;