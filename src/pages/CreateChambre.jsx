import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCreateChambre, useChambre, useUpdateChambre, useVilles } from '../hooks/useChambres';
import { useAuth } from '../contexts/AuthContext';
import { VILLES_UNIVERSITAIRES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';
import { Plus, Building, MapPin, Hash, DollarSign, Upload, Save, X } from 'lucide-react';

const CreateChambre = () => {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const createChambre = useCreateChambre();
  const updateChambre = useUpdateChambre();
  const { data: villes, error: villesError } = useVilles();
  
  // Utiliser les données passées via l'état ou faire un appel API
  const chambreFromState = location.state?.chambre;
  const { data: chambreFromAPI, isLoading: loadingChambre } = useChambre(id, { enabled: !chambreFromState && !!id });
  const chambre = chambreFromState || chambreFromAPI;
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (isEdit && chambre) {
      setValue('numero', chambre.numero);
      setValue('bloc', chambre.bloc);
      setValue('prix', chambre.prix);
      setValue('ville', chambre.ville);
    }
  }, [isEdit, chambre, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        // Pour la modification
        if (data.image && data.image.length > 0) {
          // Si nouvelle image, utiliser FormData
          const formData = new FormData();
          formData.append('numero', data.numero);
          formData.append('bloc', data.bloc);
          formData.append('prix', Number(data.prix));
          formData.append('ville', data.ville);
          formData.append('image', data.image[0]);
          await updateChambre.mutateAsync({ id, data: formData });
        } else {
          // Sinon, envoyer JSON
          const chambreData = {
            numero: data.numero,
            bloc: data.bloc,
            prix: Number(data.prix),
            ville: data.ville
          };
          await updateChambre.mutateAsync({ id, data: chambreData });
        }
      } else {
        // Pour la création, utiliser FormData pour l'image
        const formData = new FormData();
        formData.append('numero', data.numero);
        formData.append('bloc', data.bloc);
        formData.append('prix', Number(data.prix));
        formData.append('ville', data.ville);
        formData.append('proprietaire', user.id);
        
        if (data.image && data.image.length > 0) {
          formData.append('image', data.image[0]);
        }
        
        await createChambre.mutateAsync(formData);
      }
      navigate('/proprietaire/chambres');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && !chambre && loadingChambre) return <LoadingSpinner size="lg" className="py-8" />;
  if (isEdit && !chambre && !loadingChambre) return <div className="text-center py-8">Chambre non trouvée</div>;

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    document.getElementById('image').value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              {isEdit ? <Save className="h-8 w-8" /> : <Plus className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {isEdit ? 'Modifier la chambre' : 'Ajouter une nouvelle chambre'}
              </h1>
              <p className="text-green-100 mt-1">
                {isEdit ? 'Mettez à jour les informations' : 'Créez votre annonce de logement'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Informations de la chambre</h2>
            <p className="text-gray-600 mt-1">Remplissez tous les détails pour attirer les étudiants</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🌍 Ville universitaire *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...register('ville', { required: 'Ville requise' })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Sélectionnez une ville</option>
                  {(villes?.villes || VILLES_UNIVERSITAIRES).map((ville) => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>
              {errors.ville && <p className="text-red-600 text-sm mt-2">{errors.ville.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📝 Numéro de chambre *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('numero', { required: 'Numéro requis' })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Ex: 101, A12, Nord-05"
                  />
                </div>
                {errors.numero && <p className="text-red-600 text-sm mt-2">{errors.numero.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🏢 Bloc *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    {...register('bloc', { required: 'Bloc requis' })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Sélectionnez un bloc</option>
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(bloc => (
                      <option key={bloc} value={bloc}>Bloc {bloc}</option>
                    ))}
                  </select>
                </div>
                {errors.bloc && <p className="text-red-600 text-sm mt-2">{errors.bloc.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💰 Prix mensuel (GNF) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('prix', { required: 'Prix requis', min: 0 })}
                  type="number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: 150000"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  GNF
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Prix par mois en Francs Guinéens</p>
              {errors.prix && <p className="text-red-600 text-sm mt-2">{errors.prix.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📷 {isEdit ? 'Nouvelle image (optionnel)' : 'Image de la chambre (optionnel)'}
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div>
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="text-green-600 hover:text-green-500 font-medium text-lg">
                        Cliquez pour ajouter une photo
                      </span>
                      <input
                        {...register('image')}
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu de la chambre" 
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                {isEdit ? 'Laissez vide pour garder l\'image actuelle' : 'Une belle photo attire plus d\'\u00e9tudiants !'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>Votre annonce sera visible immédiatement après publication</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/proprietaire/chambres')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-yellow-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      {isEdit ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      <span>{isEdit ? 'Sauvegarder les modifications' : 'Publier la chambre'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Tips Panel */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            💡 Conseils pour une annonce réussie
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
            <div className="space-y-2">
              <p className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Ajoutez une photo claire et lumineuse</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Fixez un prix compétitif pour votre ville</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Indiquez clairement le bloc et le numéro</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Répondez rapidement aux demandes</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChambre;