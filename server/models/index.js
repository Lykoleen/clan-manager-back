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
    },
    clanName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'clan_name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    memberCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'member_count'
    },
    requiredTrophies: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'required_trophies'
    },
    warFrequency: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'war_frequency'
    },
    clanLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'clan_level'
    },
    clanPoints: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'clan_points'
    },
    location: {
        type: DataTypes.JSON,
        allowNull: true
    },
    badgeUrls: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'badge_urls'
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'last_updated'
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
    role: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    expLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'exp_level'
    },
    league: {
        type: DataTypes.JSON,
        allowNull: true
    },
    trophies: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    versusTrophies: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'versus_trophies'
    },
    clanRank: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'clan_rank'
    },
    previousClanRank: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'previous_clan_rank'
    },
    donations: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    donationsReceived: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'donations_received'
    },
    townHallLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'town_hall_level'
    },
    builderHallLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'builder_hall_level'
    },
    warPreference: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'war_preference'
    },
    attackWins: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'attack_wins'
    },
    defenseWins: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'defense_wins'
    },
    heroLevels: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'hero_levels'
    },
    spells: {
        type: DataTypes.JSON,
        allowNull: true
    },
    troops: {
        type: DataTypes.JSON,
        allowNull: true
    },
    // Données supplémentaires personnalisées
    customData: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'custom_data'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    lastSeen: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_seen'
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'last_updated'
    }
}, {
    tableName: 'members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Modèle pour les données de guerre
const WarData = sequelize.define('WarData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clanTag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'clan_tag'
    },
    warType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'war_type'
    },
    warData: {
        type: DataTypes.JSON,
        allowNull: false,
        field: 'war_data'
    },
    warDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'war_date'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'war_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relations entre les modèles
Clan.hasMany(Member, { foreignKey: 'clanTag', sourceKey: 'clanTag' });
Member.belongsTo(Clan, { foreignKey: 'clanTag', targetKey: 'clanTag' });

Clan.hasMany(WarData, { foreignKey: 'clanTag', sourceKey: 'clanTag' });
WarData.belongsTo(Clan, { foreignKey: 'clanTag', targetKey: 'clanTag' });

module.exports = {
    Clan,
    Member,
    WarData
};
