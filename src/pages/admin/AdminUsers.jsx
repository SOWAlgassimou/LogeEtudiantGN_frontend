import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BackButton from '../../components/common/BackButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatDate } from '../../utils/helpers';
import { User, Mail, Calendar, Shield, Search, Filter, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isVerified: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminService.getAllUsers(filters)
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('Rôle mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('Utilisateur supprimé');
      setShowDeleteModal(false);
      setUserToDelete(null);
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  const handleRoleChange = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setShowModal(true);
  };

  const handleConfirmRoleChange = () => {
    updateRoleMutation.mutate({ userId: selectedUser._id, role: newRole });
    setShowModal(false);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete._id);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;
  if (error) return <div className="text-center py-8 text-red-600">Erreur de chargement</div>;

  const users = Array.isArray(data) ? data : (data?.users || []);
  
  // Trier par date d'inscription (plus récents en premier)
  const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'proprietaire': return 'bg-blue-100 text-blue-800';
      case 'etudiant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
                <p className="text-purple-100 mt-1">Administration des comptes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{sortedUsers.length}</p>
              <p className="text-purple-100 text-sm">utilisateur{sortedUsers.length > 1 ? 's' : ''} inscrit{sortedUsers.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher nom, email..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="input pl-10"
              />
            </div>
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="input"
            >
              <option value="">Tous les rôles</option>
              <option value="etudiant">Étudiants</option>
              <option value="proprietaire">Propriétaires</option>
              <option value="admin">Administrateurs</option>
            </select>
            <select
              value={filters.isVerified}
              onChange={(e) => setFilters({...filters, isVerified: e.target.value})}
              className="input"
            >
              <option value="">Tous</option>
              <option value="true">Vérifiés</option>
              <option value="false">Non vérifiés</option>
            </select>
          </div>
        </div>

        {sortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun utilisateur enregistré</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">{user.nom?.charAt(0)}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-lg">{user.nom}</span>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${getRoleColor(user.role)}`}>
                      <Shield className="h-4 w-4 mr-2" />
                      {user.role === 'admin' ? 'Administrateur' : user.role === 'proprietaire' ? 'Propriétaire' : 'Étudiant'}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Inscrit le {formatDate(user.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Vérifié: {user.isVerified ? '✅ Oui' : '❌ Non'}
                      {!user.isVerified && (
                        <span className="text-orange-600 ml-1" title="L'utilisateur doit cliquer sur le lien dans son email">
                          (En attente email)
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="input-field text-sm"
                      disabled={updateRoleMutation.isLoading}
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="proprietaire">Propriétaire</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl transition-colors"
                      title="Supprimer utilisateur"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, sortedUsers.length)} sur {sortedUsers.length} utilisateurs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isCurrentPage
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmRoleChange}
          title="Changer le rôle utilisateur"
          message={`Voulez-vous changer le rôle de ${selectedUser?.nom} en ${newRole} ?`}
          confirmText="Oui, changer"
          cancelText="Annuler"
        />
        
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteUser}
          title="Supprimer l'utilisateur"
          message={`Êtes-vous sûr de vouloir supprimer ${userToDelete?.nom} ? Cette action supprimera aussi toutes ses données (chambres, réservations, etc.).`}
          confirmText="Oui, supprimer"
          cancelText="Annuler"
          isLoading={deleteUserMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AdminUsers;