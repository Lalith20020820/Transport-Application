# 📑 SK Transport POS & Invoice System - Requirements Document

## 1. Project Overview 🚀
The goal is to build a lightweight, browser-based Point of Sale (POS) system for **SK Transport**. The system will manage transport bookings, calculate margins for rented vehicles, and generate professional PDF invoices that match the company's branding.

---

## 2. Business Requirements 💼

### A. Invoice Management
* [cite_start]**Auto-Generation:** Generate unique Invoice Numbers (e.g., Starting from 009). [cite: 2]
* [cite_start]**Client Database:** Store client details like "Perfect adza PVT LTD" and their addresses for quick selection. [cite: 4, 5, 6, 7]
* [cite_start]**Service Tracking:** Ability to log "Day Packages" with specific routes (e.g., Kadawatha to Havelock City). 
* [cite_start]**Labour & Extra Charges:** Fields to add manual costs like "Labour Charge" or "Waiting Fees." 

### B. Financial Logic
* **Margin Calculation:** A hidden field in the form to enter the "Rent Cost" (what you pay the vehicle owner).
* **Profit Tracking:** The system should calculate:
    $$\text{Margin} = \text{Client Amount} - \text{Rent Cost}$$
* **Automatic Totals:** The system must sum all line items and labour charges automatically. 

### C. Branding & Professionalism
* [cite_start]**Standard Footer:** Every invoice must include bank details (Peoples Bank, Gampaha) and contact info. [cite: 13, 14, 17, 18]
* [cite_start]**System Generated Disclaimer:** Include the note: "This is a system generated invoice no signature required." [cite: 16]

---

## 3. Technical Requirements 🛠️

### A. The Tech Stack
* **Frontend:** HTML5 & Tailwind CSS (for a modern, mobile-responsive UI).
* **Interactivity:** Vanilla JavaScript (ES6+).
* **Database:** **Dexie.js** (IndexedDB wrapper) to store invoices, clients, and settings locally.
* **PDF Engine:** **html2pdf.js** or **jsPDF** to convert the HTML invoice template into a downloadable PDF.

### B. Data Schema (Dexie.js)
```javascript
// Database: SKTransportDB
// Store 1: invoices (id, invoiceNo, date, clientId, items, total, margin)
// Store 2: clients (id, name, address)
// Store 3: settings (bankDetails, companyInfo)