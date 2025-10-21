// ===== ROUTES POUR LA GESTION DES CLANS AVEC BASE DE DONNÉES =====

const express = require('express');
const fetch = require('node-fetch');
const { Clan, Member, WarData } = require('../models');

const router = express.Router();

// Configuration depuis les variables d'environnement
const API_TOKEN = process.env.CLASH_API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.clashofclans.com/v1';

// GET /api/clan/:clanTag/members - Récupérer les données supplémentaires d'un clan
router.get('/:clanTag/members', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        // Rechercher le clan dans la base de données
        const clan = await Clan.findOne({
            where: { clanTag: cleanTag },
            include: [{
                model: Member,
                where: { isActive: true },
                required: false
            }]
        });

        if (!clan) {
            // Si le clan n'existe pas, retourner une structure vide
            console.log(`📄 Aucune donnée supplémentaire pour le clan ${cleanTag}`);
            return res.json({ clanTag: cleanTag, members: {} });
        }

        // Convertir les membres en format attendu par le frontend
        const members = {};
        clan.Members.forEach(member => {
            members[member.memberTag] = {
                ...member.dataValues,
                customData: member.customData || {},
                notes: member.notes || ''
            };
        });

        console.log(`📖 Récupération des données supplémentaires pour le clan ${cleanTag} (${clan.Members.length} membres)`);
        res.json({ 
            clanTag: cleanTag, 
            members: members,
            clanInfo: {
                clanName: clan.clanName,
                memberCount: clan.memberCount,
                lastUpdated: clan.lastUpdated
            }
        });
    } catch (error) {
        console.error('❌ Erreur lecture données clan:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture des données du clan' });
    }
});

// POST /api/clan/:clanTag/members - Sauvegarder les données supplémentaires d'un clan
router.post('/:clanTag/members', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const { members, clanInfo } = req.body;
        const cleanTag = clanTag.replace('#', '');
        
        // Validation basique
        if (!members || typeof members !== 'object') {
            return res.status(400).json({ error: 'Le body doit contenir un objet members' });
        }

        // Créer ou mettre à jour le clan
        const [clan, clanCreated] = await Clan.findOrCreate({
            where: { clanTag: cleanTag },
            defaults: {
                clanTag: cleanTag,
                clanName: clanInfo?.name || null,
                memberCount: clanInfo?.memberCount || null,
                requiredTrophies: clanInfo?.requiredTrophies || null,
                warFrequency: clanInfo?.warFrequency || null,
                clanLevel: clanInfo?.clanLevel || null,
                clanPoints: clanInfo?.clanPoints || null,
                location: clanInfo?.location || null,
                badgeUrls: clanInfo?.badgeUrls || null,
                lastUpdated: new Date()
            }
        });

        // Si le clan existait déjà, mettre à jour ses informations
        if (!clanCreated && clanInfo) {
            await clan.update({
                clanName: clanInfo.name || clan.clanName,
                memberCount: clanInfo.memberCount || clan.memberCount,
                requiredTrophies: clanInfo.requiredTrophies || clan.requiredTrophies,
                warFrequency: clanInfo.warFrequency || clan.warFrequency,
                clanLevel: clanInfo.clanLevel || clan.clanLevel,
                clanPoints: clanInfo.clanPoints || clan.clanPoints,
                location: clanInfo.location || clan.location,
                badgeUrls: clanInfo.badgeUrls || clan.badgeUrls,
                lastUpdated: new Date()
            });
        }

        let updatedMembersCount = 0;

        // Traiter chaque membre
        for (const [memberTag, memberData] of Object.entries(members)) {
            const cleanMemberTag = memberTag.replace('#', '');
            
            // Créer ou mettre à jour le membre
            const [member, memberCreated] = await Member.findOrCreate({
                where: { memberTag: cleanMemberTag },
                defaults: {
                    memberTag: cleanMemberTag,
                    name: memberData.name || '',
                    role: memberData.role || null,
                    expLevel: memberData.expLevel || null,
                    league: memberData.league || null,
                    trophies: memberData.trophies || null,
                    versusTrophies: memberData.versusTrophies || null,
                    clanRank: memberData.clanRank || null,
                    previousClanRank: memberData.previousClanRank || null,
                    donations: memberData.donations || null,
                    donationsReceived: memberData.donationsReceived || null,
                    townHallLevel: memberData.townHallLevel || null,
                    builderHallLevel: memberData.builderHallLevel || null,
                    warPreference: memberData.warPreference || null,
                    attackWins: memberData.attackWins || null,
                    defenseWins: memberData.defenseWins || null,
                    heroLevels: memberData.heroLevels || null,
                    spells: memberData.spells || null,
                    troops: memberData.troops || null,
                    customData: memberData.customData || {},
                    notes: memberData.notes || '',
                    isActive: true,
                    lastSeen: new Date(),
                    lastUpdated: new Date()
                }
            });

            // Si le membre existait déjà, mettre à jour ses données
            if (!memberCreated) {
                await member.update({
                    name: memberData.name || member.name,
                    role: memberData.role || member.role,
                    expLevel: memberData.expLevel || member.expLevel,
                    league: memberData.league || member.league,
                    trophies: memberData.trophies || member.trophies,
                    versusTrophies: memberData.versusTrophies || member.versusTrophies,
                    clanRank: memberData.clanRank || member.clanRank,
                    previousClanRank: memberData.previousClanRank || member.previousClanRank,
                    donations: memberData.donations || member.donations,
                    donationsReceived: memberData.donationsReceived || member.donationsReceived,
                    townHallLevel: memberData.townHallLevel || member.townHallLevel,
                    builderHallLevel: memberData.builderHallLevel || member.builderHallLevel,
                    warPreference: memberData.warPreference || member.warPreference,
                    attackWins: memberData.attackWins || member.attackWins,
                    defenseWins: memberData.defenseWins || member.defenseWins,
                    heroLevels: memberData.heroLevels || member.heroLevels,
                    spells: memberData.spells || member.spells,
                    troops: memberData.troops || member.troops,
                    customData: memberData.customData || member.customData,
                    notes: memberData.notes || member.notes,
                    isActive: true,
                    lastSeen: new Date(),
                    lastUpdated: new Date()
                });
            }

            updatedMembersCount++;
        }

        console.log(`💾 Sauvegarde des données supplémentaires pour le clan ${cleanTag} (${updatedMembersCount} membres)`);
        
        res.json({ 
            message: 'ok', 
            clanTag: cleanTag, 
            updatedMembers: updatedMembersCount,
            clanCreated: clanCreated,
            membersCreated: updatedMembersCount
        });
    } catch (error) {
        console.error('❌ Erreur sauvegarde données clan:', error);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde des données du clan' });
    }
});

