import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Building, Calendar, MessageCircle, Bell, User, Home, Edit, Eye, CheckCircle, Clock } from 'lucide-react';
import { useConversations } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import { useChambres } from '../hooks/useChambres';
import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import { formatPrice, formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProprietaireDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('accueil');
  const { data: conversations } = useConversations();
  const { data: notifications } = useNotifications();
  const totalUnread = conversations?.reduce((total, conv) => total + (conv.unreadCount || 0), 0) || 0;
  const unreadNotifications = notifications?.unreadCount || 0;
  
  const { data: chambresData, isLoading: chambresLoading } = useChambres({ proprietaire: user?.id });
  const { data: reservationsData, isLoading: reservationsLoading } = useQuery({
    queryKey: ['proprietaire-reservations'],
    queryFn: reservationService.getProprietaireReservations
  });
  
  const mesChambres = chambresData?.chambres || [];
  const reservations = reservationsData || [];
  const chambresDisponibles = mesChambres.filter(c => c.disponible).length;
  const reservationsEnAttente = reservations.filter(r => r.statut === 'en attente').length;
  
  const menuItems = [
    { id: 'accueil', icon: Home, title: 'Accueil', badge: 0 },
    { id: 'ajouter', icon: Plus, title: 'Ajouter chambre', path: '/chambres/create', color: 'bg-green-500', badge: 0 },
    { id: 'chambres', icon: Building, title: 'Mes chambres', path: '/proprietaire/chambres', color: 'bg-blue-500', badge: 0 },
    { id: 'reservations', icon: Calendar, title: 'Réservations reçues', path: '/proprietaire/reservations', color: 'bg-yellow-500', badge: reservationsEnAttente },
    { id: 'messages', icon: MessageCircle, title: 'Messages', path: '/messages', color: 'bg-purple-500', badge: totalUnread },
    { id: 'notifications', icon: Bell, title: 'Notifications', path: '/notifications', color: 'bg-orange-500', badge: unreadNotifications },
    { id: 'profil', icon: User, title: 'Mon profil', path: '/profile', color: 'bg-gray-500', badge: 0 }
  ];

  const renderMainContent = () => {
    switch(activeSection) {
      case 'accueil':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Espace Propriétaire</h1>
                  <p className="text-green-100 text-lg">Gérez vos chambres et réservations</p>
                  <p className="text-green-200 text-sm mt-1">Bonjour {user?.nom}, maximisez vos revenus locatifs</p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 rounded-xl p-4">
                    <Building className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mesChambres.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Mes chambres</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{chambresDisponibles}</p>
                    <p className="text-sm text-gray-600 font-medium">Disponibles</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Réservations</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{reservationsEnAttente}</p>
                    <p className="text-sm text-gray-600 font-medium">En attente</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.slice(1).map((item, index) => {
                  const Icon = item.icon;
                  const badges = {
                    'Messages': totalUnread,
                    'Notifications': unreadNotifications,
                    'Réservations reçues': reservationsEnAttente
                  };
                  const badge = badges[item.title] || 0;
                  
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        {badge > 0 && (
                          <span className="bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                            {badge > 9 ? '9+' : badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {item.title === 'Ajouter chambre' && 'Publier une nouvelle chambre'}
                        {item.title === 'Mes chambres' && 'Gérer vos annonces'}
                        {item.title === 'Réservations reçues' && 'Traiter les demandes'}
                        {item.title === 'Messages' && 'Communiquer avec les étudiants'}
                        {item.title === 'Notifications' && 'Rester informé'}
                        {item.title === 'Mon profil' && 'Gérer votre compte'}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
        
      case 'chambres':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mes chambres</h2>
              <Link to="/chambres/create" className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Ajouter une chambre</span>
              </Link>
            </div>
            
            {chambresLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mesChambres.map((chambre) => (
                  <div key={chambre._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {chambre.image && (
                      <img
                        src={`http://localhost:5000${chambre.image}`}
                        alt={`Chambre ${chambre.numero}`}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Chambre {chambre.numero}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {chambre.disponible ? 'Libre' : 'Occupée'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>Bloc {chambre.bloc}</p>
                        <p className="font-bold text-blue-600">{formatPrice(chambre.prix)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/chambres/${chambre._id}/edit`} className="btn-secondary flex items-center space-x-1 text-sm">
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </Link>
                        <Link to={`/chambres/${chambre._id}`} className="btn-primary flex items-center space-x-1 text-sm">
                          <Eye className="h-4 w-4" />
                          <span>Voir</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'reservations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Réservations reçues</h2>
              <Link to="/proprietaire/reservations" className="text-blue-600 hover:text-blue-700">Voir toutes</Link>
            </div>
            
            {reservationsLoading ? (
              <LoadingSpinner size="lg" />
            ) : reservations.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune réservation reçue</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.slice(0, 5).map((reservation) => (
                  <div key={reservation._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Chambre {reservation.chambre?.numero}</h3>
                        <p className="text-sm text-gray-600">Étudiant: {reservation.etudiant?.nom}</p>
                        <p className="text-sm text-gray-600">Prix: {formatPrice(reservation.chambre?.prix)}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(reservation.date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        reservation.statut === 'confirmée' ? 'bg-green-100 text-green-800' :
                        reservation.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'messages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
              <Link to="/messages" className="btn-primary">Voir tous les messages</Link>
            </div>
            
            {conversations?.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune conversation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations?.slice(0, 5).map((conversation) => (
                  <div key={conversation._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{conversation.participants?.find(p => p._id !== user?.id)?.nom}</h3>
                        <p className="text-sm text-gray-600">{conversation.lastMessage?.contenu}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <Link to="/notifications" className="btn-primary">Voir toutes</Link>
            </div>
            
            {notifications?.notifications?.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications?.notifications?.slice(0, 5).map((notification) => (
                  <div key={notification._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <Bell className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.titre}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(notification.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'profil':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                  <p className="mt-1 text-gray-900">{user?.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div className="pt-4">
                  <Link to="/profile" className="btn-primary">
                    Modifier le profil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'ajouter':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ajouter une chambre</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-center py-8">
                <Plus className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ajoutez votre première chambre</h3>
                <p className="text-gray-600 mb-6">Commencez à générer des revenus en ajoutant vos chambres sur LogeÉtudiantGN</p>
                <Link to="/chambres/create" className="btn-primary inline-flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Ajouter une chambre</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Conseils pour une bonne annonce :</h4>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Ajoutez des photos de qualité de votre chambre</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Fixez un prix compétitif pour Labé</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Indiquez clairement le bloc et le numéro</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Répondez rapidement aux demandes d'étudiants</span>
                </li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Section en développement</h3>
            <p className="text-gray-600">Cette section sera bientôt disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-green-900 to-yellow-800 text-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-green-700/50">
          <div className="flex items-center space-x-3 mb-3">
            <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-10 w-10 rounded-xl" />
            <div>
              <h1 className="text-xl font-bold">LogeÉtudiantGN</h1>
              <p className="text-green-200 text-xs">Propriétaire</p>
            </div>
          </div>
          <div className="bg-green-700/50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-900">{user?.nom?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.nom}</p>
                <p className="text-xs text-green-300">Propriétaire</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                      isActive 
                        ? 'bg-gradient-to-r from-yellow-500 to-green-500 text-white shadow-lg transform scale-105' 
                        : 'text-green-200 hover:bg-green-700/50 hover:text-white hover:transform hover:scale-102'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${
                      isActive ? 'bg-white/20' : 'group-hover:bg-green-600/50'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.badge > 0 && (
                      <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-green-700/50">
          <div className="text-center text-xs text-green-300">
            <p>© 2024 LogeÉtudiantGN</p>
            <p>Interface Propriétaire</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default ProprietaireDashboard;