import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import { Home, GraduationCap, Building2, Shield, CheckCircle, Upload, X } from 'lucide-react';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  // Fonction pour calculer la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Très faible', color: 'bg-red-500' },
      { score: 2, label: 'Faible', color: 'bg-orange-500' },
      { score: 3, label: 'Moyen', color: 'bg-yellow-500' },
      { score: 4, label: 'Fort', color: 'bg-green-500' },
      { score: 5, label: 'Très fort', color: 'bg-green-600' }
    ];
    
    return levels[score];
  };

  // Gestion de l'aperçu photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    document.getElementById('photo').value = '';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = {
        nom: data.nom,
        email: data.email,
        password: data.password,
        role: data.role
      };
      
      if (data.photo && data.photo.length > 0) {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
          formData.append(key, userData[key]);
        });
        formData.append('photo', data.photo[0]);
        await authService.register(formData);
      } else {
        await authService.register(userData);
      }
      
      toast.success('Inscription réussie ! Un email de vérification a été envoyé.');
      navigate('/verify-email');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="flex min-h-screen">
        {/* Section gauche - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-12 w-12 rounded-xl" />
                <h1 className="text-4xl font-bold">LogeÉtudiantGN</h1>
              </div>
              <p className="text-xl text-green-100 mb-8">
                Votre plateforme de logement étudiant en Guinée
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Pour les étudiants</h3>
                  <p className="text-green-100">Trouvez facilement un logement près de votre université</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Pour les propriétaires</h3>
                  <p className="text-green-100">Louez vos chambres à des étudiants sérieux</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sécurisé et fiable</h3>
                  <p className="text-green-100">Plateforme vérifiée avec support client</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full space-y-8">
            {/* Logo mobile */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-12 w-12 rounded-xl" />
                <h1 className="text-3xl font-bold text-gray-900">LogeÉtudiantGN</h1>
              </div>
              <p className="text-gray-600">Créez votre compte</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Rejoignez LogeÉtudiantGN
                </h2>
                <p className="text-gray-600">
                  Créez votre compte en quelques minutes
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    {...register('nom', { 
                      required: 'Nom requis',
                      minLength: {
                        value: 2,
                        message: 'Minimum 2 caractères'
                      }
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Votre nom complet"
                  />
                  {errors.nom && (
                    <p className="mt-2 text-sm text-red-600">{errors.nom.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email requis',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email invalide'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    {...register('password', { 
                      required: 'Mot de passe requis',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 caractères'
                      }
                    })}
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="••••••"
                  />
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${getPasswordStrength(password).color}`}
                            style={{ width: `${(getPasswordStrength(password).score / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {getPasswordStrength(password).label}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    {...register('confirmPassword', { 
                      required: 'Confirmation requise',
                      validate: value => value === password || 'Mots de passe différents'
                    })}
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Je suis...
                  </label>
                  <select
                    {...register('role', { required: 'Rôle requis' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Sélectionnez votre rôle</option>
                    <option value={ROLES.ETUDIANT}>Étudiant</option>
                    <option value={ROLES.PROPRIETAIRE}>Propriétaire</option>
                  </select>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil (optionnel)
                  </label>
                  
                  {!photoPreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="photo" className="cursor-pointer">
                          <span className="text-sm text-gray-600">
                            Cliquez pour télécharger une photo
                          </span>
                          <input
                            {...register('photo')}
                            id="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Aperçu" 
                        className="w-24 h-24 rounded-xl object-cover mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    {...register('acceptTerms', { 
                      required: 'Vous devez accepter les conditions' 
                    })}
                    type="checkbox"
                    id="acceptTerms"
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-500 font-medium">
                      conditions d'utilisation
                    </Link>
                    {' '}et la{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-500 font-medium">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Créer mon compte'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;