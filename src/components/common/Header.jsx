import { memo, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Building, Calendar, MessageCircle } from 'lucide-react';
import { useConversations } from '../../hooks/useMessages';
import ConfirmModal from './ConfirmModal';

const Header = memo(() => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Compter les messages non lus seulement si connecté
  const { data: conversations } = useConversations();
  const totalUnread = isAuthenticated ? (conversations?.reduce((total, conv) => total + (conv.unreadCount || 0), 0) || 0) : 0;

  const handleLogoutClick = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  }, [logout, navigate]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 shadow-2xl border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-12 w-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">LogeÉtudiantGN</span>
          </Link>

          <nav className="hidden md:flex space-x-2">
            <Link to="/chambres" className="flex items-center space-x-2 text-white hover:text-blue-100 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
              <Building className="h-5 w-5" />
              <span className="font-medium">Chambres</span>
            </Link>
            {isAuthenticated && user?.role === 'etudiant' && (
              <Link to="/reservations" className="flex items-center space-x-2 text-white hover:text-blue-100 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Réservations</span>
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/messages" className="flex items-center space-x-2 text-white hover:text-blue-100 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all relative">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Messages</span>
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-white hover:text-blue-100 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block font-medium">{user.nom}</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-2 text-white hover:text-red-200 bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-xl transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block font-medium">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-semibold transition-all">
                  Connexion
                </Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl font-semibold transition-all shadow-lg">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Confirmer la déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Oui, me déconnecter"
        cancelText="Annuler"
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;