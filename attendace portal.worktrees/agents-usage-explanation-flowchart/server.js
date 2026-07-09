const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ YOUR ACTIVE GOOGLE WEB APP URL:
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGrUwVBhcrTfUGR3xoX8UJ1zatjVwrifmT1jFaWPsoCGvYGqI3NApEo4NIgpnadagz/exec";

// Geo-fencing utilities (Kept intact for your reference/future use)
const TARGET_LAT = 21.1458;
const TARGET_LON = 79.0882;
const ALLOWED_RADIUS_METERS = 150; 

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

// ─── 1. LOGIN PROXY ENDPOINT ──────────────────────────────────────
app.post('/api/login', async (req, res) => {
    try {
        // Injects the route token your Google Script expects
        const payload = { route: 'portal_login', ...req.body };
        const response = await axios.post(GOOGLE_SHEET_URL, payload);
        res.json(response.data);
    } catch (error) {
        console.error("Login Proxy Error:", error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// ─── 2. ATTENDANCE PROXY ENDPOINT ─────────────────────────────────
app.post('/api/attendance', async (req, res) => {
    try {
        const payload = { route: 'attendance', ...req.body };
        const response = await axios.post(GOOGLE_SHEET_URL, payload);
        res.json(response.data);
    } catch (error) {
        console.error("Attendance Proxy Error:", error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// ─── 3. LEAVE PROXY ENDPOINT ──────────────────────────────────────
app.post('/api/leave', async (req, res) => {
    try {
        const payload = { route: 'leave', ...req.body };
        const response = await axios.post(GOOGLE_SHEET_URL, payload);
        res.json(response.data);
    } catch (error) {
        console.error("Leave Proxy Error:", error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// ─── 4. PAYSLIPS PROXY ENDPOINT ───────────────────────────────────
app.post('/api/payslips', async (req, res) => {
    try {
        const payload = { route: 'get_payslips', ...req.body };
        const response = await axios.post(GOOGLE_SHEET_URL, payload);
        res.json(response.data);
    } catch (error) {
        console.error("Payslips Proxy Error:", error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});