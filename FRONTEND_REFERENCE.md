# Documentation API Backend - Référence Frontend React

## 🚀 Configuration de base

### Variables d'environnement Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOADS_URL=http://localhost:5000/uploads
```

### Dépendances recommandées
```json
{
  "axios": "^1.6.0",
  "react-router-dom": "^6.8.0",
  "react-hook-form": "^7.43.0",
  "react-query": "^3.39.0",
  "jwt-decode": "^3.1.2",
  "react-toastify": "^9.1.0"
}
```

## 🔐 Authentification

### Structure du token JWT
```javascript
// Token stocké dans localStorage
const token = localStorage.getItem('token');
// Headers pour requêtes authentifiées
const headers = { Authorization: `Bearer ${token}` };
```

### Routes d'authentification

#### POST /api/auth/register
```javascript
const registerUser = async (userData) => {
  const response = await axios.post('/api/auth/register', {
    nom: "string",
    email: "string", 
    password: "string",
    role: "etudiant" | "proprietaire" // optionnel, défaut: etudiant
  });
  return response.data; // { message, token, user }
};
```

#### POST /api/auth/login
```javascript
const loginUser = async (credentials) => {
  const response = await axios.post('/api/auth/login', {
    email: "string",
    password: "string"
  });
  return response.data; // { token, user }
};
```

#### GET /api/auth/verify-email?token=...
```javascript
const verifyEmail = async (token) => {
  const response = await axios.get(`/api/auth/verify-email?token=${token}`);
  return response.data; // { message }
};
```

## 👤 Gestion des utilisateurs

### Structure utilisateur
```typescript
interface User {
  _id: string;
  nom: string;
  email: string;
  role: "etudiant" | "proprietaire" | "admin";
  photo?: string;
  favoris: string[]; // IDs des chambres
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Routes utilisateurs

#### GET /api/users/:id
```javascript
const getUserProfile = async (userId, token) => {
  const response = await axios.get(`/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // User object
};
```

#### PUT /api/users/:id
```javascript
const updateUserProfile = async (userId, userData, token) => {
  const formData = new FormData();
  formData.append('nom', userData.nom);
  formData.append('email', userData.email);
  if (userData.photo) formData.append('photo', userData.photo);
  
  const response = await axios.put(`/api/users/${userId}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
```

#### PUT /api/users/:id/password
```javascript
const changePassword = async (userId, passwords, token) => {
  const response = await axios.put(`/api/users/${userId}/password`, {
    oldPassword: "string",
    newPassword: "string"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### POST /api/users/favoris
```javascript
const addToFavorites = async (chambreId, token) => {
  const response = await axios.post('/api/users/favoris', {
    chambreId: "string"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // { favoris: string[] }
};
```

#### DELETE /api/users/favoris
```javascript
const removeFromFavorites = async (chambreId, token) => {
  const response = await axios.delete('/api/users/favoris', {
    data: { chambreId: "string" },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

## 🏠 Gestion des chambres

### Structure chambre
```typescript
interface Chambre {
  _id: string;
  numero: string;
  bloc: string;
  prix: number;
  image?: string;
  disponible: boolean;
  proprietaire: string | User; // ID ou objet User peuplé
  createdAt: string;
  updatedAt: string;
}
```

### Routes chambres

#### GET /api/chambres
```javascript
const getChambres = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.disponible !== undefined) params.append('disponible', filters.disponible);
  if (filters.bloc) params.append('bloc', filters.bloc);
  if (filters.prixMin) params.append('prixMin', filters.prixMin);
  if (filters.prixMax) params.append('prixMax', filters.prixMax);
  
  const response = await axios.get(`/api/chambres?${params}`);
  return response.data; // { total, chambres }
};
```

#### GET /api/chambres/:id
```javascript
const getChambreById = async (chambreId) => {
  const response = await axios.get(`/api/chambres/${chambreId}`);
  return response.data; // Chambre object
};
```

#### POST /api/chambres (Propriétaire uniquement)
```javascript
const createChambre = async (chambreData, token) => {
  const formData = new FormData();
  formData.append('numero', chambreData.numero);
  formData.append('bloc', chambreData.bloc);
  formData.append('prix', chambreData.prix);
  if (chambreData.image) formData.append('image', chambreData.image);
  
  const response = await axios.post('/api/chambres', formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
```

#### PUT /api/chambres/:id (Propriétaire uniquement)
```javascript
const updateChambre = async (chambreId, chambreData, token) => {
  const response = await axios.put(`/api/chambres/${chambreId}`, {
    numero: "string",
    bloc: "string", 
    prix: "number",
    disponible: "boolean"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### DELETE /api/chambres/:id (Propriétaire uniquement)
```javascript
const deleteChambre = async (chambreId, token) => {
  const response = await axios.delete(`/api/chambres/${chambreId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

## 📋 Gestion des réservations

### Structure réservation
```typescript
interface Reservation {
  _id: string;
  etudiant: string | User;
  chambre: string | Chambre;
  statut: "en attente" | "confirmée" | "annulée";
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

### Routes réservations

#### POST /api/reservations (Étudiant uniquement)
```javascript
const createReservation = async (chambreId, token) => {
  const response = await axios.post('/api/reservations', {
    chambre: chambreId,
    statut: "en attente"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### GET /api/reservations
```javascript
const getReservations = async (filters, token) => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page);
  if (filters.statut) params.append('statut', filters.statut);
  
  const response = await axios.get(`/api/reservations?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // { total, reservations }
};
```

#### GET /api/reservations/:id
```javascript
const getReservationById = async (reservationId, token) => {
  const response = await axios.get(`/api/reservations/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### DELETE /api/reservations/:id (Étudiant - annuler sa réservation)
```javascript
const cancelReservation = async (reservationId, token) => {
  const response = await axios.delete(`/api/reservations/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

## 🏢 Routes propriétaire

#### GET /api/proprietaire/reservations
```javascript
const getProprietaireReservations = async (token) => {
  const response = await axios.get('/api/proprietaire/reservations', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### PUT /api/proprietaire/reservations/:id
```javascript
const updateReservationStatus = async (reservationId, statut, token) => {
  const response = await axios.put(`/api/proprietaire/reservations/${reservationId}`, {
    statut: "confirmée" | "annulée"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

## 💬 Messagerie

### Structure message
```typescript
interface Message {
  _id: string;
  expediteur: string | User;
  destinataire: string | User;
  texte: string;
  lu: boolean;
  createdAt: string;
}
```

#### POST /api/messages
```javascript
const sendMessage = async (messageData, token) => {
  const response = await axios.post('/api/messages', {
    destinataire: "string", // ID utilisateur
    texte: "string"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### GET /api/messages
```javascript
const getMessages = async (token) => {
  const response = await axios.get('/api/messages', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // { sent, received }
};
```

## 🔔 Notifications

### Structure notification
```typescript
interface Notification {
  _id: string;
  destinataire: string | User;
  titre: string;
  message: string;
  lu: boolean;
  createdAt: string;
}
```

#### GET /api/notifications/me
```javascript
const getNotifications = async (token) => {
  const response = await axios.get('/api/notifications/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### PUT /api/notifications/:id/read
```javascript
const markNotificationAsRead = async (notificationId, token) => {
  const response = await axios.put(`/api/notifications/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

## 👑 Routes Admin

#### PATCH /api/admin/users/:id/role
```javascript
const changeUserRole = async (userId, role, token) => {
  const response = await axios.patch(`/api/admin/users/${userId}/role`, {
    role: "etudiant" | "proprietaire" | "admin"
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

#### GET /api/admin/stats
```javascript
const getAdminStats = async (token) => {
  const response = await axios.get('/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // { totalUsers, totalChambres, chambresLibres, reservationsActives }
};
```

## 🎨 Composants React recommandés

### Hook d'authentification
```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout, isAuthenticated: !!user };
};
```

### Service API
```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Routes protégées
```javascript
// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
```

## 📱 Structure des pages recommandées

```
src/
├── components/
│   ├── common/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── LoadingSpinner.js
│   ├── auth/
│   │   ├── LoginForm.js
│   │   └── RegisterForm.js
│   ├── chambres/
│   │   ├── ChambreCard.js
│   │   ├── ChambreList.js
│   │   └── ChambreForm.js
│   └── reservations/
│       ├── ReservationCard.js
│       └── ReservationList.js
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── Profile.js
│   ├── Chambres.js
│   ├── Reservations.js
│   ├── Messages.js
│   └── admin/
│       ├── Dashboard.js
│       └── UserManagement.js
├── hooks/
│   ├── useAuth.js
│   ├── useChambres.js
│   └── useReservations.js
├── services/
│   └── api.js
└── utils/
    ├── constants.js
    └── helpers.js
```

## 🔧 Gestion des erreurs

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.error || 'Une erreur est survenue';
  }
  return 'Erreur de connexion';
};
```

## 📋 Validation des formulaires

```javascript
// Exemple avec react-hook-form
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await loginUser(data);
    } catch (error) {
      // Gérer l'erreur
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { 
          required: 'Email requis',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Email invalide'
          }
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input
        {...register('password', { 
          required: 'Mot de passe requis',
          minLength: {
            value: 6,
            message: 'Minimum 6 caractères'
          }
        })}
        type="password"
        placeholder="Mot de passe"
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Se connecter</button>
    </form>
  );
};
```

Cette documentation couvre tous les endpoints et structures nécessaires pour développer le frontend React en parfaite conformité avec votre backend !