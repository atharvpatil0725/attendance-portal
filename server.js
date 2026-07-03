const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ MAKE SURE THIS MATCHES YOUR ACTIVE GOOGLE WEB APP URL EXACTLY:
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

// THE ALL-IN-ONE PORTAL ROUTE HANDLER
app.post('/api/portal', async (req, res) => {
    try {
        const payload = req.body;

        // GPS location required, but no distance/geofence restriction — just log where they are
        if (payload.route === "attendance") {
            if (!payload.latitude || !payload.longitude) {
                return res.status(400).json({ status: "error", message: "GPS location is required to punch in/out." });
            }

            const googleResponse = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await googleResponse.json();
            return res.json(result);
        }

        res.status(400).json({ status: "error", message: "Unsupported route." });
    } catch (error) {
        console.error("Portal infrastructure disconnect:", error);
        res.status(500).json({ status: "error", message: "Database handshake dropped." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});