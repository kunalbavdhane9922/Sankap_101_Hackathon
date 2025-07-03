# Social Media Dashboard (React + Vite + Mock AI Backend)

## 🚀 Features
- Modern dashboard for social media analytics, scheduling, and account management
- AI-powered hashtag, SEO, and title suggestions
- Trending topic recommender, sentiment analyzer, best post timing, caption generator
- Platform-specific post preview
- Mock backend (Node.js/Express) for all analytics, billing, settings, and social APIs
- Fully offline-friendly, no real API keys needed

## 📁 Project Structure
```
root/
  backend/           # Node.js Express backend (all API endpoints)
    index.js
    income.js
    billing.js
    settings.js
    analytics.js
    trendingTopics.js
    seoEngine.js
    youtube.js
    facebook.js
    instagram.js
    twitter.js
  src/
    components/      # React components (Home, Schedule, Users, Income, Billing, Settings, etc.)
    hooks/           # Custom React hooks
    utils/           # Utility functions (sentiment, bestTimes, captionGen, etc.)
    ...
```

## 🛠️ Getting Started

### 1. Install dependencies
In the project root and backend folder:
```sh
npm install
cd backend
npm install
```

### 2. Start the backend server (in a new terminal)
```sh
cd backend
node index.js
```
The backend will run at [http://localhost:5000](http://localhost:5000)

### 3. Start the frontend (in another terminal)
```sh
npm run dev
```
The frontend will run at [http://localhost:5173](http://localhost:5173) (or similar)

## 🧠 Notes
- All data is mock/dummy and works offline.
- All AI features use rule-based or random logic for demonstration.
- You can extend the backend for real API integration if needed.

## 🗂️ Sidebar Pages
- Home: Analytics dashboard
- Schedule Posts: AI-powered post scheduling, calendar, preview
- Users: Social account management
- Income: Income analytics and AI tips
- Billing: Billing history and AI reminders
- Settings: User preferences and AI recommendations

---
**Enjoy your fully-featured, AI-powered social media dashboard!**
