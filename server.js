const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// https://script.google.com/macros/s/AKfycbwGrUwVBhcrTfUGR3xoX8UJ1zatjVwrifmT1jFaWPsoCGvYGqI3NApEo4NIgpnadagz/exec HERE
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGrUwVBhcrTfUGR3xoX8UJ1zatjVwrifmT1jFaWPsoCGvYGqI3NApEo4NIgpnadagz/exec";

app.post('/api/attendance', async (req, res) => {
    const { name, phone, action, latitude, longitude } = req.body;
    const payload = { name, phone, action, latitude, longitude };

    try {
        // This automatically pushes the data from VS Code straight up to Google Sheets
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log("📍 Sent successfully to Google Sheets:", payload);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Google Sheets Error:", error);
        res.status(500).json({ success: false });
    }
});

// Replace the old app.listen block at the very bottom of server.js with this:
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running dynamically on port ${PORT}`);
});