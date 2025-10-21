// ===== SERVEUR CATBREAKERS - API REST + PROXY =====
// Ce serveur combine les fonctionnalités de proxy API Supercell
// avec les nouvelles API REST pour la synchronisation des données locales

// Charger les variables d'environnement depuis .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuration depuis les variables d'environnement
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Ouvert pour le développement
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public'))); // Servir les fichiers statiques depuis le dossier public

// Logging des requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== CHARGEMENT DES ROUTES =====

// Routes pour les clans (proxy Supercell)
const clansRouter = require('./routes/clans');
app.use('/api/clans', clansRouter);

// Routes pour les joueurs (proxy Supercell)
const playersRouter = require('./routes/players');
app.use('/api/players', playersRouter);

// Routes pour la gestion des données supplémentaires des clans
const clanRouter = require('./routes/clan');
app.use('/api/clan', clanRouter);

// Route pour servir l'application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur CatBreakers démarré sur http://localhost:${PORT}`);
    console.log('📊 API REST disponible:');
    console.log(`   GET  /api/clans/:clanTag - Données du clan`);
    console.log(`   GET  /api/players/:playerTag - Données du joueur`);
    console.log(`   GET  /api/clan/:clanTag/members - Données supplémentaires`);
    console.log(`   POST /api/clan/:clanTag/members - Sauvegarder données supplémentaires`);
    console.log('🌐 PWA accessible à la racine');
    
    if (!process.env.CLASH_API_TOKEN || process.env.CLASH_API_TOKEN === 'your_api_token_here') {
        console.log('⚠️  Token API Supercell non configuré - fonctionnalités proxy limitées');
        console.log('📝 Créez un fichier .env avec CLASH_API_TOKEN pour activer les fonctionnalités complètes');
    } else {
        console.log('✅ Token API Supercell configuré - toutes les fonctionnalités activées');
    }
});

module.exports = app;