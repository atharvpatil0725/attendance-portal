const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ MAKE SURE THIS MATCHES YOUR ACTIVE GOOGLE WEB APP URL EXACTLY:
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGruwvBhcrfUGRJxoX8UJ1zatjVwrifmT1jfaWPsOCGvGyQi3NApEo4NIGpnadagz/exec";

const TARGET_LAT = 21.1458;   
const TARGET_LON = 79.0882;   
const ALLOWED_RADIUS_METERS = 100; 

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
    const payload = req.body;

    // Route A: Process Attendance Forms (with Geofencing)
    if (payload.route === "attendance") {
        if (!payload.latitude || !payload.longitude) {
            return res.status(400).json({ status: "error", message: "Security Violation: GPS parameters mandatory." });
        }
        const distance = calculateDistance(payload.latitude, payload.longitude, TARGET_LAT, TARGET_LON);
        if (distance > ALLOWED_RADIUS_METERS) {
            return res.status(403).json({ 
                status: "error", 
                message: `Geofence Failure: You are ${distance.toFixed(0)}m outside required workspace limits.` 
            });
        }
    }

    // Route B: Process Leave Applications (Bypasses Geofencing cleanly)
    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.status === "denied" || result.status === "error") {
            return res.status(400).json({ status: "error", message: result.message });
        }

        res.status(200).json({ status: "success", message: result.message || "Transaction processed!" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Database infrastructure handshake lost." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Unified Corporate Node Engine Live on Port ${PORT}`);
});