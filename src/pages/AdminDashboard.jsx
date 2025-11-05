import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Building, Calendar, Users, MessageCircle, Bell, User, Home, Shield, TrendingUp, Clock } from 'lucide-react';
import { useConversations } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('accueil');
  const { data: conversations } = useConversations();
  const { data: notifications } = useNotifications();
  const totalUnread = conversations?.reduce((total, conv) => total + (conv.unreadCount || 0), 0) || 0;
  const unreadNotifications = notifications?.unreadCount || 0;
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats
  });
  
  const { data: chambresData, isLoading: chambresLoading } = useQuery({
    queryKey: ['admin-chambres'],
    queryFn: () => adminService.getAllChambres({})
  });
  
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers
  });
  
  const menuItems = [
    { id: 'accueil', icon: Home, title: 'Accueil', badge: 0 },
    { id: 'stats', icon: BarChart, title: 'Statistiques', path: '/admin/stats', color: 'bg-indigo-500', badge: 0 },
    { id: 'chambres', icon: Building, title: 'Toutes les chambres', path: '/admin/chambres', color: 'bg-blue-500', badge: 0 },
    { id: 'reservations', icon: Calendar, title: 'Toutes les réservations', path: '/admin/reservations', color: 'bg-green-500', badge: 0 },
    { id: 'users', icon: Users, title: 'Utilisateurs', path: '/admin/users', color: 'bg-red-500', badge: 0 },
    { id: 'notifications', icon: Bell, title: 'Envoyer notification', path: '/admin/notifications', color: 'bg-yellow-500', badge: 0 },
    { id: 'messages', icon: MessageCircle, title: 'Messages', path: '/messages', color: 'bg-purple-500', badge: totalUnread },
    { id: 'profil', icon: User, title: 'Mon profil', path: '/profile', color: 'bg-gray-500', badge: 0 }
  ];

  const renderMainContent = () => {
    switch(activeSection) {
      case 'accueil':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
                  <p className="text-blue-100 text-lg">Administration LogeÉtudiantGN</p>
                  <p className="text-blue-200 text-sm mt-1">Bienvenue, {user?.nom}</p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 rounded-xl p-4">
                    <Home className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalUsers || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Utilisateurs totaux</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% ce mois</span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalChambres || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Chambres totales</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8% ce mois</span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.reservationsActives || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Réservations actives</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15% ce mois</span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.chambresLibres || 0}</p>
                    <p className="text-sm text-gray-600 font-medium">Chambres libres</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Disponibles</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.slice(1, -1).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        {item.title === 'Messages' && totalUnread > 0 && (
                          <span className="bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                            {totalUnread > 9 ? '9+' : totalUnread}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {item.title === 'Statistiques' && 'Voir les métriques détaillées'}
                        {item.title === 'Toutes les chambres' && 'Gérer les logements'}
                        {item.title === 'Toutes les réservations' && 'Superviser les réservations'}
                        {item.title === 'Utilisateurs' && 'Administrer les comptes'}
                        {item.title === 'Envoyer notification' && 'Communiquer avec les utilisateurs'}
                        {item.title === 'Messages' && 'Consulter les conversations'}
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
              <h2 className="text-2xl font-bold text-gray-900">Toutes les chambres</h2>
              <Link to="/admin/chambres" className="btn-primary">Gérer les chambres</Link>
            </div>
            
            {chambresLoading ? (
              <LoadingSpinner size="lg" />
            ) : !chambresData || (Array.isArray(chambresData) ? chambresData.length === 0 : !chambresData.chambres || chambresData.chambres.length === 0) ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune chambre trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(chambresData) ? chambresData : chambresData.chambres || []).slice(0, 6).map((chambre) => (
                  <div key={chambre._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Chambre {chambre.numero}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        chambre.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {chambre.disponible ? 'Libre' : 'Occupée'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Propriétaire: {chambre.proprietaire?.nom || 'Non renseigné'}</p>
                      <p>Ville: {chambre.ville || 'Non renseignée'}</p>
                      <p>Bloc: {chambre.bloc || 'Non renseigné'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
              <Link to="/admin/users" className="btn-primary">Gérer les utilisateurs</Link>
            </div>
            
            {usersLoading ? (
              <LoadingSpinner size="lg" />
            ) : !usersData || (Array.isArray(usersData) ? usersData.length === 0 : !usersData.users || usersData.users.length === 0) ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(Array.isArray(usersData) ? usersData : usersData.users || []).slice(0, 8).map((user) => (
                  <div key={user._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          user.role === 'admin' ? 'bg-red-100' :
                          user.role === 'proprietaire' ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                          <Shield className={`h-4 w-4 ${
                            user.role === 'admin' ? 'text-red-600' :
                            user.role === 'proprietaire' ? 'text-blue-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.nom}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'proprietaire' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
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
        
      case 'stats':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Statistiques détaillées</h2>
              <Link to="/admin/stats" className="btn-primary">Voir statistiques complètes</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des utilisateurs</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Étudiants</span>
                    <span className="font-semibold text-green-600">{stats?.etudiants || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Propriétaires</span>
                    <span className="font-semibold text-blue-600">{stats?.proprietaires || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Administrateurs</span>
                    <span className="font-semibold text-red-600">{stats?.admins || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Réservations par statut</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">En attente</span>
                    <span className="font-semibold text-yellow-600">{stats?.reservationsEnAttente || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Confirmées</span>
                    <span className="font-semibold text-green-600">{stats?.reservationsConfirmees || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Annulées</span>
                    <span className="font-semibold text-red-600">{stats?.reservationsAnnulees || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'reservations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Toutes les réservations</h2>
              <Link to="/admin/reservations" className="btn-primary">Gérer les réservations</Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des réservations</h3>
                <p className="text-gray-600 mb-6">Supervisez toutes les réservations de la plateforme LogeÉtudiantGN</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-lg p-3 mb-2">
                      <Clock className="h-6 w-6 text-yellow-600 mx-auto" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{stats?.reservationsEnAttente || 0}</p>
                    <p className="text-xs text-gray-600">En attente</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-lg p-3 mb-2">
                      <Calendar className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{stats?.reservationsConfirmees || 0}</p>
                    <p className="text-xs text-gray-600">Confirmées</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-100 rounded-lg p-3 mb-2">
                      <Bell className="h-6 w-6 text-red-600 mx-auto" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{stats?.reservationsAnnulees || 0}</p>
                    <p className="text-xs text-gray-600">Annulées</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Envoyer une notification</h2>
              <Link to="/admin/notifications" className="btn-primary">Accéder à l'interface complète</Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-center py-8">
                <Bell className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications globales</h3>
                <p className="text-gray-600 mb-6">Envoyez des notifications à tous les utilisateurs de LogeÉtudiantGN</p>
                <Link to="/admin/notifications" className="btn-primary inline-flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Créer une notification</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-3">Types de notifications disponibles :</h4>
              <ul className="space-y-2 text-orange-800">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600">•</span>
                  <span>Annonces importantes pour tous les utilisateurs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600">•</span>
                  <span>Mises à jour de la plateforme</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600">•</span>
                  <span>Alertes de maintenance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600">•</span>
                  <span>Nouvelles fonctionnalités</span>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3 mb-3">
            <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-10 w-10 rounded-xl" />
            <div>
              <h1 className="text-xl font-bold">LogeÉtudiantGN</h1>
              <p className="text-slate-300 text-xs">Administration</p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user?.nom?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.nom}</p>
                <p className="text-xs text-slate-400">Administrateur</p>
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
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg transform scale-105' 
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-102'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${
                      isActive ? 'bg-white/20' : 'group-hover:bg-slate-600/50'
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
        <div className="p-4 border-t border-slate-700/50">
          <div className="text-center text-xs text-slate-400">
            <p>© 2024 LogeÉtudiantGN</p>
            <p>Version 1.0</p>
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

export default AdminDashboard;