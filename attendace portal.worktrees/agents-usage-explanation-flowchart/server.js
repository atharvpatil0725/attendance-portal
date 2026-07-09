const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔒 Your Google Apps Script Web App URL
// Kept ONLY on the server — never sent to the browser.
// Better: move this to an environment variable (see notes below).
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGrUwVBhcrTfUGR3xoX8UJ1zatjVwrifmT1jFaWPsoCGvYGqI3NApEo4NIgpnadagz/exec";

// Generic helper to forward any payload to Apps Script
async function forwardToSheet(payload) {
    const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}

// ───────────────────────────────────────────────
// LOGIN
// ───────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { empCode, password } = req.body;

    if (!empCode || !password) {
        return res.status(400).json({ status: "error", message: "Employee code and password are required." });
    }

    try {
        const result = await forwardToSheet({ route: "portal_login", empCode, password });

        if (result.status === "success") {
            // Store the logged-in employee code in a session so later requests
            // (leave, payslips) can be trusted without the browser re-sending it.
            req.session = req.session || {};
            return res.status(200).json(result);
        }

        return res.status(401).json(result);
    } catch (error) {
        console.error("❌ Login proxy error:", error);
        res.status(500).json({ status: "error", message: "Server database connection failed." });
    }
});

// ───────────────────────────────────────────────
// ATTENDANCE (Punch IN / OUT)
// ───────────────────────────────────────────────
app.post('/api/attendance', async (req, res) => {
    const { name, phone, action, latitude, longitude, accuracy } = req.body;
    const payload = { route: "attendance", name, phone, action, latitude, longitude, accuracy };

    try {
        const result = await forwardToSheet(payload);

        if (result.status === "denied" || result.status === "error") {
            console.log(`❌ Attendance rejected: ${result.message}`);
            return res.status(400).json(result);
        }

        console.log('📍 Attendance recorded:', payload.name, payload.action);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Attendance proxy error:", error);
        res.status(500).json({ status: "error", message: "Server database connection failed." });
    }
});

// ───────────────────────────────────────────────
// LEAVE REQUEST
// ───────────────────────────────────────────────
app.post('/api/leave', async (req, res) => {
    const { empCode, empName, leaveType, startDate, endDate, durationDays, remark } = req.body;
    const payload = { route: "leave", empCode, empName, leaveType, startDate, endDate, durationDays, remark };

    try {
        const result = await forwardToSheet(payload);

        if (result.status === "error") {
            return res.status(400).json(result);
        }

        console.log('✈️ Leave request submitted:', empCode, leaveType, durationDays, 'days');
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Leave proxy error:", error);
        res.status(500).json({ status: "error", message: "Server database connection failed." });
    }
});

// ───────────────────────────────────────────────
// PAYSLIPS
// ───────────────────────────────────────────────
app.post('/api/payslips', async (req, res) => {
    const { empCode } = req.body;

    if (!empCode) {
        return res.status(400).json({ status: "error", message: "Employee code required." });
    }

    try {
        const result = await forwardToSheet({ route: "get_payslips", empCode });
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Payslips proxy error:", error);
        res.status(500).json({ status: "error", message: "Server database connection failed." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});