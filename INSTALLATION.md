# Guide d'installation - LogeLabé Frontend

## Prérequis
- Node.js 18+ 
- npm ou yarn
- Backend API en cours d'exécution sur http://localhost:5000

## Installation rapide

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

## Commandes utiles

### Développement
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
```

### Tests
```bash
npm run test         # Lancer les tests
npm run test:ui      # Interface graphique des tests
```

### Qualité du code
```bash
npm run lint         # Vérifier le code avec ESLint
```

## Configuration Backend

Assurez-vous que votre backend Node.js/MongoDB est configuré et en cours d'exécution :

1. Backend sur http://localhost:5000
2. Base de données MongoDB connectée
3. Variables d'environnement backend configurées

## Fonctionnalités disponibles

✅ **Authentification**
- Inscription/Connexion
- Gestion des rôles
- Protection des routes

✅ **Chambres**
- Liste avec filtres
- Recherche avancée
- Système de favoris

✅ **Réservations**
- Création et gestion
- Suivi du statut
- Historique

✅ **Interface**
- Design responsive
- Notifications toast
- Loading states

## Dépannage

### Erreur de connexion API
- Vérifiez que le backend est démarré
- Contrôlez les variables d'environnement
- Vérifiez les CORS sur le backend

### Erreurs de build
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tests qui échouent
```bash
npm run test -- --reporter=verbose
```

## Structure des dossiers créée

```
src/
├── components/
│   ├── common/           # Composants réutilisables
│   ├── auth/            # Authentification
│   ├── chambres/        # Gestion chambres
│   └── reservations/    # Gestion réservations
├── contexts/            # Contextes React
├── hooks/              # Hooks personnalisés
├── pages/              # Pages principales
├── services/           # Services API
├── utils/              # Utilitaires
└── test/               # Configuration tests
```

## Prochaines étapes

1. Tester l'authentification
2. Explorer les chambres
3. Créer des réservations
4. Personnaliser le design
5. Ajouter de nouvelles fonctionnalités

Pour plus d'informations, consultez le README.md principal.