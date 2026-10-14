const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. اختبار السيرفر
app.get('/', (req, res) => {
    res.send('Twitch Cloud Proxy is active and running!');
});

// 2. نقطة جلب الجوائز من تويتش
app.get('/api/twitch/drops', async (req, res) => {
    const authHeader = req.headers.authorization;
    const clientId = req.headers['client-id'];

    if (!authHeader || !clientId) {
        return res.status(400).json({ error: 'Missing auth token or client-id' });
    }

    try {
        const twitchRes = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': clientId,
                'Authorization': authHeader
            }
        });

        const userData = await twitchRes.json();

        // قائمة الجوائز
        const drops = [
            { id: 'drop_ow2_1', title: 'Overwatch 2: Cyber Medic Kiriko Skin', game: 'Overwatch 2', category: 'Legendary Skin', progress: 100, status: 'pending', icon: 'fa-user-ninja', color: 'from-purple-500 to-indigo-600' },
            { id: 'drop_ow2_2', title: 'Overwatch 2: Battle Pass Tier Skips (x5)', game: 'Overwatch 2', category: 'Consumable', progress: 100, status: 'pending', icon: 'fa-angles-up', color: 'from-amber-500 to-orange-600' },
            { id: 'drop_ow2_3', title: 'Overwatch 2: Panguin Weapon Charm', game: 'Overwatch 2', category: 'Weapon Charm', progress: 100, status: 'pending', icon: 'fa-gem', color: 'from-pink-500 to-rose-600' },
            { id: 'drop_ow2_4', title: 'Overwatch 2: Cyberpunk City Name Card', game: 'Overwatch 2', category: 'Name Card', progress: 100, status: 'claimed', icon: 'fa-id-card', color: 'from-cyan-500 to-blue-600' }
        ];

        res.json({
            user: userData.data ? userData.data[0] : null,
            drops: drops
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
