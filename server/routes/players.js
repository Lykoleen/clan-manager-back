// ===== ROUTES PROXY POUR LES JOUEURS =====

const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Configuration depuis les variables d'environnement
const API_TOKEN = process.env.CLASH_API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.clashofclans.com/v1';

// Route proxy pour l'API Supercell - Données d'un joueur
router.get('/:playerTag', async (req, res) => {
    try {
        if (!API_TOKEN || API_TOKEN === 'your_api_token_here') {
            return res.status(503).json({ error: 'Token API Supercell non configuré' });
        }

        const { playerTag } = req.params;
        const cleanTag = playerTag.replace('#', '');
        
        const response = await fetch(`${API_BASE_URL}/players/%23${cleanTag}`, {
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
        console.log('Données récupérées avec succès pour le joueur:', data.name);
        res.json(data);
    } catch (error) {
        console.error('Erreur proxy joueur:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

