# CivicAlert - Civic Complaint Platform

**A modern PWA for reporting and tracking civic infrastructure issues in your community.**

## 🎯 Overview

CivicAlert enables citizens to file complaints about public infrastructure problems (water, electricity, sanitation) and track their resolution in real-time. The platform provides an intuitive dashboard, interactive maps, and trend analytics to empower community engagement.

## ✨ Features

- 📝 **File Complaints** - Easy-to-use form for reporting civic issues
- 📊 **Dashboard** - Overview of active, in-progress, and resolved complaints
- 🗺️ **Map View** - Geolocation-based complaint visualization
- 📈 **Trends** - Analytics and community insights
- 🔐 **Authentication** - Secure login/signup with password validation
- 📱 **Progressive Web App** - Installable on mobile, offline support
- 🎨 **Dark/Light Mode** - Theme toggle with persistent preference
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 19 + React Router 7
- **Styling**: TailwindCSS 4 + custom CSS variables
- **Build Tool**: Vite 6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Motion/Framer Motion
- **PWA**: Vite PWA Plugin + Workbox

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key to .env.local
VITE_GEMINI_API_KEY=your_api_key_here
```

### Development

```bash
# Start dev server on localhost:3000
npm run dev
```

### Production Build

```bash
# Build optimized production bundle with PWA
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── pages/              # Route components
│   ├── Dashboard.jsx
│   ├── FileComplaint.jsx
│   ├── MyComplaints.jsx
│   ├── MapView.jsx
│   ├── Trends.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── components/         # Reusable UI components
│   ├── Layout.jsx
│   ├── Navigation.jsx
│   └── ui/
├── lib/               # Utilities
├── App.jsx            # Root component with routing
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🔑 Key Routes

| Route         | Purpose               |
| ------------- | --------------------- |
| `/`           | Dashboard (main hub)  |
| `/login`      | User authentication   |
| `/signup`     | User registration     |
| `/register`   | File new complaint    |
| `/complaints` | View filed complaints |
| `/map`        | Map-based view        |
| `/trends`     | Analytics & insights  |

## 📱 PWA Features

- **Installable**: Add to home screen on iOS/Android
- **Offline Support**: Works without internet connection
- **Fast Loading**: Smart caching of assets and API responses
- **Native Feel**: Standalone display mode

See [PWA_SETUP.md](./PWA_SETUP.md) for detailed PWA configuration and icon setup.

## 🎨 Customization

### Theme Colors

Edit CSS variables in `src/index.css`:

- `--bg` - Background color
- `--text` - Text color
- `--card` - Card background
- `--color-vision-accent` - Primary accent (blue)

### App Metadata

Update in `public/manifest.json`:

- App name, description
- Theme colors
- Icons
- Shortcuts

## 📦 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run clean        # Remove dist folder
```

## 🐛 Troubleshooting

**Build fails with dependency errors?**

```bash
npm install --legacy-peer-deps
```

**PWA not installing?**

- Requires HTTPS in production (HTTP works on localhost)
- Need valid manifest.json ✅
- Need valid service worker ✅
- Missing app icons in `public/`

**Dev server not starting?**

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## 📝 License

Apache-2.0

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

**Built with ❤️ for community empowerment**
