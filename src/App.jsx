import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from './hooks/useSocket';

import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Chambres from './pages/Chambres';
import Reservations from './pages/Reservations';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardRedirect from './components/common/DashboardRedirect';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import CreateChambre from './pages/CreateChambre';
import ProprietaireChambres from './pages/ProprietaireChambres';
import ProprietaireReservations from './pages/ProprietaireReservations';
import AdminStats from './pages/admin/AdminStats';
import AdminChambres from './pages/admin/AdminChambres';
import AdminReservations from './pages/admin/AdminReservations';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminEditChambre from './pages/admin/AdminEditChambre';
import ChambreDetails from './pages/ChambreDetails';
import EmailVerification from './pages/EmailVerification';
import Profile from './pages/Profile';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  // Initialiser Socket.io
  useSocket();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/chambres" element={<Chambres />} />
          <Route path="/chambres/:id" element={<ChambreDetails />} />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/chambres/:id/edit" 
            element={
              <ProtectedRoute requiredRole="proprietaire">
                <CreateChambre />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reservations" 
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/chambres/create" 
            element={
              <ProtectedRoute requiredRole="proprietaire">
                <CreateChambre />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/proprietaire/chambres" 
            element={
              <ProtectedRoute requiredRole="proprietaire">
                <ProprietaireChambres />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/proprietaire/reservations" 
            element={
              <ProtectedRoute requiredRole="proprietaire">
                <ProprietaireReservations />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/stats" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminStats />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/chambres" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminChambres />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/reservations" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminReservations />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/notifications" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminNotifications />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/chambres/:id/edit" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEditChambre />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/unauthorized" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Accès non autorisé
                  </h1>
                  <p className="text-gray-600">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                  </p>
                </div>
              </div>
            } 
          />
          
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Page non trouvée
                  </h1>
                  <p className="text-gray-600">
                    La page que vous recherchez n'existe pas.
                  </p>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />

        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;