# 🏗️ Architecture de l'Application CatBreakers

## 🎯 **Principe de Fonctionnement**

L'application CatBreakers suit une architecture **hybride** qui combine :

1. **API Supercell** → Données officielles du clan
2. **Serveur distant** → Données supplémentaires (commentaires, participations)
3. **Stockage local** → Backup et fonctionnement hors-ligne

---

## 🔄 **Flux de Données**

### **1. Chargement des Données du Clan**

```
Utilisateur saisit tag du clan → Clic sur "Rafraîchir"
    ↓
API Supercell (fetchClanData) → Données officielles du clan
    ↓
Serveur distant (loadClanAdditionalData) → Données supplémentaires
    ↓
Fusion des données → Affichage dans le tableau
```

### **2. Sauvegarde des Modifications**

```
Utilisateur modifie commentaire/participation → Clic sur "Sauvegarder"
    ↓
localStorage (immédiat) → Affichage instantané
    ↓
Serveur distant (saveMemberAdditionalData) → Persistance
```

---

## 📊 **Structure des Données**

### **Données Supercell (API officielle)**
```javascript
{
    "name": "Tony",
    "tag": "#2GCYYYU82",
    "level": 15,
    "trophies": 4500,
    "role": "leader",
    "donations": 250,
    "donationsReceived": 180
}
```

### **Données Supplémentaires (Serveur)**
```javascript
{
    "clanTag": "2GCYYYU82",
    "members": {
        "2GCYYYU82": {
            "comments": "Excellent leader",
            "participations": {
                "gdc": true,
                "jdc": false,
                "league": true,
                "raids": false
            },
            "firstAdded": "2024-01-15T10:30:00.000Z",
            "lastUpdated": "2024-01-15T10:30:00.000Z"
        }
    }
}
```

### **Données Fusionnées (Application)**
```javascript
{
    "name": "Tony",
    "tag": "#2GCYYYU82",
    "level": 15,
    "trophies": 4500,
    "role": "leader",
    "donations": 250,
    "donationsReceived": 180,
    "isFromAPI": true,
    // Données supplémentaires
    "comments": "Excellent leader",
    "participations": {
        "gdc": true,
        "jdc": false,
        "league": true,
        "raids": false
    }
}
```

---

## 🖥️ **API REST du Serveur**

### **GET /api/clan/:clanTag/members**
Récupère les données supplémentaires d'un clan
```bash
curl http://localhost:3000/api/clan/2GCYYYU82/members
```

**Réponse :**
```json
{
    "clanTag": "2GCYYYU82",
    "members": {
        "2GCYYYU82": {
            "comments": "Excellent leader",
            "participations": {...}
        }
    }
}
```

### **POST /api/clan/:clanTag/member/:memberTag**
Sauvegarde les données d'un membre spécifique
```bash
curl -X POST http://localhost:3000/api/clan/2GCYYYU82/member/2GCYYYU82 \
  -H "Content-Type: application/json" \
  -d '{"comments": "Nouveau commentaire", "participations": {...}}'
```

---

## 💾 **Stockage des Données**

### **Structure des Fichiers**
```
server/data/
├── clan_2GCYYYU82.json    # Données du clan #2GCYYYU82
├── clan_ABC123.json       # Données du clan #ABC123
└── clan_DEF456.json       # Données du clan #DEF456
```

### **localStorage (Navigateur)**
```javascript
// Données de base du clan
localStorage.setItem('clanMembers', JSON.stringify(clanMembers));

// Données supplémentaires par clan
localStorage.setItem('clanAdditionalData_2GCYYYU82', JSON.stringify(clanData));

// Données individuelles des membres (fallback)
localStorage.setItem('memberData_#2GCYYYU82', JSON.stringify(memberData));
```

---

## 🔄 **Synchronisation**

### **Mode Online**
1. **Chargement** : API Supercell + Serveur distant
2. **Sauvegarde** : Serveur distant + localStorage (backup)
3. **Fusion** : Données Supercell + Données supplémentaires

### **Mode Offline**
1. **Chargement** : localStorage uniquement
2. **Sauvegarde** : localStorage uniquement
3. **Synchronisation** : Au retour en ligne

---

## 🎯 **Avantages de cette Architecture**

### **Pour l'Utilisateur**
- ✅ **Données toujours à jour** depuis l'API Supercell
- ✅ **Personnalisation persistante** des commentaires/participations
- ✅ **Fonctionnement hors-ligne** complet
- ✅ **Multi-clans** : Chaque clan a ses propres données

### **Pour le Développeur**
- ✅ **Séparation claire** : Données officielles vs personnalisées
- ✅ **Extensible** : Facile d'ajouter de nouvelles données
- ✅ **Scalable** : Un fichier par clan
- ✅ **Backup automatique** : localStorage comme fallback

---

## 🔧 **Points d'Extension**

### **Nouvelles Données Supplémentaires**
Pour ajouter de nouvelles données (ex: notes, évaluations) :

1. **Modifier le serveur** : Ajouter le champ dans la structure
2. **Modifier le frontend** : Ajouter l'interface utilisateur
3. **Mise à jour automatique** : La fusion se fait automatiquement

### **Migration vers Base de Données**
Pour remplacer les fichiers JSON :

1. **Modifier les fonctions de lecture/écriture** dans `server/server.js`
2. **Adapter la structure** selon la BDD choisie
3. **Frontend inchangé** : L'API REST reste identique

---

## 🚀 **Déploiement**

### **Variables d'Environnement**
```env
PORT=3000
CLASH_API_TOKEN=your_token_here
DATA_FILE=./data/clan_data.json  # Optionnel
```

### **Structure de Déploiement**
```
Production/
├── server/           # API REST + Proxy Supercell
├── public/           # Application PWA
└── data/            # Données par clan
```

Cette architecture garantit une **séparation claire des responsabilités** tout en maintenant une **expérience utilisateur fluide** ! 🎉
