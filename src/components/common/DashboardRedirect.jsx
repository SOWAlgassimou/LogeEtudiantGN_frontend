import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';
import EtudiantDashboard from '../../pages/EtudiantDashboard';
import ProprietaireDashboard from '../../pages/ProprietaireDashboard';
import AdminDashboard from '../../pages/AdminDashboard';
import Home from '../../pages/Home';

const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Home />;
  }

  switch (user.role) {
    case ROLES.ETUDIANT:
      return <EtudiantDashboard />;
    case ROLES.PROPRIETAIRE:
      return <ProprietaireDashboard />;
    case ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <Home />;
  }
};

export default DashboardRedirect;