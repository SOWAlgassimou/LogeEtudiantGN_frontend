import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BackButton from '../../components/common/BackButton';
import { Users, Building, Calendar, CheckCircle, TrendingUp } from 'lucide-react';

const AdminStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats
  });

  const { data: graphStats } = useQuery({
    queryKey: ['admin-graph-stats'],
    queryFn: adminService.getGraphStats
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-8" />;

  const stats = data || {};
  
  // Transformation des données backend
  const usersByRole = graphStats?.usersByRole || [];
  const reservationsByStatus = graphStats?.reservationsByStatus || [];
  
  const detailedStats = {
    etudiants: usersByRole.find(u => u._id === 'etudiant')?.count || 0,
    proprietaires: usersByRole.find(u => u._id === 'proprietaire')?.count || 0,
    admins: usersByRole.find(u => u._id === 'admin')?.count || 0,
    reservationsEnAttente: reservationsByStatus.find(r => r._id === 'en attente')?.count || 0,
    reservationsConfirmees: reservationsByStatus.find(r => r._id === 'confirmée')?.count || 0,
    reservationsAnnulees: reservationsByStatus.find(r => r._id === 'annulée')?.count || 0
  };
  
  const finalStats = { ...stats, ...detailedStats };

  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: finalStats.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Chambres totales',
      value: finalStats.totalChambres || 0,
      icon: Building,
      color: 'bg-green-500'
    },
    {
      title: 'Chambres libres',
      value: finalStats.chambresLibres || 0,
      icon: CheckCircle,
      color: 'bg-yellow-500'
    },
    {
      title: 'Réservations actives',
      value: finalStats.reservationsActives || 0,
      icon: Calendar,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Statistiques détaillées</h1>
              <p className="text-indigo-100 mt-1">Analyse complète de votre plateforme</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Actif</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Répartition des utilisateurs</h3>
            <div className="space-y-4">
              {[
                { label: 'Étudiants', value: finalStats.etudiants, color: 'bg-blue-500', total: finalStats.totalUsers },
                { label: 'Propriétaires', value: finalStats.proprietaires, color: 'bg-green-500', total: finalStats.totalUsers },
                { label: 'Administrateurs', value: finalStats.admins, color: 'bg-purple-500', total: finalStats.totalUsers }
              ].map((item, index) => {
                const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Réservations par statut</h3>
            <div className="space-y-4">
              {[
                { label: 'En attente', value: finalStats.reservationsEnAttente, color: 'bg-yellow-500' },
                { label: 'Confirmées', value: finalStats.reservationsConfirmees, color: 'bg-green-500' },
                { label: 'Annulées', value: finalStats.reservationsAnnulees, color: 'bg-red-500' }
              ].map((item, index) => {
                const total = finalStats.reservationsEnAttente + finalStats.reservationsConfirmees + finalStats.reservationsAnnulees;
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;