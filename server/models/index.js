// ===== MODÈLES DE BASE DE DONNÉES =====

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modèle pour les clans
const Clan = sequelize.define('Clan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clanTag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'clan_tag'
        
    }
}, {
    tableName: 'clans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Modèle pour les membres
const Member = sequelize.define('Member', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    memberTag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'member_tag'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    clanTag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'clan_tag'
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    participations: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relations entre les modèles
Clan.hasMany(Member, { foreignKey: 'clanTag', sourceKey: 'clanTag' });
Member.belongsTo(Clan, { foreignKey: 'clanTag', targetKey: 'clanTag' });

module.exports = {
    Clan,
    Member
};
