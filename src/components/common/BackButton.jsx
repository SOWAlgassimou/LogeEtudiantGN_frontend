import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BackButton = ({ customPath, label }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else {
      // Rediriger vers le dashboard approprié selon le rôle
      navigate('/dashboard');
    }
  };

  const getDefaultLabel = () => {
    if (customPath) return label || 'Retour';
    if (!user) return 'Retour au tableau de bord';
    
    switch (user.role) {
      case 'admin':
        return 'Retour au tableau de bord admin';
      case 'proprietaire':
        return 'Retour au tableau de bord propriétaire';
      case 'etudiant':
        return 'Retour au tableau de bord étudiant';
      default:
        return 'Retour au tableau de bord';
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <ArrowLeft className="h-5 w-5" />
      <span>{getDefaultLabel()}</span>
    </button>
  );
};

export default BackButton;