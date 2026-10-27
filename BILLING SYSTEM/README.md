# 🍽️ L'AURORA • Fine Dining Restaurant POS & Intelligent Billing System

A state-of-the-art, high-performance Point of Sale (POS), Table Management, Kitchen Order Ticket (KOT), and Thermal Receipt Billing System tailored for fine dining restaurants, bistros, cafes, and bars.

---

## ✨ Features Overview

### 1. 🍽️ Dynamic Order Types & Table Management
- **Order Modes**: Dine-In (Table-based), Takeaway / Counter, and Delivery.
- **Interactive Floor Plan**:
  - Live table occupancy tracking (Main Dining Hall, Terrace Garden, VIP Lounge, Cocktail Bar).
  - Status Indicators: `Available` (Emerald), `Occupied` (Amber), `Billed` (Sky Blue), `Reserved` (Purple).
  - Real-time seated duration timer (e.g., `⏳ Seated: 35m`) and running table total.
  - Quick Table Switching & Vacate / Clear table actions.

### 2. 📋 Interactive Menu & Customizer
- **Categories**: Appetizers, Chef Mains, Woodfire Pizzas, Gourmet Burgers, Artisan Pastas, Decadent Desserts, Signature Cocktails & Bar.
- **Dietary Filter Chips**: All, 🟢 Veg, 🔴 Non-Veg, ⭐ Chef's Special, 🌾 Gluten-Free.
- **Instant Search**: Autocomplete search with keyboard shortcut `/` key.
- **Add-ons & Modifiers**: Customizable toppings, cooking temperatures, spice levels, and special chef instructions.

### 3. 🧑‍🍳 Kitchen Display System (KDS & KOT)
- **Real-Time Kanban Pipeline**:
  - `🔥 New Incoming`
  - `🍳 Cooking & In-Kitchen Prep`
  - `✨ Ready to Serve / Expedite`
- **Elapsed Time Warnings**: Automatically alerts staff when tickets exceed 15 minutes.
- **Service Bell Audio**: Procedural two-tone kitchen bell synthesized via Web Audio API.

### 4. 💳 Multi-Channel Payment & Settlement Console
- **Split Bill Engine**: Divide checks equally across 2, 3, 4, 5+ guests or custom split with per-guest calculation.
- **Discount Presets**: Instant 0%, 5%, 10%, 15%, 20% discount toggles.
- **Tendered Cash Calculator**: Preset bills (+$10, +$20, +$50, +$100, Exact) with real-time "Change to Return" computation.
- **Contactless EMV & Card Terminal**: Card tap simulation.
- **Dynamic QR Code / UPI**: Generates real SVG payment QR codes with order amount.
- **Apple Pay & Mobile Wallets**: One-tap checkout support.
- **Server Gratuity / Tip**: 5%, 10%, 15%, 20%, or custom.

### 5. 🧾 Thermal Receipt Printing
- High-fidelity **80mm thermal receipt roll** template with jagged paper edges, itemized breakdown, tax registration numbers, and barcode.
- Native **Browser Thermal Print Integration** via `@media print`.

### 6. 📊 Executive Sales Analytics & Reporting
- Daily Gross Revenue, Total Invoices, Average Order Value (AOV), and Tax Reconciliations.
- Transaction Journal with instant receipt re-printing.
- **Export to CSV**: One-click download of daily sales reports.

### 7. ⚙️ Settings & Customization
- Restaurant Branding: Name, address, phone, GSTIN/Tax ID.
- Multi-Currency Support: `$`, `€`, `£`, `₹`, `AED`, `CAD`, `AUD`, `¥`.
- Configurable Tax rates (State Tax, VAT, CGST/SGST) and optional Service Charge.
- **Dark Mode (Luxury Obsidian)** and **Light Mode (Bistro Chic)** toggle.
- **Procedural Web Audio Synthesizer**: Delightful audio cues with zero external audio assets.

---

## 🚀 How to Run Locally

1. Open your terminal in this directory:
   ```bash
   cd "/Users/nikhilmallipamula/Desktop/BILLING SYSTEM"
   ```

2. Start a local server (if not already running):
   ```bash
   python3 -m http.server 8080
   ```

3. Open your browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

---

## 📁 File Structure
```
BILLING SYSTEM/
├── index.html            # Main semantic HTML5 POS workspace & modals
├── css/
│   └── styles.css        # Luxury design system, CSS variables & print styles
├── js/
│   ├── menu-data.js      # Menu catalog, tables, floor layout & settings
│   ├── sound.js          # Web Audio API sound synthesizer
│   ├── storage.js        # LocalStorage persistence & database management
│   └── app.js            # Main controller, cart, table & checkout logic
└── assets/
    └── images/           # High-resolution food photography & restaurant logo
```
