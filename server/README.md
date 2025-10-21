# CatBreakers Server - API REST + Proxy Supercell

## Description

Serveur Node/Express pour l'application CatBreakers qui combine :
- **API REST** pour la synchronisation des données locales (membres du clan)
- **Proxy API Supercell** pour les données officielles Clash of Clans

## Installation et Démarrage

### 1. Installation des dépendances

```bash
cd server
npm install
```

### 2. Configuration (optionnelle)

Créez un fichier `.env` à la racine du dossier `server` :

```env
# Port du serveur (défaut: 3000)
PORT=3000

# Token API Supercell (optionnel - pour les fonctionnalités proxy)
CLASH_API_TOKEN=your_api_token_here

# URL de base de l'API Supercell
API_BASE_URL=https://api.clashofclans.com/v1

# Fichier de données des membres (optionnel)
DATA_FILE=./data/members.json
```

### 3. Démarrage du serveur

```bash
npm start
# ou pour le développement avec auto-reload
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## API REST - Synchronisation des Données

### GET /api/members
Récupère tous les membres du clan

**Réponse :**
```json
[
  {
    "name": "NomDuMembre",
    "tag": "#TAG123",
    "level": 15,
    "role": "member",
    "comments": "Commentaire du membre",
    "participations": 5
  }
]
```

### POST /api/members
Sauvegarde tous les membres du clan

**Requête :**
```json
[
  {
    "name": "NomDuMembre",
    "tag": "#TAG123",
    "level": 15,
    "role": "member",
    "comments": "Commentaire du membre",
    "participations": 5
  }
]
```

**Réponse :**
```json
{
  "message": "ok",
  "count": 1
}
```

## API Proxy - Supercell

### GET /api/clans/:clanTag
Récupère les données d'un clan

### GET /api/players/:playerTag
Récupère les données d'un joueur

### GET /api/clans/:clanTag/currentwar
Récupère la guerre actuelle du clan

### GET /api/clans/:clanTag/currentwar/leaguegroup
Récupère la guerre de ligue du clan

## Déploiement

### Variables d'environnement pour le déploiement

- `PORT` : Port du serveur (défaut: 3000)
- `CLASH_API_TOKEN` : Token API Supercell (optionnel)
- `DATA_FILE` : Chemin vers le fichier de données (optionnel)

### Plateformes recommandées

#### Render.com
1. Connectez votre repository GitHub
2. Sélectionnez "Web Service"
3. Configurez les variables d'environnement :
   - `PORT` : Laissé vide (Render assigne automatiquement)
   - `CLASH_API_TOKEN` : Votre token API Supercell
4. Déployez !

#### Railway
1. Connectez votre repository GitHub
2. Créez un nouveau projet
3. Configurez les variables d'environnement
4. Déployez !

### Migration vers une vraie base de données

Pour remplacer le stockage fichier par une base de données (PostgreSQL, Supabase, etc.) :

1. **Modifiez `server/server.js`** :
   - Remplacez les accès `fs.readFile` et `fs.writeFile` par des requêtes SQL
   - Lignes concernées : ~50-70 (GET /api/members) et ~75-95 (POST /api/members)

2. **Exemple avec Supabase** :
```javascript
// Au lieu de :
const data = await fs.readFile(DATA_FILE, 'utf8');

// Utilisez :
const { data, error } = await supabase
  .from('members')
  .select('*');
```

## Tests Manuels

### 1. Test de l'API REST

```bash
# Récupérer les membres
curl http://localhost:3000/api/members

# Sauvegarder des membres
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '[{"name":"Test","tag":"#TEST","level":10}]'
```

### 2. Test de la PWA

1. Ouvrez `http://localhost:3000`
2. Vérifiez que les données se chargent depuis le serveur
3. Testez le mode offline :
   - Désactivez votre connexion
   - Modifiez des données → sauvegardées en local
   - Réactivez la connexion → synchronisation automatique

### 3. Test d'import/export

1. Cliquez sur "Export" → fichier téléchargé
2. Cliquez sur "Import" → sélectionnez le fichier
3. Vérifiez que les données sont importées

## Stratégie de Résolution de Conflits

**Priorité serveur** : En cas de conflit entre données locales et serveur, la version serveur est conservée.

**Logique** :
1. Au chargement, les données serveur ont priorité
2. Si des modifications locales existent, un avertissement est affiché
3. L'utilisateur peut choisir de conserver ou remplacer les données

## Logs et Débogage

Le serveur affiche des logs détaillés :
- Requêtes API REST et Proxy
- Erreurs de synchronisation
- Changements de mode online/offline

## Support

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Testez l'API avec curl/Postman
3. Vérifiez la console du navigateur pour les erreurs JavaScript
