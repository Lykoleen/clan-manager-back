# 🚀 Démarrage Rapide - CatBreakers PWA

## Installation et Lancement (3 étapes)

### 1. Installer le serveur
```bash
npm run install-server
```

### 2. Démarrer l'application
```bash
npm start
```

### 3. Ouvrir dans le navigateur
Allez sur `http://localhost:3000`

## ✅ Tests Rapides

### Test API REST
```bash
# Récupérer les membres (doit retourner [])
curl http://localhost:3000/api/members

# Sauvegarder un membre de test
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '[{"name":"TestMember","tag":"#TEST","level":10}]'
```

### Test PWA
1. **Mode Online** : Les données se chargent depuis le serveur
2. **Mode Offline** : Désactivez internet, modifiez des données → sauvegardées localement
3. **Reconnexion** : Réactivez internet → synchronisation automatique
4. **Import/Export** : Utilisez les boutons dans l'interface

## 🔧 Configuration (Optionnelle)

Créez `server/.env` pour activer les fonctionnalités complètes :
```env
CLASH_API_TOKEN=your_api_token_here
```

## 📱 Fonctionnalités

- ✅ **Synchronisation automatique** online/offline
- ✅ **Import/Export** JSON avec validation
- ✅ **Interface responsive** (mobile/desktop)
- ✅ **Messages de statut** contextuels
- ✅ **Debounce** pour éviter les requêtes multiples
- ✅ **Résolution de conflits** (priorité serveur)

## 🚨 En Cas de Problème

1. **Serveur ne démarre pas** : Vérifiez que le port 3000 est libre
2. **API ne répond pas** : Vérifiez les logs du serveur
3. **PWA ne se charge pas** : Vérifiez la console du navigateur
4. **Synchronisation ne fonctionne pas** : Vérifiez la connectivité

## 📚 Documentation Complète

- [README.md](README.md) - Documentation complète
- [server/README.md](server/README.md) - Documentation du serveur

---

**Prêt à gérer votre clan ! 🏰**
