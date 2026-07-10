# BFSI Global Regulatory Compliance Radar

An interactive, high-fidelity Single-Page Application (SPA) dashboard showcasing a global compliance radar specifically tailored for the BFSI (Banking, Financial Services, and Insurance) sector.

## Features

- **Global Regulatory Radar Screen**: An interactive SVG-based radar display segmenting compliance directives into subsectors (Banking Operations, Payments & Fintech, Asset & Wealth Management, Insurance, and Security & Privacy) and mapping impact zones (Critical, High, Medium, Low).
- **Searchable Regulatory Grid**: A tabular database grid featuring live sorting, multi-column search capabilities, dynamic filters (by Jurisdiction, Sector, Impact, and Status), and data exports to CSV/JSON.
- **Compliance Self-Assessment Wizard**: A 4-step interactive questionnaire analyzing institutional structures and generating customized requirements checklists with persistent progress status.
- **Compliance Portfolio & Auditing Notepad**: A management interface tracking firm compliance status (Compliant, In-Progress, Non-Compliant) and saving active progress notes, persisted via browser `localStorage`.
- **Theme Selection**: Dark/Light mode color schemes matching HSL-controlled modern visualization styling.

## Design Systems

- Developed using **Raw ESM HTML5, Vanilla JavaScript, and Custom CSS-Grids**.
- Responsive layout architecture supporting sidebar dashboards with glassmorphism aesthetics.
- Seamless animations including radar sweeps and pulsing core pins.

## Run Locally

You can run this application locally without any dependencies or compile steps:

1. Clone this repository.
2. Open `index.html` directly in your browser, or run a simple local web server to enable ES Modules:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using NodeJS (http-server)
   npx http-server -p 8000
   ```
3. Navigate to `http://localhost:8000` in your web browser.
