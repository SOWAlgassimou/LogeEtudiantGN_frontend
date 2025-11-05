# LogeLabé - Frontend React

## Description
Application frontend React pour la gestion de logements étudiants à Labé. Interface moderne et responsive construite avec React, Vite, Tailwind CSS et React Query.

## Fonctionnalités
- 🔐 Authentification JWT complète
- 🏠 Recherche et filtrage de chambres
- 📋 Gestion des réservations
- ❤️ Système de favoris
- 📱 Interface responsive
- 🎨 Design moderne avec Tailwind CSS
- ⚡ Performance optimisée avec React Query
- 🧪 Tests avec Vitest et React Testing Library

## Technologies utilisées
- **React 19** - Framework frontend
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Routage côté client
- **React Query** - Gestion d'état serveur
- **React Hook Form** - Gestion des formulaires
- **Axios** - Client HTTP
- **Lucide React** - Icônes
- **React Toastify** - Notifications
- **Vitest** - Framework de tests

## Installation

1. Cloner le repository
```bash
git clone <repo-url>
cd LogeEtudiantLabe
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Modifier le fichier `.env` avec vos configurations.

4. Lancer le serveur de développement
```bash
npm run dev
```

## Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run test` - Lancer les tests
- `npm run test:ui` - Interface graphique des tests
- `npm run lint` - Linter ESLint

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs
│   ├── auth/           # Composants d'authentification
│   ├── chambres/       # Composants de chambres
│   └── reservations/   # Composants de réservations
├── contexts/           # Contextes React
├── hooks/              # Hooks personnalisés
├── pages/              # Pages de l'application
├── services/           # Services API
├── utils/              # Utilitaires
└── test/               # Configuration des tests
```

## Fonctionnalités principales

### Authentification
- Inscription avec validation
- Connexion sécurisée
- Gestion des rôles (étudiant, propriétaire, admin)
- Protection des routes

### Gestion des chambres
- Liste avec filtres avancés
- Recherche par prix, bloc, disponibilité
- Système de favoris
- Images et détails complets

### Réservations
- Création de réservations
- Suivi du statut
- Annulation possible
- Historique complet

## API Backend
Cette application consomme l'API REST backend Node.js/MongoDB.
Voir `FRONTEND_REFERENCE.md` pour la documentation complète de l'API.

## Tests
Les tests sont écrits avec Vitest et React Testing Library :
```bash
npm run test
```

## Optimisations
- Composants mémorisés avec `React.memo`
- Hooks optimisés avec `useCallback` et `useMemo`
- Lazy loading des composants
- Debouncing des recherches
- Cache intelligent avec React Query

## Déploiement
1. Build de production :
```bash
npm run build
```

2. Les fichiers sont générés dans le dossier `dist/`

## Variables d'environnement
```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

## Auteur
SOW Algassime
