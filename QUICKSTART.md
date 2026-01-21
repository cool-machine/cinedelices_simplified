# CinéDélices - Guide Démarrage Rapide

> **Pour les nouveaux membres de l'équipe** - Comment commencer en 5 minutes

---

## 🚀 Setup Initial (À faire une seule fois)

### 1. Cloner le projet

```bash
git clone https://github.com/cool-machine/cinedelices.git
cd cinedelices
git checkout develop
```

### 2. Copier les variables d'environnement

```bash
# Dans le dossier backend
cd backend
cp .env.example .env
```

**Important** : Éditer `.env` et remplacer :
- `DB_PASSWORD` par votre mot de passe
- `SESSION_SECRET` par une clé aléatoire
- `COOKIE_SECRET` par une clé aléatoire

### 3. Installer les dépendances

```bash
# Backend (toujours dans le dossier backend)
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Démarrer Docker Desktop

- Mac/Windows : Lancer l'application Docker Desktop
- Linux : `sudo systemctl start docker`

### 5. Démarrer la base de données

Depuis la racine du projet :

```bash
cd ..
docker-compose -f docker-compose.dev.yml up db -d
```

**Vérifier** que PostgreSQL tourne :
```bash
docker ps
# Vous devriez voir cinedelices-db-dev
```

### 6. Initialiser la base de données

Depuis le dossier backend :

```bash
cd backend
# Exécuter les migrations
npm run db:migrate

# Insérer les données de test
npm run db:seed
```

### 6b. Comptes de Démonstration

Une fois la base de données initialisée, vous pouvez vous connecter avec :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | `admin@cinedelices.fr` | `password123` |
| **Utilisateur** | `user@cinedelices.fr` | `password123` |

### 7. Démarrer le serveur

Vous avez besoin de deux terminaux :

Terminal 1 (Backend) :
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend) :
```bash
cd frontend
npm run dev
```

Ouvrir dans votre navigateur : **http://localhost:5173**

---

## 📝 Développement Quotidien

### Démarrer votre journée

```bash
# 1. Mettre à jour le code
git pull origin develop

# 2. Installer les nouvelles dépendances (si besoin)
npm install

# 3. Démarrer la BDD (si pas déjà en cours)
docker-compose -f docker-compose.dev.yml up db -d

# 4. Démarrer le serveur
npm run dev
```

### Créer une nouvelle fonctionnalité

```bash
# 1. Créer une branche depuis develop
git checkout develop
git pull
git checkout -b feature/nom-de-la-feature

# 2. Coder...

# 3. Tester
npm run lint        # Vérifier le code
npm test           # Lancer les tests

# 4. Commiter
git add .
git commit -m "feat(scope): description"
git push origin feature/nom-de-la-feature

# 5. Créer une Pull Request sur GitHub
```

### Conventions de commit

```bash
feat(recipes): add search functionality    # Nouvelle fonctionnalité
fix(auth): resolve login redirect issue    # Correction de bug
docs(readme): update installation guide    # Documentation
refactor(api): simplify response handling  # Refactoring
test(recipes): add unit tests             # Tests
chore(deps): update express to 4.18.2     # Maintenance
```

---

## 🛠️ Commandes Utiles

### Développement

```bash
npm run dev          # Démarrer avec hot-reload
npm start            # Démarrer en production
npm run lint         # Vérifier le code
npm run lint:fix     # Corriger automatiquement
npm test             # Lancer les tests
```

### Base de données

```bash
npm run db:migrate   # Exécuter les migrations
npm run db:seed      # Insérer les données de test
npm run db:reset     # Reset complet (drop, create, migrate, seed)
```

### Docker

```bash
# Démarrer juste la BDD
docker-compose -f docker-compose.dev.yml up db -d

# Démarrer tout (app + BDD) dans Docker
docker-compose -f docker-compose.dev.yml up

# Arrêter les containers
docker-compose -f docker-compose.dev.yml down

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f db

# Se connecter à PostgreSQL
docker exec -it cinedelices-db-dev psql -U user -d cinedelices
```

### Git

```bash
# Statut
git status

# Mettre à jour develop
git checkout develop
git pull origin develop

# Créer une branche
git checkout -b feature/ma-feature

# Voir les branches
git branch -a

# Supprimer une branche locale
git branch -d feature/ma-feature
```

---

## 🐛 Dépannage

### "Port 3000 already in use"

```bash
# Trouver et arrêter le processus
lsof -i :3000
kill -9 <PID>

# Ou changer le port
# Dans .env : PORT=3001
```

### "Cannot connect to database"

```bash
# Vérifier que Docker tourne
docker ps

# Redémarrer le container
docker-compose -f docker-compose.dev.yml restart db

# Voir les logs
docker-compose -f docker-compose.dev.yml logs db
```

### "Module not found"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problème de migration Sequelize

```bash
# Annuler la dernière migration
npx sequelize-cli db:migrate:undo

# Réexécuter
npm run db:migrate
```

---

## 📚 Documentation Complète

Pour plus de détails, consulter :

- **Guide complet** : [dev-notes.md](dev-notes.md)
- **Commandes Sprint 1** : [docs/commands/sprint-1-commands.md](docs/commands/sprint-1-commands.md)
- **Progression Sprint 1** : [docs/sprints/sprint-1.md](docs/sprints/sprint-1.md)
- **Architecture** : [docs/README.md](docs/README.md)

---

## ✅ Checklist de Vérification

Avant de commencer à coder, vérifier que :

- [ ] Docker Desktop est démarré
- [ ] Le container PostgreSQL tourne (`docker ps`)
- [ ] Les variables `.env` sont configurées
- [ ] `npm install` a été exécuté
- [ ] Les migrations sont à jour (`npm run db:migrate`)
- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] Je suis sur la branche `develop` ou une feature branch

---

## 🆘 Besoin d'Aide ?

1. Vérifier la [documentation](docs/)
2. Voir les issues GitHub
3. Demander sur le canal Slack de l'équipe
4. Contacter le formateur O'clock

---

*Bon développement ! 🚀*
