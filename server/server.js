// ===== SERVEUR CATBREAKERS - API REST + PROXY =====
// Ce serveur combine les fonctionnalités de proxy API Supercell
// avec les nouvelles API REST pour la synchronisation des données locales

// Charger les variables d'environnement depuis .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuration de la base de données
const { testConnection, syncDatabase } = require('./config/database');
const { Clan, Member, WarData } = require('./models');

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

// Routes pour la gestion des données supplémentaires des clans (avec base de données)
const clanDbRouter = require('./routes/clan-db');
app.use('/api/clan', clanDbRouter);

// Route racine pour l'API backend
app.get('/', (req, res) => {
    res.json({
        message: 'API CatBreakers Backend',
        version: '1.0.0',
        endpoints: {
            clans: '/api/clans/:clanTag',
            players: '/api/players/:playerTag',
            clanMembers: '/api/clan/:clanTag/members',
            clanStats: '/api/clan/:clanTag/stats'
        },
        status: 'online',
        database: 'connected'
    });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Initialisation de la base de données et démarrage du serveur
async function startServer() {
    try {
        // Test de connexion à la base de données
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.log('⚠️  Serveur démarré sans base de données - fonctionnalités limitées');
        } else {
            // Synchronisation des modèles
            await syncDatabase();
        }

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
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

// Démarrer le serveur
startServer();

module.exports = app;