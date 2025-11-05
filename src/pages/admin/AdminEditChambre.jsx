import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { chambreService } from '../../services/chambreService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BackButton from '../../components/common/BackButton';
import { ArrowLeft, Save } from 'lucide-react';

const AdminEditChambre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    numero: '',
    bloc: '',
    prix: '',
    description: '',
    disponible: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const { data: chambre, isLoading } = useQuery({
    queryKey: ['admin-chambre', id],
    queryFn: () => adminService.getChambreById(id)
  });

  const updateMutation = useMutation({
    mutationFn: (data) => adminService.updateChambre(id, data),
    onSuccess: () => {
      toast.success('Chambre mise à jour avec succès');
      queryClient.invalidateQueries(['admin-chambres']);
      navigate('/admin/chambres');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  });

  useEffect(() => {
    if (chambre) {
      setFormData({
        numero: chambre.numero || '',
        bloc: chambre.bloc || '',
        prix: chambre.prix || '',
        description: chambre.description || '',
        disponible: chambre.disponible ?? true,
        image: null
      });
      if (chambre.image) {
        setImagePreview(`http://localhost:5000${chambre.image}`);
      }
    }
  }, [chambre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        submitData.append('image', formData[key]);
      } else if (key !== 'image') {
        submitData.append(key, formData[key]);
      }
    });
    updateMutation.mutate(submitData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BackButton customPath="/admin/chambres" label="Retour aux chambres" />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Save className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier la chambre</h1>
              <p className="text-blue-100 mt-1">Chambre n° {chambre?.numero}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Informations de la chambre</h2>
            <p className="text-gray-600 mt-1">Modifiez les détails de cette chambre</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📝 Numéro de chambre *
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: 101, A12, Nord-05"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🏢 Bloc *
                </label>
                <select
                  value={formData.bloc}
                  onChange={(e) => setFormData({...formData, bloc: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Sélectionnez un bloc</option>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(bloc => (
                    <option key={bloc} value={bloc}>Bloc {bloc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📷 Image de la chambre
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu de la chambre"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="bg-white text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      Changer l'image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="text-6xl mb-4">📷</div>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Cliquez pour ajouter une image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💰 Prix mensuel (GNF) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.prix}
                  onChange={(e) => setFormData({...formData, prix: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-12"
                  placeholder="Ex: 150000"
                  required
                  min="0"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  GNF
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Prix par mois en Francs Guinéens</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📝 Description de la chambre
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez les caractéristiques de la chambre : taille, équipements, proximité..."
              />
              <p className="text-xs text-gray-500 mt-2">Caractères: {formData.description.length}/500</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Statut de disponibilité</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.disponible === true}
                    onChange={() => setFormData({...formData, disponible: true})}
                    className="sr-only"
                  />
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                    formData.disponible ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}>
                    <span className="text-2xl">✅</span>
                    <span className="font-medium">Disponible</span>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.disponible === false}
                    onChange={() => setFormData({...formData, disponible: false})}
                    className="sr-only"
                  />
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                    !formData.disponible ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}>
                    <span className="text-2xl">❌</span>
                    <span className="font-medium">Occupée</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>Les modifications seront appliquées immédiatement</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/chambres')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{updateMutation.isPending ? 'Mise à jour...' : 'Sauvegarder les modifications'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditChambre;