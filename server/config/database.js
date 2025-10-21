// ===== CONFIGURATION DE LA BASE DE DONNÉES =====

const { Sequelize } = require('sequelize');

// Configuration de la connexion PostgreSQL avec Neon
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Test de connexion
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données PostgreSQL (Neon) établie avec succès');
        return true;
    } catch (error) {
        console.error('❌ Impossible de se connecter à la base de données:', error.message);
        return false;
    }
}

// Synchronisation des modèles (création des tables)
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('📊 Base de données synchronisée avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation de la base de données:', error.message);
        return false;
    }
}

module.exports = {
    sequelize,
    testConnection,
    syncDatabase
};