// POST /api/clan/:clanTag/member/:memberTag - Sauvegarder les données d'un membre spécifique
router.post('/:clanTag/member/:memberTag', async (req, res) => {
    try {
        const { clanTag, memberTag } = req.params;
        const memberData = req.body;
        const cleanClanTag = clanTag.replace('#', '');
        const cleanMemberTag = memberTag.replace('#', '');
        
        // Créer ou mettre à jour le membre
        const [member, memberCreated] = await Member.findOrCreate({
            where: { memberTag: cleanMemberTag },
            defaults: {
                memberTag: cleanMemberTag,
                name: memberData.name || '',
                role: memberData.role || null,
                expLevel: memberData.expLevel || null,
                league: memberData.league || null,
                trophies: memberData.trophies || null,
                versusTrophies: memberData.versusTrophies || null,
                clanRank: memberData.clanRank || null,
                previousClanRank: memberData.previousClanRank || null,
                donations: memberData.donations || null,
                donationsReceived: memberData.donationsReceived || null,
                townHallLevel: memberData.townHallLevel || null,
                builderHallLevel: memberData.builderHallLevel || null,
                warPreference: memberData.warPreference || null,
                attackWins: memberData.attackWins || null,
                defenseWins: memberData.defenseWins || null,
                heroLevels: memberData.heroLevels || null,
                spells: memberData.spells || null,
                troops: memberData.troops || null,
                customData: memberData.customData || {},
                notes: memberData.notes || '',
                isActive: true,
                lastSeen: new Date(),
                lastUpdated: new Date()
            }
        });

        // Si le membre existait déjà, mettre à jour ses données
        if (!memberCreated) {
            await member.update({
                name: memberData.name || member.name,
                role: memberData.role || member.role,
                expLevel: memberData.expLevel || member.expLevel,
                league: memberData.league || member.league,
                trophies: memberData.trophies || member.trophies,
                versusTrophies: memberData.versusTrophies || member.versusTrophies,
                clanRank: memberData.clanRank || member.clanRank,
                previousClanRank: memberData.previousClanRank || member.previousClanRank,
                donations: memberData.donations || member.donations,
                donationsReceived: memberData.donationsReceived || member.donationsReceived,
                townHallLevel: memberData.townHallLevel || member.townHallLevel,
                builderHallLevel: memberData.builderHallLevel || member.builderHallLevel,
                warPreference: memberData.warPreference || member.warPreference,
                attackWins: memberData.attackWins || member.attackWins,
                defenseWins: memberData.defenseWins || member.defenseWins,
                heroLevels: memberData.heroLevels || member.heroLevels,
                spells: memberData.spells || member.spells,
                troops: memberData.troops || member.troops,
                customData: memberData.customData || member.customData,
                notes: memberData.notes || member.notes,
                isActive: true,
                lastSeen: new Date(),
                lastUpdated: new Date()
            });
        }

        console.log(`💾 Sauvegarde des données du membre ${cleanMemberTag} pour le clan ${cleanClanTag}`);
        
        res.json({ 
            message: 'ok', 
            memberTag: cleanMemberTag, 
            clanTag: cleanClanTag,
            memberCreated: memberCreated
        });
    } catch (error) {
        console.error('❌ Erreur sauvegarde membre:', error);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde du membre' });
    }
});

// GET /api/clan/:clanTag/stats - Récupérer les statistiques d'un clan
router.get('/:clanTag/stats', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        const clan = await Clan.findOne({
            where: { clanTag: cleanTag },
            include: [{
                model: Member,
                where: { isActive: true },
                required: false
            }]
        });

        if (!clan) {
            return res.status(404).json({ error: 'Clan non trouvé' });
        }

        const stats = {
            clanTag: cleanTag,
            clanName: clan.clanName,
            memberCount: clan.Members.length,
            averageTrophies: clan.Members.reduce((sum, m) => sum + (m.trophies || 0), 0) / clan.Members.length,
            averageTownHall: clan.Members.reduce((sum, m) => sum + (m.townHallLevel || 0), 0) / clan.Members.length,
            totalDonations: clan.Members.reduce((sum, m) => sum + (m.donations || 0), 0),
            totalDonationsReceived: clan.Members.reduce((sum, m) => sum + (m.donationsReceived || 0), 0),
            lastUpdated: clan.lastUpdated
        };

        res.json(stats);
    } catch (error) {
        console.error('❌ Erreur récupération stats clan:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

module.exports = router;
