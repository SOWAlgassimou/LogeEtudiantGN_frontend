import { useState } from 'react';
import { useNotifications, useMarkAsRead, useCreateNotification, useMarkAllAsRead, useDeleteNotification, useAllUsers } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BackButton from '../components/common/BackButton';
import { formatDate } from '../utils/helpers';
import { Bell, Check, Plus, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'normal',
    user: ''
  });

  const { data: notifications, isLoading } = useNotifications();
  
  console.log('Notifications data:', notifications);
  console.log('Notifications type:', typeof notifications);
  console.log('Is array:', Array.isArray(notifications));
  
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const createNotification = useCreateNotification();
  const { data: allUsers, isLoading: loadingUsers } = useAllUsers();

  const notificationsList = notifications?.notifications || [];
  const unreadCount = notifications?.unreadCount || 0;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'normal': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      await createNotification.mutateAsync({
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        priority: newNotification.priority,
        user: newNotification.user || null
      });
      setNewNotification({ title: '', message: '', type: 'info', priority: 'normal', user: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erreur création notification:', error);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Bell className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                className="btn-secondary flex items-center space-x-1"
                disabled={markAllAsRead.isLoading}
              >
                <CheckCheck className="h-4 w-4" />
                <span>Tout marquer lu</span>
              </button>
            )}
            
            {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle</span>
            </button>
            )}
          </div>
        </div>

        {/* Formulaire de création (admin seulement) */}
        {showCreateForm && user?.role === 'admin' && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Créer une notification</h3>
            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="info">Information</option>
                    <option value="success">Succès</option>
                    <option value="warning">Avertissement</option>
                    <option value="error">Erreur</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                    className="input-field"
                  >
                    <option value="low">Basse</option>
                    <option value="normal">Normale</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire
                </label>
                <select
                  value={newNotification.user}
                  onChange={(e) => setNewNotification({...newNotification, user: e.target.value})}
                  className="input-field"
                >
                  <option value="">Notification globale (tous les utilisateurs)</option>
                  {loadingUsers ? (
                    <option disabled>Chargement...</option>
                  ) : (
                    allUsers?.users?.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.nom} ({user.role}) - {user.email}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary" disabled={createNotification.isLoading}>
                  Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notificationsList.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune notification</p>
            </div>
          ) : (
            notificationsList.map((notification) => (
              <div
                key={notification._id}
                className={`card border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getTypeIcon(notification.type)}
                    
                    <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDate(notification.createdAt)}</span>
                      {notification.user ? (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">Personnel</span>
                      ) : (
                        <span className="bg-blue-100 px-2 py-1 rounded text-xs">Global</span>
                      )}
                      <span className="capitalize">{notification.priority}</span>
                    </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead.mutate(notification._id)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Marquer comme lu"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification.mutate(notification._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;