const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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

// Generic forwarder to Google Apps Script
async function forwardToSheet(route, body, res) {
    try {
        const response = await axios.post(GOOGLE_SHEET_URL, { ...body, route });
        res.json(response.data);
    } catch (error) {
        console.error("Backend Proxy Error:", error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// 🔑 Login
app.post('/api/login', async (req, res) => {
    await forwardToSheet('portal_login', req.body, res);
});

// 🛰️ Attendance punch (with server-side geofence check)
app.post('/api/attendance', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.json({ status: 'error', message: 'Missing or invalid location data.' });
    }

    const distance = calculateDistance(TARGET_LAT, TARGET_LON, latitude, longitude);
    if (distance > ALLOWED_RADIUS_METERS) {
        return res.json({
            status: 'error',
            message: `Access Denied: You are ${Math.round(distance)}m away from the office. Must be within ${ALLOWED_RADIUS_METERS}m.`
        });
    }

    await forwardToSheet('attendance', req.body, res);
});

// 📝 Leave requests
app.post('/api/leave', async (req, res) => {
    await forwardToSheet('leave', req.body, res);
});

// 📂 Payslips
app.post('/api/payslips', async (req, res) => {
    await forwardToSheet('get_payslips', req.body, res);
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});