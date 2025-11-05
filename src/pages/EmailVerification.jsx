import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data, isLoading, error } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => authService.verifyEmail(token),
    enabled: !!token,
    retry: false
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vérifiez votre email
          </h1>
          <p className="text-gray-600 mb-6">
            Un email de vérification a été envoyé à votre adresse. 
            Cliquez sur le lien dans l'email pour activer votre compte.
          </p>
          <Link to="/login" className="btn-primary">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur de vérification
          </h1>
          <p className="text-gray-600 mb-6">
            Le lien de vérification est invalide ou a expiré.
          </p>
          <Link to="/register" className="btn-primary">
            S'inscrire à nouveau
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Email vérifié !
        </h1>
        <p className="text-gray-600 mb-6">
          Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.
        </p>
        <Link to="/login" className="btn-primary">
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;