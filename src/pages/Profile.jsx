import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Camera, Save, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';

const Profile = () => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  // Récupérer le profil complet
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => userService.getUserProfile(user.id, token),
    enabled: !!user?.id && !!token
  });

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: (data) => userService.updateUserProfile(user.id, data, token),
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      queryClient.invalidateQueries(['profile']);
      setSelectedImage(null);
      setImagePreview(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  });

  // Mutation pour changer le mot de passe
  const changePasswordMutation = useMutation({
    mutationFn: (data) => userService.changePassword(user.id, data, token),
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès');
      setShowPasswordForm(false);
      resetPassword();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = (data) => {
    const formData = {
      nom: data.nom,
      email: data.email,
      photo: selectedImage
    };
    updateProfileMutation.mutate(formData);
  };

  const onSubmitPassword = (data) => {
    changePasswordMutation.mutate(data);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo de profil */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="relative inline-block">
                <img
                  src={imagePreview || (profile?.photo ? `http://localhost:5000${profile.photo}?t=${Date.now()}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTY0IDY0QzY5LjUyMjggNjQgNzQgNTkuNTIyOCA3NCA1NFM2OS41MjI4IDQ0IDY0IDQ0UzU0IDQ4LjQ3NzIgNTQgNTRTNTguNDc3MiA2NCA2NCA2NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTY0IDc0QzUyLjk1NDMgNzQgNDQgODIuOTU0MyA0NCA5NEg4NEM4NCA4Mi45NTQzIDc1LjA0NTcgNzQgNjQgNzRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=')}
                  alt="Photo de profil"
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{profile?.nom}</h3>
              <p className="text-gray-600 capitalize">{profile?.role}</p>
              <p className="text-sm text-gray-500 mt-2">
                Membre depuis {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    {...register('nom', { required: 'Nom requis' })}
                    defaultValue={profile?.nom}
                    className="input-field"
                  />
                  {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email requis',
                      pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' }
                    })}
                    defaultValue={profile?.email}
                    type="email"
                    className="input-field"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="btn-primary flex items-center space-x-2"
                >
                  {updateProfileMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Sauvegarder</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Changer mot de passe */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Sécurité</h2>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>Changer mot de passe</span>
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      {...registerPassword('oldPassword', { required: 'Mot de passe actuel requis' })}
                      type="password"
                      className="input-field"
                    />
                    {passwordErrors.oldPassword && (
                      <p className="text-red-600 text-sm mt-1">{passwordErrors.oldPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      {...registerPassword('newPassword', { 
                        required: 'Nouveau mot de passe requis',
                        minLength: { value: 6, message: 'Minimum 6 caractères' }
                      })}
                      type="password"
                      className="input-field"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="btn-primary"
                    >
                      {changePasswordMutation.isPending ? <LoadingSpinner size="sm" /> : 'Modifier'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;