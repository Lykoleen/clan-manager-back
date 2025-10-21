// ===== SCRIPT DE TEST DE LA BASE DE DONNÉES =====

// Charger les variables d'environnement
require('dotenv').config();

const { sequelize, testConnection, syncDatabase } = require('./config/database');
const { Clan, Member } = require('./models');

async function testDatabase() {
    console.log('🔍 Test de la base de données...\n');
    
    // Test de connexion
    const connected = await testConnection();
    if (!connected) {
        console.log('❌ Impossible de se connecter à la base de données');
        return;
    }
    
    // Synchronisation des modèles
    const synced = await syncDatabase();
    if (!synced) {
        console.log('❌ Erreur lors de la synchronisation');
        return;
    }
    
    console.log('\n📊 Schéma des tables :');
    
    // Afficher les colonnes de la table clans
    const [clanColumns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'clans' 
        ORDER BY ordinal_position;
    `);
    
    console.log('\n🏰 Table CLANS :');
    clanColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Afficher les colonnes de la table members
    const [memberColumns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'members' 
        ORDER BY ordinal_position;
    `);
    
    console.log('\n👥 Table MEMBERS :');
    memberColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    console.log('\n✅ Test terminé avec succès !');
    process.exit(0);
}

testDatabase().catch(error => {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
});
