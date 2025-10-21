// ===== ROUTES POUR LA GESTION DES CLANS =====

const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Configuration depuis les variables d'environnement
const API_TOKEN = process.env.CLASH_API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.clashofclans.com/v1';

// Créer le dossier data s'il n'existe pas
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, '..', 'data');
    try {
        await fs.access(dataDir);
    } catch (error) {
        await fs.mkdir(dataDir, { recursive: true });
        console.log('📁 Dossier data créé');
    }
}

// GET /api/clan/:clanTag/members - Récupérer les données supplémentaires d'un clan
router.get('/:clanTag/members', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        await ensureDataDirectory();
        const clanDataFile = path.join(__dirname, '..', 'data', `clan_${cleanTag}.json`);
        
        try {
            const data = await fs.readFile(clanDataFile, 'utf8');
            const clanData = JSON.parse(data);
            console.log(`📖 Récupération des données supplémentaires pour le clan ${cleanTag}`);
            res.json(clanData);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Fichier n'existe pas encore, retourner structure vide
                console.log(`📄 Aucune donnée supplémentaire pour le clan ${cleanTag}`);
                res.json({ clanTag: cleanTag, members: {} });
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('❌ Erreur lecture données clan:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture des données du clan' });
    }
});

// POST /api/clan/:clanTag/members - Sauvegarder les données supplémentaires d'un clan
router.post('/:clanTag/members', async (req, res) => {
    try {
        const { clanTag } = req.params;
        const { members } = req.body;
        const cleanTag = clanTag.replace('#', '');
        
        // Validation basique
        if (!members || typeof members !== 'object') {
            return res.status(400).json({ error: 'Le body doit contenir un objet members' });
        }

        await ensureDataDirectory();
        const clanDataFile = path.join(__dirname, '..', 'data', `clan_${cleanTag}.json`);
        
        // Lire les données existantes ou créer une nouvelle structure
        let clanData = { clanTag: cleanTag, members: {} };
        try {
            const existingData = await fs.readFile(clanDataFile, 'utf8');
            clanData = JSON.parse(existingData);
        } catch (error) {
            // Fichier n'existe pas, utiliser la structure par défaut
        }

        // Fusionner les données (mise à jour des membres existants, ajout des nouveaux)
        Object.keys(members).forEach(memberTag => {
            const memberData = members[memberTag];
            if (clanData.members[memberTag]) {
                // Mise à jour des données existantes
                clanData.members[memberTag] = {
                    ...clanData.members[memberTag],
                    ...memberData,
                    lastUpdated: new Date().toISOString()
                };
            } else {
                // Ajout d'un nouveau membre
                clanData.members[memberTag] = {
                    ...memberData,
                    firstAdded: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };
            }
        });

        await fs.writeFile(clanDataFile, JSON.stringify(clanData, null, 2), 'utf8');
        console.log(`💾 Sauvegarde des données supplémentaires pour le clan ${cleanTag}`);
        
        res.json({ message: 'ok', clanTag: cleanTag, updatedMembers: Object.keys(members).length });
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
        
        await ensureDataDirectory();
        const clanDataFile = path.join(__dirname, '..', 'data', `clan_${cleanClanTag}.json`);
        
        // Lire les données existantes ou créer une nouvelle structure
        let clanData = { clanTag: cleanClanTag, members: {} };
        try {
            const existingData = await fs.readFile(clanDataFile, 'utf8');
            clanData = JSON.parse(existingData);
        } catch (error) {
            // Fichier n'existe pas, utiliser la structure par défaut
        }

        // Mettre à jour ou ajouter les données du membre
        if (clanData.members[cleanMemberTag]) {
            clanData.members[cleanMemberTag] = {
                ...clanData.members[cleanMemberTag],
                ...memberData,
                lastUpdated: new Date().toISOString()
            };
        } else {
            clanData.members[cleanMemberTag] = {
                ...memberData,
                firstAdded: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
        }

        await fs.writeFile(clanDataFile, JSON.stringify(clanData, null, 2), 'utf8');
        console.log(`💾 Sauvegarde des données du membre ${cleanMemberTag} pour le clan ${cleanClanTag}`);
        
        res.json({ message: 'ok', memberTag: cleanMemberTag, clanTag: cleanClanTag });
    } catch (error) {
        console.error('❌ Erreur sauvegarde membre:', error);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde du membre' });
    }
});

module.exports = router;

