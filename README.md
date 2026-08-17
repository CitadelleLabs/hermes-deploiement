# Hermes

Service de déploiement centralisé de plugins Minecraft multi-serveurs.

## Prérequis

- Node.js (v20+)
- npm ou yarn
- Un bucket Cloudflare R2 (stockage des plugins)
- Un panel Pterodactyl

## Installation

### Installation classique

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
```

### Avec Docker

Vous pouvez lancer l'application sous forme de conteneur Docker.

#### 1. Préparer l'environnement

Vérifiez que le fichier `.env` est configuré (copié à partir de `.env.example`).
> [!IMPORTANT]
> Pour conserver la base de données SQLite par défaut lors du redémarrage du conteneur, vous devez monter un volume sur le dossier `/app/tmp` du conteneur.

#### 2. Récupérer l'image Docker

Téléchargez la dernière image pré-construite :

```bash
docker pull ghcr.io/citadellelabs/hermes-deploiement:main
```

#### 3. Exécuter les migrations de base de données

Lancez les migrations de la base de données sqlite à l'aide de l'image Docker :

```bash
docker run --rm \
  -v hermes-data:/app/tmp \
  --env-file .env \
  ghcr.io/citadellelabs/hermes-deploiement:main \
  node ace migration:run --force
```

#### 4. Démarrer le conteneur

```bash
docker run -d \
  -p 4343:4343 \
  --name hermes \
  -v hermes-data:/app/tmp \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/citadellelabs/hermes-deploiement:main
```

L'application sera accessible à l'adresse `http://localhost:4343`.

#### 5. Créer un utilisateur administrateur

Exécutez la commande suivante dans le conteneur en cours d'exécution pour créer un utilisateur :

```bash
docker exec -it hermes node ace user:create <username> <password>
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
2. **Déploiement** : Cliquez sur un plugin pour le déployer sur un ou plusieurs serveurs

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

## Licence

Ce projet est sous licence [MIT](LICENSE).
