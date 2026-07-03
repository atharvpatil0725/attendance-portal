const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ YOUR ACTIVE GOOGLE WEB APP URL:
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGrUwVBhcrTfUGR3xoX8UJ1zatjVwrifmT1jFaWPsoCGvYGqI3NApEo4NIgpnadagz/exec";

const TARGET_LAT = 21.1458;
const TARGET_LON = 79.0882;
const ALLOWED_RADIUS_METERS = 150; // Realistic office geofence radius

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

app.post('/api/portal', async (req, res) => {
    try {
        const { route } = req.body;

        // 🛡️ Permits all three routes to pass through to Google Sheets
        if (route !== 'portal_login' && route !== 'attendance' && route !== 'leave') {
            return res.json({ status: 'error', message: 'Unsupported route.' });
        }

        // ✅ FIXED: Using the active URL defined on line 10
        const response = await axios.post(GOOGLE_SHEET_URL, req.body);
        res.json(response.data);

    } catch (error) {
        console.error("Backend Proxy Error:", error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});