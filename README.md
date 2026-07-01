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




 ##     🛠️ Complete Deployment & Installation Guide
Follow these exact steps to set up the development environment, configure the backend server coordinates, and deploy the architecture to production.

📋 Prerequisites
Before beginning, ensure you have the following frameworks installed on your local operating machine:

Node.js (v18.x or higher recommended)

Git Version Control CLI

A modern web browser with Location Services enabled (Chrome/Safari)

💻 Step 1: Local Environment Setup
1. Clone the Repository
Open your terminal or command prompt, navigate to your desired workspace directory, and clone the codebase:

Bash
git clone https://github.com/YOUR_USERNAME/attendance-portal.git
cd attendance-portal
2. Install Project Dependencies
Run the installation command to populate the node_modules folder with all required runtime environments (Express, etc.):

Bash
npm install
🏢 Step 2: System Configuration Benchmark
Before launching the instance, you must supply the server with your office parameters. Open server.js in VS Code and adjust the coordinate variables:

JavaScript
// Locate these lines near the top of server.js and modify values:
const TARGET_LAT = 21.1458;         // Replace with your office Latitude
const TARGET_LON = 79.0882;         // Replace with your office Longitude
const ALLOWED_RADIUS_METERS = 100;   // The maximum allowed fence distance (in meters)
🛰️ Step 3: Launching the App Locally
To execute and run the application instance on your local machine for testing purposes:

Bash
npm start
Once executed, open your browser and navigate to: http://localhost:3000

🚀 Step 4: Shipping to Production (Render Deployment)
Since your repository utilizes an active Render automatic pipeline, deploying updates only requires a Git push sequence.

Run these terminal commands within VS Code to push your changes live:

Bash
# 1. Stage all modified configuration architectures
git add .

# 2. Commit the changes with an identity tag
git commit -m "Deploy production instance with geofencing and anti-proxy rules"

# 3. Push to main to fire off Render's build trigger
git push origin main
⏳ Verifying the Live Run:
Navigate to your Render Dashboard.

Select your attendance-portal Web Service.

Observe the deployment logs. Once it says Live, click your unique platform URL to test your locked, production-ready system!
