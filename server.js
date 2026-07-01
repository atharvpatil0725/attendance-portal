const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Your Google Script Web App URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGrUwVBhcrTfUGR3xoX8UJ1zatjVwrifmT1jFaWPsoCGvYGqI3NApEo4NIgpnadagz/exec";
// const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGruwvBhcrfUGRJxoX8UJ1zatjVwrifmT1jfaWPsOCGvGyQi3NApEo4NIGpnadagz/exec";

app.post('/api/attendance', async (req, res) => {
    const { name, phone, action, latitude, longitude } = req.body;
    const payload = { name, phone, action, latitude, longitude };

    try {
        // 📡 Forward data to Google Script Web App
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // 📥 Read the actual decision response from your Google Script
        const result = await response.json();

        // 🛑 If your Google Script denied the entry (e.g., duplicate or geo-fence error)
        if (result.status === "denied" || result.status === "error") {
            console.log(`❌ Request Rejected by Sheet: ${result.message}`);
            return res.status(400).json({ status: "error", message: result.message });
        }

        console.log('📍 Sent successfully to Google Sheets:', payload);
        res.status(200).json({ status: "success", message: "Recorded successfully!" });

    } catch (error) {
        console.error("❌ Google Sheets Error:", error);
        res.status(500).json({ status: "error", message: "Server database connection failed." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running dynamically on port ${PORT}`);
});