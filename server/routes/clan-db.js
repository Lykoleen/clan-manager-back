// ===== ROUTES POUR LA GESTION DES CLANS AVEC BASE DE DONNÉES =====

const express = require('express');
const fetch = require('node-fetch');
const { Clan, Member } = require('../models');

const router = express.Router();

// Configuration depuis les variables d'environnement
const API_TOKEN = process.env.CLASH_API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.clashofclans.com/v1';

// GET /api/clan/:clanTag/members - Récupérer les commentaires et participations d'un clan
router.get('/:clanTag/members', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        // Rechercher les membres du clan dans la base de données
        const members = await Member.findAll({
            where: { clanTag: cleanTag }
        });

        // Convertir les membres en format attendu par le frontend
        const membersData = {};
        members.forEach(member => {
            membersData[member.memberTag] = {
                name: member.name,
                comment: member.comment || '',
                participations: member.participations || {}
            };
        });

        console.log(`📖 Récupération des données pour le clan ${cleanTag} (${members.length} membres)`);
        res.json({ 
            clanTag: cleanTag, 
            members: membersData
        });
    } catch (error) {
        console.error('❌ Erreur lecture données clan:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture des données du clan' });
    }
});

// POST /api/clan/:clanTag/members - Sauvegarder les commentaires et participations d'un clan
router.post('/:clanTag/members', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const { members } = req.body;
        const cleanTag = clanTag.replace('#', '');
        
        // Validation basique
        if (!members || typeof members !== 'object') {
            return res.status(400).json({ error: 'Le body doit contenir un objet members' });
        }

        // Créer le clan s'il n'existe pas
        await Clan.findOrCreate({
            where: { clanTag: cleanTag },
            defaults: { clanTag: cleanTag }
        });

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
                    clanTag: cleanTag,
                    comment: memberData.comment || '',
                    participations: memberData.participations || {}
                }
            });

            // Si le membre existait déjà, mettre à jour ses données
            if (!memberCreated) {
                await member.update({
                    name: memberData.name || member.name,
                    comment: memberData.comment || member.comment,
                    participations: memberData.participations || member.participations
                });
            }

            updatedMembersCount++;
        }

        console.log(`💾 Sauvegarde des données pour le clan ${cleanTag} (${updatedMembersCount} membres)`);
        
        res.json({ 
            message: 'ok', 
            clanTag: cleanTag, 
            updatedMembers: updatedMembersCount
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
        
        // Créer le clan s'il n'existe pas
        await Clan.findOrCreate({
            where: { clanTag: cleanClanTag },
            defaults: { clanTag: cleanClanTag }
        });
        
        // Créer ou mettre à jour le membre
        const [member, memberCreated] = await Member.findOrCreate({
            where: { memberTag: cleanMemberTag },
            defaults: {
                memberTag: cleanMemberTag,
                name: memberData.name || '',
                clanTag: cleanClanTag,
                comment: memberData.comment || '',
                participations: memberData.participations || {}
            }
        });

        // Si le membre existait déjà, mettre à jour ses données
        if (!memberCreated) {
            await member.update({
                name: memberData.name || member.name,
                comment: memberData.comment || member.comment,
                participations: memberData.participations || member.participations
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

module.exports = router;
