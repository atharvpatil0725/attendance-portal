# 🏢 Enterprise Geofenced Attendance Portal with Anti-Proxy Protection
A secure, full-stack, enterprise-grade attendance tracking application. 
This system ensures high-accuracy location tracking using hardware GPS satellites, implements server-side mathematical geofencing to prevent remote check-ins, 
and utilizes device fingerprinting algorithms to eliminate proxy attendance fraud.

## 📐 System Architecture
The application is built on a decoupled, secure 3-tier architecture to ensure zero client-side trust

### Data Flow Execution:
1. **Client Tier (Frontend):** The user enters their 10-digit mobile number. The browser enforces strict input validation, initializes a canvas-based device fingerprinting token, grabs absolute real-time satellite GPS parameters, and transmits them.
2. **Application Tier (Backend - Render Host):** The Node.js application acts as an isolated validation firewall. It calculates the spherical distance using the **Haversine Formula** against the office coordinates. Out-of-bounds requests are rejected instantly at the edge.
3. **Database Tier (Engine - Google Script):** If the geofence check passes, the payload hits our sheet database wrapper. It runs a deep transactional scan to verify if the employee has checked in already or if their device fingerprint has been reused across multiple phone numbers.

## 🛡️ Key Enterprise Features

* **🛰️ Strict Hardware Geolocation Enforcement:** Configured with `enableHighAccuracy: true` and `maximumAge: 0` to bypass tower-based approximations and old cache. The system forces direct smartphone satellite links down to a narrow error margin.
* **📐 Server-Side Haversine Geofencing:** Prevents users from manipulating client-side scripts to forge coordinates. The backend reruns geometric math calculations ensuring the device resides within a strict 100m office radius.
* **🕵️‍♂️ Cryptographic Anti-Proxy Browser Fingerprinting:** Hashes hardware metrics (canvas engine layouts, screen resolution matrices, user agents) into an identifier. If Employee A tries to cheat the system by checking in for Employee B from the same device, the system automatically flags the row with an active alert status.
* **🔒 Dynamic UI Field-Locks:** Leverages deep-browser local storage states to freeze personal credentials upon initial check-in, preventing multi-account flipping.

## ⚙️ Tech Stack & Protocols

* **Frontend Engine:** Semantic HTML5, CSS3 Grid Architectures, Native Browsing Geolocation APIs.
* **Server Middleware:** Node.js, Express.js Core Framework, Asynchronous RESTful Handshakes.
* **Data Core Registry:** Google Apps Script Execution Engine (V8 Engine Layer), Google Spreadsheet Relational Infrastructure.
* **Hosting Pipeline:** Render Web Cloud, GitHub Automated CI/CD Deployments.





1.Install Node.js dependencies:
npm install


2.Configure Environment Parameters:
Open server.js and input your dedicated targeted corporate destination:
const TARGET_LAT = 21.1458;   // Input Target Latitude
const TARGET_LON = 79.0882;   // Input Target Longitude
const ALLOWED_RADIUS_METERS = 100;


3.Launch the platform instance locally:
npm start
