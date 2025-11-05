import { X } from 'lucide-react';

const VILLE_IMAGES = {
  'Labé': '/images/labe-univ.png',
  'Conakry': '/images/conakry-univ.png',
  'Kindia': '/images/kindia-univ.png',
  'Boké': '/images/boke-univ.png',
  'Mamou': '/images/mamou-univ.png',
  'Dalaba': '/images/dalaba-univ.png',
  'Kankan': '/images/kankan-univ.png',
  'Faranah': '/images/faranah-univ.png',
  'N\'zérékoré': '/images/nzerekore-univ.png'
};

const VilleModal = ({ isOpen, onClose, ville }) => {
  if (!isOpen || !ville) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Universités et Instituts - {ville}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <img
            src={VILLE_IMAGES[ville]}
            alt={`Universités de ${ville}`}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-4">
              Découvrez les établissements d'enseignement supérieur de {ville}
            </p>
            <button
              onClick={() => window.location.href = `/chambres?ville=${encodeURIComponent(ville)}`}
              className="btn-primary"
            >
              Voir les chambres disponibles à {ville}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VilleModal;