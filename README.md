# RescueIQ 🆘

RescueIQ is a professional disaster response and emergency management platform designed to streamline communication, triage, and real-time coordination during critical incidents.

## 🚀 Key Features

- **Real-time SOS Monitoring**: Live dashboard for tracking emergency signals via Socket.io.
- **AI-Powered Triage**: Automated assessment of emergency situations to prioritize rescue efforts.
- **Live Interactive Map**: Visual representation of incidents and rescue assets using Leaflet.
- **Instant Communication**: Integrated SMS and notification system (Twilio) for rapid response.
- **Secure Data Management**: Robust backend powered by Supabase and Express.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server**: Express
- **Real-time**: Socket.io
- **Database/Auth**: Supabase
- **AI Integration**: Anthropic Claude API
- **Messaging**: Twilio

---

## 📂 Project Structure

```text
RescueIQ/
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── config/     # Service configurations
│   │   ├── controllers/# Business logic
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # AI and external integrations
│   │   └── sockets/    # Real-time event handlers
│   └── package.json
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # View components
│   │   └── store/      # Global state management
│   └── package.json
├── .gitignore          # Global exclusion rules
└── README.md           # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amritas851203/RescuelQ.git
   cd RescuelQ
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # SUPABASE_URL=...
   # SUPABASE_ANON_KEY=...
   # ANTHROPIC_API_KEY=...
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📄 License

This project is developed for hackathon purposes and internal use.

---
*Developed with ❤️ by the RescueIQ Team.*
