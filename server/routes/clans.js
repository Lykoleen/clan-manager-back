// ===== ROUTES PROXY POUR L'API SUPERCELL =====

const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Configuration depuis les variables d'environnement
const API_TOKEN = process.env.CLASH_API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.clashofclans.com/v1';

// Route proxy pour l'API Supercell - Données du clan
router.get('/:clanTag', async (req, res) => {
    try {
        if (!API_TOKEN || API_TOKEN === 'your_api_token_here') {
            return res.status(503).json({ error: 'Token API Supercell non configuré' });
        }

        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        const response = await fetch(`${API_BASE_URL}/clans/%23${cleanTag}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API Supercell:', response.status, errorText);
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Données récupérées avec succès pour le clan:', data.name);
        res.json(data);
    } catch (error) {
        console.error('Erreur proxy clan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route proxy pour l'API Supercell - Guerre actuelle du clan
router.get('/:clanTag/currentwar', async (req, res) => {
    try {
        if (!API_TOKEN || API_TOKEN === 'your_api_token_here') {
            return res.status(503).json({ error: 'Token API Supercell non configuré' });
        }

        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        const response = await fetch(`${API_BASE_URL}/clans/%23${cleanTag}/currentwar`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API Supercell:', response.status, errorText);
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Données de guerre récupérées avec succès');
        res.json(data);
    } catch (error) {
        console.error('Erreur proxy guerre:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route proxy pour l'API Supercell - Guerre de ligue du clan
router.get('/:clanTag/currentwar/leaguegroup', async (req, res) => {
    try {
        if (!API_TOKEN || API_TOKEN === 'your_api_token_here') {
            return res.status(503).json({ error: 'Token API Supercell non configuré' });
        }

        const { clanTag } = req.params;
        const cleanTag = clanTag.replace('#', '');
        
        const response = await fetch(`${API_BASE_URL}/clans/%23${cleanTag}/currentwar/leaguegroup`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API Supercell:', response.status, errorText);
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Données de guerre de ligue récupérées avec succès');
        res.json(data);
    } catch (error) {
        console.error('Erreur proxy guerre de ligue:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

