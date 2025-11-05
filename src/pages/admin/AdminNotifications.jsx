import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Send, Users, User, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import BackButton from '../../components/common/BackButton';

const AdminNotifications = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'normal',
    target: 'all', // all, role, user
    role: '',
    userId: ''
  });

  const sendNotificationMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority
      };

      if (data.target === 'role') {
        payload.role = data.role;
      } else if (data.target === 'user') {
        payload.user = data.userId;
      }

      return adminService.sendNotification(payload);
    },
    onSuccess: () => {
      toast.success('Notification envoyée avec succès');
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'normal',
        target: 'all',
        role: '',
        userId: ''
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendNotificationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BackButton />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Send className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Envoyer une notification</h1>
              <p className="text-orange-100 mt-1">Communiquez avec vos utilisateurs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Créer une nouvelle notification</h2>
            <p className="text-gray-600 mt-1">Remplissez les informations ci-dessous pour envoyer votre message</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Titre de la notification *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ex: Nouvelle fonctionnalité disponible"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Send className="h-4 w-4 inline mr-2" />
                Contenu du message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Rédigez votre message ici..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">Caractères: {formData.message.length}/500</p>
            </div>

            {/* Type et Priorité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Type de notification
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'info', label: 'Information', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '💡' },
                    { value: 'success', label: 'Succès', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
                    { value: 'warning', label: 'Avertissement', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⚠️' },
                    { value: 'error', label: 'Erreur', color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="sr-only"
                      />
                      <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${
                        formData.type === type.value ? type.color : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Niveau de priorité
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'low', label: 'Faible', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '🔵' },
                    { value: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🟡' },
                    { value: 'high', label: 'Élevée', color: 'bg-red-100 text-red-800 border-red-200', icon: '🔴' }
                  ].map((priority) => (
                    <label key={priority.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="sr-only"
                      />
                      <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${
                        formData.priority === priority.value ? priority.color : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <span className="text-lg">{priority.icon}</span>
                        <span className="font-medium">{priority.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Cible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinataires
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="all"
                    checked={formData.target === 'all'}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    className="mr-2"
                  />
                  <Users className="h-4 w-4 mr-2" />
                  Tous les utilisateurs
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="role"
                    checked={formData.target === 'role'}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    className="mr-2"
                  />
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Par rôle
                </label>

                {formData.target === 'role' && (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="input ml-6"
                    required
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="etudiant">Étudiants</option>
                    <option value="proprietaire">Propriétaires</option>
                    <option value="admin">Administrateurs</option>
                  </select>
                )}

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="user"
                    checked={formData.target === 'user'}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    className="mr-2"
                  />
                  <User className="h-4 w-4 mr-2" />
                  Utilisateur spécifique
                </label>

                {formData.target === 'user' && (
                  <input
                    type="text"
                    placeholder="ID de l'utilisateur"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    className="input ml-6"
                    required
                  />
                )}
              </div>
            </div>

            {/* Bouton */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>La notification sera envoyée immédiatement</p>
              </div>
              <button
                type="submit"
                disabled={sendNotificationMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-200 transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>{sendNotificationMutation.isPending ? 'Envoi en cours...' : 'Envoyer la notification'}</span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Info Panel */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Conseils pour vos notifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <p className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Utilisez des titres clairs et concis</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Adaptez le type selon l'importance</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Évitez les notifications trop fréquentes</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Privilégiez la priorité normale</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;