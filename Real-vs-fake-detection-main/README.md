# 🛡️REAL VS FAKE ANALYSIS


https://github.com/user-attachments/assets/a1d738bf-f9af-45dc-83f7-01f9dc6888f7


# 🛡️ Real Vs Fake| Deep Image Forensics

![VeriSight Banner](https://img.shields.io/badge/Status-Operational-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React-Vite_Typescript-blue?style=for-the-badge)

**VeriSight AI** is a high-end forensic analysis tool designed to detect AI-generated imagery. It utilizes deep pixel-by-pixel inspection powered by Google's **Gemini 1.5 Flash** model to identify GAN artifacts, diffusion tiling patterns, and lighting inconsistencies.

## Features

* **Deep Forensic Scan:** Analyzes noise distribution, luminance integrity, and texture quantization.
* **Real-time Simulation:** Multi-threaded UI visualization of the analysis pipeline (Noise Profiling, Geometry Check, etc.).
* **AI Classification:** Precise "Real" vs. "Fake" verdict with confidence scoring and detailed reasoning logs.
* **Cyber-Security UI:** Immersive, high-contrast interface built with Tailwind CSS, featuring scanlines and data visualization.

---

## 📂 System Architecture

The project follows a modern **Vite + React + TypeScript** structure for optimal performance.

```text
verisight-ai/
├── 📂 public/              # Static assets
├── 📂 src/
│   ├── 📂 components/      # UI Modules
│   │   ├── ForensicScanner.tsx  # Visual scanning effect & image container
│   │   └── ThreadMonitor.tsx    # Simulation of analysis threads
│   ├── 📂 services/        # API Layer
│   │   └── gemini.ts       # Google GenAI connection logic
│   ├── App.tsx             # Main application controller
│   ├── index.css           # Tailwind directives & custom animations
│   ├── index.tsx           # Entry point
│   └── types.ts            # TypeScript interfaces (ForensicReport, etc.)
├── .env.local              # Environment variables (API Key)
├── index.html              # HTML Entry
├── package.json            # Dependencies & Scripts
├── tailwind.config.js      # Styling configuration
└── vite.config.ts          # Build configuration

```


## 🛠️ Installation & Setup
Prerequisites
Node.js (v18 or higher)

Get your Google Gemini API Key 
```
1. Clone the Repository

Bash

git clone 
cd verisight-ai

2. Install Dependencies
Bash

npm install

3. Configure Environment
Create a file named .env.local in the root directory and add your API Key.

Note: This file is git-ignored to protect your security.

Code snippet

GEMINI_API_KEY=your_actual_api_key_here

4. Run the Application
Bash

npm run dev
```
Open your browser to the local link provided (usually http://localhost:xxxxx).

## 🧩 Tech Stack
Frontend Framework: React 19

Build Tool: Vite

Language: TypeScript

Styling: Tailwind CSS 

AI Model: Google Gemini model

Icons: Lucide React


## 🤝 Contribution
Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
