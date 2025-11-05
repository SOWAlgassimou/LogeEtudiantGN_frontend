export const ROLES = {
  ETUDIANT: 'etudiant',
  PROPRIETAIRE: 'proprietaire',
  ADMIN: 'admin'
};

export const RESERVATION_STATUS = {
  EN_ATTENTE: 'en attente',
  CONFIRMEE: 'confirmée',
  ANNULEE: 'annulée'
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USERS: '/users',
  CHAMBRES: '/chambres',
  RESERVATIONS: '/reservations',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications'
};

export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export const VILLES_UNIVERSITAIRES = [
  'Labé',
  'Conakry',
  'Kindia',
  'Boké',
  'Mamou',
  'Dalaba',
  'Kankan',
  'Faranah',
  'N\'zérékoré'
];