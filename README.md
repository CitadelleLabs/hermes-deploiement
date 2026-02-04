# Hermes

Service de déploiement centralisé de plugins Minecraft multi-serveurs.

## Prérequis

- Node.js (v20+)
- npm ou yarn
- Un bucket Cloudflare R2 (stockage des plugins)
- Un panel Pterodactyl

## Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
```

## Configuration

Éditez le fichier `.env` :

```env
APP_KEY=
PORT=4343
HOST=localhost

# Cloudflare R2 Bucket
R2_KEY=votre_cle_r2
R2_SECRET=votre_secret_r2
R2_BUCKET=nom_du_bucket
R2_ENDPOINT=lien_du_bucket

# Pterodactyl
PTERODACTYL_PANEL_URL=lien_pterodactyl
PTERODACTYL_API_KEY=api_key_pterodactyl
```

```bash
# Générer l'APP_KEY
node ace generate:key
```

## Base de données

```bash
# Créer la base de données
node ace migration:run

# Créer un utilisateur
node ace user:create <username> <password>
```

## Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## Utilisation

1. **Connexion** : Accédez à `/login` avec vos identifiants
2. **Ajout de serveurs** : Configurez vos serveurs Pterodactyl dans l'interface
3. **Déploiement** : Cliquez sur un plugin pour le déployer sur un ou plusieurs serveurs

## Commandes utiles

```bash
# Créer un utilisateur
node ace user:create <username> <password>

# Supprimer un utilisateur
node ace user:delete <username>

# Lancer les migrations
node ace migration:run

# Réinitialiser la base de données
node ace migration:fresh
```

## Technologies

- **Backend** : AdonisJS 6
- **Frontend** : React + Inertia.js
- **Styling** : TailwindCSS + shadcn/ui
- **Base de données** : SQLite
- **Stockage** : Cloudflare R2
